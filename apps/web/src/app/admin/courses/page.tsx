'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  Video,
  MoreVertical,
  Eye,
  EyeOff,
} from 'lucide-react'
import { coursesApi } from '@/lib/api/courses'
import type { Course, CourseLevel } from '@/lib/api/types'
import { cn } from '@/lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const levelColors: Record<CourseLevel, string> = {
  JUNIOR: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  SENIOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  MASTER: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
}

const categoryLabels: Record<string, string> = {
  FRONTEND: '프론트엔드',
  BACKEND: '백엔드',
  DATABASE: '데이터베이스',
}

export default function AdminCoursesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<CourseLevel | ''>('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-courses', levelFilter, categoryFilter],
    queryFn: () =>
      coursesApi.getCourses({
        level: levelFilter || undefined,
        category: categoryFilter as any || undefined,
        pageSize: 100,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete course')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] })
      setDeleteConfirm(null)
    },
  })

  const togglePublishMutation = useMutation({
    mutationFn: async ({ courseId, published }: { courseId: string; published: boolean }) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published }),
      })
      if (!res.ok) throw new Error('Failed to update course')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] })
    },
  })

  const filteredCourses = data?.courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            코스 관리
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            교육 코스를 추가, 수정, 삭제할 수 있습니다
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          새 코스 추가
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="코스 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Level Filter */}
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as CourseLevel | '')}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">모든 레벨</option>
          <option value="JUNIOR">Junior</option>
          <option value="SENIOR">Senior</option>
          <option value="MASTER">Master</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">모든 카테고리</option>
          <option value="FRONTEND">프론트엔드</option>
          <option value="BACKEND">백엔드</option>
          <option value="DATABASE">데이터베이스</option>
        </select>
      </div>

      {/* Course List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          코스를 불러오는데 실패했습니다
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  코스
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">
                  카테고리
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                  레벨
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                  챕터
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  상태
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    코스가 없습니다
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {course.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {course.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {categoryLabels[course.category || ''] || '-'}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell">
                      <span className={cn('rounded-full px-2 py-1 text-xs font-medium', levelColors[course.level])}>
                        {course.level}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {course._count?.chapters || 0}개
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => togglePublishMutation.mutate({
                          courseId: course.id,
                          published: !course.published,
                        })}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                          course.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        )}
                      >
                        {course.published ? (
                          <>
                            <Eye className="h-3 w-3" /> 공개
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" /> 비공개
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/courses/${course.id}/chapters`}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                          title="챕터 관리"
                        >
                          <Video className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/courses/${course.id}/edit`}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                          title="수정"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(course.id)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700"
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              코스 삭제
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              정말로 이 코스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        총 {filteredCourses.length}개의 코스
      </div>
    </div>
  )
}
