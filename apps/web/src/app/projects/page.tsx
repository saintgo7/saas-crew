'use client'

import { Suspense } from 'react'
import { ProjectList } from '@/components/projects'
import { Loader2 } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

function ProjectsLoading() {
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

export default function ProjectsPage() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('projects.title')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('projects.subtitle')}
        </p>
      </div>

      {/* Project List */}
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}
