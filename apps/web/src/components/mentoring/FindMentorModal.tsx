'use client'

import { useState } from 'react'
import { Search, X, User as UserIcon, Award, Star, Users, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/LanguageContext'
import { useAvailableMentors, useRequestMentorship } from '@/lib/hooks'
import type { MentorInfo, UserRank } from '@/lib/api/types'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface FindMentorModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
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

interface MentorListItemProps {
  mentor: MentorInfo
  onRequest: (mentor: MentorInfo) => void
  isRequesting: boolean
  selectedMentorId: string | null
}

function MentorListItem({ mentor, onRequest, isRequesting, selectedMentorId }: MentorListItemProps) {
  const t = useTranslations()
  const rankStyles = getRankBadgeStyles(mentor.rank)
  const isSelected = selectedMentorId === mentor.id

  // Render star rating
  const renderRating = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3 w-3 ${
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
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {mentor.profileImage ? (
          <img
            src={mentor.profileImage}
            alt={mentor.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white shadow">
          {mentor.level}
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-semibold text-gray-900 dark:text-white">
            {mentor.name}
          </h4>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${rankStyles.bg} ${rankStyles.text} ${rankStyles.border}`}
          >
            <Award className="h-3 w-3" />
            {getRankLabel(mentor.rank)}
          </span>
        </div>

        {mentor.bio && (
          <p className="mt-1 line-clamp-1 text-sm text-gray-600 dark:text-gray-400">
            {mentor.bio}
          </p>
        )}

        {/* Stats */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{mentor.sessionsCount} {t('mentoring.sessions')}</span>
          </div>
          {mentor.totalRatings > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">{renderRating(Math.round(mentor.averageRating))}</div>
              <span>({mentor.totalRatings})</span>
            </div>
          )}
        </div>

        {/* Expertise Tags */}
        {mentor.expertise && mentor.expertise.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {mentor.expertise.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Request Button */}
      <Button
        onClick={() => onRequest(mentor)}
        disabled={isRequesting && isSelected}
        size="sm"
        variant="default"
      >
        {isRequesting && isSelected ? (
          <LoadingSpinner size="sm" />
        ) : (
          t('mentoring.request')
        )}
      </Button>
    </div>
  )
}

export function FindMentorModal({ isOpen, onClose, onSuccess }: FindMentorModalProps) {
  const t = useTranslations()
  const [expertiseFilter, setExpertiseFilter] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null)
  const [requestMessage, setRequestMessage] = useState('')
  const [showMessageInput, setShowMessageInput] = useState(false)
  const [mentorToRequest, setMentorToRequest] = useState<MentorInfo | null>(null)

  const { data: mentorsData, isLoading: isLoadingMentors } = useAvailableMentors({
    expertise: expertiseFilter || undefined,
  })

  const requestMentorship = useRequestMentorship()

  // Derive expertise tags from available mentors since backend doesn't have a dedicated endpoint
  const expertiseTags = (() => {
    const mentors = mentorsData?.mentors || []
    const tagSet = new Set<string>()
    mentors.forEach((mentor) => {
      mentor.expertise?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })()

  const handleRequestMentor = (mentor: MentorInfo) => {
    setMentorToRequest(mentor)
    setSelectedMentorId(mentor.id)
    setShowMessageInput(true)
  }

  const handleConfirmRequest = async () => {
    if (!mentorToRequest) return

    try {
      await requestMentorship.mutateAsync({
        mentorId: mentorToRequest.id,
        message: requestMessage.trim() || undefined,
      })
      setShowMessageInput(false)
      setRequestMessage('')
      setMentorToRequest(null)
      setSelectedMentorId(null)
      onSuccess?.()
      onClose()
    } catch {
      // Error handling is done in the mutation
    }
  }

  const handleClose = () => {
    setExpertiseFilter('')
    setShowFilters(false)
    setShowMessageInput(false)
    setRequestMessage('')
    setMentorToRequest(null)
    setSelectedMentorId(null)
    onClose()
  }

  if (!isOpen) return null

  const mentors = mentorsData?.mentors || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('mentoring.findMentor')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('mentoring.findMentorDescription')}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('mentoring.searchMentors')}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="icon"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Expertise Filter */}
          {showFilters && expertiseTags.length > 0 && (
            <div className="mt-3">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('mentoring.filterByExpertise')}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setExpertiseFilter('')}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    !expertiseFilter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {t('common.all')}
                </button>
                {expertiseTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setExpertiseFilter(tag)}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      expertiseFilter === tag
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingMentors ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : mentors.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {t('mentoring.noMentorsAvailable')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mentors.map((mentor) => (
                <MentorListItem
                  key={mentor.id}
                  mentor={mentor}
                  onRequest={handleRequestMentor}
                  isRequesting={requestMentorship.isPending}
                  selectedMentorId={selectedMentorId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Message Input Modal */}
        {showMessageInput && mentorToRequest && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                {t('mentoring.requestMentorFrom')} {mentorToRequest.name}
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {t('mentoring.addOptionalMessage')}
              </p>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder={t('mentoring.messagePlaceholder')}
                rows={3}
                className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowMessageInput(false)
                    setMentorToRequest(null)
                    setSelectedMentorId(null)
                    setRequestMessage('')
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={requestMentorship.isPending}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={handleConfirmRequest}
                  variant="default"
                  className="flex-1"
                  disabled={requestMentorship.isPending}
                >
                  {requestMentorship.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    t('mentoring.sendRequest')
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
