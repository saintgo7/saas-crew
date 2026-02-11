'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from '@/i18n'
import { useUserStore } from '@/store/user-store'
import { cn } from '@/lib/utils'
import {
  ChatHeader,
  ChannelList,
  MessageList,
  MessageInput,
  TypingIndicator,
  OnlineUsers,
} from '@/components/chat'
import { chatApi } from '@/lib/api/chat'
import type {
  ChatChannel,
  ChatMessage,
  OnlineUser,
} from '@/lib/api/chat'

// Mock data for development
const MOCK_CHANNELS: ChatChannel[] = [
  {
    id: '1',
    name: 'general',
    description: 'General discussion for all crew members',
    type: 'general',
    memberCount: 156,
    unreadCount: 3,
    lastMessage: {
      content: 'Welcome to the crew!',
      authorName: 'Admin',
      createdAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'introductions',
    description: 'Introduce yourself to the crew',
    type: 'general',
    memberCount: 142,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'questions',
    description: 'Ask questions and get help',
    type: 'general',
    memberCount: 128,
    unreadCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'senior-lounge',
    description: 'For Senior level members only',
    type: 'level-restricted',
    requiredLevel: 11,
    memberCount: 45,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'master-council',
    description: 'For Master level members only',
    type: 'level-restricted',
    requiredLevel: 31,
    memberCount: 12,
    unreadCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'project-alpha',
    description: 'Alpha project team discussion',
    type: 'project',
    memberCount: 8,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    channelId: '1',
    authorId: 'admin-1',
    author: {
      id: 'admin-1',
      name: 'Kim Admin',
      profileImage: undefined,
      level: 50,
      role: 'admin',
    },
    content: 'Welcome to CrewSpace! This is the general discussion channel.',
    reactions: [
      { emoji: 'heart', count: 5, userIds: [], hasReacted: false },
      { emoji: 'thumbsup', count: 3, userIds: [], hasReacted: true },
    ],
    isEdited: false,
    isPinned: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    channelId: '1',
    authorId: 'mentor-1',
    author: {
      id: 'mentor-1',
      name: 'Park Mentor',
      profileImage: undefined,
      level: 35,
      role: 'mentor',
    },
    content: 'Feel free to ask any questions here. We are here to help!',
    reactions: [],
    isEdited: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 82800000).toISOString(),
    updatedAt: new Date(Date.now() - 82800000).toISOString(),
  },
  {
    id: '3',
    channelId: '1',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      name: 'Lee Junior',
      profileImage: undefined,
      level: 5,
      role: 'student',
    },
    content: 'Hello everyone! I just joined the crew. Excited to learn and grow with you all!',
    reactions: [
      { emoji: 'fire', count: 2, userIds: [], hasReacted: false },
    ],
    isEdited: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '4',
    channelId: '1',
    authorId: 'user-2',
    author: {
      id: 'user-2',
      name: 'Choi Senior',
      profileImage: undefined,
      level: 22,
      role: 'student',
    },
    content: 'Welcome Lee Junior! What technologies are you interested in?',
    reactions: [],
    replyTo: {
      id: '3',
      authorName: 'Lee Junior',
      content: 'Hello everyone! I just joined the crew...',
    },
    isEdited: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 3000000).toISOString(),
    updatedAt: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: '5',
    channelId: '1',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      name: 'Lee Junior',
      profileImage: undefined,
      level: 5,
      role: 'student',
    },
    content: 'I am mainly interested in React and TypeScript. I have been learning for about 3 months now. Looking forward to building projects together!',
    reactions: [
      { emoji: 'thumbsup', count: 1, userIds: [], hasReacted: false },
    ],
    isEdited: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 2400000).toISOString(),
    updatedAt: new Date(Date.now() - 2400000).toISOString(),
  },
  {
    id: '6',
    channelId: '1',
    authorId: 'mentor-1',
    author: {
      id: 'mentor-1',
      name: 'Park Mentor',
      profileImage: undefined,
      level: 35,
      role: 'mentor',
    },
    content: 'Great choices! We have some excellent React courses that you should check out. Let me know if you need any guidance.',
    reactions: [],
    isEdited: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
]

const MOCK_ONLINE_USERS: OnlineUser[] = [
  {
    id: 'admin-1',
    name: 'Kim Admin',
    profileImage: undefined,
    level: 50,
    role: 'admin',
    status: 'online',
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'mentor-1',
    name: 'Park Mentor',
    profileImage: undefined,
    level: 35,
    role: 'mentor',
    status: 'online',
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'mentor-2',
    name: 'Kang Mentor',
    profileImage: undefined,
    level: 32,
    role: 'mentor',
    status: 'away',
    lastActiveAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'user-1',
    name: 'Lee Junior',
    profileImage: undefined,
    level: 5,
    role: 'student',
    status: 'online',
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    name: 'Choi Senior',
    profileImage: undefined,
    level: 22,
    role: 'student',
    status: 'online',
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    name: 'Jung Student',
    profileImage: undefined,
    level: 8,
    role: 'student',
    status: 'busy',
    lastActiveAt: new Date().toISOString(),
  },
]

export default function ChatPage() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUserStore()

  // State
  const [channels, setChannels] = useState<ChatChannel[]>([])
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  // Loading states
  const [isLoadingChannels, setIsLoadingChannels] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(false)

  // Error states
  const [channelsError, setChannelsError] = useState<string | null>(null)
  const [messagesError, setMessagesError] = useState<string | null>(null)

  // Mobile sidebar states
  const [showChannelsSidebar, setShowChannelsSidebar] = useState(false)
  const [showUsersSidebar, setShowUsersSidebar] = useState(false)

  // Get current channel
  const activeChannel = channels.find((ch) => ch.id === activeChannelId) || null

  // Load channels
  useEffect(() => {
    const loadChannels = async () => {
      setIsLoadingChannels(true)
      setChannelsError(null)

      try {
        // Use mock data for now
        // const response = await chatApi.getChannels()
        // setChannels(response.channels)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        setChannels(MOCK_CHANNELS)

        // Set initial channel from URL or default to first
        const channelId = searchParams.get('channel')
        if (channelId && MOCK_CHANNELS.find((ch) => ch.id === channelId)) {
          setActiveChannelId(channelId)
        } else if (MOCK_CHANNELS.length > 0) {
          setActiveChannelId(MOCK_CHANNELS[0].id)
        }
      } catch (error) {
        console.error('Failed to load channels:', error)
        setChannelsError(t('chat.loadChannelsFailed'))
      } finally {
        setIsLoadingChannels(false)
      }
    }

    loadChannels()
  }, [searchParams, t])

  // Load messages when channel changes
  useEffect(() => {
    if (!activeChannelId) return

    const loadMessages = async () => {
      setIsLoadingMessages(true)
      setMessagesError(null)

      try {
        // Use mock data for now
        // const response = await chatApi.getMessages(activeChannelId)
        // setMessages(response.messages)
        // setHasMoreMessages(response.hasMore)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))
        const channelMessages = MOCK_MESSAGES.filter(
          (m) => m.channelId === activeChannelId
        )
        setMessages(channelMessages)
        setHasMoreMessages(false)

        // Load online users
        setOnlineUsers(MOCK_ONLINE_USERS)

        // Mark channel as read
        // await chatApi.markAsRead(activeChannelId)
      } catch (error) {
        console.error('Failed to load messages:', error)
        setMessagesError(t('chat.loadMessagesFailed'))
      } finally {
        setIsLoadingMessages(false)
      }
    }

    loadMessages()
  }, [activeChannelId, t])

  // Update URL when channel changes
  useEffect(() => {
    if (activeChannelId) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('channel', activeChannelId)
      router.replace(`/chat?${params.toString()}`, { scroll: false })
    }
  }, [activeChannelId, router, searchParams])

  // Handle channel selection
  const handleSelectChannel = useCallback((channelId: string) => {
    setActiveChannelId(channelId)
    setReplyTo(null)
    setShowChannelsSidebar(false)
  }, [])

  // Handle send message
  const handleSendMessage = useCallback(
    async (content: string, replyToId?: string) => {
      if (!activeChannelId || !user) return

      try {
        // await chatApi.sendMessage(activeChannelId, { content, replyToId })

        // Add message to local state (optimistic update)
        const newMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          channelId: activeChannelId,
          authorId: user.id,
          author: {
            id: user.id,
            name: user.name,
            profileImage: user.profileImage,
            level: user.level,
            role: user.role,
          },
          content,
          reactions: [],
          replyTo: replyToId
            ? {
                id: replyToId,
                authorName: replyTo?.author.name || '',
                content: replyTo?.content.slice(0, 50) || '',
              }
            : undefined,
          isEdited: false,
          isPinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, newMessage])
        setReplyTo(null)
      } catch (error) {
        console.error('Failed to send message:', error)
        throw error
      }
    },
    [activeChannelId, user, replyTo]
  )

  // Handle reply
  const handleReply = useCallback((message: ChatMessage) => {
    setReplyTo(message)
  }, [])

  // Handle reaction
  const handleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!activeChannelId) return

      try {
        // await chatApi.addReaction(activeChannelId, messageId, { emoji })

        // Update local state
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== messageId) return m

            const existingReaction = m.reactions.find((r) => r.emoji === emoji)
            if (existingReaction) {
              if (existingReaction.hasReacted) {
                // Remove reaction
                return {
                  ...m,
                  reactions: m.reactions
                    .map((r) =>
                      r.emoji === emoji
                        ? { ...r, count: r.count - 1, hasReacted: false }
                        : r
                    )
                    .filter((r) => r.count > 0),
                }
              } else {
                // Add to existing
                return {
                  ...m,
                  reactions: m.reactions.map((r) =>
                    r.emoji === emoji
                      ? { ...r, count: r.count + 1, hasReacted: true }
                      : r
                  ),
                }
              }
            } else {
              // New reaction
              return {
                ...m,
                reactions: [
                  ...m.reactions,
                  { emoji, count: 1, userIds: [], hasReacted: true },
                ],
              }
            }
          })
        )
      } catch (error) {
        console.error('Failed to add reaction:', error)
      }
    },
    [activeChannelId]
  )

  // Handle edit message
  const handleEditMessage = useCallback(
    async (messageId: string, content: string) => {
      if (!activeChannelId) return

      const newContent = prompt(t('chat.editMessage'), content)
      if (newContent === null || newContent === content) return

      try {
        // await chatApi.updateMessage(activeChannelId, messageId, { content: newContent })

        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, content: newContent, isEdited: true }
              : m
          )
        )
      } catch (error) {
        console.error('Failed to edit message:', error)
      }
    },
    [activeChannelId, t]
  )

  // Handle delete message
  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
      if (!activeChannelId) return

      try {
        // await chatApi.deleteMessage(activeChannelId, messageId)

        setMessages((prev) => prev.filter((m) => m.id !== messageId))
      } catch (error) {
        console.error('Failed to delete message:', error)
      }
    },
    [activeChannelId]
  )

  // Handle load more messages
  const handleLoadMore = useCallback(async () => {
    if (!activeChannelId || isLoadingMore || !hasMoreMessages) return

    setIsLoadingMore(true)
    try {
      // const oldestMessage = messages[0]
      // const response = await chatApi.getMessages(
      //   activeChannelId,
      //   oldestMessage?.createdAt
      // )
      // setMessages((prev) => [...response.messages, ...prev])
      // setHasMoreMessages(response.hasMore)
    } catch (error) {
      console.error('Failed to load more messages:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [activeChannelId, isLoadingMore, hasMoreMessages])

  // Handle typing indicator
  const handleTyping = useCallback(async () => {
    if (!activeChannelId) return
    // await chatApi.sendTypingIndicator(activeChannelId)
  }, [activeChannelId])

  // Check if user can access channel
  const canAccessChannel = useCallback(
    (channel: ChatChannel) => {
      if (channel.type !== 'level-restricted') return true
      if (!user) return false
      return user.level >= (channel.requiredLevel || 0)
    },
    [user]
  )

  return (
    <div className="flex h-full overflow-hidden bg-white dark:bg-gray-900">
      {/* Mobile channel sidebar overlay */}
      {showChannelsSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setShowChannelsSidebar(false)}
        />
      )}

      {/* Channel list sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto',
          'transform transition-transform duration-200 ease-in-out',
          showChannelsSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <ChannelList
          channels={channels}
          activeChannelId={activeChannelId}
          onSelectChannel={handleSelectChannel}
          isLoading={isLoadingChannels}
          error={channelsError}
          onClose={() => setShowChannelsSidebar(false)}
          isMobile={showChannelsSidebar}
        />
      </div>

      {/* Main chat area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Chat header */}
        <ChatHeader
          channel={activeChannel}
          onToggleSidebar={() => setShowChannelsSidebar(true)}
          onToggleUsersSidebar={() => setShowUsersSidebar(!showUsersSidebar)}
          showMobileMenu
        />

        {/* Messages */}
        {!user ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('chat.loginRequired')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('chat.loginToChat')}
            </p>
            <a
              href="/auth/login"
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t('common.login')}
            </a>
          </div>
        ) : activeChannel && !canAccessChannel(activeChannel) ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-amber-100 p-4 dark:bg-amber-900/30">
              <span className="text-4xl">\ud83d\udd12</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('chat.levelRestricted')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('chat.levelRequired', { level: activeChannel.requiredLevel || 0 })}
            </p>
          </div>
        ) : (
          <>
            <MessageList
              messages={messages}
              currentUserId={user?.id}
              isLoading={isLoadingMessages}
              isLoadingMore={isLoadingMore}
              hasMore={hasMoreMessages}
              error={messagesError}
              onLoadMore={handleLoadMore}
              onReply={handleReply}
              onReact={handleReaction}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
            />

            {/* Typing indicator */}
            <TypingIndicator typingUsers={typingUsers} />

            {/* Message input */}
            <MessageInput
              channelId={activeChannelId || ''}
              channelName={activeChannel?.name || ''}
              replyTo={replyTo}
              disabled={!activeChannel}
              onSend={handleSendMessage}
              onCancelReply={() => setReplyTo(null)}
              onTyping={handleTyping}
            />
          </>
        )}
      </div>

      {/* Mobile users sidebar overlay */}
      {showUsersSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setShowUsersSidebar(false)}
        />
      )}

      {/* Online users sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 lg:relative lg:z-auto',
          'transform transition-transform duration-200 ease-in-out',
          'hidden lg:block',
          showUsersSidebar ? 'block translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <OnlineUsers
          users={onlineUsers}
          isLoading={isLoadingMessages}
          onClose={() => setShowUsersSidebar(false)}
          isMobile={showUsersSidebar}
        />
      </div>
    </div>
  )
}
