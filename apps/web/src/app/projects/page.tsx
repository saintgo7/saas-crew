'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { ProjectList } from '@/components/projects'
import { Loader2, Plus } from 'lucide-react'
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    setIsAuthenticated(!!token)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('projects.title')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Create Project Button */}
        {isAuthenticated && (
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {t('projects.createProject')}
          </Link>
        )}
      </div>

      {/* Project List */}
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}
