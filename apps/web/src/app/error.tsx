'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Next.js App Router Error Page
 *
 * This component is rendered when an error occurs during rendering,
 * in a Server Component, or when an error is thrown.
 *
 * It provides a user-friendly error message and options to retry or navigate home.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error)
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
          Oops! Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          We encountered an unexpected error. Please try again or return to the home page.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Error ID: {error.digest}
          </p>
        )}

        {/* Error message in development */}
        {isDevelopment && error.message && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-left dark:bg-red-900/20">
            <div className="flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-200">
              <Bug className="h-4 w-4" />
              <span>Development Error Info</span>
            </div>
            <p className="mt-2 break-all text-sm text-red-700 dark:text-red-300">
              {error.message}
            </p>
            {error.stack && (
              <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap text-xs text-red-600 dark:text-red-400">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          If this problem persists, please{' '}
          <a
            href="mailto:support@crewspace.dev"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  )
}
