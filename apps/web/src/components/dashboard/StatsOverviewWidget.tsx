'use client'

import {
  BookOpen,
  FolderKanban,
  MessageSquare,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Award,
} from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

export interface DashboardStats {
  totalCoursesEnrolled: number
  totalCoursesCompleted: number
  totalProjects: number
  totalContributions: number
  daysActive: number
  postsCreated?: number
  commentsCreated?: number
}

interface StatsOverviewWidgetProps {
  stats: DashboardStats
  isLoading?: boolean
}

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: number | string
  sublabel?: string
  color: string
  bgColor: string
}

function StatCard({ icon: Icon, label, value, sublabel, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {sublabel && (
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
            {sublabel}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div className="mt-3 space-y-2">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
    </div>
  )
}

export function StatsOverviewWidget({ stats, isLoading }: StatsOverviewWidgetProps) {
  const t = useTranslations()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const statItems = [
    {
      icon: BookOpen,
      label: t('dashboard.stats.coursesEnrolled') || 'Courses Enrolled',
      value: stats.totalCoursesEnrolled,
      sublabel:
        stats.totalCoursesCompleted > 0
          ? `${stats.totalCoursesCompleted} ${t('dashboard.completed') || 'completed'}`
          : undefined,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: CheckCircle2,
      label: t('dashboard.stats.coursesCompleted') || 'Courses Completed',
      value: stats.totalCoursesCompleted,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      icon: FolderKanban,
      label: t('dashboard.stats.projects') || 'Projects',
      value: stats.totalProjects,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      icon: MessageSquare,
      label: t('dashboard.stats.contributions') || 'Contributions',
      value: stats.totalContributions,
      sublabel:
        stats.postsCreated !== undefined
          ? `${stats.postsCreated} ${t('dashboard.stats.posts') || 'posts'}`
          : undefined,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: Calendar,
      label: t('dashboard.stats.daysActive') || 'Days Active',
      value: stats.daysActive,
      sublabel: t('dashboard.stats.streak') || 'streak',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <StatCard
          key={index}
          icon={item.icon}
          label={item.label}
          value={item.value}
          sublabel={item.sublabel}
          color={item.color}
          bgColor={item.bgColor}
        />
      ))}
    </div>
  )
}

// Compact version for smaller spaces
export function StatsOverviewCompact({ stats, isLoading }: StatsOverviewWidgetProps) {
  const t = useTranslations()

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-2" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-1" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const compactStats = [
    {
      icon: CheckCircle2,
      value: stats.totalCoursesCompleted,
      label: t('dashboard.stats.coursesCompleted') || 'Courses',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      icon: FolderKanban,
      value: stats.totalProjects,
      label: t('dashboard.stats.projects') || 'Projects',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      icon: MessageSquare,
      value: stats.totalContributions,
      label: t('dashboard.stats.contributions') || 'Posts',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: Calendar,
      value: stats.daysActive,
      label: t('dashboard.stats.daysActive') || 'Days',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.stats.overview') || 'Stats Overview'}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {compactStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="text-center">
              <div
                className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}
              >
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Mini stats for inline display
export function StatsOverviewMini({ stats }: { stats: DashboardStats }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span className="font-medium text-gray-900 dark:text-white">
          {stats.totalCoursesCompleted}
        </span>
        <span className="text-gray-500 dark:text-gray-400">courses</span>
      </div>
      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
      <div className="flex items-center gap-1.5">
        <FolderKanban className="w-4 h-4 text-orange-500" />
        <span className="font-medium text-gray-900 dark:text-white">{stats.totalProjects}</span>
        <span className="text-gray-500 dark:text-gray-400">projects</span>
      </div>
      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
      <div className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-pink-500" />
        <span className="font-medium text-gray-900 dark:text-white">{stats.daysActive}</span>
        <span className="text-gray-500 dark:text-gray-400">days</span>
      </div>
    </div>
  )
}
