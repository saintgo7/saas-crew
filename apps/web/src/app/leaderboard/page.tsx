'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Trophy,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Crown,
  Medal,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RankBadge } from '@/components/xp/RankBadge'
import { useLeaderboard } from '@/hooks/useXp'
import { useTranslations } from '@/i18n/LanguageContext'
import { useUserStore } from '@/store/user-store'
import type { LeaderboardUser } from '@/lib/api/types'
import type { LeaderboardPeriod } from '@/lib/api/xp'

const DEMO_LEADERBOARD: LeaderboardUser[] = [
  { id: 'demo-1', name: 'Go Seongmin', rank: 'MASTER', level: 22, experiencePoints: 12450, position: 1 },
  { id: 'demo-2', name: 'Kim Jihye', rank: 'SENIOR', level: 18, experiencePoints: 8920, position: 2 },
  { id: 'demo-3', name: 'Park Junhyuk', rank: 'SENIOR', level: 15, experiencePoints: 6780, position: 3 },
  { id: 'demo-4', name: 'Lee Dongwoo', rank: 'SENIOR', level: 12, experiencePoints: 5340, position: 4 },
  { id: 'demo-5', name: 'Choi Yerin', rank: 'JUNIOR', level: 8, experiencePoints: 3210, position: 5 },
  { id: 'demo-6', name: 'Han Seungho', rank: 'JUNIOR', level: 7, experiencePoints: 2890, position: 6 },
  { id: 'demo-7', name: 'Shin Minji', rank: 'JUNIOR', level: 6, experiencePoints: 2450, position: 7 },
  { id: 'demo-8', name: 'Jang Hyunwoo', rank: 'JUNIOR', level: 5, experiencePoints: 1980, position: 8 },
  { id: 'demo-9', name: 'Kim Soyeon', rank: 'JUNIOR', level: 4, experiencePoints: 1520, position: 9 },
  { id: 'demo-10', name: 'Yoon Taewon', rank: 'JUNIOR', level: 3, experiencePoints: 890, position: 10 },
  { id: 'demo-11', name: 'Baek Jiwon', rank: 'SENIOR', level: 14, experiencePoints: 6210, position: 11 },
  { id: 'demo-12', name: 'Seo Yeji', rank: 'SENIOR', level: 13, experiencePoints: 5870, position: 12 },
  { id: 'demo-13', name: 'Kwon Doyun', rank: 'SENIOR', level: 11, experiencePoints: 4950, position: 13 },
  { id: 'demo-14', name: 'Im Chaeyoung', rank: 'JUNIOR', level: 9, experiencePoints: 3780, position: 14 },
  { id: 'demo-15', name: 'Oh Junseok', rank: 'JUNIOR', level: 8, experiencePoints: 3450, position: 15 },
  { id: 'demo-16', name: 'Ryu Hana', rank: 'JUNIOR', level: 7, experiencePoints: 3120, position: 16 },
  { id: 'demo-17', name: 'Moon Sihyun', rank: 'JUNIOR', level: 6, experiencePoints: 2670, position: 17 },
  { id: 'demo-18', name: 'Song Eunji', rank: 'JUNIOR', level: 5, experiencePoints: 2210, position: 18 },
  { id: 'demo-19', name: 'Hwang Minho', rank: 'JUNIOR', level: 5, experiencePoints: 2050, position: 19 },
  { id: 'demo-20', name: 'Ahn Soojin', rank: 'JUNIOR', level: 4, experiencePoints: 1830, position: 20 },
  { id: 'demo-21', name: 'Noh Jaehyun', rank: 'JUNIOR', level: 4, experiencePoints: 1690, position: 21 },
  { id: 'demo-22', name: 'Yang Nayeon', rank: 'JUNIOR', level: 3, experiencePoints: 1450, position: 22 },
  { id: 'demo-23', name: 'Kang Woojin', rank: 'JUNIOR', level: 3, experiencePoints: 1280, position: 23 },
  { id: 'demo-24', name: 'Bae Sumin', rank: 'JUNIOR', level: 3, experiencePoints: 1120, position: 24 },
  { id: 'demo-25', name: 'Cho Hyunjin', rank: 'JUNIOR', level: 2, experiencePoints: 980, position: 25 },
  { id: 'demo-26', name: 'Woo Seonghyun', rank: 'JUNIOR', level: 2, experiencePoints: 870, position: 26 },
  { id: 'demo-27', name: 'Yeo Dayeon', rank: 'JUNIOR', level: 2, experiencePoints: 750, position: 27 },
  { id: 'demo-28', name: 'Jung Taeyoung', rank: 'JUNIOR', level: 2, experiencePoints: 640, position: 28 },
  { id: 'demo-29', name: 'Ha Jisoo', rank: 'JUNIOR', level: 1, experiencePoints: 520, position: 29 },
  { id: 'demo-30', name: 'Nam Seonwoo', rank: 'JUNIOR', level: 1, experiencePoints: 430, position: 30 },
  { id: 'demo-31', name: 'Byun Yujin', rank: 'JUNIOR', level: 1, experiencePoints: 350, position: 31 },
  { id: 'demo-32', name: 'Tak Jihoon', rank: 'JUNIOR', level: 1, experiencePoints: 280, position: 32 },
  { id: 'demo-33', name: 'Gil Eunbi', rank: 'JUNIOR', level: 1, experiencePoints: 210, position: 33 },
  { id: 'demo-34', name: 'Pyo Chanwoo', rank: 'JUNIOR', level: 1, experiencePoints: 150, position: 34 },
  { id: 'demo-35', name: 'Min Hayoung', rank: 'JUNIOR', level: 1, experiencePoints: 90, position: 35 },
]

const periodOptions: { value: LeaderboardPeriod; label: string; labelKo: string }[] = [
  { value: 'all_time', label: 'All Time', labelKo: '전체' },
  { value: 'this_month', label: 'This Month', labelKo: '이번 달' },
  { value: 'this_week', label: 'This Week', labelKo: '이번 주' },
]

function getPositionStyle(position: number) {
  switch (position) {
    case 1:
      return {
        bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        icon: Crown,
        iconColor: 'text-yellow-500',
        textColor: 'text-yellow-700 dark:text-yellow-300',
      }
    case 2:
      return {
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50',
        border: 'border-gray-200 dark:border-gray-700',
        icon: Medal,
        iconColor: 'text-gray-400',
        textColor: 'text-gray-600 dark:text-gray-300',
      }
    case 3:
      return {
        bg: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        icon: Medal,
        iconColor: 'text-orange-400',
        textColor: 'text-orange-600 dark:text-orange-300',
      }
    default:
      return {
        bg: 'bg-white dark:bg-gray-800',
        border: 'border-gray-100 dark:border-gray-700',
        icon: null,
        iconColor: '',
        textColor: 'text-gray-600 dark:text-gray-400',
      }
  }
}

interface LeaderboardRowProps {
  user: LeaderboardUser
  isCurrentUser: boolean
}

function LeaderboardRow({ user, isCurrentUser }: LeaderboardRowProps) {
  const style = getPositionStyle(user.position)
  const PositionIcon = style.icon

  return (
    <tr
      className={cn(
        'transition-colors',
        style.bg,
        isCurrentUser && 'ring-2 ring-blue-500 ring-inset'
      )}
    >
      {/* Position */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center">
          {PositionIcon ? (
            <PositionIcon className={cn('w-6 h-6', style.iconColor)} />
          ) : (
            <span className={cn('text-lg font-bold', style.textColor)}>
              {user.position}
            </span>
          )}
        </div>
      </td>

      {/* User */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          {user.profileImage || user.avatar ? (
            <img
              src={user.profileImage || user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {user.name}
              </span>
              {isCurrentUser && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Lv. {user.level}
            </div>
          </div>
        </div>
      </td>

      {/* Rank */}
      <td className="px-6 py-4 whitespace-nowrap">
        <RankBadge rank={user.rank} size="md" />
      </td>

      {/* Level */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {user.level}
        </span>
      </td>

      {/* XP */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {user.experiencePoints.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">XP</span>
      </td>
    </tr>
  )
}

function LeaderboardSkeleton() {
  return (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-4">
            <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </td>
          <td className="px-6 py-4">
            <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
          </td>
          <td className="px-6 py-4">
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
          </td>
        </tr>
      ))}
    </tbody>
  )
}

const DEMO_PAGE_SIZE = 10

export default function LeaderboardPage() {
  const t = useTranslations()
  const { user: currentUser } = useUserStore()
  const [period, setPeriodState] = useState<LeaderboardPeriod>('all_time')
  const [demoPage, setDemoPage] = useState(1)

  const { data, isLoading, error, setPeriod, setPage } = useLeaderboard({
    limit: 50,
    period,
  })

  const handlePeriodChange = (newPeriod: LeaderboardPeriod) => {
    setPeriodState(newPeriod)
    setPeriod(newPeriod)
    setDemoPage(1)
  }

  const isDemo = !!error || (!isLoading && !data)
  const demoTotalPages = Math.ceil(DEMO_LEADERBOARD.length / DEMO_PAGE_SIZE)
  const paginatedDemoUsers = isDemo
    ? DEMO_LEADERBOARD.slice(
        (demoPage - 1) * DEMO_PAGE_SIZE,
        demoPage * DEMO_PAGE_SIZE
      )
    : []
  const users = isDemo ? paginatedDemoUsers : data?.users ?? []
  const currentPage = isDemo ? demoPage : 1
  const totalPages = isDemo ? demoTotalPages : data ? Math.ceil(data.total / 50) : 1

  const handlePageChange = (page: number) => {
    if (isDemo) {
      setDemoPage(page)
    } else {
      setPage(page)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 dark:from-yellow-600 dark:via-orange-700 dark:to-red-700">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard"
              className="text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <Trophy className="w-10 h-10 text-white" />
              <h1 className="text-3xl font-bold text-white">
                {t('xp.leaderboard')}
              </h1>
            </div>
          </div>
          <p className="text-white/80 max-w-2xl">
            {t('xp.leaderboardDescription')}
          </p>

          {/* Current User Position */}
          {data?.currentUserPosition && (
            <div className="mt-6 inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <TrendingUp className="w-5 h-5 text-white" />
              <span className="text-white">
                {t('xp.yourRank')}: <strong>#{data.currentUserPosition}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('xp.period')}:
              </span>
            </div>
            <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePeriodChange(option.value)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    period === option.value
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isDemo && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('xp.demoBanner')}
            </p>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('xp.rank')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('xp.member')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('xp.tier')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('xp.level')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    XP
                  </th>
                </tr>
              </thead>

              {isLoading ? (
                <LeaderboardSkeleton />
              ) : users.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {t('xp.noLeaderboard')}
                      </p>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <LeaderboardRow
                      key={user.id}
                      user={user}
                      isCurrentUser={currentUser?.id === user.id}
                    />
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                {t('common.previous')}
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('common.page')} {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
