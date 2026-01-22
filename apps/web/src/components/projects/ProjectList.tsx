'use client'

import { useState } from 'react'
import { useProjects } from '@/lib/hooks/use-projects'
import { ProjectCard } from './ProjectCard'
import { AlertCircle, Loader2, Folder, Search } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

export function ProjectList() {
  const t = useTranslations()
  const [selectedVisibility, setSelectedVisibility] = useState<
    'PUBLIC' | 'PRIVATE' | undefined
  >(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const visibilityFilters = [
    { value: undefined, label: t('projects.filter.all') },
    { value: 'PUBLIC' as const, label: t('projects.filter.public') },
    { value: 'PRIVATE' as const, label: t('projects.filter.private') },
  ]

  // Debounce search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    // Simple debounce
    setTimeout(() => {
      setDebouncedSearch(value)
    }, 300)
  }

  const { data, isLoading, error } = useProjects({
    visibility: selectedVisibility,
    search: debouncedSearch || undefined,
    limit: 20,
  })

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              {t('projects.error')}
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error instanceof Error
                ? error.message
                : t('projects.unknownError')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={t('projects.searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {visibilityFilters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setSelectedVisibility(filter.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedVisibility === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t('projects.loading')}
            </p>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && data && (
        <>
          {data.data.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <Folder className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {t('projects.noProjectsToShow')}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {/* Project Count */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('projects.totalProjects', { count: data.meta.total })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
