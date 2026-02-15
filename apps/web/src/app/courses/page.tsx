'use client'

import { Suspense } from 'react'
import { CourseList, CourseStats } from '@/components/courses'
import { Loader2 } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

function CoursesLoading() {
  const t = useTranslations()
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {t('common.loading')}
        </p>
      </div>
    </div>
  )
}

export default function CoursesPage() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('courses.title')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('courses.subtitle')}
        </p>
      </div>

      {/* Course Stats */}
      <CourseStats />

      {/* Course List */}
      <Suspense fallback={<CoursesLoading />}>
        <CourseList />
      </Suspense>
    </div>
  )
}
