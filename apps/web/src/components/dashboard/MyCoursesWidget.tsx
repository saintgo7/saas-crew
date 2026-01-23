'use client'

import Link from 'next/link'
import { BookOpen, CheckCircle2, Clock, Play, ArrowRight, GraduationCap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS, type Locale } from 'date-fns/locale'
import type { CourseProgress } from '@/lib/api/types'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

interface MyCoursesWidgetProps {
  courses: CourseProgress[]
  maxCourses?: number
}

function CourseCard({
  course,
  dateLocale,
  t,
}: {
  course: CourseProgress
  dateLocale: Locale
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const isCompleted = course.progress === 100

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all group">
      {/* Course Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`p-2 rounded-lg ${
            isCompleted
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-blue-100 dark:bg-blue-900/30'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={`/courses/${course.courseId}`}
            className="font-medium text-gray-900 dark:text-white truncate block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {course.courseTitle}
          </Link>
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

      {/* Progress Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            {t('dashboard.modulesCompleted', {
              completed: course.completedModules,
              total: course.totalModules,
            })}
          </span>
          <span
            className={`font-semibold ${
              isCompleted
                ? 'text-green-600 dark:text-green-400'
                : 'text-blue-600 dark:text-blue-400'
            }`}
          >
            {course.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            }`}
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/courses/${course.courseId}`}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
          isCompleted
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            {t('dashboard.reviewCourse') || 'Review Course'}
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            {t('dashboard.continueLearning') || 'Continue Learning'}
          </>
        )}
      </Link>
    </div>
  )
}

function CourseSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      </div>
      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

export function MyCoursesWidget({ courses, maxCourses = 4 }: MyCoursesWidgetProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  // Sort courses: in-progress first, then by last accessed
  const sortedCourses = [...courses].sort((a, b) => {
    // Completed courses go to end
    if (a.progress === 100 && b.progress !== 100) return 1
    if (a.progress !== 100 && b.progress === 100) return -1
    // Sort by last accessed (most recent first)
    return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
  })

  const displayedCourses = sortedCourses.slice(0, maxCourses)
  const completedCount = courses.filter((c) => c.progress === 100).length
  const inProgressCount = courses.length - completedCount

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('dashboard.myCourses')}
          </h3>
        </div>
        {courses.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
              {inProgressCount} {t('courses.detail.enrolled') || 'In Progress'}
            </span>
            {completedCount > 0 && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                {completedCount} {t('dashboard.completed') || 'Completed'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="mb-4">{t('dashboard.noCourses')}</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {t('dashboard.browseCourses') || 'Browse Courses'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedCourses.map((course) => (
              <CourseCard key={course.courseId} course={course} dateLocale={dateLocale} t={t} />
            ))}
          </div>

          {courses.length > maxCourses && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/courses"
                className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                {t('dashboard.viewAll')} ({courses.length})
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Skeleton component for loading state
export function MyCoursesWidgetSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <CourseSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
