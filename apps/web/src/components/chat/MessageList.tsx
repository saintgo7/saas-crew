'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { ArrowDown, Loader2 } from 'lucide-react'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import { MessageItem, MessageItemSkeleton } from './MessageItem'
import type { ChatMessage } from '@/lib/api/chat'

interface MessageListProps {
  messages: ChatMessage[]
  currentUserId?: string
  isLoading?: boolean
  isLoadingMore?: boolean
  hasMore?: boolean
  error?: string | null
  onLoadMore?: () => void
  onReply?: (message: ChatMessage) => void
  onReact?: (messageId: string, emoji: string) => void
  onEdit?: (messageId: string, content: string) => void
  onDelete?: (messageId: string) => void
}

export function MessageList({
  messages,
  currentUserId,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  error = null,
  onLoadMore,
  onReply,
  onReact,
  onEdit,
  onDelete,
}: MessageListProps) {
  const t = useTranslations()
  const listRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const prevMessagesLength = useRef(messages.length)

  // Check if user is near bottom of the list
  const checkScrollPosition = useCallback(() => {
    if (!listRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const nearBottom = distanceFromBottom < 100

    setIsNearBottom(nearBottom)
    setShowScrollButton(distanceFromBottom > 500)
  }, [])

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    })
  }, [])

  // Auto-scroll when new messages arrive (only if user is near bottom)
  useEffect(() => {
    if (messages.length > prevMessagesLength.current && isNearBottom) {
      scrollToBottom(false)
    }
    prevMessagesLength.current = messages.length
  }, [messages.length, isNearBottom, scrollToBottom])

  // Initial scroll to bottom
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom(false)
    }
  }, [isLoading, scrollToBottom])

  // Infinite scroll - load more when scrolling to top
  const handleScroll = useCallback(() => {
    checkScrollPosition()

    if (!listRef.current || !hasMore || isLoadingMore) return

    const { scrollTop } = listRef.current
    if (scrollTop < 100) {
      onLoadMore?.()
    }
  }, [checkScrollPosition, hasMore, isLoadingMore, onLoadMore])

  // Group messages by same author within 5 minutes
  const groupMessages = (msgs: ChatMessage[]) => {
    return msgs.map((message, index) => {
      const prevMessage = msgs[index - 1]
      const nextMessage = msgs[index + 1]

      const isFirstInGroup =
        !prevMessage ||
        prevMessage.authorId !== message.authorId ||
        new Date(message.createdAt).getTime() -
          new Date(prevMessage.createdAt).getTime() >
          5 * 60 * 1000

      const isLastInGroup =
        !nextMessage ||
        nextMessage.authorId !== message.authorId ||
        new Date(nextMessage.createdAt).getTime() -
          new Date(message.createdAt).getTime() >
          5 * 60 * 1000

      return { message, isFirstInGroup, isLastInGroup }
    })
  }

  // Group messages by date
  const groupMessagesByDate = (msgs: ChatMessage[]) => {
    const groups: { date: string; messages: ChatMessage[] }[] = []
    let currentDate = ''

    msgs.forEach((message) => {
      const messageDate = new Date(message.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      if (messageDate !== currentDate) {
        currentDate = messageDate
        groups.push({ date: messageDate, messages: [message] })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
    })

    return groups
  }

  const dateGroups = groupMessagesByDate(messages)

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          {t('common.tryAgain')}
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Messages container */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {t('chat.loadingMore')}
            </span>
          </div>
        )}

        {/* Has more indicator */}
        {hasMore && !isLoadingMore && (
          <button
            onClick={onLoadMore}
            className="flex w-full items-center justify-center py-3 text-sm text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            {t('chat.loadOlderMessages')}
          </button>
        )}

        {/* Initial loading state */}
        {isLoading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <MessageItemSkeleton key={i} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          // Empty state
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <span className="text-4xl">\ud83d\udcac</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('chat.noMessages')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('chat.startConversation')}
            </p>
          </div>
        ) : (
          // Messages grouped by date
          <div className="pb-4">
            {dateGroups.map((group) => (
              <div key={group.date}>
                {/* Date divider */}
                <div className="sticky top-0 z-10 flex items-center justify-center py-4">
                  <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    {group.date}
                  </div>
                </div>

                {/* Messages */}
                {groupMessages(group.messages).map(
                  ({ message, isFirstInGroup, isLastInGroup }) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      isFirstInGroup={isFirstInGroup}
                      isLastInGroup={isLastInGroup}
                      currentUserId={currentUserId}
                      onReply={onReply}
                      onReact={onReact}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom(true)}
          className={cn(
            'absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-lg transition-all dark:border-gray-700 dark:bg-gray-800',
            'hover:bg-gray-50 dark:hover:bg-gray-700'
          )}
        >
          <ArrowDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('chat.scrollToBottom')}
          </span>
        </button>
      )}
    </div>
  )
}
