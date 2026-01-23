import { CourseListSkeleton } from '@/components/ui/skeletons'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Courses Page Loading State
 *
 * Shows skeleton UI while the courses page is loading.
 */
export default function CoursesLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Course List Skeleton */}
      <CourseListSkeleton count={6} />
    </main>
  )
}
