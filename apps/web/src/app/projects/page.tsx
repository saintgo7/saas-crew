import { Suspense } from 'react'
import { ProjectList } from '@/components/projects'
import { Loader2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '프로젝트 | WKU Software Crew',
  description: '진행 중인 프로젝트를 탐색하고 팀에 참여하세요',
}

function ProjectsLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          프로젝트를 불러오는 중...
        </p>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          프로젝트
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          진행 중인 프로젝트를 탐색하고 팀에 참여하세요
        </p>
      </div>

      {/* Project List */}
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}
