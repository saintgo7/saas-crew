'use client'

import { AlertCircle, RefreshCw, WifiOff, ServerOff, ShieldOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type ErrorType = 'network' | 'server' | 'unauthorized' | 'notFound' | 'generic'

interface ApiErrorProps {
  /** Error object or message */
  error?: Error | string | null
  /** Custom title */
  title?: string
  /** Custom message */
  message?: string
  /** Error type for specific icons and styling */
  type?: ErrorType
  /** Retry callback */
  onRetry?: () => void
  /** Retry button loading state */
  isRetrying?: boolean
  /** Additional CSS classes */
  className?: string
  /** Compact variant for inline errors */
  compact?: boolean
}

/**
 * API Error Display Component
 *
 * Displays user-friendly error messages with retry functionality.
 * Adapts appearance based on error type.
 */
export function ApiError({
  error,
  title,
  message,
  type = 'generic',
  onRetry,
  isRetrying = false,
  className,
  compact = false,
}: ApiErrorProps) {
  const errorMessage =
    message || (error instanceof Error ? error.message : error) || getDefaultMessage(type)

  const errorTitle = title || getDefaultTitle(type)
  const Icon = getIcon(type)

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm dark:border-red-800 dark:bg-red-900/20',
          className
        )}
      >
        <Icon className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
        <span className="text-red-700 dark:text-red-300">{errorMessage}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="ml-auto flex-shrink-0 text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
          >
            <RefreshCw
              className={cn('h-4 w-4', isRetrying && 'animate-spin')}
            />
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
          <Icon className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 dark:text-red-100">
            {errorTitle}
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {errorMessage}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
            >
              <RefreshCw
                className={cn('h-4 w-4', isRetrying && 'animate-spin')}
              />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function getIcon(type: ErrorType) {
  switch (type) {
    case 'network':
      return WifiOff
    case 'server':
      return ServerOff
    case 'unauthorized':
      return ShieldOff
    default:
      return AlertCircle
  }
}

function getDefaultTitle(type: ErrorType): string {
  switch (type) {
    case 'network':
      return 'Connection Error'
    case 'server':
      return 'Server Error'
    case 'unauthorized':
      return 'Access Denied'
    case 'notFound':
      return 'Not Found'
    default:
      return 'Something went wrong'
  }
}

function getDefaultMessage(type: ErrorType): string {
  switch (type) {
    case 'network':
      return 'Unable to connect. Please check your internet connection and try again.'
    case 'server':
      return 'The server encountered an error. Please try again later.'
    case 'unauthorized':
      return 'You do not have permission to access this resource. Please log in or contact support.'
    case 'notFound':
      return 'The requested resource could not be found.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

/**
 * Inline error message for form fields
 */
export function InlineError({
  message,
  className,
}: {
  message?: string
  className?: string
}) {
  if (!message) return null

  return (
    <p
      className={cn(
        'mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400',
        className
      )}
    >
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  )
}

/**
 * Empty state component for when data is not available
 */
export function EmptyState({
  title,
  message,
  icon: Icon = AlertCircle,
  action,
  className,
}: {
  title: string
  message?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50',
        className
      )}
    >
      <Icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
      <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      {message && (
        <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
