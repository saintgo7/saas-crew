import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UseGuards, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ChatService } from './chat.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { TypingDto, JoinChannelDto, LeaveChannelDto } from './dto/create-channel.dto'

/**
 * User info extracted from JWT
 */
interface AuthenticatedUser {
  id: string
  email: string
  rank: string
}

/**
 * Extended Socket with user data
 */
interface AuthenticatedSocket extends Socket {
  user: AuthenticatedUser
}

/**
 * Online user tracking
 */
interface OnlineUser {
  id: string
  name: string
  avatar: string | null
  socketId: string
  channels: Set<string>
}

/**
 * Chat WebSocket Gateway
 * Handles real-time chat communication using Socket.IO
 *
 * Events:
 * - join_channel: Join a channel room
 * - leave_channel: Leave a channel room
 * - send_message: Send a message to a channel
 * - typing: Broadcast typing indicator
 *
 * Emissions:
 * - new_message: New message in channel
 * - user_joined: User joined channel
 * - user_left: User left channel
 * - typing_indicator: User typing status
 * - error: Error messages
 */
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
@Injectable()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(ChatGateway.name)

  // Track online users: Map<socketId, OnlineUser>
  private onlineUsers: Map<string, OnlineUser> = new Map()

  // Track user sockets: Map<userId, Set<socketId>>
  private userSockets: Map<string, Set<string>> = new Map()

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Called when gateway is initialized
   */
  afterInit(server: Server) {
    this.logger.log('Chat WebSocket Gateway initialized')
  }

  /**
   * Handle new socket connection
   * Authenticates user via JWT in handshake
   */
  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake
      const token = this.extractToken(client)

      if (!token) {
        this.logger.warn(`Connection rejected: No token provided (${client.id})`)
        client.emit('error', { message: 'Authentication required' })
        client.disconnect()
        return
      }

      // Verify JWT
      const payload = this.verifyToken(token)

      if (!payload) {
        this.logger.warn(`Connection rejected: Invalid token (${client.id})`)
        client.emit('error', { message: 'Invalid authentication token' })
        client.disconnect()
        return
      }

      // Attach user to socket
      client.user = {
        id: payload.sub,
        email: payload.email,
        rank: payload.rank,
      }

      // Track online user
      const onlineUser: OnlineUser = {
        id: payload.sub,
        name: payload.email.split('@')[0], // Will be updated with real name
        avatar: null,
        socketId: client.id,
        channels: new Set(),
      }

      this.onlineUsers.set(client.id, onlineUser)

      // Track user sockets (for multi-device support)
      if (!this.userSockets.has(payload.sub)) {
        this.userSockets.set(payload.sub, new Set())
      }
      this.userSockets.get(payload.sub)!.add(client.id)

      this.logger.log(`User connected: ${payload.email} (${client.id})`)

      // Send connection success
      client.emit('connected', {
        userId: payload.sub,
        message: 'Connected to chat server',
      })
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`)
      client.emit('error', { message: 'Connection failed' })
      client.disconnect()
    }
  }

  /**
   * Handle socket disconnection
   */
  async handleDisconnect(client: AuthenticatedSocket) {
    const user = this.onlineUsers.get(client.id)

    if (user) {
      // Notify channels about user leaving
      user.channels.forEach(channelId => {
        client.to(channelId).emit('user_left', {
          channelId,
          user: {
            id: user.id,
            name: user.name,
          },
          timestamp: new Date().toISOString(),
        })
      })

      // Clean up tracking
      this.onlineUsers.delete(client.id)

      const userSocketSet = this.userSockets.get(user.id)
      if (userSocketSet) {
        userSocketSet.delete(client.id)
        if (userSocketSet.size === 0) {
          this.userSockets.delete(user.id)
        }
      }

      this.logger.log(`User disconnected: ${user.id} (${client.id})`)
    }
  }

  /**
   * Handle join_channel event
   * Joins the socket to a channel room
   */
  @SubscribeMessage('join_channel')
  async handleJoinChannel(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: JoinChannelDto,
  ) {
    try {
      const { channelId } = data
      const userId = client.user.id
      const userRank = client.user.rank

      // Validate and join channel
      const membership = await this.chatService.joinChannel(userId, channelId, userRank)

      // Join socket room
      client.join(channelId)

      // Track channel for this socket
      const onlineUser = this.onlineUsers.get(client.id)
      if (onlineUser) {
        onlineUser.channels.add(channelId)
      }

      // Get recent messages
      const messages = await this.chatService.getMessages(channelId, userId, { limit: 50 })

      // Get channel members
      const members = await this.chatService.getChannelMembers(channelId, userId)

      // Send channel data to client
      client.emit('channel_joined', {
        channelId,
        messages,
        members: members.map(m => ({
          ...m,
          isOnline: this.isUserOnline(m.userId),
        })),
      })

      // Notify others in channel (membership includes user data from service)
      if (membership && membership.user) {
        client.to(channelId).emit('user_joined', {
          channelId,
          user: {
            id: membership.user.id,
            name: membership.user.name,
            avatar: membership.user.avatar,
            rank: membership.user.rank,
          },
          timestamp: new Date().toISOString(),
        })
      }

      this.logger.log(`User ${userId} joined channel ${channelId}`)

      return { success: true, channelId }
    } catch (error) {
      this.logger.error(`Join channel error: ${error.message}`)
      throw new WsException(error.message)
    }
  }

  /**
   * Handle leave_channel event
   * Leaves the socket from a channel room
   */
  @SubscribeMessage('leave_channel')
  async handleLeaveChannel(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: LeaveChannelDto,
  ) {
    try {
      const { channelId } = data
      const userId = client.user.id

      // Leave socket room
      client.leave(channelId)

      // Update tracking
      const onlineUser = this.onlineUsers.get(client.id)
      if (onlineUser) {
        onlineUser.channels.delete(channelId)
      }

      // Notify others in channel
      client.to(channelId).emit('user_left', {
        channelId,
        user: {
          id: userId,
        },
        timestamp: new Date().toISOString(),
      })

      this.logger.log(`User ${userId} left channel ${channelId}`)

      return { success: true, channelId }
    } catch (error) {
      this.logger.error(`Leave channel error: ${error.message}`)
      throw new WsException(error.message)
    }
  }

  /**
   * Handle send_message event
   * Creates message and broadcasts to channel
   */
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: CreateMessageDto,
  ) {
    try {
      const userId = client.user.id

      // Create message in database
      const message = await this.chatService.createMessage(userId, data)

      // Broadcast to channel (including sender)
      this.server.to(data.channelId).emit('new_message', {
        ...message,
        timestamp: message.createdAt.toISOString(),
      })

      this.logger.debug(`Message sent to channel ${data.channelId} by ${userId}`)

      return { success: true, messageId: message.id }
    } catch (error) {
      this.logger.error(`Send message error: ${error.message}`)
      throw new WsException(error.message)
    }
  }

  /**
   * Handle typing event
   * Broadcasts typing indicator to channel
   */
  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: TypingDto,
  ) {
    try {
      const { channelId, isTyping } = data
      const userId = client.user.id

      const onlineUser = this.onlineUsers.get(client.id)

      // Broadcast typing indicator to others in channel
      client.to(channelId).emit('typing_indicator', {
        channelId,
        user: {
          id: userId,
          name: onlineUser?.name || 'Unknown',
        },
        isTyping,
        timestamp: new Date().toISOString(),
      })

      return { success: true }
    } catch (error) {
      this.logger.error(`Typing indicator error: ${error.message}`)
      throw new WsException(error.message)
    }
  }

  /**
   * Handle get_online_users event
   * Returns online users in a channel
   */
  @SubscribeMessage('get_online_users')
  async handleGetOnlineUsers(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { channelId: string },
  ) {
    try {
      const { channelId } = data

      // Get all sockets in the room
      const roomSockets = await this.server.in(channelId).fetchSockets()

      const onlineUsers = roomSockets.map(socket => {
        const user = this.onlineUsers.get(socket.id)
        return user ? {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        } : null
      }).filter(Boolean)

      return { success: true, users: onlineUsers }
    } catch (error) {
      this.logger.error(`Get online users error: ${error.message}`)
      throw new WsException(error.message)
    }
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Extract JWT token from socket handshake
   */
  private extractToken(client: Socket): string | null {
    // Try authorization header first
    const authHeader = client.handshake.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    // Try query parameter
    const token = client.handshake.query.token
    if (typeof token === 'string') {
      return token
    }

    // Try auth object (Socket.IO v4)
    const auth = client.handshake.auth as { token?: string }
    if (auth?.token) {
      return auth.token
    }

    return null
  }

  /**
   * Verify JWT token
   */
  private verifyToken(token: string): { sub: string; email: string; rank: string } | null {
    try {
      const secret = this.configService.get('JWT_SECRET') || 'development-secret-key'
      const payload = this.jwtService.verify(token, { secret })
      if (payload && typeof payload === 'object' && 'sub' in payload) {
        return payload as { sub: string; email: string; rank: string }
      }
      return null
    } catch (error) {
      return null
    }
  }

  /**
   * Check if user is online (has at least one connected socket)
   */
  private isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId)
    return sockets ? sockets.size > 0 : false
  }

  /**
   * Emit event to specific user (all their connected devices)
   */
  private emitToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(userId)
    if (sockets) {
      sockets.forEach(socketId => {
        this.server.to(socketId).emit(event, data)
      })
    }
  }
}
