'use client'

import { Trophy, Star, TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { LevelProgress as LevelProgressType } from '@/lib/api/types'

interface LevelProgressProps {
  levelProgress?: LevelProgressType
}

export function LevelProgress({ levelProgress }: LevelProgressProps) {
  if (!levelProgress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          레벨 진행률
        </h3>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>레벨 정보를 불러오는 중입니다</p>
        </div>
      </div>
    )
  }

  const { currentLevel, currentXP, nextLevelXP, progress, achievements } = levelProgress

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        레벨 진행률
      </h3>

      {/* Level Display */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full shadow-lg mb-3">
          <span className="text-4xl font-bold text-white">{currentLevel}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">현재 레벨</p>
      </div>

      {/* XP Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">경험치</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
          </span>
        </div>
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="absolute top-0 left-0 bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute top-0 left-0 w-full h-3 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-700 dark:text-white drop-shadow">
              {progress}%
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          다음 레벨까지 {(nextLevelXP - currentXP).toLocaleString()} XP 남음
        </p>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              최근 업적 ({achievements.length})
            </h4>
          </div>
          <div className="space-y-2">
            {achievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
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
                      locale: ko,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
