'use client'

import Link from 'next/link'
import { Trophy, Medal, ArrowRight, User as UserIcon, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RankBadge } from './RankBadge'
import type { LeaderboardUser, UserRank } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'
import { useUserStore } from '@/store/user-store'

export interface LeaderboardProps {
  users: LeaderboardUser[]
  currentUserPosition?: number
  isLoading?: boolean
  maxItems?: number
  showViewAll?: boolean
  className?: string
}

function getPositionStyle(position: number): {
  bgColor: string
  textColor: string
  borderColor: string
  icon: React.ElementType | null
  iconColor: string
} {
  switch (position) {
    case 1:
      return {
        bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
        textColor: 'text-yellow-600 dark:text-yellow-400',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        icon: Crown,
        iconColor: 'text-yellow-500',
      }
    case 2:
      return {
        bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50',
        textColor: 'text-gray-600 dark:text-gray-300',
        borderColor: 'border-gray-200 dark:border-gray-700',
        icon: Medal,
        iconColor: 'text-gray-400',
      }
    case 3:
      return {
        bgColor: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
        textColor: 'text-orange-600 dark:text-orange-400',
        borderColor: 'border-orange-200 dark:border-orange-800',
        icon: Medal,
        iconColor: 'text-orange-400',
      }
    default:
      return {
        bgColor: 'bg-white dark:bg-gray-800',
        textColor: 'text-gray-600 dark:text-gray-400',
        borderColor: 'border-gray-100 dark:border-gray-700',
        icon: null,
        iconColor: '',
      }
  }
}

interface LeaderboardItemProps {
  user: LeaderboardUser
  isCurrentUser: boolean
}

function LeaderboardItem({ user, isCurrentUser }: LeaderboardItemProps) {
  const positionStyle = getPositionStyle(user.position)
  const PositionIcon = positionStyle.icon

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg border transition-all',
        positionStyle.bgColor,
        positionStyle.borderColor,
        isCurrentUser && 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
      )}
    >
      {/* Position */}
      <div className="flex-shrink-0 w-10 text-center">
        {PositionIcon ? (
          <PositionIcon className={cn('w-6 h-6 mx-auto', positionStyle.iconColor)} />
        ) : (
          <span className={cn('text-lg font-bold', positionStyle.textColor)}>
            {user.position}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        {user.profileImage || user.avatar ? (
          <img
            src={user.profileImage || user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white truncate">
            {user.name}
          </span>
          {isCurrentUser && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <RankBadge rank={user.rank} size="sm" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Lv. {user.level}
          </span>
        </div>
      </div>

      {/* XP */}
      <div className="flex-shrink-0 text-right">
        <span className="font-bold text-gray-900 dark:text-white">
          {user.experiencePoints.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">XP</span>
      </div>
    </div>
  )
}

function LeaderboardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
          <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          </div>
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  )
}

export function Leaderboard({
  users,
  currentUserPosition,
  isLoading,
  maxItems = 10,
  showViewAll = true,
  className,
}: LeaderboardProps) {
  const t = useTranslations()
  const { user: currentUser } = useUserStore()

  const displayedUsers = maxItems ? users.slice(0, maxItems) : users

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('xp.leaderboard')}
            </h3>
          </div>
          {currentUserPosition && currentUserPosition > maxItems && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('xp.yourRank')}: #{currentUserPosition}
            </span>
          )}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="p-4">
        {isLoading ? (
          <LeaderboardSkeleton count={maxItems} />
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t('xp.noLeaderboard')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedUsers.map((user) => (
              <LeaderboardItem
                key={user.id}
                user={user}
                isCurrentUser={currentUser?.id === user.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* View All Link */}
      {showViewAll && users.length > 0 && (
        <div className="p-4 pt-0">
          <Link
            href="/leaderboard"
            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {t('common.viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

// Compact version for sidebar or widget
export interface LeaderboardCompactProps {
  users: LeaderboardUser[]
  isLoading?: boolean
  maxItems?: number
  className?: string
}

export function LeaderboardCompact({
  users,
  isLoading,
  maxItems = 5,
  className,
}: LeaderboardCompactProps) {
  const t = useTranslations()
  const { user: currentUser } = useUserStore()
  const displayedUsers = users.slice(0, maxItems)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
          {t('xp.topMembers')}
        </h4>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: maxItems }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 animate-pulse">
              <div className="w-5 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-10 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {displayedUsers.map((user) => {
            const isCurrentUser = currentUser?.id === user.id
            return (
              <div
                key={user.id}
                className={cn(
                  'flex items-center gap-2 p-1.5 rounded-lg transition-colors',
                  isCurrentUser
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                )}
              >
                <span
                  className={cn(
                    'w-5 text-xs font-medium text-center',
                    user.position <= 3
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {user.position}
                </span>
                {user.profileImage || user.avatar ? (
                  <img
                    src={user.profileImage || user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                  {user.name}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {user.experiencePoints.toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <Link
        href="/leaderboard"
        className="block text-center text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
      >
        {t('common.viewAll')}
      </Link>
    </div>
  )
}
