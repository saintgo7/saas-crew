'use client'

import Link from 'next/link'
import {
  Calendar,
  Users,
  Tag,
  FolderKanban,
  ExternalLink,
  Github,
  Eye,
  Plus,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react'
import { format } from 'date-fns'
import { ko, enUS, type Locale } from 'date-fns/locale'
import type { Project } from '@/lib/api/types'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'
import { useState } from 'react'

interface MyProjectsWidgetProps {
  projects: Project[]
  maxProjects?: number
}

const statusConfig = {
  planning: {
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    dotColor: 'bg-gray-500',
  },
  in_progress: {
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    dotColor: 'bg-blue-500',
  },
  completed: {
    color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    dotColor: 'bg-green-500',
  },
  archived: {
    color: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    dotColor: 'bg-gray-400',
  },
}

function ProjectCard({
  project,
  dateLocale,
  t,
}: {
  project: Project
  dateLocale: Locale
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const [showActions, setShowActions] = useState(false)
  const status = project.status || 'in_progress'
  const statusStyle = statusConfig[status] || statusConfig.in_progress

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all group relative">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/projects/${project.slug || project.id}`}
            className="font-semibold text-gray-900 dark:text-white truncate block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {project.name}
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Quick Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>

          {showActions && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActions(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 top-8 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 w-40">
                <Link
                  href={`/projects/${project.slug || project.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowActions(false)}
                >
                  <Eye className="w-4 h-4" />
                  {t('dashboard.viewProject') || 'View'}
                </Link>
                {project.githubRepo && (
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowActions(false)}
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {project.deployUrl && (
                  <a
                    href={project.deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowActions(false)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('projects.detail.deployedSite') || 'Live Site'}
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotColor}`} />
          {t(`dashboard.projectStatus.${status}`)}
        </span>
        {project.visibility === 'PRIVATE' && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({t('projects.filter.private') || 'Private'})
          </span>
        )}
      </div>

      {/* Progress Bar (if available) */}
      {project.progress !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">{t('dashboard.progress')}</span>
            <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        {project.startDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(project.startDate), 'yyyy.MM.dd', { locale: dateLocale })}</span>
          </div>
        )}
        {(project._count?.members || project.teamMembers?.length) && (
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>
              {t('dashboard.members', {
                count: project._count?.members || project.teamMembers?.length || 0,
              })}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="mt-3 flex items-center gap-1 flex-wrap">
          <Tag className="w-3 h-3 text-gray-400" />
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{project.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Quick Link Bar (shown on hover) */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={`/projects/${project.slug || project.id}`}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          {t('projects.card.viewDetails') || 'View'}
        </Link>
        {project.githubRepo && (
          <a
            href={project.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        )}
        {project.deployUrl && (
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live
          </a>
        )}
      </div>
    </div>
  )
}

function ProjectSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        </div>
      </div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3" />
      <div className="flex gap-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>
    </div>
  )
}

export function MyProjectsWidget({ projects, maxProjects = 4 }: MyProjectsWidgetProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  // Sort projects: active first, then by created date
  const sortedProjects = [...projects].sort((a, b) => {
    const statusOrder = { in_progress: 0, planning: 1, completed: 2, archived: 3 }
    const aOrder = statusOrder[a.status || 'in_progress'] || 1
    const bOrder = statusOrder[b.status || 'in_progress'] || 1
    if (aOrder !== bOrder) return aOrder - bOrder
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const displayedProjects = sortedProjects.slice(0, maxProjects)
  const activeCount = projects.filter((p) => p.status === 'in_progress').length
  const completedCount = projects.filter((p) => p.status === 'completed').length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('dashboard.myProjects')}
          </h3>
        </div>
        {projects.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
              {activeCount} {t('dashboard.projectStatus.in_progress') || 'Active'}
            </span>
            {completedCount > 0 && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                {completedCount} {t('dashboard.projectStatus.completed') || 'Done'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="mb-4">{t('dashboard.noProjects')}</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            {t('dashboard.createProject') || 'Create Project'}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} dateLocale={dateLocale} t={t} />
            ))}
          </div>

          {projects.length > maxProjects && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/projects"
                className="flex items-center justify-center gap-2 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
              >
                {t('dashboard.viewAll')} ({projects.length})
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
export function MyProjectsWidgetSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
