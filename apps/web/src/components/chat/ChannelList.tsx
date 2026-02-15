'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import { ChannelItem, ChannelItemSkeleton } from './ChannelItem'
import type { ChatChannel } from '@/lib/api/chat'

interface ChannelListProps {
  channels: ChatChannel[]
  activeChannelId: string | null
  onSelectChannel: (channelId: string) => void
  isLoading?: boolean
  error?: string | null
  onClose?: () => void
  isMobile?: boolean
}

interface ChannelGroup {
  key: string
  label: string
  channels: ChatChannel[]
  defaultExpanded: boolean
}

export function ChannelList({
  channels,
  activeChannelId,
  onSelectChannel,
  isLoading = false,
  error = null,
  onClose,
  isMobile = false,
}: ChannelListProps) {
  const t = useTranslations()

  // Group channels by type
  const groupedChannels: ChannelGroup[] = [
    {
      key: 'general',
      label: t('chat.channelGroups.general'),
      channels: channels.filter((ch) => ch.type === 'general'),
      defaultExpanded: true,
    },
    {
      key: 'level-restricted',
      label: t('chat.channelGroups.levelRestricted'),
      channels: channels.filter((ch) => ch.type === 'level-restricted'),
      defaultExpanded: true,
    },
    {
      key: 'project',
      label: t('chat.channelGroups.project'),
      channels: channels.filter((ch) => ch.type === 'project'),
      defaultExpanded: false,
    },
  ].filter((group) => group.channels.length > 0)

  // Track expanded state for each group
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groupedChannels.map((g) => [g.key, g.defaultExpanded]))
  )

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }))
  }

  const handleSelectChannel = (channelId: string) => {
    onSelectChannel(channelId)
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <aside
      className={cn(
        'flex h-full w-60 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900',
        isMobile && 'w-full'
      )}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('chat.channels')}
        </h2>
        <div className="flex items-center gap-1">
          {/* Create channel button - hidden for now */}
          {/* <button
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label={t('chat.createChannel')}
          >
            <Plus className="h-4 w-4" />
          </button> */}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label={t('common.cancel')}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Channel groups */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2].map((groupIdx) => (
              <div key={groupIdx}>
                <div className="mb-2 flex items-center gap-2 px-2">
                  <div className="h-3 w-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="space-y-1">
                  {[1, 2, 3].map((idx) => (
                    <ChannelItemSkeleton key={idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            <button
              className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
              onClick={() => window.location.reload()}
            >
              {t('common.tryAgain')}
            </button>
          </div>
        ) : channels.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('chat.noChannels')}
            </p>
          </div>
        ) : (
          // Channel groups
          <div className="space-y-3">
            {groupedChannels.map((group) => (
              <div key={group.key}>
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="flex w-full items-center gap-1 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {expandedGroups[group.key] ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  <span>{group.label}</span>
                  <span className="ml-auto text-gray-400 dark:text-gray-500">
                    {group.channels.length}
                  </span>
                </button>

                {/* Group channels */}
                {expandedGroups[group.key] && (
                  <div className="mt-1 space-y-0.5">
                    {group.channels.map((channel) => (
                      <ChannelItem
                        key={channel.id}
                        channel={channel}
                        isActive={channel.id === activeChannelId}
                        onClick={() => handleSelectChannel(channel.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-200 p-3 dark:border-gray-700">
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          {t('chat.channelCount', { count: channels.length })}
        </p>
      </div>
    </aside>
  )
}
