'use client'

import { useState } from 'react'
import { useCourses } from '@/lib/hooks/use-courses'
import { CourseCard } from './CourseCard'
import { Loader2, BookOpen } from 'lucide-react'
import type { CourseLevel } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'
import { DEMO_COURSES } from '@/lib/data/demo-courses'

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
    pageSize: 30,
  })

  const isDemo = !!error || (!isLoading && !data)
  const courses = isDemo
    ? DEMO_COURSES.filter((c) => !selectedLevel || c.level === selectedLevel)
    : data?.courses ?? []
  const totalCount = isDemo ? courses.length : data?.total ?? 0

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      {isDemo && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t('courses.demoBanner')}
          </p>
        </div>
      )}

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
      {!isLoading && (
        <>
          {courses.length === 0 ? (
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
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {/* Course Count */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('courses.totalCourses', { count: totalCount })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
