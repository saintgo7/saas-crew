import { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonText } from '@/components/ui/skeleton'

/**
 * Course Detail Page Loading State
 */
export default function CourseDetailLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Skeleton className="mb-6 h-5 w-40" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            {/* Cover Image */}
            <Skeleton className="mb-6 h-64 w-full rounded-lg" />

            {/* Level Badge */}
            <div className="mb-4">
              <SkeletonBadge />
            </div>

            {/* Title */}
            <Skeleton className="mb-4 h-8 w-3/4" />

            {/* Description */}
            <SkeletonText lines={3} className="mb-6" />

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <SkeletonAvatar size="md" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Chapters Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <Skeleton className="mb-4 h-6 w-32" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <Skeleton className="mb-4 h-10 w-full rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Progress Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <Skeleton className="mb-4 h-6 w-24" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="mt-2 h-4 w-20" />
          </div>

          {/* Tags */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <Skeleton className="mb-4 h-6 w-16" />
            <div className="flex flex-wrap gap-2">
              <SkeletonBadge />
              <SkeletonBadge />
              <SkeletonBadge />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
