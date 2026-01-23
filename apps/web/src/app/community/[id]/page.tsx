export const runtime = 'edge';

import { Suspense } from 'react'
import { PostDetailClient } from './PostDetailClient'
import { PostDetailLoading } from './PostDetailLoading'
import type { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: 'Post | WKU Software Crew',
    description: 'Community post',
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PostDetailLoading />}>
        <PostDetailClient postId={id} />
      </Suspense>
    </div>
  )
}
