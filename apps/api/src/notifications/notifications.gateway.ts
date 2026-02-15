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
import { Logger, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { NotificationsService } from './notifications.service'

/**
 * User info extracted from JWT
 */
interface AuthenticatedUser {
  id: string
  email: string
}

/**
 * Extended Socket with user data
 */
interface AuthenticatedSocket extends Socket {
  user: AuthenticatedUser
}

/**
 * Notification payload for real-time delivery
 */
interface NotificationPayload {
  id: string
  type: string
  title: string
  content: string
  referenceType?: string | null
  referenceId?: string | null
  actor?: {
    id: string
    name: string
    avatar: string | null
  } | null
  createdAt: string
}

/**
 * Notifications WebSocket Gateway
 * Handles real-time notification delivery using Socket.IO
 *
 * Events (Client -> Server):
 * - subscribe: Subscribe to user's notification stream
 * - unsubscribe: Unsubscribe from notifications
 * - mark_read: Mark notification as read via WebSocket
 *
 * Emissions (Server -> Client):
 * - notification: New notification for user
 * - notification_read: Notification was read
 * - all_notifications_read: All notifications marked as read
 * - unread_count: Updated unread count
 * - error: Error messages
 * - connected: Connection confirmed
 */
@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(NotificationsGateway.name)

  // Track user sockets: Map<userId, Set<socketId>>
  private userSockets: Map<string, Set<string>> = new Map()

  // Track socket to user mapping: Map<socketId, userId>
  private socketToUser: Map<string, string> = new Map()

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Called when gateway is initialized
   */
  afterInit(server: Server) {
    this.logger.log('Notifications WebSocket Gateway initialized')
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
      }

      // Track user sockets (for multi-device support)
      if (!this.userSockets.has(payload.sub)) {
        this.userSockets.set(payload.sub, new Set())
      }
      this.userSockets.get(payload.sub)!.add(client.id)
      this.socketToUser.set(client.id, payload.sub)

      // Join user's personal room for notifications
      client.join(`user:${payload.sub}`)

      this.logger.log(`User connected to notifications: ${payload.email} (${client.id})`)

      // Send connection success with initial unread count
      const unreadCount = await this.notificationsService.getUnreadCount(payload.sub)
      client.emit('connected', {
        userId: payload.sub,
        message: 'Connected to notification server',
        unreadCount,
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
    const userId = this.socketToUser.get(client.id)

    if (userId) {
      // Clean up tracking
      const userSocketSet = this.userSockets.get(userId)
      if (userSocketSet) {
        userSocketSet.delete(client.id)
        if (userSocketSet.size === 0) {
          this.userSockets.delete(userId)
        }
      }
      this.socketToUser.delete(client.id)

      this.logger.log(`User disconnected from notifications: ${userId} (${client.id})`)
    }
  }

  /**
   * Handle mark_read event
   * Marks a notification as read via WebSocket
   */
  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { notificationId: string },
  ) {
    try {
      const userId = client.user.id
      const { notificationId } = data

      const notification = await this.notificationsService.markAsRead(notificationId, userId)

      // Get updated unread count
      const unreadCount = await this.notificationsService.getUnreadCount(userId)

      // Emit to all user's connected devices
      this.emitToUser(userId, 'notification_read', {
        notificationId,
        timestamp: new Date().toISOString(),
      })

      this.emitToUser(userId, 'unread_count', { count: unreadCount })

      return { success: true, notificationId }
    } catch (error) {
      this.logger.error(`Mark read error: ${error.message}`)
      throw new WsException(error.message)
    }
  }

  /**
   * Handle mark_all_read event
   * Marks all notifications as read via WebSocket
   */
  @SubscribeMessage('mark_all_read')
  async handleMarkAllRead(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const userId = client.user.id

      const result = await this.notificationsService.markAllAsRead(userId)

      // Emit to all user's connected devices
      this.emitToUser(userId, 'all_notifications_read', {
        count: result.count,
        timestamp: new Date().toISOString(),
      })

      this.emitToUser(userId, 'unread_count', { count: 0 })

      return { success: true, count: result.count }
    } catch (error) {
      this.logger.error(`Mark all read error: ${error.message}`)
      throw new WsException(error.message)
    }
  }

  /**
   * Handle get_unread_count event
   * Returns current unread notification count
   */
  @SubscribeMessage('get_unread_count')
  async handleGetUnreadCount(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const userId = client.user.id
      const count = await this.notificationsService.getUnreadCount(userId)

      return { success: true, count }
    } catch (error) {
      this.logger.error(`Get unread count error: ${error.message}`)
      throw new WsException(error.message)
    }
  }

  // ============================================
  // Public Methods for Sending Notifications
  // ============================================

  /**
   * Send a notification to a specific user
   * Called by NotificationsService after creating a notification
   *
   * @param userId - Target user ID
   * @param notification - Notification payload
   */
  sendNotificationToUser(userId: string, notification: NotificationPayload) {
    this.emitToUser(userId, 'notification', notification)
    this.logger.debug(`Notification sent to user ${userId}: ${notification.type}`)
  }

  /**
   * Send updated unread count to a user
   *
   * @param userId - Target user ID
   * @param count - New unread count
   */
  sendUnreadCountToUser(userId: string, count: number) {
    this.emitToUser(userId, 'unread_count', { count })
  }

  /**
   * Check if a user is online (has connected sockets)
   *
   * @param userId - User ID to check
   */
  isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId)
    return sockets ? sockets.size > 0 : false
  }

  /**
   * Get connected socket count for a user
   *
   * @param userId - User ID
   */
  getUserSocketCount(userId: string): number {
    const sockets = this.userSockets.get(userId)
    return sockets ? sockets.size : 0
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
  private verifyToken(token: string): { sub: string; email: string } | null {
    try {
      const secret = this.configService.get('JWT_SECRET') || 'development-secret-key'
      const payload = this.jwtService.verify(token, { secret })
      if (payload && typeof payload === 'object' && 'sub' in payload) {
        return payload as { sub: string; email: string }
      }
      return null
    } catch (error) {
      return null
    }
  }

  /**
   * Emit event to specific user (all their connected devices)
   */
  private emitToUser(userId: string, event: string, data: any) {
    // Use room-based emission for better performance
    this.server.to(`user:${userId}`).emit(event, data)
  }
}
