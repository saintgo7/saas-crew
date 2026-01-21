export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Widget Skeleton */}
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

        {/* Projects Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-3" />
                  <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Level Progress Skeleton */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6" />
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="space-y-4">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        </div>

        {/* Course Progress Skeleton */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3" />
                  <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
