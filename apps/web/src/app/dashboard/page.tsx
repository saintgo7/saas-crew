import { Suspense } from 'react'
import { DashboardClient } from './DashboardClient'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '대시보드 | WKU Software Crew',
  description: '내 프로필, 프로젝트, 코스 진행 상황을 확인하세요',
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient />
    </Suspense>
  )
}
