import { Suspense } from 'react'
import { CourseList } from '@/components/courses'
import { Loader2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '코스 목록 | WKU Software Crew',
  description: 'Junior, Senior, Master 레벨별 코스를 탐색하고 수강 신청하세요',
}

function CoursesLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          코스를 불러오는 중...
        </p>
      </div>
    </div>
  )
}

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          코스 목록
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          실력 향상을 위한 다양한 코스를 탐색하고 학습하세요
        </p>
      </div>

      {/* Course List */}
      <Suspense fallback={<CoursesLoading />}>
        <CourseList />
      </Suspense>
    </div>
  )
}
