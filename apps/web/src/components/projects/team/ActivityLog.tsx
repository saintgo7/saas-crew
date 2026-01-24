'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  UserPlus,
  UserMinus,
  UserCog,
  GitBranch,
  Settings,
  Mail,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { projectsApi } from '@/lib/api/projects'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

interface ActivityLogProps {
  projectId: string
}

const activityIcons: Record<string, any> = {
  PROJECT_CREATED: Settings,
  PROJECT_UPDATED: Settings,
  PROJECT_DELETED: Settings,
  MEMBER_JOINED: UserPlus,
  MEMBER_LEFT: UserMinus,
  MEMBER_REMOVED: UserMinus,
  MEMBER_ROLE_CHANGED: UserCog,
  INVITATION_SENT: Mail,
  INVITATION_ACCEPTED: UserPlus,
  INVITATION_REJECTED: Mail,
  INVITATION_CANCELLED: Mail,
  GITHUB_SYNCED: GitBranch,
  GITHUB_CONNECTED: GitBranch,
  GITHUB_DISCONNECTED: GitBranch,
}

const activityColors: Record<string, string> = {
  PROJECT_CREATED: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  PROJECT_UPDATED: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  MEMBER_JOINED: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  MEMBER_LEFT: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
  MEMBER_REMOVED: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
  MEMBER_ROLE_CHANGED: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
  INVITATION_SENT: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  INVITATION_ACCEPTED: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  INVITATION_REJECTED: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
  GITHUB_SYNCED: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
}

export function ActivityLog({ projectId }: ActivityLogProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['project-activities', projectId],
    queryFn: () => projectsApi.getActivityLog(projectId),
  })

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <p>{t('projects.activity.error')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('projects.activity.title')}
          </h3>
        </div>
      </div>

      {!activities || activities.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <Activity className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            {t('projects.activity.empty')}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {activities.map((activity: any) => {
            const Icon = activityIcons[activity.type] || Activity
            const colorClass = activityColors[activity.type] || 'text-gray-600 bg-gray-100'

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 px-6 py-4"
              >
                <div className={`rounded-full p-2 ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
