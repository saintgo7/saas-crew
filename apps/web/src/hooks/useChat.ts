'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSocket, ChatSocketMessage, TypingIndicator, ReactionEvent } from './useSocket'
import { chatApi, ChatMessage, ChatChannel } from '../lib/api/chat'

// Typing debounce delay in ms
const TYPING_DEBOUNCE_MS = 1000
const TYPING_TIMEOUT_MS = 3000

// useChat options
export interface UseChatOptions {
  channelId?: string
  autoJoin?: boolean
  onMessage?: (message: ChatSocketMessage) => void
  onMessageUpdated?: (message: ChatSocketMessage) => void
  onMessageDeleted?: (messageId: string) => void
  onTyping?: (data: TypingIndicator) => void
  onUserJoined?: (data: { userId: string; userName: string }) => void
  onUserLeft?: (data: { userId: string; userName: string }) => void
  onError?: (error: Error) => void
}

// Typing user info
export interface TypingUser {
  userId: string
  userName: string
  timestamp: number
}

// useChat return type
export interface UseChatReturn {
  // State
  messages: ChatMessage[]
  isLoading: boolean
  hasMore: boolean
  cursor: string | null
  typingUsers: TypingUser[]
  onlineUsers: string[]
  isConnected: boolean

  // Actions
  sendMessage: (content: string, replyToId?: string) => Promise<void>
  editMessage: (messageId: string, content: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  addReaction: (messageId: string, emoji: string) => Promise<void>
  removeReaction: (messageId: string, emoji: string) => Promise<void>
  loadMoreMessages: () => Promise<void>
  sendTypingIndicator: () => void
  joinChannel: (channelId: string) => void
  leaveChannel: (channelId: string) => void
  markAsRead: () => Promise<void>

  // Refresh
  refreshMessages: () => Promise<void>
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    channelId,
    autoJoin = true,
    onMessage,
    onMessageUpdated,
    onMessageDeleted,
    onTyping,
    onUserJoined,
    onUserLeft,
    onError,
  } = options

  // Socket connection
  const { socket, isConnected, emit, on, off } = useSocket({
    autoConnect: true,
    onError: (error) => onError?.(error),
  })

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  // Refs for debouncing
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTypingRef = useRef<number>(0)
  const currentChannelRef = useRef<string | null>(null)

  // Join channel
  const joinChannel = useCallback(
    (id: string) => {
      if (!isConnected) return

      // Leave previous channel if any
      if (currentChannelRef.current && currentChannelRef.current !== id) {
        emit('chat:leave', { channelId: currentChannelRef.current })
      }

      // Join new channel
      emit('chat:join', { channelId: id })
      currentChannelRef.current = id

      // Request online users
      emit('presence:get', { channelId: id })
    },
    [isConnected, emit]
  )

  // Leave channel
  const leaveChannel = useCallback(
    (id: string) => {
      if (!isConnected) return

      emit('chat:leave', { channelId: id })

      if (currentChannelRef.current === id) {
        currentChannelRef.current = null
      }
    },
    [isConnected, emit]
  )

  // Load messages from API
  const loadMessages = useCallback(
    async (channelIdToLoad: string, messageCursor?: string) => {
      setIsLoading(true)
      try {
        const response = await chatApi.getMessages(channelIdToLoad, messageCursor)

        if (messageCursor) {
          // Append older messages
          setMessages((prev) => [...prev, ...response.messages])
        } else {
          // Replace with new messages
          setMessages(response.messages)
        }

        setHasMore(response.hasMore)
        setCursor(response.cursor || null)
      } catch (error) {
        console.error('[Chat] Failed to load messages:', error)
        onError?.(error instanceof Error ? error : new Error('Failed to load messages'))
      } finally {
        setIsLoading(false)
      }
    },
    [onError]
  )

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!channelId || isLoading || !hasMore || !cursor) return
    await loadMessages(channelId, cursor)
  }, [channelId, isLoading, hasMore, cursor, loadMessages])

  // Refresh messages
  const refreshMessages = useCallback(async () => {
    if (!channelId) return
    setCursor(null)
    setHasMore(true)
    await loadMessages(channelId)
  }, [channelId, loadMessages])

  // Send message
  const sendMessage = useCallback(
    async (content: string, replyToId?: string) => {
      if (!channelId || !content.trim()) return

      try {
        // Optimistic update - emit through socket for real-time
        emit('chat:message:send', {
          channelId,
          content: content.trim(),
          replyToId,
        })

        // Also call API for persistence
        await chatApi.sendMessage(channelId, {
          content: content.trim(),
          replyToId,
        })
      } catch (error) {
        console.error('[Chat] Failed to send message:', error)
        onError?.(error instanceof Error ? error : new Error('Failed to send message'))
        throw error
      }
    },
    [channelId, emit, onError]
  )

  // Edit message
  const editMessage = useCallback(
    async (messageId: string, content: string) => {
      if (!channelId || !content.trim()) return

      try {
        await chatApi.updateMessage(channelId, messageId, { content: content.trim() })

        // Emit update event
        emit('chat:message:update', {
          channelId,
          messageId,
          content: content.trim(),
        })
      } catch (error) {
        console.error('[Chat] Failed to edit message:', error)
        onError?.(error instanceof Error ? error : new Error('Failed to edit message'))
        throw error
      }
    },
    [channelId, emit, onError]
  )

  // Delete message
  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!channelId) return

      try {
        await chatApi.deleteMessage(channelId, messageId)

        // Emit delete event
        emit('chat:message:delete', {
          channelId,
          messageId,
        })

        // Remove from local state
        setMessages((prev) => prev.filter((m) => m.id !== messageId))
      } catch (error) {
        console.error('[Chat] Failed to delete message:', error)
        onError?.(error instanceof Error ? error : new Error('Failed to delete message'))
        throw error
      }
    },
    [channelId, emit, onError]
  )

  // Add reaction
  const addReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!channelId) return

      try {
        await chatApi.addReaction(channelId, messageId, { emoji })

        // Emit reaction event
        emit('chat:reaction:add', {
          channelId,
          messageId,
          emoji,
        })
      } catch (error) {
        console.error('[Chat] Failed to add reaction:', error)
        onError?.(error instanceof Error ? error : new Error('Failed to add reaction'))
        throw error
      }
    },
    [channelId, emit, onError]
  )

  // Remove reaction
  const removeReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!channelId) return

      try {
        await chatApi.removeReaction(channelId, messageId, emoji)

        // Emit reaction event
        emit('chat:reaction:remove', {
          channelId,
          messageId,
          emoji,
        })
      } catch (error) {
        console.error('[Chat] Failed to remove reaction:', error)
        onError?.(error instanceof Error ? error : new Error('Failed to remove reaction'))
        throw error
      }
    },
    [channelId, emit, onError]
  )

  // Send typing indicator (debounced)
  const sendTypingIndicator = useCallback(() => {
    if (!channelId || !isConnected) return

    const now = Date.now()

    // Debounce typing indicator
    if (now - lastTypingRef.current < TYPING_DEBOUNCE_MS) return

    lastTypingRef.current = now
    emit('chat:typing', { channelId, isTyping: true })

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set timeout to send stop typing
    typingTimeoutRef.current = setTimeout(() => {
      emit('chat:typing', { channelId, isTyping: false })
    }, TYPING_TIMEOUT_MS)
  }, [channelId, isConnected, emit])

  // Mark channel as read
  const markAsRead = useCallback(async () => {
    if (!channelId) return

    try {
      await chatApi.markAsRead(channelId)
    } catch (error) {
      console.error('[Chat] Failed to mark as read:', error)
    }
  }, [channelId])

  // Handle incoming message
  const handleMessage = useCallback(
    (message: ChatSocketMessage) => {
      if (message.channelId !== channelId) return

      // Convert socket message to ChatMessage format
      const chatMessage: ChatMessage = {
        id: message.id,
        channelId: message.channelId,
        authorId: message.senderId,
        author: {
          id: message.sender.id,
          name: message.sender.name,
          profileImage: message.sender.profileImage,
          level: message.sender.level,
          role: 'student', // Default role
        },
        content: message.content,
        reactions: [],
        replyTo: message.replyToId
          ? {
              id: message.replyToId,
              authorName: '',
              content: '',
            }
          : undefined,
        isEdited: false,
        isPinned: false,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      }

      // Add to messages (prepend for newest first)
      setMessages((prev) => {
        // Check if message already exists
        if (prev.some((m) => m.id === message.id)) {
          return prev
        }
        return [chatMessage, ...prev]
      })

      onMessage?.(message)
    },
    [channelId, onMessage]
  )

  // Handle message update
  const handleMessageUpdated = useCallback(
    (message: ChatSocketMessage) => {
      if (message.channelId !== channelId) return

      setMessages((prev) =>
        prev.map((m) =>
          m.id === message.id
            ? {
                ...m,
                content: message.content,
                isEdited: true,
                updatedAt: message.updatedAt,
              }
            : m
        )
      )

      onMessageUpdated?.(message)
    },
    [channelId, onMessageUpdated]
  )

  // Handle message deleted
  const handleMessageDeleted = useCallback(
    (data: { messageId: string; channelId: string }) => {
      if (data.channelId !== channelId) return

      setMessages((prev) => prev.filter((m) => m.id !== data.messageId))
      onMessageDeleted?.(data.messageId)
    },
    [channelId, onMessageDeleted]
  )

  // Handle typing indicator
  const handleTyping = useCallback(
    (data: TypingIndicator) => {
      if (data.channelId !== channelId) return

      setTypingUsers((prev) => {
        if (data.isTyping) {
          // Add or update typing user
          const existing = prev.find((u) => u.userId === data.userId)
          if (existing) {
            return prev.map((u) =>
              u.userId === data.userId ? { ...u, timestamp: Date.now() } : u
            )
          }
          return [
            ...prev,
            {
              userId: data.userId,
              userName: data.userName,
              timestamp: Date.now(),
            },
          ]
        } else {
          // Remove typing user
          return prev.filter((u) => u.userId !== data.userId)
        }
      })

      onTyping?.(data)
    },
    [channelId, onTyping]
  )

  // Handle user joined
  const handleUserJoined = useCallback(
    (data: { channelId: string; userId: string; userName: string }) => {
      if (data.channelId !== channelId) return

      setOnlineUsers((prev) => {
        if (prev.includes(data.userId)) return prev
        return [...prev, data.userId]
      })

      onUserJoined?.(data)
    },
    [channelId, onUserJoined]
  )

  // Handle user left
  const handleUserLeft = useCallback(
    (data: { channelId: string; userId: string; userName: string }) => {
      if (data.channelId !== channelId) return

      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId))
      onUserLeft?.(data)
    },
    [channelId, onUserLeft]
  )

  // Handle online users list
  const handleOnlineUsers = useCallback(
    (data: { channelId: string; users: string[] }) => {
      if (data.channelId !== channelId) return
      setOnlineUsers(data.users)
    },
    [channelId]
  )

  // Handle reaction event
  const handleReaction = useCallback(
    (data: ReactionEvent) => {
      if (data.channelId !== channelId) return

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== data.messageId) return m

          const reactions = [...(m.reactions || [])]
          const existingIndex = reactions.findIndex((r) => r.emoji === data.emoji)

          if (data.action === 'add') {
            if (existingIndex >= 0) {
              reactions[existingIndex] = {
                ...reactions[existingIndex],
                count: reactions[existingIndex].count + 1,
                userIds: [...reactions[existingIndex].userIds, data.userId],
              }
            } else {
              reactions.push({
                emoji: data.emoji,
                count: 1,
                userIds: [data.userId],
                hasReacted: false,
              })
            }
          } else if (data.action === 'remove' && existingIndex >= 0) {
            const newCount = reactions[existingIndex].count - 1
            if (newCount <= 0) {
              reactions.splice(existingIndex, 1)
            } else {
              reactions[existingIndex] = {
                ...reactions[existingIndex],
                count: newCount,
                userIds: reactions[existingIndex].userIds.filter((id) => id !== data.userId),
              }
            }
          }

          return { ...m, reactions }
        })
      )
    },
    [channelId]
  )

  // Clean up stale typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setTypingUsers((prev) =>
        prev.filter((u) => now - u.timestamp < TYPING_TIMEOUT_MS)
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Subscribe to socket events
  useEffect(() => {
    if (!isConnected) return

    on('chat:message', handleMessage)
    on('chat:message:updated', handleMessageUpdated)
    on('chat:message:deleted', handleMessageDeleted)
    on('chat:typing', handleTyping)
    on('chat:user:joined', handleUserJoined)
    on('chat:user:left', handleUserLeft)
    on('chat:reaction', handleReaction)
    on('presence:users', handleOnlineUsers)

    return () => {
      off('chat:message', handleMessage)
      off('chat:message:updated', handleMessageUpdated)
      off('chat:message:deleted', handleMessageDeleted)
      off('chat:typing', handleTyping)
      off('chat:user:joined', handleUserJoined)
      off('chat:user:left', handleUserLeft)
      off('chat:reaction', handleReaction)
      off('presence:users', handleOnlineUsers)
    }
  }, [
    isConnected,
    on,
    off,
    handleMessage,
    handleMessageUpdated,
    handleMessageDeleted,
    handleTyping,
    handleUserJoined,
    handleUserLeft,
    handleReaction,
    handleOnlineUsers,
  ])

  // Auto-join channel and load messages
  useEffect(() => {
    if (!channelId) {
      setMessages([])
      setCursor(null)
      setHasMore(true)
      setTypingUsers([])
      setOnlineUsers([])
      return
    }

    // Load initial messages
    loadMessages(channelId)

    // Join channel if connected and autoJoin is enabled
    if (isConnected && autoJoin) {
      joinChannel(channelId)
    }

    return () => {
      // Leave channel on unmount or channel change
      if (currentChannelRef.current) {
        leaveChannel(currentChannelRef.current)
      }

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [channelId, isConnected, autoJoin, joinChannel, leaveChannel, loadMessages])

  return {
    // State
    messages,
    isLoading,
    hasMore,
    cursor,
    typingUsers,
    onlineUsers,
    isConnected,

    // Actions
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    loadMoreMessages,
    sendTypingIndicator,
    joinChannel,
    leaveChannel,
    markAsRead,

    // Refresh
    refreshMessages,
  }
}

// Hook for channels list with real-time updates
export interface UseChannelsOptions {
  autoRefresh?: boolean
}

export interface UseChannelsReturn {
  channels: ChatChannel[]
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

export function useChannels(options: UseChannelsOptions = {}): UseChannelsReturn {
  const { autoRefresh = true } = options

  const [channels, setChannels] = useState<ChatChannel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { isConnected, on, off } = useSocket()

  const loadChannels = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await chatApi.getChannels()
      setChannels(response.channels)
    } catch (err) {
      console.error('[Channels] Failed to load channels:', err)
      setError(err instanceof Error ? err : new Error('Failed to load channels'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle new message (update last message in channel)
  const handleNewMessage = useCallback((message: ChatSocketMessage) => {
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === message.channelId
          ? {
              ...ch,
              lastMessage: {
                content: message.content,
                authorName: message.sender.name,
                createdAt: message.createdAt,
              },
              unreadCount: ch.unreadCount + 1,
            }
          : ch
      )
    )
  }, [])

  // Subscribe to socket events
  useEffect(() => {
    if (!isConnected || !autoRefresh) return

    on('chat:message', handleNewMessage)

    return () => {
      off('chat:message', handleNewMessage)
    }
  }, [isConnected, autoRefresh, on, off, handleNewMessage])

  // Load channels on mount
  useEffect(() => {
    loadChannels()
  }, [loadChannels])

  return {
    channels,
    isLoading,
    error,
    refresh: loadChannels,
  }
}
