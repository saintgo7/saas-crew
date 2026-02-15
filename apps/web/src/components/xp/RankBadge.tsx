'use client'

import { Sprout, Star, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserRank } from '@/lib/api/types'

export interface RankBadgeProps {
  rank: UserRank
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const rankConfig: Record<
  UserRank,
  {
    label: string
    labelKo: string
    icon: React.ElementType
    bgColor: string
    textColor: string
    borderColor: string
    gradientFrom: string
    gradientTo: string
    iconColor: string
  }
> = {
  JUNIOR: {
    label: 'Junior',
    labelKo: '주니어',
    icon: Sprout,
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-500',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  SENIOR: {
    label: 'Senior',
    labelKo: '시니어',
    icon: Star,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-indigo-500',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  MASTER: {
    label: 'Master',
    labelKo: '마스터',
    icon: Crown,
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    gradientFrom: 'from-yellow-400',
    gradientTo: 'to-amber-500',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
}

const sizeConfig = {
  sm: {
    badge: 'px-2 py-0.5 text-xs gap-1',
    icon: 'w-3 h-3',
    iconOnly: 'w-6 h-6',
    iconOnlySize: 'w-3 h-3',
  },
  md: {
    badge: 'px-3 py-1 text-sm gap-1.5',
    icon: 'w-4 h-4',
    iconOnly: 'w-8 h-8',
    iconOnlySize: 'w-4 h-4',
  },
  lg: {
    badge: 'px-4 py-1.5 text-base gap-2',
    icon: 'w-5 h-5',
    iconOnly: 'w-10 h-10',
    iconOnlySize: 'w-5 h-5',
  },
}

export function RankBadge({
  rank,
  size = 'md',
  showLabel = true,
  className,
}: RankBadgeProps) {
  const config = rankConfig[rank]
  const sizeStyles = sizeConfig[size]
  const Icon = config.icon

  if (!showLabel) {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          `bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo}`,
          sizeStyles.iconOnly,
          className
        )}
        title={config.label}
      >
        <Icon className={cn(sizeStyles.iconOnlySize, 'text-white')} />
      </div>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeStyles.badge,
        className
      )}
    >
      <Icon className={cn(sizeStyles.icon, config.iconColor)} />
      <span>{config.label}</span>
    </span>
  )
}

// Export rank configuration for external use
export { rankConfig }
