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
import { CanvasService } from './canvas.service'

interface AuthenticatedUser {
  id: string
  email: string
  name?: string
}

interface AuthenticatedSocket extends Socket {
  user: AuthenticatedUser
}

interface CanvasUser {
  userId: string
  name: string
  avatar?: string | null
  color: string
  cursor?: { x: number; y: number }
}

// Generate consistent colors for users
const USER_COLORS = [
  '#E57373', '#F06292', '#BA68C8', '#9575CD',
  '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1',
  '#4DB6AC', '#81C784', '#AED581', '#FFD54F',
]

@WebSocketGateway({
  namespace: '/canvas',
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
@Injectable()
export class CanvasGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(CanvasGateway.name)

  // Track users in each canvas room: Map<canvasId, Map<socketId, CanvasUser>>
  private canvasUsers: Map<string, Map<string, CanvasUser>> = new Map()

  // Track socket -> canvas mapping: Map<socketId, canvasId>
  private socketCanvas: Map<string, string> = new Map()

  // Debounce timers for auto-save: Map<canvasId, NodeJS.Timeout>
  private saveTimers: Map<string, NodeJS.Timeout> = new Map()

  constructor(
    private readonly canvasService: CanvasService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit() {
    this.logger.log('Canvas WebSocket Gateway initialized')
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractToken(client)
      if (!token) {
        client.emit('error', { message: 'Authentication required' })
        client.disconnect()
        return
      }

      const payload = this.verifyToken(token)
      if (!payload) {
        client.emit('error', { message: 'Invalid authentication token' })
        client.disconnect()
        return
      }

      client.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.email.split('@')[0],
      }

      this.logger.log(`Canvas user connected: ${payload.email} (${client.id})`)
      client.emit('connected', { userId: payload.sub })
    } catch (error) {
      this.logger.error(`Canvas connection error: ${error.message}`)
      client.emit('error', { message: 'Connection failed' })
      client.disconnect()
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const canvasId = this.socketCanvas.get(client.id)
    if (canvasId) {
      const users = this.canvasUsers.get(canvasId)
      if (users) {
        users.delete(client.id)
        if (users.size === 0) {
          this.canvasUsers.delete(canvasId)
        }
      }

      this.socketCanvas.delete(client.id)

      // Notify remaining users
      client.to(canvasId).emit('canvas:users', {
        users: this.getCanvasUserList(canvasId),
      })

      this.logger.log(`Canvas user disconnected: ${client.user?.id} from canvas ${canvasId}`)
    }
  }

  @SubscribeMessage('canvas:join')
  async handleJoin(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { canvasId: string },
  ) {
    try {
      const { canvasId } = data
      const userId = client.user.id

      // Verify access
      await this.canvasService.findOne(canvasId, userId)

      // Leave previous canvas if any
      const prevCanvas = this.socketCanvas.get(client.id)
      if (prevCanvas) {
        client.leave(prevCanvas)
        const prevUsers = this.canvasUsers.get(prevCanvas)
        if (prevUsers) {
          prevUsers.delete(client.id)
        }
      }

      // Join new canvas room
      client.join(canvasId)
      this.socketCanvas.set(client.id, canvasId)

      // Track user
      if (!this.canvasUsers.has(canvasId)) {
        this.canvasUsers.set(canvasId, new Map())
      }
      const users = this.canvasUsers.get(canvasId)!
      const colorIndex = users.size % USER_COLORS.length
      users.set(client.id, {
        userId,
        name: client.user.name || client.user.email,
        color: USER_COLORS[colorIndex],
      })

      // Load canvas data
      const canvasData = await this.canvasService.getCanvasData(canvasId)

      // Send initial data to joiner
      client.emit('canvas:load', {
        canvasId,
        data: canvasData,
        users: this.getCanvasUserList(canvasId),
      })

      // Notify others
      client.to(canvasId).emit('canvas:users', {
        users: this.getCanvasUserList(canvasId),
      })

      this.logger.log(`User ${userId} joined canvas ${canvasId}`)

      return { success: true }
    } catch (error) {
      this.logger.error(`Canvas join error: ${error.message}`)
      throw new WsException(error.message)
    }
  }

  @SubscribeMessage('canvas:leave')
  async handleLeave(
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const canvasId = this.socketCanvas.get(client.id)
    if (canvasId) {
      client.leave(canvasId)
      const users = this.canvasUsers.get(canvasId)
      if (users) {
        users.delete(client.id)
      }
      this.socketCanvas.delete(client.id)

      client.to(canvasId).emit('canvas:users', {
        users: this.getCanvasUserList(canvasId),
      })
    }

    return { success: true }
  }

  @SubscribeMessage('canvas:sync')
  async handleSync(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { canvasId: string; elements: any; appState?: any },
  ) {
    const { canvasId, elements, appState } = data

    // Broadcast to other users in the canvas
    client.to(canvasId).emit('canvas:sync', {
      elements,
      appState,
      userId: client.user.id,
    })

    // Debounced auto-save to database
    this.debounceSave(canvasId, { elements, appState })

    return { success: true }
  }

  @SubscribeMessage('canvas:awareness')
  async handleAwareness(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { canvasId: string; cursor?: { x: number; y: number }; selectedElementIds?: string[] },
  ) {
    const { canvasId, cursor, selectedElementIds } = data

    // Update tracked user cursor
    const users = this.canvasUsers.get(canvasId)
    if (users) {
      const user = users.get(client.id)
      if (user) {
        user.cursor = cursor
      }
    }

    // Broadcast cursor position to others
    client.to(canvasId).emit('canvas:awareness', {
      userId: client.user.id,
      name: client.user.name,
      cursor,
      selectedElementIds,
      color: users?.get(client.id)?.color,
    })

    return { success: true }
  }

  // Debounced save to PostgreSQL
  private debounceSave(canvasId: string, data: { elements: any; appState?: any }) {
    const existing = this.saveTimers.get(canvasId)
    if (existing) {
      clearTimeout(existing)
    }

    const timer = setTimeout(async () => {
      try {
        // Get first connected user as saver (system-level save)
        const users = this.canvasUsers.get(canvasId)
        if (!users || users.size === 0) return

        const firstUser = users.values().next().value
        if (!firstUser) return

        await this.canvasService.saveData(canvasId, firstUser.userId, {
          data: { elements: data.elements, appState: data.appState },
        })

        // Notify all users in canvas that save completed
        this.server.to(canvasId).emit('canvas:saved', {
          canvasId,
          timestamp: new Date().toISOString(),
        })

        this.logger.debug(`Canvas ${canvasId} auto-saved`)
      } catch (error) {
        this.logger.error(`Canvas auto-save error: ${error.message}`)
      }
    }, 5000) // 5 second debounce

    this.saveTimers.set(canvasId, timer)
  }

  private getCanvasUserList(canvasId: string): CanvasUser[] {
    const users = this.canvasUsers.get(canvasId)
    if (!users) return []
    return Array.from(users.values())
  }

  private extractToken(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    const token = client.handshake.query.token
    if (typeof token === 'string') {
      return token
    }

    const auth = client.handshake.auth as { token?: string }
    if (auth?.token) {
      return auth.token
    }

    return null
  }

  private verifyToken(token: string): { sub: string; email: string; rank: string } | null {
    try {
      const secret = this.configService.get('JWT_SECRET') || 'development-secret-key'
      const payload = this.jwtService.verify(token, { secret })
      if (payload && typeof payload === 'object' && 'sub' in payload) {
        return payload as { sub: string; email: string; rank: string }
      }
      return null
    } catch {
      return null
    }
  }
}
