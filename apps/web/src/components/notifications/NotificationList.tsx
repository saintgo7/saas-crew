'use client'

import { useState } from 'react'
import { Bell, CheckCheck, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { NotificationItem } from './NotificationItem'
import {
  useNotifications,
  useMarkAllAsRead,
} from '@/lib/hooks/use-notifications'
import { useTranslations } from '@/i18n/LanguageContext'
import type { NotificationCategory } from '@/lib/api/types'

interface FilterTab {
  key: NotificationCategory
  labelKey: string
  defaultLabel: string
}

const filterTabs: FilterTab[] = [
  { key: 'all', labelKey: 'notifications.filter.all', defaultLabel: 'All' },
  { key: 'qa', labelKey: 'notifications.filter.qa', defaultLabel: 'Q&A' },
  { key: 'social', labelKey: 'notifications.filter.social', defaultLabel: 'Social' },
  { key: 'system', labelKey: 'notifications.filter.system', defaultLabel: 'System' },
]

interface NotificationListProps {
  className?: string
}

export function NotificationList({ className }: NotificationListProps) {
  const t = useTranslations()
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data, isLoading, isFetching } = useNotifications({
    category: activeFilter,
    page,
    pageSize,
  })
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead()

  const notifications = data?.notifications ?? []
  const total = data?.total ?? 0
  const unreadCount = data?.unreadCount ?? 0
  const totalPages = Math.ceil(total / pageSize)

  const handleFilterChange = (filter: NotificationCategory) => {
    setActiveFilter(filter)
    setPage(1)
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with Mark All Read */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('notifications.title') || 'Notifications'}
          </h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {unreadCount} {t('notifications.unread') || 'unread'}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {isMarkingAll ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="mr-1 h-4 w-4" />
            )}
            {t('notifications.markAllRead') || 'Mark all as read'}
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              activeFilter === tab.key
                ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            )}
          >
            {t(tab.labelKey) || tab.defaultLabel}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
              {t('notifications.emptyTitle') || 'No notifications'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {activeFilter === 'all'
                ? t('notifications.emptyDescription') ||
                  "You're all caught up! Check back later for new notifications."
                : t('notifications.emptyFilterDescription') ||
                  'No notifications in this category.'}
            </p>
          </div>
        ) : (
          <>
            <div className={cn(isFetching && 'opacity-50')}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  showBorder
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('notifications.pagination.showing') || 'Showing'}{' '}
                  <span className="font-medium">{(page - 1) * pageSize + 1}</span>
                  {' - '}
                  <span className="font-medium">
                    {Math.min(page * pageSize, total)}
                  </span>{' '}
                  {t('notifications.pagination.of') || 'of'}{' '}
                  <span className="font-medium">{total}</span>
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={page === 1 || isFetching}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t('common.previous') || 'Previous'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={page === totalPages || isFetching}
                  >
                    {t('common.next') || 'Next'}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
