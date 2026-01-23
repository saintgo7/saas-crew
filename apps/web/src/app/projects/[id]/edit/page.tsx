'use client'

export const runtime = 'edge';

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Edit, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { ProjectForm } from '@/components/projects'
import { useProject, useUpdateProject } from '@/lib/hooks/use-projects'
import { useTranslations } from '@/i18n/LanguageContext'
import type { CreateProjectInput, UpdateProjectInput, Project } from '@/lib/api/types'

export default function EditProjectPage() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const { data: project, isLoading, error } = useProject(projectId)
  const updateProject = useUpdateProject()

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push(`/auth/login?redirect=/projects/${projectId}/edit`)
      return
    }

    // Get current user ID from token or local storage
    const userDataString = localStorage.getItem('user_data')
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString)
        setCurrentUserId(userData.id)
      } catch {
        // Ignore parse errors
      }
    }

    setIsAuthenticated(true)
  }, [router, projectId])

  // Check ownership after project loads
  useEffect(() => {
    if (project && currentUserId) {
      const isOwner = (project as any).ownerId === currentUserId
      const isAdmin = localStorage.getItem('user_role') === 'admin'

      if (!isOwner && !isAdmin) {
        router.push(`/projects/${projectId}`)
      }
    }
  }, [project, currentUserId, router, projectId])

  const handleSubmit = async (data: CreateProjectInput): Promise<Project> => {
    const result = await updateProject.mutateAsync({ id: projectId, data: data as UpdateProjectInput })
    return result
  }

  // Show loading while checking authentication
  if (isAuthenticated === null || isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {t('common.loading')}
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
              {t('projects.error')}
            </h2>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error instanceof Error ? error.message : t('projects.unknownError')}
            </p>
            <Link
              href="/projects"
              className="mt-4 inline-block text-sm text-red-700 underline hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
            >
              {t('projects.backToList')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show not found state
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('projects.notFound.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('projects.notFound.description')}
            </p>
            <Link
              href="/projects"
              className="mt-4 inline-block text-sm text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('projects.backToList')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back Link */}
        <Link
          href={`/projects/${projectId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('projects.edit.backToProject')}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('projects.edit.title')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {project.name}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <ProjectForm
            mode="edit"
            project={project}
            onSubmit={handleSubmit}
            isSubmitting={updateProject.isPending}
            error={updateProject.error as Error | null}
          />
        </div>
      </div>
    </div>
  )
}
