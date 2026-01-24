'use client'

import Link from 'next/link'
import {
  FileText,
  MessageSquare,
  CheckCircle2,
  ThumbsUp,
  Share2,
  GraduationCap,
  BookOpen,
  LogIn,
  Flame,
  Users,
  Clock,
  ArrowRight,
  Zap,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS, type Locale } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { XpActivity, XpActivityType } from '@/lib/api/types'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

export interface XpActivityListProps {
  activities: XpActivity[]
  isLoading?: boolean
  maxItems?: number
  showViewAll?: boolean
  onViewAll?: () => void
  className?: string
}

const activityConfig: Record<
  XpActivityType,
  {
    icon: React.ElementType
    color: string
    bgColor: string
    label: string
    labelKo: string
  }
> = {
  POST_CREATED: {
    icon: FileText,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    label: 'Created post',
    labelKo: '게시글 작성',
  },
  ANSWER_CREATED: {
    icon: MessageSquare,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Answered question',
    labelKo: '답변 작성',
  },
  ANSWER_ACCEPTED: {
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    label: 'Answer accepted',
    labelKo: '답변 채택됨',
  },
  VOTE_RECEIVED: {
    icon: ThumbsUp,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    label: 'Received vote',
    labelKo: '투표 받음',
  },
  RESOURCE_SHARED: {
    icon: Share2,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    label: 'Shared resource',
    labelKo: '자료 공유',
  },
  COURSE_COMPLETED: {
    icon: GraduationCap,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    label: 'Completed course',
    labelKo: '강좌 완료',
  },
  CHAPTER_COMPLETED: {
    icon: BookOpen,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    label: 'Completed chapter',
    labelKo: '챕터 완료',
  },
  DAILY_LOGIN: {
    icon: LogIn,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-700/50',
    label: 'Daily login',
    labelKo: '일일 로그인',
  },
  STREAK_BONUS: {
    icon: Flame,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    label: 'Streak bonus',
    labelKo: '연속 접속 보너스',
  },
  MENTOR_BONUS: {
    icon: Users,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    label: 'Mentor bonus',
    labelKo: '멘토링 보너스',
  },
}

function getActivityLink(activity: XpActivity): string | undefined {
  const { metadata } = activity
  if (!metadata) return undefined

  if (metadata.postId) return `/community/${metadata.postId}`
  if (metadata.courseId && metadata.chapterId) {
    return `/courses/${metadata.courseId}?chapter=${metadata.chapterId}`
  }
  if (metadata.courseId) return `/courses/${metadata.courseId}`
  if (metadata.mentorshipId) return `/mentoring/${metadata.mentorshipId}`

  return undefined
}

interface XpActivityItemProps {
  activity: XpActivity
  dateLocale: Locale
}

function XpActivityItem({ activity, dateLocale }: XpActivityItemProps) {
  const { locale } = useLanguage()
  const config = activityConfig[activity.type]
  const Icon = config.icon
  const link = getActivityLink(activity)
  const label = locale === 'ko' ? config.labelKo : config.label

  const content = (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
      <div className={cn('flex-shrink-0 p-2 rounded-full', config.bgColor)}>
        <Icon className={cn('w-4 h-4', config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {activity.description || label}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>
              {formatDistanceToNow(new Date(activity.createdAt), {
                addSuffix: true,
                locale: dateLocale,
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
          <Zap className="w-3 h-3" />+{activity.amount}
        </span>
        {link && (
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        )}
      </div>
    </div>
  )

  if (link) {
    return (
      <Link href={link} className="block">
        {content}
      </Link>
    )
  }

  return content
}

function XpActivitySkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
          <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  )
}

export function XpActivityList({
  activities,
  isLoading,
  maxItems = 5,
  showViewAll = true,
  onViewAll,
  className,
}: XpActivityListProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md', className)}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('xp.recentActivity')}
            </h3>
          </div>
          {activities.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {activities.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-2">
        {isLoading ? (
          <XpActivitySkeleton />
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t('xp.noActivity')}</p>
            <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
              {t('xp.noActivityHint')}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayedActivities.map((activity) => (
              <XpActivityItem
                key={activity.id}
                activity={activity}
                dateLocale={dateLocale}
              />
            ))}
          </div>
        )}
      </div>

      {showViewAll && activities.length > maxItems && (
        <div className="p-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onViewAll}
            className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            {t('common.viewAll')} ({activities.length})
          </button>
        </div>
      )}
    </div>
  )
}

// Export activity config for external use
export { activityConfig }
