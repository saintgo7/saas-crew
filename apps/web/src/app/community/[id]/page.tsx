import { Suspense } from 'react'
import { PostDetailClient } from './PostDetailClient'
import { Loader2 } from 'lucide-react'
import type { Metadata } from 'next'

interface PostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  // In a real app, you might fetch post data here for better SEO
  return {
    title: '게시글 | WKU Software Crew',
    description: '커뮤니티 게시글',
  }
}

function PostDetailLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          게시글을 불러오는 중...
        </p>
      </div>
    </div>
  )
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PostDetailLoading />}>
        <PostDetailClient postId={params.id} />
      </Suspense>
    </div>
  )
}
