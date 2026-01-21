'use client'

import { useDashboard } from '@/lib/hooks/use-dashboard'
import { ProfileWidget } from '@/components/dashboard/ProfileWidget'
import { MyProjects } from '@/components/dashboard/MyProjects'
import { CourseProgress } from '@/components/dashboard/CourseProgress'
import { LevelProgress } from '@/components/dashboard/LevelProgress'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { AlertCircle } from 'lucide-react'

export function DashboardClient() {
  const { user, projects, courseProgress, levelProgress, isLoading, errors } = useDashboard()

  // Show loading state
  if (isLoading) {
    return <DashboardSkeleton />
  }

  // Show error state
  if (errors.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                데이터를 불러오는데 실패했습니다
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {errors.user instanceof Error ? errors.user.message : '알 수 없는 오류가 발생했습니다'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                로그인이 필요합니다
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                대시보드를 보려면 먼저 로그인해주세요
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Widget - Full Width */}
        <div className="lg:col-span-3">
          <ProfileWidget user={user} />
        </div>

        {/* Projects - 2/3 Width on Large Screens */}
        <div className="lg:col-span-2">
          <MyProjects projects={projects} />
        </div>

        {/* Level Progress - 1/3 Width on Large Screens */}
        <div>
          <LevelProgress levelProgress={levelProgress} />
        </div>

        {/* Course Progress - Full Width */}
        <div className="lg:col-span-3">
          <CourseProgress courses={courseProgress} />
        </div>
      </div>
    </div>
  )
}
