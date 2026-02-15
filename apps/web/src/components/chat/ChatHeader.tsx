'use client'

import { Hash, Lock, Users, Settings, Bell, BellOff, Pin, Search, Menu } from 'lucide-react'
import { useTranslations } from '@/i18n'
import type { ChatChannel } from '@/lib/api/chat'

interface ChatHeaderProps {
  channel: ChatChannel | null
  onToggleSidebar?: () => void
  onToggleUsersSidebar?: () => void
  showMobileMenu?: boolean
}

export function ChatHeader({
  channel,
  onToggleSidebar,
  onToggleUsersSidebar,
  showMobileMenu = false,
}: ChatHeaderProps) {
  const t = useTranslations()

  if (!channel) {
    return (
      <header className="flex h-14 items-center border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </header>
    )
  }

  const getChannelIcon = () => {
    if (channel.type === 'level-restricted') {
      return <Lock className="h-5 w-5 text-amber-500" />
    }
    return <Hash className="h-5 w-5 text-gray-400 dark:text-gray-500" />
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        {showMobileMenu && (
          <button
            onClick={onToggleSidebar}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 lg:hidden"
            aria-label={t('chat.toggleChannels')}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Channel icon and name */}
        <div className="flex items-center gap-2">
          {getChannelIcon()}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {channel.name}
          </h1>
        </div>

        {/* Level restriction badge */}
        {channel.type === 'level-restricted' && channel.requiredLevel && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Lv.{channel.requiredLevel}+
          </span>
        )}

        {/* Divider */}
        {channel.description && (
          <>
            <div className="hidden h-4 w-px bg-gray-300 dark:bg-gray-600 sm:block" />
            <p className="hidden max-w-xs truncate text-sm text-gray-500 dark:text-gray-400 sm:block">
              {channel.description}
            </p>
          </>
        )}
      </div>

      {/* Right section - actions */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button
          className="hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 sm:block"
          aria-label={t('chat.searchMessages')}
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Pinned messages */}
        <button
          className="hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 sm:block"
          aria-label={t('chat.pinnedMessages')}
        >
          <Pin className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button
          className="hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 sm:block"
          aria-label={t('chat.notifications')}
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Member count / toggle users sidebar */}
        <button
          onClick={onToggleUsersSidebar}
          className="flex items-center gap-1 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          aria-label={t('chat.showMembers')}
        >
          <Users className="h-5 w-5" />
          <span className="hidden text-sm font-medium sm:inline">
            {channel.memberCount}
          </span>
        </button>
      </div>
    </header>
  )
}
