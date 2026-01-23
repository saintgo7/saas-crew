'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Folder } from 'lucide-react'
import Link from 'next/link'
import { ProjectForm } from '@/components/projects'
import { useCreateProject } from '@/lib/hooks/use-projects'
import { useTranslations } from '@/i18n/LanguageContext'
import type { CreateProjectInput } from '@/lib/api/types'

export default function NewProjectPage() {
  const t = useTranslations()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const createProject = useCreateProject()

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/auth/login?redirect=/projects/new')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleSubmit = async (data: CreateProjectInput) => {
    const result = await createProject.mutateAsync(data)
    return result
  }

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {t('common.loading')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back Link */}
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('projects.backToList')}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('projects.new.title')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('projects.new.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <ProjectForm
            mode="create"
            onSubmit={handleSubmit}
            isSubmitting={createProject.isPending}
            error={createProject.error as Error | null}
          />
        </div>

        {/* Tips Section */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            {t('projects.new.tips.title')}
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">1.</span>
              {t('projects.new.tips.tip1')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">2.</span>
              {t('projects.new.tips.tip2')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">3.</span>
              {t('projects.new.tips.tip3')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">4.</span>
              {t('projects.new.tips.tip4')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
