'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Github, ExternalLink, Users, Calendar, Eye, Lock, Edit } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'
import { ProjectTabs } from '@/components/projects/ProjectTabs'
import { ProjectCanvas } from '@/components/projects/ProjectCanvas'

interface Project {
  id: string
  name: string
  slug: string
  description: string
  visibility: string
  tags?: string[]
  githubRepo?: string
  deployUrl?: string
  coverImage?: string
  createdAt: string
  updatedAt?: string
  ownerId?: string
  _count?: {
    members: number
  }
}

interface ProjectDetailContentProps {
  project: Project
}

export function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  const [canEdit, setCanEdit] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { key: 'overview', label: t('projects.detail.overview') || 'Overview' },
    { key: 'canvas', label: t('canvas.title') || 'Canvas' },
  ]

  // Check if current user can edit the project
  useEffect(() => {
    const userDataString = localStorage.getItem('user_data')
    const userRole = localStorage.getItem('user_role')

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString)
        const isOwner = project.ownerId === userData.id
        const isAdmin = userRole === 'admin'
        setCanEdit(isOwner || isAdmin)
      } catch {
        setCanEdit(false)
      }
    }
  }, [project.ownerId])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {project.visibility === 'PUBLIC' ? (
                <>
                  <Eye className="h-4 w-4" />
                  <span>{t('projects.visibility.public')}</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>{t('projects.visibility.private')}</span>
                </>
              )}
            </div>

            {/* Edit Button for owners */}
            {canEdit && (
              <Link
                href={`/projects/${project.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Edit className="h-4 w-4" />
                {t('common.edit')}
              </Link>
            )}
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

        {/* Canvas Tab */}
        {activeTab === 'canvas' && (
          <ProjectCanvas projectId={project.id} />
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
        <>
        {/* Info Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Members */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('projects.detail.participants')}
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('projects.detail.participantsCount', { count: project._count?.members || 0 })}
                </p>
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('projects.detail.createdAt')}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDistanceToNow(new Date(project.createdAt), {
                    addSuffix: true,
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        {(project.githubRepo || project.deployUrl) && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {t('projects.detail.links')}
            </h2>
            <div className="space-y-3">
              {project.githubRepo && (
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                >
                  <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      GitHub Repository
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.githubRepo}
                    </p>
                  </div>
                </a>
              )}

              {project.deployUrl && (
                <a
                  href={project.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                >
                  <ExternalLink className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {t('projects.detail.deployedSite')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.deployUrl}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Cover Image */}
        {project.coverImage && (
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <img
              src={project.coverImage}
              alt={project.name}
              className="h-auto w-full"
            />
          </div>
        )}

        {/* Additional Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {t('projects.detail.projectInfo')}
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">
                {t('projects.detail.projectId')}
              </dt>
              <dd className="font-mono text-sm text-gray-900 dark:text-white">
                {project.id}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Slug</dt>
              <dd className="font-mono text-sm text-gray-900 dark:text-white">
                {project.slug}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">
                {t('projects.detail.createdAt')}
              </dt>
              <dd className="text-gray-900 dark:text-white">
                {new Date(project.createdAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
            {project.updatedAt && (
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">
                  {t('projects.detail.updatedAt')}
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {new Date(project.updatedAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
            )}
          </dl>
        </div>
        </>
        )}
      </div>
    </div>
  )
}
