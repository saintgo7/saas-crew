'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuestions, useQnaTags } from '@/lib/hooks/use-qna'
import { QuestionCard } from './QuestionCard'
import { TagBadge } from './TagBadge'
import {
  Loader2,
  HelpCircle,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { QuestionSortBy, QuestionStatus, Question } from '@/lib/api/qna-types'
import { useTranslations } from '@/i18n/LanguageContext'

const DEMO_QNA_TAGS = ['JavaScript', 'React', 'TypeScript', 'Git', 'CSS', 'Python', 'Docker', 'Database']

const DEMO_QUESTIONS: Question[] = [
  {
    id: 'demo-q1',
    title: 'useEffect 클린업 함수는 언제 실행되나요?',
    content: 'useEffect 안에서 return으로 함수를 반환하면 언제 실행되는지 정확히 모르겠습니다...',
    authorId: 'u1',
    author: { id: 'u1', name: 'Choi Yerin', level: 3 },
    tags: ['React', 'JavaScript'],
    votes: 8,
    views: 124,
    answersCount: 3,
    hasAcceptedAnswer: true,
    status: 'answered',
    createdAt: '2026-02-10T15:30:00Z',
    updatedAt: '2026-02-10T15:30:00Z',
  },
  {
    id: 'demo-q2',
    title: 'Git rebase와 merge의 차이점이 뭔가요?',
    content: '프로젝트에서 rebase를 쓰라고 하는데 merge와 어떤 차이가 있는지...',
    authorId: 'u2',
    author: { id: 'u2', name: 'Jang Hyunwoo', level: 2 },
    tags: ['Git'],
    votes: 15,
    views: 267,
    answersCount: 4,
    hasAcceptedAnswer: true,
    status: 'answered',
    createdAt: '2026-02-09T09:00:00Z',
    updatedAt: '2026-02-09T09:00:00Z',
  },
  {
    id: 'demo-q3',
    title: 'TypeScript에서 interface vs type 어떤 걸 써야 하나요?',
    content: 'interface와 type alias 둘 다 비슷한 기능을 하는 것 같은데...',
    authorId: 'u3',
    author: { id: 'u3', name: 'Shin Minji', level: 5 },
    tags: ['TypeScript'],
    votes: 21,
    views: 389,
    answersCount: 6,
    hasAcceptedAnswer: true,
    status: 'answered',
    createdAt: '2026-02-08T11:20:00Z',
    updatedAt: '2026-02-08T11:20:00Z',
  },
  {
    id: 'demo-q4',
    title: 'Docker 컨테이너에서 hot reload가 안 됩니다',
    content: 'Docker Compose로 Next.js 개발 환경을 구성했는데 파일 변경 시 hot reload가 동작하지 않습니다...',
    authorId: 'u4',
    author: { id: 'u4', name: 'Lee Dongwoo', level: 10 },
    tags: ['Docker', 'Next.js'],
    votes: 5,
    views: 87,
    answersCount: 2,
    hasAcceptedAnswer: false,
    status: 'open',
    createdAt: '2026-02-07T14:00:00Z',
    updatedAt: '2026-02-07T14:00:00Z',
  },
  {
    id: 'demo-q5',
    title: 'CSS Grid vs Flexbox 언제 어떤 걸 써야 하나요?',
    content: '레이아웃을 잡을 때 Grid와 Flexbox 중 어떤 걸 써야 하는지 기준이 있나요?',
    authorId: 'u5',
    author: { id: 'u5', name: 'Kim Soyeon', level: 4 },
    tags: ['CSS'],
    votes: 11,
    views: 198,
    answersCount: 5,
    hasAcceptedAnswer: true,
    status: 'answered',
    createdAt: '2026-02-06T08:30:00Z',
    updatedAt: '2026-02-06T08:30:00Z',
  },
  {
    id: 'demo-q6',
    title: 'Python 가상환경 venv vs conda 차이점',
    content: 'Python 프로젝트를 시작할 때 venv와 conda 중 어떤 걸 사용하는 게 좋을까요?',
    authorId: 'u6',
    author: { id: 'u6', name: 'Han Seungho', level: 6 },
    tags: ['Python'],
    votes: 7,
    views: 145,
    answersCount: 3,
    hasAcceptedAnswer: false,
    status: 'open',
    createdAt: '2026-02-05T16:10:00Z',
    updatedAt: '2026-02-05T16:10:00Z',
  },
]

interface QuestionListProps {
  pageSize?: number
}

export function QuestionList({ pageSize = 20 }: QuestionListProps) {
  const t = useTranslations()
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<QuestionStatus>('all')
  const [sortBy, setSortBy] = useState<QuestionSortBy>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const statusOptions: { value: QuestionStatus; label: string }[] = [
    { value: 'all', label: t('qna.status.all') },
    { value: 'open', label: t('qna.status.open') },
    { value: 'answered', label: t('qna.status.answered') },
  ]

  const sortOptions: { value: QuestionSortBy; label: string }[] = [
    { value: 'newest', label: t('qna.sort.latest') },
    { value: 'oldest', label: t('qna.sort.oldest') },
    { value: 'most_votes', label: t('qna.sort.votes') },
    { value: 'most_answers', label: t('qna.sort.answers') },
    { value: 'most_views', label: t('qna.sort.views') },
    { value: 'bounty', label: t('qna.sort.bounty') },
  ]

  const { data: tags } = useQnaTags()
  const { data, isLoading, error } = useQuestions({
    tag: selectedTag,
    status: status === 'all' ? undefined : status,
    sortBy,
    search: searchQuery,
    page: currentPage,
    pageSize,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    setCurrentPage(1)
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? undefined : tag)
    setCurrentPage(1)
  }

  const isDemo = !!error || (!isLoading && !data)
  const displayTags = isDemo ? DEMO_QNA_TAGS : tags
  const questions = isDemo
    ? DEMO_QUESTIONS.filter((q) => {
        if (selectedTag && !q.tags.includes(selectedTag)) return false
        if (status === 'open' && q.status !== 'open') return false
        if (status === 'answered' && q.status !== 'answered') return false
        if (searchQuery) {
          const s = searchQuery.toLowerCase()
          return q.title.toLowerCase().includes(s)
        }
        return true
      })
    : data?.questions ?? []
  const totalCount = isDemo ? questions.length : data?.total ?? 0
  const totalPages = isDemo ? 1 : data ? Math.ceil(data.total / pageSize) : 0

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      {isDemo && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t('qna.demoBanner')}
          </p>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('qna.searchPlaceholder')}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </form>

        <Link
          href="/qna/ask"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>{t('qna.askQuestion')}</span>
        </Link>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => { setStatus(option.value); setCurrentPage(1) }}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  status === option.value
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as QuestionSortBy); setCurrentPage(1) }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => { setSelectedTag(undefined); setCurrentPage(1) }}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedTag === undefined
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('qna.filter.all')}
          </button>
          {displayTags?.slice(0, 8).map((tag) => (
            <TagBadge
              key={tag}
              tag={tag}
              onClick={() => handleTagClick(tag)}
              isActive={selectedTag === tag}
            />
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t('qna.loading')}
            </p>
          </div>
        </div>
      )}

      {/* Questions List */}
      {!isLoading && (
        <>
          {questions.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {t('qna.noQuestions')}
                </p>
                <Link
                  href="/qna/ask"
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Plus className="h-4 w-4" />
                  {t('qna.askFirst')}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onTagClick={handleTagClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t('common.previous')}
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    {t('common.next')}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('qna.totalQuestions', { count: totalCount })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
