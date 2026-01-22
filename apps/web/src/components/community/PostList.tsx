'use client'

import { useState } from 'react'
import { usePosts, useTags } from '@/lib/hooks/use-community'
import { PostCard } from './PostCard'
import { AlertCircle, Loader2, MessageSquare, Search } from 'lucide-react'
import type { PostSortBy } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'

export function PostList() {
  const t = useTranslations()
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined)
  const [sortBy, setSortBy] = useState<PostSortBy>('latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const sortOptions: { value: PostSortBy; label: string }[] = [
    { value: 'latest', label: t('community.filter.latest') },
    { value: 'popular', label: t('community.filter.popular') },
    { value: 'views', label: t('community.filter.views') },
  ]

  const { data: tags } = useTags()
  const { data, isLoading, error } = usePosts({
    tag: selectedTag,
    sortBy,
    search: searchQuery,
    pageSize: 20,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              {t('community.error')}
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error instanceof Error
                ? error.message
                : t('community.unknownError')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t('community.searchPlaceholder')}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />
      </form>

      {/* Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedTag(undefined)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedTag === undefined
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('community.filter.all')}
          </button>
          {tags?.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                sortBy === option.value
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t('community.loading')}
            </p>
          </div>
        </div>
      )}

      {/* Posts List */}
      {!isLoading && data && (
        <>
          {data.posts.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {t('community.noPostsToShow')}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {data.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Post Count */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('community.totalPosts', { count: data.total })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
