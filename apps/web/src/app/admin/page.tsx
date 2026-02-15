'use client'

import { useQuery } from '@tanstack/react-query'
import { BookOpen, Users, FolderKanban, TrendingUp, Loader2 } from 'lucide-react'
import Link from 'next/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface AdminStats {
  stats: {
    users: number
    courses: number
    projects: number
    enrollments: number
  }
  recentUsers: Array<{
    id: string
    name: string
    email: string
    createdAt: string
  }>
  recentCourses: Array<{
    id: string
    title: string
    slug: string
    published: boolean
    createdAt: string
  }>
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
}

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    },
  })

  const stats = [
    {
      label: '총 코스',
      value: data?.stats.courses ?? 0,
      icon: BookOpen,
      href: '/admin/courses',
      color: 'blue',
    },
    {
      label: '총 사용자',
      value: data?.stats.users ?? 0,
      icon: Users,
      href: '/admin/users',
      color: 'green',
    },
    {
      label: '총 프로젝트',
      value: data?.stats.projects ?? 0,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'purple',
    },
    {
      label: '수강 중',
      value: data?.stats.enrollments ?? 0,
      icon: TrendingUp,
      href: '/admin/courses',
      color: 'orange',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          관리자 대시보드
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          CrewSpace 관리 페이지입니다
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          통계를 불러오려면 로그인이 필요합니다
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            최근 가입자
          </h2>
          {data?.recentUsers && data.recentUsers.length > 0 ? (
            <ul className="space-y-3">
              {data.recentUsers.map((user) => (
                <li key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              최근 가입자가 없습니다
            </p>
          )}
        </div>

        {/* Recent Courses */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            최근 코스
          </h2>
          {data?.recentCourses && data.recentCourses.length > 0 ? (
            <ul className="space-y-3">
              {data.recentCourses.map((course) => (
                <li key={course.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {course.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {course.published ? '공개' : '비공개'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(course.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              최근 코스가 없습니다
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          빠른 작업
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900 dark:text-white">
              새 코스 추가
            </span>
          </Link>
          <Link
            href="/admin/courses"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <BookOpen className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900 dark:text-white">
              코스 관리
            </span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <Users className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-900 dark:text-white">
              사용자 관리
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
