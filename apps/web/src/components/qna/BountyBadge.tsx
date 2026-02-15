'use client'

import { memo } from 'react'
import { Coins, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { useLanguage } from '@/i18n/LanguageContext'

interface BountyBadgeProps {
  amount: number
  expiresAt?: string
  size?: 'sm' | 'md' | 'lg'
  showExpiry?: boolean
}

function BountyBadgeComponent({
  amount,
  expiresAt,
  size = 'md',
  showExpiry = false,
}: BountyBadgeProps) {
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const isExpired = expiresAt && new Date(expiresAt) < new Date()

  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex items-center rounded-full font-semibold ${sizeClasses[size]} ${
          isExpired
            ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        }`}
      >
        <Coins className={iconSizes[size]} />
        <span>+{amount} XP</span>
      </span>

      {showExpiry && expiresAt && !isExpired && (
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="h-3 w-3" />
          <span>
            {formatDistanceToNow(new Date(expiresAt), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </span>
        </span>
      )}

      {showExpiry && isExpired && (
        <span className="text-xs text-gray-500 dark:text-gray-400">Expired</span>
      )}
    </div>
  )
}

export const BountyBadge = memo(BountyBadgeComponent)
