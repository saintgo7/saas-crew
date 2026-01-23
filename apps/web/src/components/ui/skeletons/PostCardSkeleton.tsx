'use client'

import { cn } from '@/lib/utils'
import { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonText } from '../skeleton'

interface PostCardSkeletonProps {
  className?: string
}

/**
 * Skeleton component that matches PostCard layout
 */
export function PostCardSkeleton({ className }: PostCardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800',
        className
      )}
    >
      <div className="flex gap-4">
        {/* Vote Count Skeleton */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-col items-center rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
            <Skeleton className="h-6 w-8 bg-gray-200 dark:bg-gray-600" />
            <Skeleton className="mt-1 h-3 w-10 bg-gray-200 dark:bg-gray-600" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <Skeleton className="h-6 w-3/4" />

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <SkeletonBadge />
            <SkeletonBadge />
            <SkeletonBadge />
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-4">
            {/* Author */}
            <div className="flex items-center gap-2">
              <SkeletonAvatar size="sm" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>

            {/* Comments */}
            <Skeleton className="h-4 w-12" />

            {/* Views */}
            <Skeleton className="h-4 w-12" />

            {/* Time */}
            <Skeleton className="ml-auto h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Post list skeleton with search bar, filters, and cards
 */
export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* Filters Row Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Posts List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

/**
 * Post detail skeleton
 */
export function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Skeleton className="h-5 w-36" />

      {/* Post Content Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        {/* Title */}
        <Skeleton className="mb-4 h-8 w-3/4" />

        {/* Meta */}
        <div className="mb-6 flex items-center gap-4">
          <SkeletonAvatar size="md" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          <SkeletonBadge />
          <SkeletonBadge />
          <SkeletonBadge />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <SkeletonText lines={4} />
          <SkeletonText lines={3} />
          <SkeletonText lines={5} />
        </div>

        {/* Vote buttons */}
        <div className="mt-6 flex items-center gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Comments Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 border-b border-gray-100 pb-4 dark:border-gray-700">
              <SkeletonAvatar size="sm" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <SkeletonText lines={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
