import { ProjectListSkeleton } from '@/components/ui/skeletons'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Projects Page Loading State
 *
 * Shows skeleton UI while the projects page is loading.
 */
export default function ProjectsLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Header Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-10 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Project List Skeleton */}
      <ProjectListSkeleton count={6} />
    </main>
  )
}
