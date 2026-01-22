import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function ProjectNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <FileQuestion className="mx-auto h-16 w-16 text-gray-400" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          프로젝트를 찾을 수 없습니다
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          요청하신 프로젝트가 존재하지 않거나 삭제되었습니다.
        </p>
        <div className="mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            프로젝트 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
