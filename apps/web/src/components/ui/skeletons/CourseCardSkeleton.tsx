'use client'

import { cn } from '@/lib/utils'
import { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonText } from '../skeleton'

interface CourseCardSkeletonProps {
  className?: string
}

/**
 * Skeleton component that matches CourseCard layout
 */
export function CourseCardSkeleton({ className }: CourseCardSkeletonProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
        className
      )}
    >
      {/* Cover Image Skeleton */}
      <div className="relative h-48 w-full">
        <Skeleton className="h-full w-full rounded-none" />
        {/* Level Badge Skeleton */}
        <div className="absolute left-3 top-3">
          <SkeletonBadge />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Skeleton className="mb-2 h-6 w-3/4" />

        {/* Description */}
        <SkeletonText lines={2} className="mb-4" />

        {/* Meta Information */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          <SkeletonBadge />
          <SkeletonBadge />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <SkeletonAvatar size="sm" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}

/**
 * Course list skeleton with multiple cards
 */
export function CourseListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Filter Tabs Skeleton */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* Course Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
