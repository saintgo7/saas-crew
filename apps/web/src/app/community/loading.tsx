import { PostListSkeleton } from '@/components/ui/skeletons'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Community Page Loading State
 *
 * Shows skeleton UI while the community page is loading.
 */
export default function CommunityLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Header Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-10 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      {/* Post List Skeleton */}
      <PostListSkeleton count={5} />
    </main>
  )
}
