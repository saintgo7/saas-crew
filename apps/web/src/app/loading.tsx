import { Loader2 } from 'lucide-react'

/**
 * Global Loading Component
 *
 * This component is displayed during route navigation while the page is loading.
 * It provides a centered spinner with subtle animation.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  )
}
