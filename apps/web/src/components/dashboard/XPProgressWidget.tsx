'use client'

import { Trophy, Star, TrendingUp, Zap, Target } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import type { LevelProgress } from '@/lib/api/types'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

interface XPProgressWidgetProps {
  levelProgress?: LevelProgress
  rank?: 'JUNIOR' | 'SENIOR' | 'MASTER'
}

const rankConfig = {
  JUNIOR: {
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800',
    icon: Zap,
    levelRange: '1-10',
  },
  SENIOR: {
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: Star,
    levelRange: '11-30',
  },
  MASTER: {
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-800',
    icon: Trophy,
    levelRange: '31-50',
  },
}

function getRankFromLevel(level: number): 'JUNIOR' | 'SENIOR' | 'MASTER' {
  if (level <= 10) return 'JUNIOR'
  if (level <= 30) return 'SENIOR'
  return 'MASTER'
}

export function XPProgressWidget({ levelProgress, rank }: XPProgressWidgetProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  if (!levelProgress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('dashboard.levelProgress')}
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{t('dashboard.profile.loadingLevel')}</p>
        </div>
      </div>
    )
  }

  const { currentLevel, currentXP, nextLevelXP, progress, achievements } = levelProgress
  const currentRank = rank || getRankFromLevel(currentLevel)
  const config = rankConfig[currentRank]
  const RankIcon = config.icon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header with Rank Badge */}
      <div className={`bg-gradient-to-r ${config.color} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <RankIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">{t('dashboard.profile.currentLevel')}</p>
              <h3 className="text-2xl font-bold text-white">{currentRank}</h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-4xl font-bold text-white">{currentLevel}</span>
            <p className="text-white/80 text-xs">Lv. {config.levelRange}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* XP Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{t('dashboard.profile.xpProgress')}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </span>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${config.color} h-4 rounded-full transition-all duration-500 ease-out relative`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700 dark:text-white drop-shadow">
                {progress}%
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            {t('dashboard.profile.xpRemaining', { xp: (nextLevelXP - currentXP).toLocaleString() })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 text-center`}>
            <p className={`text-2xl font-bold ${config.textColor}`}>{currentLevel}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('dashboard.profile.level')}</p>
          </div>
          <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 text-center`}>
            <p className={`text-2xl font-bold ${config.textColor}`}>{currentXP.toLocaleString()}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('dashboard.profile.xp')}</p>
          </div>
          <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 text-center`}>
            <p className={`text-2xl font-bold ${config.textColor}`}>{achievements.length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('dashboard.stats.achievements') || 'Achievements'}</p>
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {t('dashboard.profile.recentAchievements')}
              </h4>
            </div>
            <div className="space-y-2">
              {achievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                      <Star className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDistanceToNow(new Date(achievement.earnedAt), {
                        addSuffix: true,
                        locale: dateLocale,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements.length === 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('dashboard.noAchievements') || 'Complete activities to earn achievements!'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
