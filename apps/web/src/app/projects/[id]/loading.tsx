import { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonText } from '@/components/ui/skeleton'

/**
 * Project Detail Page Loading State
 */
export default function ProjectDetailLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Skeleton className="mb-6 h-5 w-48" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Description */}
            <SkeletonText lines={4} className="mb-6" />

            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              <SkeletonBadge />
              <SkeletonBadge />
              <SkeletonBadge />
              <SkeletonBadge />
            </div>

            {/* Tech Stack */}
            <div className="mb-6">
              <Skeleton className="mb-2 h-5 w-24" />
              <div className="flex flex-wrap gap-2">
                <SkeletonBadge />
                <SkeletonBadge />
                <SkeletonBadge />
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 border-t border-gray-100 pt-6 dark:border-gray-700">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>

          {/* README/Description Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <Skeleton className="mb-4 h-6 w-32" />
            <SkeletonText lines={6} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <Skeleton className="mb-4 h-6 w-32" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          {/* Members Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <Skeleton className="mb-4 h-6 w-24" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonAvatar size="sm" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-1 h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
