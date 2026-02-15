'use client'

import Link from 'next/link'
import Image from 'next/image'
import { memo, useMemo } from 'react'
import { MessageSquare, Eye, CheckCircle2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { useLanguage } from '@/i18n/LanguageContext'
import { TagBadge } from './TagBadge'
import { BountyBadge } from './BountyBadge'
import type { Question } from '@/lib/api/qna-types'

interface QuestionCardProps {
  question: Question
  onTagClick?: (tag: string) => void
}

/**
 * QuestionCard Component - Performance Optimized
 *
 * Optimizations applied:
 * 1. React.memo - prevents re-renders when parent updates but question data unchanged
 * 2. Next.js Image - automatic image optimization, lazy loading, proper sizing
 * 3. useMemo for date formatting - avoids recalculation on every render
 */
function QuestionCardComponent({ question, onTagClick }: QuestionCardProps) {
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  // Memoize date formatting to prevent recalculation on re-renders
  const formattedDate = useMemo(
    () =>
      formatDistanceToNow(new Date(question.createdAt), {
        addSuffix: true,
        locale: dateLocale,
      }),
    [question.createdAt, dateLocale]
  )

  // Memoize author initial to prevent recalculation
  const authorInitial = useMemo(
    () => question.author.name.charAt(0).toUpperCase(),
    [question.author.name]
  )

  // Determine status styling
  const getStatusColor = () => {
    if (question.hasAcceptedAnswer) {
      return 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
    }
    if (question.answersCount > 0) {
      return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    }
    return 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }

  return (
    <Link
      href={`/qna/${question.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
      prefetch={false}
    >
      <div className="flex gap-4">
        {/* Stats Column */}
        <div className="flex flex-col items-center gap-2">
          {/* Vote Count */}
          <div className="flex flex-col items-center rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {question.votes}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">votes</span>
          </div>

          {/* Answer Count */}
          <div
            className={`flex flex-col items-center rounded-lg border px-3 py-2 ${getStatusColor()}`}
          >
            <span className="text-lg font-semibold">{question.answersCount}</span>
            <span className="text-xs">answers</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Eye className="h-3 w-3" />
            <span>{question.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Title with status icon */}
          <div className="flex items-start gap-2">
            <h3 className="flex-1 text-lg font-semibold text-gray-900 dark:text-white">
              {question.title}
            </h3>
            {question.hasAcceptedAnswer && (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
            )}
          </div>

          {/* Bounty Badge */}
          {question.bounty && question.bounty > 0 && (
            <BountyBadge
              amount={question.bounty}
              expiresAt={question.bountyExpiresAt}
              size="sm"
            />
          )}

          {/* Tags */}
          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  size="sm"
                  onClick={onTagClick ? () => onTagClick(tag) : undefined}
                />
              ))}
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {/* Author */}
            <div className="flex items-center gap-2">
              {question.author.profileImage ? (
                <Image
                  src={question.author.profileImage}
                  alt={question.author.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                  {authorInitial}
                </div>
              )}
              <span className="font-medium">{question.author.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Lv.{question.author.level}
              </span>
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
export const QuestionCard = memo(QuestionCardComponent)
