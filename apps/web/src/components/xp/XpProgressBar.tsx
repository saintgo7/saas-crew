'use client'

import { TrendingUp, Target, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RankBadge, rankConfig } from './RankBadge'
import type { UserRank } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'

export interface XpProgressBarProps {
  currentXp: number
  currentLevelXp: number
  nextLevelXp: number
  level: number
  rank: UserRank
  progress: number
  showStats?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeConfig = {
  sm: {
    barHeight: 'h-2',
    text: 'text-xs',
    levelBadge: 'w-8 h-8 text-sm',
    padding: 'p-3',
  },
  md: {
    barHeight: 'h-3',
    text: 'text-sm',
    levelBadge: 'w-12 h-12 text-lg',
    padding: 'p-4',
  },
  lg: {
    barHeight: 'h-4',
    text: 'text-base',
    levelBadge: 'w-16 h-16 text-xl',
    padding: 'p-6',
  },
}

export function XpProgressBar({
  currentXp,
  currentLevelXp,
  nextLevelXp,
  level,
  rank,
  progress,
  showStats = true,
  size = 'md',
  className,
}: XpProgressBarProps) {
  const t = useTranslations()
  const config = rankConfig[rank]
  const sizeStyles = sizeConfig[size]
  const xpToNextLevel = nextLevelXp - currentLevelXp
  const xpEarned = currentXp - currentLevelXp

  return (
    <div className={cn('rounded-lg', className)}>
      {/* Header with Level and Rank */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center justify-center rounded-full font-bold text-white shadow-lg',
              `bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo}`,
              sizeStyles.levelBadge
            )}
          >
            {level}
          </div>
          <div>
            <p className={cn('font-medium text-gray-900 dark:text-white', sizeStyles.text)}>
              {t('xp.level')} {level}
            </p>
            <RankBadge rank={rank} size={size === 'lg' ? 'md' : 'sm'} />
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Zap className="w-4 h-4" />
            <span className={cn('font-bold', sizeStyles.text, config.textColor)}>
              {currentXp.toLocaleString()} XP
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Target className="w-3 h-3" />
            <span className="text-xs">{t('xp.progress')}</span>
          </div>
          <span className={cn('font-medium', sizeStyles.text, 'text-gray-900 dark:text-white')}>
            {xpEarned.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
          </span>
        </div>

        <div className="relative">
          <div
            className={cn(
              'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
              sizeStyles.barHeight
            )}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500 ease-out relative',
                `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}`
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse" />
            </div>
          </div>
          {size !== 'sm' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700 dark:text-white drop-shadow">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          {t('xp.toNextLevel', { xp: (xpToNextLevel - xpEarned).toLocaleString() })}
        </p>
      </div>

      {/* Quick Stats */}
      {showStats && (
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className={cn('text-center rounded-lg', sizeStyles.padding, config.bgColor)}>
            <p className={cn('font-bold', sizeStyles.text, config.textColor)}>{level}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('xp.level')}</p>
          </div>
          <div className={cn('text-center rounded-lg', sizeStyles.padding, config.bgColor)}>
            <p className={cn('font-bold', sizeStyles.text, config.textColor)}>
              {currentXp.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">XP</p>
          </div>
          <div className={cn('text-center rounded-lg', sizeStyles.padding, config.bgColor)}>
            <p className={cn('font-bold', sizeStyles.text, config.textColor)}>
              {Math.round(progress)}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('xp.progress')}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for inline use
export interface XpProgressBarCompactProps {
  currentXp: number
  nextLevelXp: number
  progress: number
  rank: UserRank
  className?: string
}

export function XpProgressBarCompact({
  currentXp,
  nextLevelXp,
  progress,
  rank,
  className,
}: XpProgressBarCompactProps) {
  const config = rankConfig[rank]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}`
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()}
      </span>
    </div>
  )
}
