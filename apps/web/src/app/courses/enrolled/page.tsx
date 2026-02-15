'use client'

import { useState, useMemo } from 'react'
import { useEnrolledCourses } from '@/lib/hooks/use-courses'
import { CourseCard } from '@/components/courses/CourseCard'
import { ProgressBar } from '@/components/courses/ProgressBar'
import { Loader2, BookOpen, ArrowLeft } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import { DEMO_COURSES } from '@/lib/data/demo-courses'
import Link from 'next/link'
import type { Course } from '@/lib/api/types'

type FilterStatus = 'all' | 'inProgress' | 'completed'

interface EnrolledCourseWithProgress extends Course {
  progress: number
  lastAccessedAt?: string
}

function generateDemoEnrolledCourses(): EnrolledCourseWithProgress[] {
  // Pick a subset of demo courses with fake progress
  const enrolledIds = [
    'demo-c1', 'demo-c2', 'demo-c3', 'demo-c5', 'demo-c7',
    'demo-c12', 'demo-c19', 'demo-c23', 'demo-c24', 'demo-c30',
  ]
  return DEMO_COURSES.filter((c) => enrolledIds.includes(c.id)).map((course, i) => ({
    ...course,
    progress: [85, 100, 45, 100, 60, 30, 100, 15, 70, 100][i] ?? 50,
    lastAccessedAt: new Date(
      Date.now() - i * 24 * 60 * 60 * 1000
    ).toISOString(),
  }))
}

export default function EnrolledCoursesPage() {
  const t = useTranslations()
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const { data, isLoading, error } = useEnrolledCourses()

  const isDemo = !!error || (!isLoading && !data)

  const enrolledCourses = useMemo<EnrolledCourseWithProgress[]>(() => {
    if (!isDemo && data) {
      // Real data - add default progress since API returns Course[]
      return (data as Course[]).map((c) => ({
        ...c,
        progress: 0,
      }))
    }
    return generateDemoEnrolledCourses()
  }, [isDemo, data])

  const filteredCourses = useMemo(() => {
    if (filterStatus === 'all') return enrolledCourses
    if (filterStatus === 'completed') {
      return enrolledCourses.filter((c) => c.progress >= 100)
    }
    return enrolledCourses.filter((c) => c.progress < 100)
  }, [enrolledCourses, filterStatus])

  const filterTabs = [
    { value: 'all' as FilterStatus, label: t('courses.enrolled.filter.all') },
    { value: 'inProgress' as FilterStatus, label: t('courses.enrolled.filter.inProgress') },
    { value: 'completed' as FilterStatus, label: t('courses.enrolled.filter.completed') },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('courses.backToList')}
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('courses.enrolled.title')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('courses.enrolled.subtitle')}
        </p>
      </div>

      {/* Demo Banner */}
      {isDemo && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t('courses.enrolled.demoBanner')}
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filterStatus === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {tab.label}
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
          {filteredCourses.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {t('courses.enrolled.empty')}
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  {t('courses.enrolled.emptyHint')}
                </p>
                <Link
                  href="/courses"
                  className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {t('courses.backToList')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <div key={course.id} className="relative">
                  <CourseCard course={course} />
                  {/* Progress Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 rounded-b-lg border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/95">
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>
                        {t('courses.enrolled.progressLabel', {
                          percent: course.progress.toString(),
                        })}
                      </span>
                      {course.progress >= 100 && (
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {t('courses.learn.completed')}
                        </span>
                      )}
                    </div>
                    <ProgressBar
                      progress={course.progress}
                      showLabel={false}
                      size="sm"
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
