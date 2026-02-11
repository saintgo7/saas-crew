'use client'

import { useState } from 'react'
import { useProjects } from '@/lib/hooks/use-projects'
import { ProjectCard } from './ProjectCard'
import { AlertCircle, Loader2, Folder, Search } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import type { Project } from '@/lib/api/types'

const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    name: 'Crew Platform',
    slug: 'crew-platform',
    description: 'CrewSpace 메인 플랫폼. Next.js + NestJS + PostgreSQL 기반의 풀스택 웹 애플리케이션으로, 프로젝트 관리, 코스 학습, 커뮤니티 기능을 제공합니다.',
    visibility: 'PUBLIC',
    status: 'in_progress',
    tags: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL'],
    githubRepo: 'https://github.com/saintgo7/saas-crew',
    deployUrl: 'https://crew.abada.kr',
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
    _count: { members: 4 },
  },
  {
    id: 'demo-2',
    name: 'Campus Map',
    slug: 'campus-map',
    description: '캠퍼스 인터랙티브 지도 앱. React Native로 개발한 모바일 앱으로, 건물 검색, 경로 안내, 시설 정보를 제공합니다.',
    visibility: 'PUBLIC',
    status: 'in_progress',
    tags: ['React Native', 'Expo', 'TypeScript', 'MapBox'],
    githubRepo: 'https://github.com/wku-crew/campus-map',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-08T00:00:00Z',
    _count: { members: 3 },
  },
  {
    id: 'demo-3',
    name: 'Algorithm Study Tracker',
    slug: 'algo-tracker',
    description: '알고리즘 스터디 진행 상황 추적 도구. 백준, 프로그래머스 문제 풀이 기록을 자동 수집하고 스터디원 간 진행률을 비교합니다.',
    visibility: 'PUBLIC',
    status: 'in_progress',
    tags: ['Python', 'FastAPI', 'React', 'Redis'],
    githubRepo: 'https://github.com/wku-crew/algo-tracker',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-02-05T00:00:00Z',
    _count: { members: 5 },
  },
  {
    id: 'demo-4',
    name: 'DevLog CLI',
    slug: 'devlog-cli',
    description: '개발 로그를 터미널에서 간편하게 작성하고 관리하는 CLI 도구. Markdown 기반으로 작성하며 GitHub Pages로 자동 배포됩니다.',
    visibility: 'PUBLIC',
    status: 'completed',
    tags: ['Go', 'CLI', 'Markdown', 'GitHub Actions'],
    githubRepo: 'https://github.com/wku-crew/devlog-cli',
    createdAt: '2025-11-10T00:00:00Z',
    updatedAt: '2026-01-30T00:00:00Z',
    _count: { members: 2 },
  },
  {
    id: 'demo-5',
    name: 'Study Room Booking',
    slug: 'study-room-booking',
    description: '스터디룸 예약 시스템. 실시간 예약 현황 확인, QR 체크인, 사용 통계 대시보드를 제공합니다.',
    visibility: 'PUBLIC',
    status: 'planning',
    tags: ['Vue.js', 'Spring Boot', 'MySQL'],
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-09T00:00:00Z',
    _count: { members: 3 },
  },
  {
    id: 'demo-6',
    name: 'AI Chat Tutor',
    slug: 'ai-chat-tutor',
    description: 'LLM 기반 프로그래밍 학습 챗봇. 코드 리뷰, 에러 디버깅, 개념 설명을 대화형으로 제공하는 AI 튜터입니다.',
    visibility: 'PUBLIC',
    status: 'in_progress',
    tags: ['Python', 'LangChain', 'Next.js', 'OpenAI'],
    githubRepo: 'https://github.com/wku-crew/ai-tutor',
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    _count: { members: 4 },
  },
]

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

  // Use demo data when API is unavailable
  const isDemo = !!error || (!isLoading && !data)
  const projects = isDemo
    ? DEMO_PROJECTS.filter((p) => {
        if (selectedVisibility && p.visibility !== selectedVisibility) return false
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase()
          return (
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((tag) => tag.toLowerCase().includes(q))
          )
        }
        return true
      })
    : data?.data ?? []

  const totalCount = isDemo ? projects.length : data?.meta.total ?? 0

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      {isDemo && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t('projects.demoBanner')}
          </p>
        </div>
      )}

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
      {!isLoading && (
        <>
          {projects.length === 0 ? (
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
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {/* Project Count */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('projects.totalProjects', { count: totalCount })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
