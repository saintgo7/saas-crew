import { PostForm } from '@/components/community'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '질문 작성 | WKU Software Crew',
  description: '커뮤니티에 질문을 작성하고 답변을 받아보세요',
}

export default function NewPostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          질문 작성
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          다른 개발자들에게 도움을 요청하세요
        </p>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <PostForm />
      </div>

      {/* Guidelines */}
      <div className="mx-auto mt-6 max-w-4xl rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
          좋은 질문을 작성하는 팁
        </h3>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <li>• 명확하고 구체적인 제목을 작성하세요</li>
          <li>• 문제 상황을 자세히 설명해주세요</li>
          <li>• 시도해본 해결 방법을 공유해주세요</li>
          <li>• 코드는 마크다운 코드 블록(```)을 사용하세요</li>
          <li>• 관련된 태그를 추가하여 적절한 답변자를 찾으세요</li>
        </ul>
      </div>
    </div>
  )
}
