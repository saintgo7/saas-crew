import { PostDetailSkeleton } from '@/components/ui/skeletons'

/**
 * Community Post Detail Page Loading State
 */
export default function PostDetailLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <PostDetailSkeleton />
    </main>
  )
}
