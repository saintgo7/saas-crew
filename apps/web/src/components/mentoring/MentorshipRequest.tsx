'use client'

import { User as UserIcon, Award, Check, X, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/LanguageContext'
import type { MentorshipRequest as MentorshipRequestType, UserRank } from '@/lib/api/types'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { useLanguage } from '@/i18n/LanguageContext'

interface MentorshipRequestProps {
  request: MentorshipRequestType
  variant: 'incoming' | 'outgoing'
  onAccept?: () => void
  onReject?: () => void
  onCancel?: () => void
  isAccepting?: boolean
  isRejecting?: boolean
  isCancelling?: boolean
}

function getRankBadgeStyles(rank: UserRank): { bg: string; text: string; border: string } {
  switch (rank) {
    case 'JUNIOR':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-800',
      }
    case 'SENIOR':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
      }
    case 'MASTER':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-800',
      }
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-700',
      }
  }
}

function getRankLabel(rank: UserRank): string {
  switch (rank) {
    case 'JUNIOR':
      return 'Junior'
    case 'SENIOR':
      return 'Senior'
    case 'MASTER':
      return 'Master'
    default:
      return rank
  }
}

export function MentorshipRequest({
  request,
  variant,
  onAccept,
  onReject,
  onCancel,
  isAccepting = false,
  isRejecting = false,
  isCancelling = false,
}: MentorshipRequestProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS

  // For incoming requests, show mentee info; for outgoing, show mentor info
  const person = variant === 'incoming' ? request.mentee : request.mentor
  const rankStyles = getRankBadgeStyles(person.rank)

  const isLoading = isAccepting || isRejecting || isCancelling

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-sm dark:border-yellow-800 dark:bg-yellow-900/20">
      {/* Header with direction indicator */}
      <div className="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>
            {formatDistanceToNow(new Date(request.createdAt), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
            variant === 'incoming'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
          }`}
        >
          {variant === 'incoming' ? (
            <>
              <ArrowRight className="h-3 w-3 rotate-180" />
              {t('mentoring.incomingRequest')}
            </>
          ) : (
            <>
              <ArrowRight className="h-3 w-3" />
              {t('mentoring.outgoingRequest')}
            </>
          )}
        </span>
      </div>

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {person.profileImage ? (
            <img
              src={person.profileImage}
              alt={person.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-gray-100 dark:ring-gray-700">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
          )}
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white shadow">
            {person.level}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-semibold text-gray-900 dark:text-white">
              {person.name}
            </h4>
            {/* Rank Badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${rankStyles.bg} ${rankStyles.text} ${rankStyles.border}`}
            >
              <Award className="h-3 w-3" />
              {getRankLabel(person.rank)}
            </span>
          </div>

          {/* Message */}
          {request.message && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              &quot;{request.message}&quot;
            </p>
          )}

          {/* Status */}
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
              <Clock className="h-3 w-3" />
              {t('mentoring.status.pending')}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {variant === 'incoming' && (
          <>
            {onAccept && (
              <Button
                onClick={onAccept}
                disabled={isLoading}
                variant="default"
                size="sm"
                className="flex-1"
              >
                <Check className="mr-1 h-4 w-4" />
                {t('mentoring.accept')}
              </Button>
            )}
            {onReject && (
              <Button
                onClick={onReject}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <X className="mr-1 h-4 w-4" />
                {t('mentoring.reject')}
              </Button>
            )}
          </>
        )}
        {variant === 'outgoing' && onCancel && (
          <Button
            onClick={onCancel}
            disabled={isLoading}
            variant="destructive"
            size="sm"
            className="flex-1"
          >
            <X className="mr-1 h-4 w-4" />
            {t('mentoring.cancelRequest')}
          </Button>
        )}
      </div>
    </div>
  )
}
