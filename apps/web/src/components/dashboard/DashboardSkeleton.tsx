export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Widget Skeleton - Full Width */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview Skeleton - Full Width */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-300 dark:bg-gray-700" />
                <div className="mt-3 space-y-2">
                  <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XP Progress Widget Skeleton - 1/3 Width */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            {/* Header */}
            <div className="bg-gray-300 dark:bg-gray-700 p-4 h-24" />
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
              </div>
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed Skeleton - 2/3 Width */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Courses Widget Skeleton - Full Width */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                  </div>
                  <div className="h-9 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Projects Widget Skeleton - Full Width */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    </div>
                  </div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-3" />
                  <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-full mb-3" />
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
