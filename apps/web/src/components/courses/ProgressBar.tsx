'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress?: number | null
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressBar({
  progress,
  className,
  showLabel = true,
  size = 'md',
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress ?? 0, 0), 100)

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
          heights[size]
        )}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{clampedProgress.toFixed(0)}%</span>
        </div>
      )}
    </div>
  )
}
