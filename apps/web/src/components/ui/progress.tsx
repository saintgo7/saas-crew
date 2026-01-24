'use client'

import { HTMLAttributes, forwardRef } from 'react'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = '', value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={`relative h-4 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800 ${className}`}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-neutral-900 transition-all dark:bg-neutral-50"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    )
  },
)
Progress.displayName = 'Progress'
