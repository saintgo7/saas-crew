import { Suspense } from 'react'
import { CourseDetail } from '@/components/courses'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface CoursePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  // In production, you might want to fetch course data here for better SEO
  return {
    title: '코스 상세 | WKU Software Crew',
    description: '코스 정보와 커리큘럼을 확인하고 학습을 시작하세요',
  }
}

function CourseDetailLoading() {
  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          코스 정보를 불러오는 중...
        </p>
      </div>
    </div>
  )
}

export default function CoursePage({ params }: CoursePageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          코스 목록으로 돌아가기
        </Link>
      </div>

      {/* Course Detail */}
      <Suspense fallback={<CourseDetailLoading />}>
        <CourseDetail courseId={params.id} />
      </Suspense>
    </div>
  )
}
