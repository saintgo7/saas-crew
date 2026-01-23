'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import { ProfileWidget } from '@/components/dashboard/ProfileWidget'
import { XPProgressWidget } from '@/components/dashboard/XPProgressWidget'
import { ActivityFeedWidget } from '@/components/dashboard/ActivityFeedWidget'
import { MyCoursesWidget } from '@/components/dashboard/MyCoursesWidget'
import { MyProjectsWidget } from '@/components/dashboard/MyProjectsWidget'
import { StatsOverviewWidget } from '@/components/dashboard/StatsOverviewWidget'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

export function DashboardClient() {
  const {
    user,
    projects,
    courseProgress,
    levelProgress,
    activities,
    stats,
    isLoading,
    errors,
  } = useDashboard()
  const t = useTranslations()
  const router = useRouter()

  // Check if error is unauthorized (401)
  const isUnauthorized = (error: unknown): boolean => {
    if (!error) return false
    // Check for ApiError with status property
    if (error && typeof error === 'object' && 'status' in error) {
      return (error as { status: number }).status === 401
    }
    // Fallback to message check
    const message = error instanceof Error ? error.message : ''
    return message.toLowerCase().includes('unauthorized') || message.includes('401')
  }

  // Redirect to login if unauthorized
  useEffect(() => {
    if (errors.user && isUnauthorized(errors.user)) {
      localStorage.removeItem('auth_token')
      router.push('/auth/login')
    }
  }, [errors.user, router])

  // Show loading state
  if (isLoading) {
    return <DashboardSkeleton />
  }

  // Redirect for unauthorized errors (handled by useEffect, show loading while redirecting)
  if (errors.user) {
    if (isUnauthorized(errors.user)) {
      return <DashboardSkeleton />
    }

    // Show error state for other errors
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                {t('common.error')}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {errors.user instanceof Error ? errors.user.message : t('common.error')}
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
                {t('common.login')}
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                {t('auth.login.subtitle')}
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

        {/* Stats Overview - Full Width */}
        <div className="lg:col-span-3">
          <StatsOverviewWidget stats={stats} />
        </div>

        {/* XP Progress Widget - 1/3 Width on Large Screens */}
        <div className="lg:col-span-1">
          <XPProgressWidget levelProgress={levelProgress} rank={user.rank} />
        </div>

        {/* Activity Feed - 2/3 Width on Large Screens */}
        <div className="lg:col-span-2">
          <ActivityFeedWidget activities={activities} />
        </div>

        {/* My Courses Widget - Full Width */}
        <div className="lg:col-span-3">
          <MyCoursesWidget courses={courseProgress} maxCourses={4} />
        </div>

        {/* My Projects Widget - Full Width */}
        <div className="lg:col-span-3">
          <MyProjectsWidget projects={projects} maxProjects={4} />
        </div>
      </div>
    </div>
  )
}
