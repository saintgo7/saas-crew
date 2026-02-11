'use client'

import Link from 'next/link'
import { Users, Github, ExternalLink, Eye, Lock } from 'lucide-react'
import type { Project } from '@/lib/api/types'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  const isDemo = project.id.startsWith('demo-')
  const href = isDemo ? '/projects' : `/projects/${project.id}`

  return (
    <Link
      href={href}
      onClick={isDemo ? (e) => e.preventDefault() : undefined}
      className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {project.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            {project.visibility === 'PUBLIC' ? (
              <>
                <Eye className="h-3 w-3" />
                <span>Public</span>
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                <span>Private</span>
              </>
            )}
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {project.description}
        </p>
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Links */}
      <div className="mb-4 flex items-center gap-4 text-sm">
        {project.githubRepo && (
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Github className="h-4 w-4" />
            <span className="text-xs">GitHub</span>
          </div>
        )}
        {project.deployUrl && (
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <ExternalLink className="h-4 w-4" />
            <span className="text-xs">Live</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Users className="h-4 w-4" />
          <span>{t('projects.membersCount', { count: project._count?.members || 0 })}</span>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(project.createdAt), {
            addSuffix: true,
            locale: dateLocale,
          })}
        </div>
      </div>
    </Link>
  )
}
