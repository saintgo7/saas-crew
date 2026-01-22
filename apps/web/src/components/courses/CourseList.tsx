'use client'

import { useState } from 'react'
import { useCourses } from '@/lib/hooks/use-courses'
import { CourseCard } from './CourseCard'
import { AlertCircle, Loader2, BookOpen } from 'lucide-react'
import type { CourseLevel } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'

export function CourseList() {
  const t = useTranslations()
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | undefined>(
    undefined
  )

  const levelFilters = [
    { value: undefined, label: t('courses.level.all') },
    { value: 'JUNIOR' as CourseLevel, label: t('courses.level.junior') },
    { value: 'SENIOR' as CourseLevel, label: t('courses.level.senior') },
    { value: 'MASTER' as CourseLevel, label: t('courses.level.master') },
  ]

  const { data, isLoading, error } = useCourses({
    level: selectedLevel,
    pageSize: 20,
  })

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              {t('courses.error')}
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error instanceof Error
                ? error.message
                : t('courses.unknownError')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {levelFilters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setSelectedLevel(filter.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedLevel === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t('courses.loading')}
            </p>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && data && (
        <>
          {data.courses.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {t('courses.noCoursesToShow')}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {/* Course Count */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('courses.totalCourses', { count: data.total })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
