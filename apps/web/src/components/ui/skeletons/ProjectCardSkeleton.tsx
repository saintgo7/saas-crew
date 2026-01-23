'use client'

import { cn } from '@/lib/utils'
import { Skeleton, SkeletonBadge, SkeletonText } from '../skeleton'

interface ProjectCardSkeletonProps {
  className?: string
}

/**
 * Skeleton component that matches ProjectCard layout
 */
export function ProjectCardSkeleton({ className }: ProjectCardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800',
        className
      )}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-2">
          <SkeletonText lines={2} />
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        <SkeletonBadge />
        <SkeletonBadge />
        <SkeletonBadge />
      </div>

      {/* Links */}
      <div className="mb-4 flex items-center gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

/**
 * Project list skeleton with search bar, filters, and cards
 */
export function ProjectListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <Skeleton className="h-10 w-full rounded-lg" />

      {/* Filter Tabs Skeleton */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* Project Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
