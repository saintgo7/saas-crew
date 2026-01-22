'use client'

import Link from 'next/link'
import Image from 'next/image'
import { memo, useMemo } from 'react'
import { MessageSquare, Eye, CheckCircle2 } from 'lucide-react'
import type { Post } from '@/lib/api/types'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface PostCardProps {
  post: Post
}

/**
 * PostCard Component - Performance Optimized
 *
 * Optimizations applied:
 * 1. React.memo - prevents re-renders when parent updates but post data unchanged
 * 2. Next.js Image - automatic image optimization, lazy loading, proper sizing
 * 3. useMemo for date formatting - avoids recalculation on every render
 */
function PostCardComponent({ post }: PostCardProps) {
  // Memoize date formatting to prevent recalculation on re-renders
  const formattedDate = useMemo(
    () =>
      formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: ko,
      }),
    [post.createdAt]
  )

  // Memoize author initial to prevent recalculation
  const authorInitial = useMemo(
    () => post.author.name.charAt(0).toUpperCase(),
    [post.author.name]
  )

  return (
    <Link
      href={`/community/${post.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
      prefetch={false}
    >
      <div className="flex gap-4">
        {/* Vote Count */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-col items-center rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {post.votes}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              votes
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {post.title}
            {post.hasAcceptedAnswer && (
              <CheckCircle2 className="ml-2 inline-block h-5 w-5 text-green-600" />
            )}
          </h3>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {/* Author */}
            <div className="flex items-center gap-2">
              {post.author.profileImage ? (
                <Image
                  src={post.author.profileImage}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {authorInitial}
                </div>
              )}
              <span className="font-medium">{post.author.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Lv.{post.author.level}
              </span>
            </div>

            {/* Comments Count */}
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.commentsCount}</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views}</span>
            </div>

            {/* Time */}
            <span className="ml-auto">{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Export memoized component to prevent unnecessary re-renders
export const PostCard = memo(PostCardComponent)
