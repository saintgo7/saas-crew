'use client'

import { Suspense } from 'react'
import { CourseDetail } from '@/components/courses'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from '@/i18n/LanguageContext'

interface CoursePageContentProps {
  courseId: string
}

function CourseDetailLoading() {
  const t = useTranslations()

  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {t('courses.loadingDetail')}
        </p>
      </div>
    </div>
  )
}

export function CoursePageContent({ courseId }: CoursePageContentProps) {
  const t = useTranslations()

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

      {/* Course Detail */}
      <Suspense fallback={<CourseDetailLoading />}>
        <CourseDetail courseId={courseId} />
      </Suspense>
    </div>
  )
}
