'use client'

import { useState } from 'react'
import { usePosts, useTags } from '@/lib/hooks/use-community'
import { PostCard } from './PostCard'
import { Loader2, MessageSquare, Search } from 'lucide-react'
import type { Post, PostSortBy } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'

const DEMO_TAGS = ['일반', '기술', '프로젝트', '취업/진로', '스터디']

const DEMO_POSTS: Post[] = [
  {
    id: 'demo-p1',
    title: 'Next.js 15에서 Server Actions 사용 경험 공유',
    content: 'Server Actions를 실제 프로젝트에 적용해봤는데, form 처리가 훨씬 간결해졌습니다...',
    authorId: 'u1',
    author: { id: 'u1', name: 'Kim Jihye', level: 8 },
    tags: ['기술', 'Next.js'],
    votes: 12,
    views: 156,
    commentsCount: 5,
    hasAcceptedAnswer: false,
    createdAt: '2026-02-10T14:30:00Z',
    updatedAt: '2026-02-10T14:30:00Z',
  },
  {
    id: 'demo-p2',
    title: 'Crew Platform 프로젝트 2주차 회고',
    content: '이번 주에는 인증 시스템과 프로젝트 CRUD를 완성했습니다. GitHub OAuth 연동이 생각보다...',
    authorId: 'u2',
    author: { id: 'u2', name: 'Go Seongmin', level: 15 },
    tags: ['프로젝트'],
    votes: 8,
    views: 89,
    commentsCount: 3,
    hasAcceptedAnswer: false,
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'demo-p3',
    title: '2026 상반기 인턴 지원 후기 (네이버, 카카오)',
    content: '네이버와 카카오 인턴에 지원한 경험을 공유합니다. 코딩 테스트 준비 방법과 면접 후기...',
    authorId: 'u3',
    author: { id: 'u3', name: 'Park Junhyuk', level: 12 },
    tags: ['취업/진로'],
    votes: 24,
    views: 342,
    commentsCount: 11,
    hasAcceptedAnswer: false,
    createdAt: '2026-02-08T09:15:00Z',
    updatedAt: '2026-02-08T09:15:00Z',
  },
  {
    id: 'demo-p4',
    title: 'Docker Compose로 개발 환경 세팅하기',
    content: 'PostgreSQL + Redis + API + Web을 Docker Compose로 한 번에 구동하는 방법을 정리했습니다...',
    authorId: 'u4',
    author: { id: 'u4', name: 'Lee Dongwoo', level: 10 },
    tags: ['기술', 'Docker'],
    votes: 15,
    views: 203,
    commentsCount: 7,
    hasAcceptedAnswer: false,
    createdAt: '2026-02-07T16:45:00Z',
    updatedAt: '2026-02-07T16:45:00Z',
  },
  {
    id: 'demo-p5',
    title: '알고리즘 스터디 모집 (매주 화/목)',
    content: '백준과 프로그래머스 문제를 함께 풀 스터디원을 모집합니다. Python/Java 사용...',
    authorId: 'u5',
    author: { id: 'u5', name: 'Choi Yerin', level: 5 },
    tags: ['스터디'],
    votes: 6,
    views: 78,
    commentsCount: 4,
    hasAcceptedAnswer: false,
    createdAt: '2026-02-06T11:20:00Z',
    updatedAt: '2026-02-06T11:20:00Z',
  },
]

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

  const isDemo = !!error || (!isLoading && !data)
  const displayTags = isDemo ? DEMO_TAGS : tags
  const posts = isDemo
    ? DEMO_POSTS.filter((p) => {
        if (selectedTag && !p.tags.includes(selectedTag)) return false
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          return p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
        }
        return true
      }).sort((a, b) => {
        if (sortBy === 'popular') return b.votes - a.votes
        if (sortBy === 'views') return b.views - a.views
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    : data?.posts ?? []
  const totalCount = isDemo ? posts.length : data?.total ?? 0

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      {isDemo && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t('community.demoBanner')}
          </p>
        </div>
      )}

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
          {displayTags?.map((tag) => (
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
      {!isLoading && (
        <>
          {posts.length === 0 ? (
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
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('community.totalPosts', { count: totalCount })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
