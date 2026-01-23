'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  className?: string
  fullScreen?: boolean
  overlay?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
}

/**
 * Reusable Loading Spinner Component
 *
 * Usage:
 * <LoadingSpinner /> - Default spinner
 * <LoadingSpinner size="lg" message="Loading data..." />
 * <LoadingSpinner fullScreen /> - Centered full screen
 * <LoadingSpinner overlay /> - Overlay with backdrop
 */
export function LoadingSpinner({
  size = 'md',
  message,
  className,
  fullScreen = false,
  overlay = false,
}: LoadingSpinnerProps) {
  const spinnerContent = (
    <div className={cn('text-center', className)}>
      <Loader2
        className={cn(
          'animate-spin text-blue-600 dark:text-blue-400',
          sizeClasses[size],
          !fullScreen && 'mx-auto'
        )}
      />
      {message && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          {spinnerContent}
        </div>
      </div>
    )
  }

  if (fullScreen) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}

/**
 * Inline loading indicator for buttons and small areas
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
    </span>
  )
}

/**
 * Loading button state wrapper
 */
export function ButtonLoading({
  isLoading,
  loadingText = 'Loading...',
  children,
}: {
  isLoading: boolean
  loadingText?: string
  children: React.ReactNode
}) {
  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {loadingText}
      </span>
    )
  }

  return <>{children}</>
}
