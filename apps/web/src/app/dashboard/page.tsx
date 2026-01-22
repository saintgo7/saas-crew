import { Suspense } from 'react'
import { DashboardClient } from './DashboardClient'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | WKU Software Crew',
  description: 'Check your profile, projects, and course progress',
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient />
    </Suspense>
  )
}
