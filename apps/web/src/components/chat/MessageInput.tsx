'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Smile,
  Paperclip,
  X,
  AtSign,
  Hash,
  AlertCircle,
} from 'lucide-react'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/lib/api/chat'

interface MessageInputProps {
  channelId: string
  channelName: string
  replyTo?: ChatMessage | null
  disabled?: boolean
  onSend: (content: string, replyToId?: string) => Promise<void>
  onCancelReply?: () => void
  onTyping?: () => void
}

// Typing indicator debounce time in ms
const TYPING_DEBOUNCE = 2000

export function MessageInput({
  channelId,
  channelName,
  replyTo,
  disabled = false,
  onSend,
  onCancelReply,
  onTyping,
}: MessageInputProps) {
  const t = useTranslations()
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-focus textarea when reply is set
  useEffect(() => {
    if (replyTo) {
      textareaRef.current?.focus()
    }
  }, [replyTo])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 200)
      textarea.style.height = `${newHeight}px`
    }
  }, [content])

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    onTyping?.()

    typingTimeoutRef.current = setTimeout(() => {
      // Typing stopped
    }, TYPING_DEBOUNCE)
  }, [onTyping])

  // Clean up typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    const trimmedContent = content.trim()
    if (!trimmedContent || isSending || disabled) return

    setIsSending(true)
    setError(null)

    try {
      await onSend(trimmedContent, replyTo?.id)
      setContent('')
      onCancelReply?.()

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch {
      setError(t('chat.sendFailed'))
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setError(null)
    handleTyping()
  }

  return (
    <div className="shrink-0 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Reply preview */}
      {replyTo && (
        <div className="mb-2 flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 dark:bg-gray-700">
          <div className="h-4 w-1 rounded-full bg-blue-500" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {t('chat.replyingTo')} {replyTo.author.name}
            </p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {replyTo.content}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-200"
            aria-label={t('common.cancel')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-2 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto shrink-0"
            aria-label={t('common.cancel')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Main input container */}
        <div
          className={cn(
            'flex flex-1 items-end rounded-lg border bg-gray-50 transition-colors dark:bg-gray-900',
            disabled
              ? 'border-gray-200 dark:border-gray-700'
              : 'border-gray-300 focus-within:border-blue-500 dark:border-gray-600 dark:focus-within:border-blue-400'
          )}
        >
          {/* Attachment button */}
          <button
            type="button"
            disabled={disabled}
            className="shrink-0 p-3 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label={t('chat.attachFile')}
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? t('chat.cannotSend')
                : t('chat.messagePlaceholder', { channel: channelName })
            }
            disabled={disabled || isSending}
            rows={1}
            className="max-h-[200px] min-h-[44px] flex-1 resize-none bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder-gray-500"
          />

          {/* Emoji button */}
          <button
            type="button"
            disabled={disabled}
            className="shrink-0 p-3 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label={t('chat.addEmoji')}
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!content.trim() || disabled || isSending}
          className={cn(
            'flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg transition-colors',
            content.trim() && !disabled && !isSending
              ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
          )}
          aria-label={t('chat.send')}
        >
          {isSending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>

      {/* Keyboard hint */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{t('chat.keyboardHint')}</span>
        <span>{content.length} / 2000</span>
      </div>
    </div>
  )
}

// Typing indicator component
interface TypingIndicatorProps {
  typingUsers: string[]
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  const t = useTranslations()

  if (typingUsers.length === 0) return null

  const getMessage = () => {
    if (typingUsers.length === 1) {
      return t('chat.typingOne', { name: typingUsers[0] })
    } else if (typingUsers.length === 2) {
      return t('chat.typingTwo', {
        name1: typingUsers[0],
        name2: typingUsers[1],
      })
    } else {
      return t('chat.typingMany', { count: typingUsers.length })
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
      {/* Animated dots */}
      <div className="flex gap-0.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
      </div>
      <span>{getMessage()}</span>
    </div>
  )
}
