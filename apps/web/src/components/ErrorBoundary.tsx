'use client'

import React, { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  isDetailsOpen: boolean
}

/**
 * React Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * With custom fallback:
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsOpen: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsOpen: false,
    })
  }

  toggleDetails = () => {
    this.setState((state) => ({ isDetailsOpen: !state.isDetailsOpen }))
  }

  render() {
    const { hasError, error, errorInfo, isDetailsOpen } = this.state
    const { children, fallback, showDetails = process.env.NODE_ENV === 'development' } = this.props

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Default fallback UI
      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <div className="w-full max-w-lg rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/50">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-600 dark:text-red-400" />

            <h2 className="mt-4 text-xl font-semibold text-red-900 dark:text-red-100">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error?.message || 'An unexpected error occurred'}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </div>

            {/* Error details (development mode) */}
            {showDetails && error && (
              <div className="mt-6 text-left">
                <button
                  onClick={this.toggleDetails}
                  className="flex w-full items-center justify-between rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-900 transition-colors hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900"
                >
                  <span>Error Details</span>
                  {isDetailsOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {isDetailsOpen && (
                  <div className="mt-2 max-h-48 overflow-auto rounded-lg bg-red-100 p-4 dark:bg-red-900/50">
                    <pre className="whitespace-pre-wrap text-xs text-red-900 dark:text-red-200">
                      <strong>Error:</strong> {error.message}
                      {'\n\n'}
                      <strong>Stack:</strong>
                      {'\n'}
                      {error.stack}
                      {errorInfo && (
                        <>
                          {'\n\n'}
                          <strong>Component Stack:</strong>
                          {'\n'}
                          {errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }

    return children
  }
}

/**
 * Hook-based error boundary wrapper for functional components
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`

  return ComponentWithErrorBoundary
}

export default ErrorBoundary
