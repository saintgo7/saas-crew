'use client'

import { User, Shield, Star, X } from 'lucide-react'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import type { OnlineUser } from '@/lib/api/chat'

interface OnlineUsersProps {
  users: OnlineUser[]
  isLoading?: boolean
  error?: string | null
  onClose?: () => void
  isMobile?: boolean
}

interface GroupedUsers {
  admins: OnlineUser[]
  mentors: OnlineUser[]
  members: OnlineUser[]
}

export function OnlineUsers({
  users,
  isLoading = false,
  error = null,
  onClose,
  isMobile = false,
}: OnlineUsersProps) {
  const t = useTranslations()

  // Group users by role
  const groupedUsers: GroupedUsers = {
    admins: users.filter((u) => u.role === 'admin'),
    mentors: users.filter((u) => u.role === 'mentor'),
    members: users.filter((u) => u.role === 'student'),
  }

  const onlineCount = users.filter((u) => u.status === 'online').length

  return (
    <aside
      className={cn(
        'flex h-full w-60 flex-col border-l border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900',
        isMobile && 'w-full'
      )}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('chat.members')}
          </h2>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {onlineCount} {t('chat.online')}
          </span>
        </div>
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

      {/* User list */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((groupIdx) => (
              <div key={groupIdx}>
                <div className="mb-2 h-3 w-16 animate-pulse rounded bg-gray-200 px-2 dark:bg-gray-700" />
                <div className="space-y-1">
                  {[1, 2].map((idx) => (
                    <UserItemSkeleton key={idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : users.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('chat.noMembers')}
            </p>
          </div>
        ) : (
          // User groups
          <div className="space-y-4">
            {/* Admins */}
            {groupedUsers.admins.length > 0 && (
              <UserGroup
                title={t('chat.userGroups.admins')}
                users={groupedUsers.admins}
                icon={<Shield className="h-3 w-3 text-red-500" />}
              />
            )}

            {/* Mentors */}
            {groupedUsers.mentors.length > 0 && (
              <UserGroup
                title={t('chat.userGroups.mentors')}
                users={groupedUsers.mentors}
                icon={<Star className="h-3 w-3 text-purple-500" />}
              />
            )}

            {/* Members */}
            {groupedUsers.members.length > 0 && (
              <UserGroup
                title={t('chat.userGroups.members')}
                users={groupedUsers.members}
              />
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

// User group component
interface UserGroupProps {
  title: string
  users: OnlineUser[]
  icon?: React.ReactNode
}

function UserGroup({ title, users, icon }: UserGroupProps) {
  return (
    <div>
      {/* Group header */}
      <div className="flex items-center gap-1 px-2 py-1">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          - {users.length}
        </span>
      </div>

      {/* Users */}
      <div className="space-y-0.5">
        {users.map((user) => (
          <UserItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

// Single user item
interface UserItemProps {
  user: OnlineUser
}

function UserItem({ user }: UserItemProps) {
  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  }

  return (
    <div className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
      {/* Avatar with status */}
      <div className="relative shrink-0">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
        {/* Status indicator */}
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-gray-50 dark:border-gray-900',
            statusColors[user.status]
          )}
        />
      </div>

      {/* User info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {user.name}
          </span>
          <span className="shrink-0 rounded bg-gray-100 px-1 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            Lv.{user.level}
          </span>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton for user item
function UserItemSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 space-y-1">
        <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}
