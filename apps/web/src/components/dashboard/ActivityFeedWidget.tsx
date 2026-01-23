'use client'

import Link from 'next/link'
import {
  BookOpen,
  MessageSquare,
  CheckCircle2,
  FileText,
  Award,
  Clock,
  ArrowRight,
  Activity,
  FolderKanban,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS, type Locale } from 'date-fns/locale'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

export type ActivityType =
  | 'course_progress'
  | 'course_completed'
  | 'post_created'
  | 'comment_created'
  | 'project_joined'
  | 'achievement_earned'
  | 'level_up'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description?: string
  link?: string
  createdAt: string
  metadata?: {
    courseId?: string
    postId?: string
    projectId?: string
    achievementId?: string
    progress?: number
    level?: number
  }
}

interface ActivityFeedWidgetProps {
  activities: ActivityItem[]
  isLoading?: boolean
}

const activityConfig: Record<
  ActivityType,
  {
    icon: React.ElementType
    color: string
    bgColor: string
  }
> = {
  course_progress: {
    icon: BookOpen,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  course_completed: {
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  post_created: {
    icon: FileText,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  comment_created: {
    icon: MessageSquare,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  project_joined: {
    icon: FolderKanban,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  achievement_earned: {
    icon: Award,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  level_up: {
    icon: Award,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
}

function ActivityItemCard({
  activity,
  dateLocale,
}: {
  activity: ActivityItem
  dateLocale: Locale
}) {
  const config = activityConfig[activity.type]
  const Icon = config.icon

  const content = (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
      <div className={`flex-shrink-0 p-2 rounded-full ${config.bgColor}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {activity.title}
        </p>
        {activity.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
            {activity.description}
          </p>
        )}
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>
            {formatDistanceToNow(new Date(activity.createdAt), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </span>
        </div>
      </div>
      {activity.link && (
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
      )}
    </div>
  )

  if (activity.link) {
    return (
      <Link href={activity.link} className="block">
        {content}
      </Link>
    )
  }

  return content
}

function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ActivityFeedWidget({ activities, isLoading }: ActivityFeedWidgetProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('dashboard.recentActivity')}
          </h3>
        </div>
        {activities.length > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {activities.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <ActivitySkeleton />
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{t('dashboard.noActivity') || 'No recent activity'}</p>
          <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
            {t('dashboard.noActivityHint') || 'Start learning courses or contributing to see your activity here'}
          </p>
        </div>
      ) : (
        <div className="space-y-1 -mx-3">
          {activities.slice(0, 6).map((activity) => (
            <ActivityItemCard key={activity.id} activity={activity} dateLocale={dateLocale} />
          ))}
        </div>
      )}

      {activities.length > 6 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            {t('dashboard.viewAll')} ({activities.length})
          </button>
        </div>
      )}
    </div>
  )
}
