'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Socket connection states
export type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

// Socket event types
export interface SocketEvents {
  // Connection events
  connect: () => void
  disconnect: (reason: string) => void
  connect_error: (error: Error) => void

  // Chat events
  'chat:message': (message: ChatSocketMessage) => void
  'chat:message:updated': (message: ChatSocketMessage) => void
  'chat:message:deleted': (data: { messageId: string; channelId: string }) => void
  'chat:typing': (data: TypingIndicator) => void
  'chat:user:joined': (data: UserJoinedEvent) => void
  'chat:user:left': (data: UserLeftEvent) => void
  'chat:reaction': (data: ReactionEvent) => void

  // Presence events
  'presence:online': (data: { userId: string; channelId?: string }) => void
  'presence:offline': (data: { userId: string; channelId?: string }) => void
  'presence:users': (data: { channelId: string; users: string[] }) => void

  // Error events
  error: (error: { message: string; code?: string }) => void
}

// Socket message types
export interface ChatSocketMessage {
  id: string
  channelId: string
  senderId: string
  sender: {
    id: string
    name: string
    profileImage?: string
    level: number
  }
  content: string
  replyToId?: string
  createdAt: string
  updatedAt: string
}

export interface TypingIndicator {
  channelId: string
  userId: string
  userName: string
  isTyping: boolean
}

export interface UserJoinedEvent {
  channelId: string
  userId: string
  userName: string
}

export interface UserLeftEvent {
  channelId: string
  userId: string
  userName: string
}

export interface ReactionEvent {
  messageId: string
  channelId: string
  emoji: string
  userId: string
  action: 'add' | 'remove'
}

// Socket options
export interface UseSocketOptions {
  autoConnect?: boolean
  reconnection?: boolean
  reconnectionAttempts?: number
  reconnectionDelay?: number
  onConnect?: () => void
  onDisconnect?: (reason: string) => void
  onError?: (error: Error) => void
}

// Get authentication token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

// Socket hook return type
export interface UseSocketReturn {
  socket: Socket | null
  status: SocketStatus
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  emit: <T = unknown>(event: string, data?: T) => void
  on: <K extends keyof SocketEvents>(event: K, handler: SocketEvents[K]) => void
  off: <K extends keyof SocketEvents>(event: K, handler?: SocketEvents[K]) => void
}

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const {
    autoConnect = true,
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
    onConnect,
    onDisconnect,
    onError,
  } = options

  const socketRef = useRef<Socket | null>(null)
  const [status, setStatus] = useState<SocketStatus>('disconnected')

  // Initialize socket connection
  const connect = useCallback(() => {
    const token = getAuthToken()

    // Don't connect without authentication
    if (!token) {
      console.warn('[Socket] No auth token available, skipping connection')
      return
    }

    // Already connected or connecting
    if (socketRef.current?.connected) {
      return
    }

    setStatus('connecting')

    // Create socket instance with authentication
    const socket = io(API_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: {
        token,
      },
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
      autoConnect: true,
    })

    // Connection event handlers
    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      setStatus('connected')
      onConnect?.()
    })

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
      setStatus('disconnected')
      onDisconnect?.(reason)
    })

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message)
      setStatus('error')
      onError?.(error)
    })

    socket.on('error', (error) => {
      console.error('[Socket] Error:', error)
      onError?.(new Error(error.message || 'Socket error'))
    })

    // Handle reconnection
    socket.io.on('reconnect', (attempt) => {
      console.log('[Socket] Reconnected after', attempt, 'attempts')
      setStatus('connected')
    })

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log('[Socket] Reconnection attempt:', attempt)
      setStatus('connecting')
    })

    socket.io.on('reconnect_failed', () => {
      console.error('[Socket] Reconnection failed')
      setStatus('error')
    })

    socketRef.current = socket
  }, [reconnection, reconnectionAttempts, reconnectionDelay, onConnect, onDisconnect, onError])

  // Disconnect socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setStatus('disconnected')
    }
  }, [])

  // Emit event
  const emit = useCallback(<T = unknown>(event: string, data?: T) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    } else {
      console.warn('[Socket] Cannot emit, socket not connected')
    }
  }, [])

  // Subscribe to event
  const on = useCallback(<K extends keyof SocketEvents>(event: K, handler: SocketEvents[K]) => {
    if (socketRef.current) {
      socketRef.current.on(event as string, handler as (...args: unknown[]) => void)
    }
  }, [])

  // Unsubscribe from event
  const off = useCallback(<K extends keyof SocketEvents>(event: K, handler?: SocketEvents[K]) => {
    if (socketRef.current) {
      if (handler) {
        socketRef.current.off(event as string, handler as (...args: unknown[]) => void)
      } else {
        socketRef.current.off(event as string)
      }
    }
  }, [])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  // Reconnect when auth token changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (e.newValue) {
          // Token added or changed, reconnect
          disconnect()
          connect()
        } else {
          // Token removed, disconnect
          disconnect()
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [connect, disconnect])

  return {
    socket: socketRef.current,
    status,
    isConnected: status === 'connected',
    connect,
    disconnect,
    emit,
    on,
    off,
  }
}

// Singleton socket instance for global use
let globalSocket: Socket | null = null

export function getGlobalSocket(): Socket | null {
  return globalSocket
}

export function initGlobalSocket(): Socket {
  if (globalSocket) {
    return globalSocket
  }

  const token = getAuthToken()

  globalSocket = io(API_URL, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: !!token,
  })

  return globalSocket
}

export function disconnectGlobalSocket(): void {
  if (globalSocket) {
    globalSocket.disconnect()
    globalSocket = null
  }
}
