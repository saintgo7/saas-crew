'use client'

import { Hash, Lock, Volume2, FolderGit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatChannel } from '@/lib/api/chat'

interface ChannelItemProps {
  channel: ChatChannel
  isActive: boolean
  onClick: () => void
}

export function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  const getChannelIcon = () => {
    const iconClass = cn(
      'h-4 w-4 shrink-0',
      isActive
        ? 'text-white'
        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
    )

    switch (channel.type) {
      case 'level-restricted':
        return <Lock className={cn(iconClass, !isActive && 'text-amber-500 dark:text-amber-400')} />
      case 'project':
        return <FolderGit2 className={iconClass} />
      case 'direct':
        return <Volume2 className={iconClass} />
      case 'general':
      default:
        return <Hash className={iconClass} />
    }
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors',
        isActive
          ? 'bg-blue-600 text-white dark:bg-blue-500'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
      )}
    >
      {/* Channel icon */}
      {getChannelIcon()}

      {/* Channel name */}
      <span
        className={cn(
          'flex-1 truncate text-sm font-medium',
          isActive
            ? 'text-white'
            : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </span>

      {/* Level badge for restricted channels */}
      {channel.type === 'level-restricted' && channel.requiredLevel && !isActive && (
        <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          Lv.{channel.requiredLevel}
        </span>
      )}

      {/* Unread count badge */}
      {channel.unreadCount > 0 && (
        <span
          className={cn(
            'flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold',
            isActive
              ? 'bg-white text-blue-600'
              : 'bg-red-500 text-white'
          )}
        >
          {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
        </span>
      )}
    </button>
  )
}

// Loading skeleton for channel item
export function ChannelItemSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-4 flex-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}
