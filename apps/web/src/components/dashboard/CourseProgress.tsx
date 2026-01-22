'use client'

import { BookOpen, CheckCircle2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import type { CourseProgress as CourseProgressType } from '@/lib/api/types'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

interface CourseProgressProps {
  courses: CourseProgressType[]
}

export function CourseProgress({ courses }: CourseProgressProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  if (courses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('dashboard.courseProgress')}
        </h3>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{t('dashboard.noCourses')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.courseProgress')}
        </h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t('dashboard.totalCourses', { count: courses.length })}
        </span>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {/* Course Title */}
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {course.courseTitle}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(course.lastAccessedAt), {
                      addSuffix: true,
                      locale: dateLocale,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Info */}
            <div className="flex items-center gap-3 mb-2 text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>
                  {t('dashboard.modulesCompleted', { completed: course.completedModules, total: course.totalModules })}
                </span>
              </div>
              <span className="text-gray-400">·</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {course.progress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
