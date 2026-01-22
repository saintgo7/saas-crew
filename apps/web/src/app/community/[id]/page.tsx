import { Suspense } from 'react'
import { PostDetailClient } from './PostDetailClient'
import { PostDetailLoading } from './PostDetailLoading'
import type { Metadata } from 'next'

interface PostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  return {
    title: 'Post | WKU Software Crew',
    description: 'Community post',
  }
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
