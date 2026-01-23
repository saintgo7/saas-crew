'use client'

import { FileQuestion, Home, Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/**
 * Next.js App Router 404 Not Found Page
 *
 * This page is displayed when a user navigates to a route that doesn't exist.
 */
export default function NotFoundPage() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        {/* 404 Illustration */}
        <div className="relative mx-auto h-40 w-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-bold text-gray-200 dark:text-gray-700">
              404
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileQuestion className="h-20 w-20 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>

          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">
            Maybe you were looking for:
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Courses
            </Link>
            <Link
              href="/projects"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Projects
            </Link>
            <Link
              href="/community"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Community
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-800/50">
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <Search className="h-5 w-5" />
            <span>Try searching for what you need</span>
          </div>
          <div className="mt-3">
            <Link
              href="/community"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Search in Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
