'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export interface CollaboratorInfo {
  userId: string
  name: string
  avatar?: string | null
  color: string
  cursor?: { x: number; y: number }
}

interface CanvasLoadData {
  canvasId: string
  data: any
  users: CollaboratorInfo[]
}

interface CanvasSyncData {
  elements: any
  appState?: any
  userId: string
}

interface AwarenessData {
  userId: string
  name: string
  cursor?: { x: number; y: number }
  selectedElementIds?: string[]
  color?: string
}

export interface UseCanvasCollaborationOptions {
  canvasId: string
  onLoad?: (data: any) => void
  onSync?: (data: CanvasSyncData) => void
  onAwareness?: (data: AwarenessData) => void
  onUsersChange?: (users: CollaboratorInfo[]) => void
  onSaved?: () => void
}

export function useCanvasCollaboration(options: UseCanvasCollaborationOptions) {
  const { canvasId, onLoad, onSync, onAwareness, onUsersChange, onSaved } = options

  const socketRef = useRef<Socket | null>(null)
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([])
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  // Store latest callbacks in refs to avoid re-connections
  const callbacksRef = useRef({ onLoad, onSync, onAwareness, onUsersChange, onSaved })
  callbacksRef.current = { onLoad, onSync, onAwareness, onUsersChange, onSaved }

  useEffect(() => {
    if (!canvasId) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      console.warn('[CanvasCollab] No auth token, skipping connection')
      return
    }

    setStatus('connecting')

    const socket = io(`${API_URL}/canvas`, {
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
      setStatus('connected')
      // Join the canvas room
      socket.emit('canvas:join', { canvasId })
    })

    socket.on('disconnect', () => {
      setStatus('disconnected')
    })

    socket.on('connect_error', () => {
      setStatus('error')
    })

    // Handle initial canvas load
    socket.on('canvas:load', (data: CanvasLoadData) => {
      callbacksRef.current.onLoad?.(data.data)
      setCollaborators(data.users)
      callbacksRef.current.onUsersChange?.(data.users)
    })

    // Handle real-time sync from other users
    socket.on('canvas:sync', (data: CanvasSyncData) => {
      callbacksRef.current.onSync?.(data)
    })

    // Handle cursor/awareness updates
    socket.on('canvas:awareness', (data: AwarenessData) => {
      callbacksRef.current.onAwareness?.(data)
      // Update collaborator cursor
      setCollaborators((prev) =>
        prev.map((c) =>
          c.userId === data.userId
            ? { ...c, cursor: data.cursor, color: data.color || c.color }
            : c,
        ),
      )
    })

    // Handle user list updates
    socket.on('canvas:users', (data: { users: CollaboratorInfo[] }) => {
      setCollaborators(data.users)
      callbacksRef.current.onUsersChange?.(data.users)
    })

    // Handle save confirmation
    socket.on('canvas:saved', () => {
      setSaveStatus('saved')
      callbacksRef.current.onSaved?.()
    })

    socket.on('error', (error: { message: string }) => {
      console.error('[CanvasCollab] Error:', error.message)
    })

    socketRef.current = socket

    return () => {
      socket.emit('canvas:leave')
      socket.disconnect()
      socketRef.current = null
      setStatus('disconnected')
      setCollaborators([])
    }
  }, [canvasId])

  const syncElements = useCallback(
    (elements: any, appState?: any) => {
      if (socketRef.current?.connected) {
        setSaveStatus('saving')
        socketRef.current.emit('canvas:sync', {
          canvasId,
          elements,
          appState,
        })
      }
    },
    [canvasId],
  )

  const updateAwareness = useCallback(
    (cursor?: { x: number; y: number }, selectedElementIds?: string[]) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('canvas:awareness', {
          canvasId,
          cursor,
          selectedElementIds,
        })
      }
    },
    [canvasId],
  )

  return {
    status,
    isConnected: status === 'connected',
    collaborators,
    saveStatus,
    syncElements,
    updateAwareness,
  }
}
