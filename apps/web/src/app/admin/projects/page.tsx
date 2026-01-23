'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Search, Folder, ExternalLink, Github } from 'lucide-react'
import { cn } from '@/lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface Project {
  id: string
  name: string
  slug: string
  description: string
  visibility: string
  status: string
  githubRepo?: string
  deployUrl?: string
  createdAt: string
  _count?: {
    members: number
  }
}

const statusColors: Record<string, string> = {
  planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
}

const statusLabels: Record<string, string> = {
  planning: '계획중',
  in_progress: '진행중',
  completed: '완료',
  archived: '보관됨',
}

export default function AdminProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/projects?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    },
  })

  const projects: Project[] = data?.data || []

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          프로젝트 관리
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          등록된 프로젝트를 조회하고 관리할 수 있습니다
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="프로젝트 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">모든 상태</option>
          <option value="planning">계획중</option>
          <option value="in_progress">진행중</option>
          <option value="completed">완료</option>
          <option value="archived">보관됨</option>
        </select>
      </div>

      {/* Project List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          프로젝트를 불러오는데 실패했습니다
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
              <Folder className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-500">프로젝트가 없습니다</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2 py-1 text-xs font-medium',
                      statusColors[project.status] || statusColors.planning
                    )}
                  >
                    {statusLabels[project.status] || project.status}
                  </span>
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{project._count?.members || 0}명 참여</span>
                  <div className="flex items-center gap-2">
                    {project.githubRepo && (
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.deployUrl && (
                      <a
                        href={project.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        총 {filteredProjects.length}개의 프로젝트
      </div>
    </div>
  )
}
