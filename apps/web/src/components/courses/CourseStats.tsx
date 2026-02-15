'use client'

import { useMemo } from 'react'
import { BookOpen, Users, BarChart3, Layers } from 'lucide-react'
import { DEMO_COURSES } from '@/lib/data/demo-courses'
import { useTranslations } from '@/i18n/LanguageContext'

export function CourseStats() {
  const t = useTranslations()

  const stats = useMemo(() => {
    const total = DEMO_COURSES.length
    const byLevel = {
      JUNIOR: DEMO_COURSES.filter((c) => c.level === 'JUNIOR').length,
      SENIOR: DEMO_COURSES.filter((c) => c.level === 'SENIOR').length,
      MASTER: DEMO_COURSES.filter((c) => c.level === 'MASTER').length,
    }

    // Count tags and find top categories
    const tagCounts: Record<string, number> = {}
    for (const course of DEMO_COURSES) {
      if (course.tags) {
        for (const tag of course.tags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        }
      }
    }
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))

    return { total, byLevel, topTags }
  }, [])

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Courses */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('courses.stats.totalCourses')}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </p>
          </div>
        </div>
      </div>

      {/* By Level */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
            <Layers className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('courses.stats.byLevel')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                J {stats.byLevel.JUNIOR}
              </span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                S {stats.byLevel.SENIOR}
              </span>
              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                M {stats.byLevel.MASTER}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Enrolled */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
            <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('courses.enrolledCount', { count: '' })}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {DEMO_COURSES.reduce((sum, c) => sum + (c.enrolledCount || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('courses.stats.topCategories')}
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {stats.topTags.slice(0, 3).map(({ tag }) => (
                <span
                  key={tag}
                  className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
