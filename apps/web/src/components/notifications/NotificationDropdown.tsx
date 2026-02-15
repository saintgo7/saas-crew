'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NotificationItem } from './NotificationItem'
import {
  useNotifications,
  useUnreadCount,
  useMarkAllAsRead,
} from '@/lib/hooks/use-notifications'
import { useTranslations } from '@/i18n/LanguageContext'
import { useUserStore } from '@/store/user-store'

export function NotificationDropdown() {
  const t = useTranslations()
  const { user } = useUserStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch notifications and unread count
  const { data: unreadData } = useUnreadCount()
  const { data: notificationsData, isLoading } = useNotifications({
    pageSize: 5,
  })
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead()

  const unreadCount = unreadData?.count ?? 0
  const notifications = notificationsData?.notifications ?? []

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  // Do not render if user is not logged in
  if (!user) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
          'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          'dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
          isOpen && 'bg-gray-100 dark:bg-gray-800'
        )}
        aria-label={t('notifications.title') || 'Notifications'}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="h-5 w-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('notifications.title') || 'Notifications'}
            </h3>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isMarkingAll ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCheck className="h-3 w-3" />
                )}
                {t('notifications.markAllRead') || 'Mark all as read'}
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('notifications.empty') || 'No notifications yet'}
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => setIsOpen(false)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('notifications.viewAll') || 'View all notifications'}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
