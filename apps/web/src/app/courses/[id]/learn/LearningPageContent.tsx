'use client'

import { Suspense } from 'react'
import { LearningView } from '@/components/courses/LearningView'
import { Loader2 } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

interface LearningPageContentProps {
  courseId: string
}

function LearningLoading() {
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

export function LearningPageContent({ courseId }: LearningPageContentProps) {
  return (
    <Suspense fallback={<LearningLoading />}>
      <LearningView courseId={courseId} />
    </Suspense>
  )
}
