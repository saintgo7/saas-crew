'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

/**
 * Base Skeleton component for loading states
 * Uses CSS animation for smooth pulse effect
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
    />
  )
}

/**
 * Text line skeleton - simulates text content
 */
export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-4/5' : 'w-full')}
        />
      ))}
    </div>
  )
}

/**
 * Avatar skeleton - circular shape for profile images
 */
export function SkeletonAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  }

  return (
    <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />
  )
}

/**
 * Card skeleton - for card-based layouts
 */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800',
        className
      )}
    >
      <Skeleton className="mb-4 h-48 w-full" />
      <Skeleton className="mb-2 h-6 w-3/4" />
      <SkeletonText lines={2} className="mb-4" />
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="sm" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

/**
 * Button skeleton
 */
export function SkeletonButton({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-28',
    lg: 'h-12 w-36',
  }

  return (
    <Skeleton
      className={cn('rounded-md', sizeClasses[size], className)}
    />
  )
}

/**
 * Input field skeleton
 */
export function SkeletonInput({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-full rounded-lg', className)} />
}

/**
 * Badge/Tag skeleton
 */
export function SkeletonBadge({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-6 w-16 rounded-full', className)} />
}

/**
 * Table row skeleton
 */
export function SkeletonTableRow({
  columns = 4,
  className,
}: {
  columns?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 border-b border-gray-200 py-4 dark:border-gray-700',
        className
      )}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === 0 ? 'w-1/4' : 'flex-1')}
        />
      ))}
    </div>
  )
}
