'use client'

import { useState, useRef } from 'react'
import {
  MoreHorizontal,
  Reply,
  Smile,
  Pin,
  Edit2,
  Trash2,
  Copy,
  User,
  Shield,
  Star,
} from 'lucide-react'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/lib/api/chat'

interface MessageItemProps {
  message: ChatMessage
  isFirstInGroup: boolean
  isLastInGroup: boolean
  currentUserId?: string
  onReply?: (message: ChatMessage) => void
  onReact?: (messageId: string, emoji: string) => void
  onEdit?: (messageId: string, content: string) => void
  onDelete?: (messageId: string) => void
}

// Common reaction emojis
const QUICK_REACTIONS = ['heart', 'thumbsup', 'fire', 'clap', 'thinking']

export function MessageItem({
  message,
  isFirstInGroup,
  isLastInGroup,
  currentUserId,
  onReply,
  onReact,
  onEdit,
  onDelete,
}: MessageItemProps) {
  const t = useTranslations()
  const [showActions, setShowActions] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isOwnMessage = currentUserId === message.authorId
  const formattedTime = formatMessageTime(message.createdAt)

  const handleReaction = (emoji: string) => {
    onReact?.(message.id, emoji)
    setShowReactions(false)
  }

  const getRoleBadge = () => {
    switch (message.author.role) {
      case 'admin':
        return (
          <span className="flex items-center gap-0.5 rounded bg-red-100 px-1 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        )
      case 'mentor':
        return (
          <span className="flex items-center gap-0.5 rounded bg-purple-100 px-1 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <Star className="h-3 w-3" />
            Mentor
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'group relative px-4 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-800/50',
        isFirstInGroup && 'mt-3 pt-2'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false)
        setShowMenu(false)
        setShowReactions(false)
      }}
    >
      {/* Reply indicator */}
      {message.replyTo && (
        <div className="mb-1 ml-12 flex items-center gap-2 text-sm">
          <div className="h-3 w-5 border-l-2 border-t-2 border-gray-300 dark:border-gray-600" />
          <span className="text-gray-500 dark:text-gray-400">
            {message.replyTo.authorName}:
          </span>
          <span className="truncate text-gray-400 dark:text-gray-500">
            {message.replyTo.content}
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar - only show on first message in group */}
        {isFirstInGroup ? (
          <div className="shrink-0">
            {message.author.profileImage ? (
              <img
                src={message.author.profileImage}
                alt={message.author.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-10 shrink-0" />
        )}

        {/* Message content */}
        <div className="min-w-0 flex-1">
          {/* Author info - only show on first message in group */}
          {isFirstInGroup && (
            <div className="mb-0.5 flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {message.author.name}
              </span>
              {getRoleBadge()}
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                Lv.{message.author.level}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formattedTime}
              </span>
              {message.isPinned && (
                <Pin className="h-3 w-3 text-amber-500" />
              )}
            </div>
          )}

          {/* Message text */}
          <div className="text-gray-800 dark:text-gray-200">
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
            {message.isEdited && (
              <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                ({t('chat.edited')})
              </span>
            )}
          </div>

          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {message.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={() => handleReaction(reaction.emoji)}
                  className={cn(
                    'flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm transition-colors',
                    reaction.hasReacted
                      ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'
                  )}
                >
                  <span>{getEmojiFromName(reaction.emoji)}</span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {reaction.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hover timestamp for grouped messages */}
        {!isFirstInGroup && showActions && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
            {formattedTime}
          </span>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className="absolute -top-3 right-4 flex items-center gap-0.5 rounded-md border border-gray-200 bg-white p-0.5 shadow-sm dark:border-gray-600 dark:bg-gray-800">
            {/* Quick reactions */}
            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                aria-label={t('chat.addReaction')}
              >
                <Smile className="h-4 w-4" />
              </button>
              {showReactions && (
                <div className="absolute right-0 top-full z-10 mt-1 flex gap-1 rounded-md border border-gray-200 bg-white p-1 shadow-md dark:border-gray-600 dark:bg-gray-800">
                  {QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="rounded p-1 text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {getEmojiFromName(emoji)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reply */}
            <button
              onClick={() => onReply?.(message)}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label={t('chat.reply')}
            >
              <Reply className="h-4 w-4" />
            </button>

            {/* More options */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                aria-label={t('chat.moreOptions')}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full z-10 mt-1 min-w-36 rounded-md border border-gray-200 bg-white py-1 shadow-md dark:border-gray-600 dark:bg-gray-800">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(message.content)
                      setShowMenu(false)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                    {t('chat.copyMessage')}
                  </button>
                  {isOwnMessage && (
                    <>
                      <button
                        onClick={() => {
                          onEdit?.(message.id, message.content)
                          setShowMenu(false)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Edit2 className="h-4 w-4" />
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(t('chat.confirmDelete'))) {
                            onDelete?.(message.id)
                          }
                          setShowMenu(false)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t('common.delete')}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading skeleton for message
export function MessageItemSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-2">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

// Helper function to format message time
function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isYesterday) {
    return `Yesterday ${date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Helper function to convert emoji name to actual emoji
function getEmojiFromName(name: string): string {
  const emojiMap: Record<string, string> = {
    heart: '\u2764\ufe0f',
    thumbsup: '\ud83d\udc4d',
    thumbsdown: '\ud83d\udc4e',
    fire: '\ud83d\udd25',
    clap: '\ud83d\udc4f',
    thinking: '\ud83e\udd14',
    laugh: '\ud83d\ude02',
    sad: '\ud83d\ude22',
    rocket: '\ud83d\ude80',
    eyes: '\ud83d\udc40',
  }
  return emojiMap[name] || name
}
