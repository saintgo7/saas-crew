'use client'

import { User as UserIcon, Award, Users, ClipboardCheck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/LanguageContext'
import type { Mentorship, UserRank } from '@/lib/api/types'

interface MenteeCardProps {
  mentorship: Mentorship
  onRecordSession?: () => void
  onComplete?: () => void
  isRecordingSession?: boolean
  isCompleting?: boolean
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

export function MenteeCard({
  mentorship,
  onRecordSession,
  onComplete,
  isRecordingSession = false,
  isCompleting = false,
}: MenteeCardProps) {
  const t = useTranslations()
  const mentee = mentorship.mentee
  const rankStyles = getRankBadgeStyles(mentee.rank)

  // Check if mentorship can be completed (at least 1 session)
  const canComplete = mentorship.sessionsCount >= 1

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {mentee.profileImage ? (
            <img
              src={mentee.profileImage}
              alt={mentee.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-600 ring-2 ring-gray-100 dark:ring-gray-700">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
          )}
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white shadow">
            {mentee.level}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
              {mentee.name}
            </h3>
            {/* Rank Badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${rankStyles.bg} ${rankStyles.text} ${rankStyles.border}`}
            >
              <Award className="h-3 w-3" />
              {getRankLabel(mentee.rank)}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {mentorship.sessionsCount} {t('mentoring.sessions')}
              </span>
            </div>
            {mentorship.startedAt && (
              <div className="text-xs">
                {t('mentoring.startedAt')}{' '}
                {new Date(mentorship.startedAt).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                mentorship.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : mentorship.status === 'COMPLETED'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {mentorship.status === 'ACTIVE'
                ? t('mentoring.status.active')
                : mentorship.status === 'COMPLETED'
                ? t('mentoring.status.completed')
                : mentorship.status}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {mentorship.status === 'ACTIVE' && (
        <div className="mt-4 flex gap-2">
          {onRecordSession && (
            <Button
              onClick={onRecordSession}
              disabled={isRecordingSession}
              variant="outline"
              className="flex-1"
            >
              <ClipboardCheck className="mr-2 h-4 w-4" />
              {t('mentoring.recordSession')}
            </Button>
          )}
          {onComplete && (
            <Button
              onClick={onComplete}
              disabled={isCompleting || !canComplete}
              variant="default"
              className="flex-1"
              title={!canComplete ? t('mentoring.needAtLeastOneSession') : ''}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {t('mentoring.complete')}
            </Button>
          )}
        </div>
      )}

      {/* Completed State */}
      {mentorship.status === 'COMPLETED' && mentorship.completedAt && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <span>
              {t('mentoring.completedOn')}{' '}
              {new Date(mentorship.completedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
