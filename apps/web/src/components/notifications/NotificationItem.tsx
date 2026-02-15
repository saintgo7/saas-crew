'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  HelpCircle,
  MessageCircle,
  CheckCircle,
  UserPlus,
  AtSign,
  ThumbsUp,
  TrendingUp,
  Award,
  Zap,
  Users,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Notification, NotificationType } from '@/lib/api/types'
import { useMarkAsRead } from '@/lib/hooks/use-notifications'
import { useLanguage } from '@/i18n'

interface NotificationIconConfig {
  icon: React.ElementType
  className: string
}

const notificationIcons: Record<NotificationType, NotificationIconConfig> = {
  NEW_QUESTION: { icon: HelpCircle, className: 'text-blue-500' },
  NEW_ANSWER: { icon: MessageCircle, className: 'text-green-500' },
  ANSWER_ACCEPTED: { icon: CheckCircle, className: 'text-green-500' },
  NEW_FOLLOWER: { icon: UserPlus, className: 'text-purple-500' },
  MENTION: { icon: AtSign, className: 'text-blue-500' },
  VOTE_RECEIVED: { icon: ThumbsUp, className: 'text-orange-500' },
  LEVEL_UP: { icon: TrendingUp, className: 'text-yellow-500' },
  RANK_UP: { icon: Award, className: 'text-amber-500' },
  XP_GAINED: { icon: Zap, className: 'text-yellow-500' },
  MENTOR_ASSIGNED: { icon: Users, className: 'text-purple-500' },
  MENTEE_ASSIGNED: { icon: Users, className: 'text-purple-500' },
  MENTOR_MESSAGE: { icon: MessageSquare, className: 'text-blue-500' },
}

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
  showBorder?: boolean
}

export function NotificationItem({
  notification,
  onClick,
  showBorder = true,
}: NotificationItemProps) {
  const router = useRouter()
  const { locale } = useLanguage()
  const { mutate: markAsRead } = useMarkAsRead()

  const { icon: Icon, className: iconClassName } =
    notificationIcons[notification.type] || notificationIcons.NEW_QUESTION

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: locale === 'ko' ? ko : undefined,
  })

  const handleClick = () => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsRead(notification.id)
    }

    // Navigate to the linked content if available
    if (notification.link) {
      router.push(notification.link)
    }

    // Call optional onClick handler
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
        showBorder && 'border-b border-gray-100 last:border-b-0 dark:border-gray-700',
        !notification.isRead && 'bg-blue-50/50 dark:bg-blue-900/20'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700',
          iconClassName
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm',
              notification.isRead
                ? 'text-gray-700 dark:text-gray-300'
                : 'font-medium text-gray-900 dark:text-white'
            )}
          >
            {notification.title}
          </p>

          {/* Unread indicator */}
          {!notification.isRead && (
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
          )}
        </div>

        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
          {notification.content}
        </p>

        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {timeAgo}
        </p>
      </div>
    </button>
  )
}
