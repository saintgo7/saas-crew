'use client'

import { User as UserIcon, MessageCircle, Star, Award, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/LanguageContext'
import type { MentorInfo, Mentorship, UserRank } from '@/lib/api/types'

interface MentorCardProps {
  mentor: MentorInfo | Mentorship
  variant: 'available' | 'active'
  onRequest?: () => void
  onMessage?: () => void
  isLoading?: boolean
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

function isMentorship(item: MentorInfo | Mentorship): item is Mentorship {
  return 'mentor' in item
}

export function MentorCard({
  mentor,
  variant,
  onRequest,
  onMessage,
  isLoading = false,
}: MentorCardProps) {
  const t = useTranslations()

  // Extract mentor info based on whether it's a MentorInfo or Mentorship
  const mentorInfo: MentorInfo = isMentorship(mentor) ? mentor.mentor : mentor
  const sessionsCount = isMentorship(mentor) ? mentor.sessionsCount : mentorInfo.sessionsCount

  const rankStyles = getRankBadgeStyles(mentorInfo.rank)

  // Render star rating
  const renderRating = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
          }`}
        />
      )
    }
    return stars
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {mentorInfo.profileImage ? (
            <img
              src={mentorInfo.profileImage}
              alt={mentorInfo.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-gray-100 dark:ring-gray-700">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
          )}
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white shadow">
            {mentorInfo.level}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
              {mentorInfo.name}
            </h3>
            {/* Rank Badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${rankStyles.bg} ${rankStyles.text} ${rankStyles.border}`}
            >
              <Award className="h-3 w-3" />
              {getRankLabel(mentorInfo.rank)}
            </span>
          </div>

          {/* Bio */}
          {mentorInfo.bio && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {mentorInfo.bio}
            </p>
          )}

          {/* Expertise Tags */}
          {mentorInfo.expertise && mentorInfo.expertise.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {mentorInfo.expertise.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
              {mentorInfo.expertise.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  +{mentorInfo.expertise.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {sessionsCount} {t('mentoring.sessions')}
              </span>
            </div>
            {variant === 'available' && mentorInfo.totalRatings > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex">{renderRating(Math.round(mentorInfo.averageRating))}</div>
                <span className="text-gray-400">({mentorInfo.totalRatings})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {variant === 'available' && onRequest && (
          <Button
            onClick={onRequest}
            disabled={isLoading}
            className="flex-1"
            variant="default"
          >
            <Users className="mr-2 h-4 w-4" />
            {t('mentoring.requestMentor')}
          </Button>
        )}
        {variant === 'active' && onMessage && (
          <Button
            onClick={onMessage}
            className="flex-1"
            variant="outline"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t('mentoring.message')}
          </Button>
        )}
      </div>
    </div>
  )
}
