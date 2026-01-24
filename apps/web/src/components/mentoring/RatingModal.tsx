'use client'

import { useState } from 'react'
import { Star, X, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/LanguageContext'
import type { Mentorship } from '@/lib/api/types'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  mentorship: Mentorship
  onSubmit: (rating: number, feedback?: string) => void
  isSubmitting?: boolean
}

export function RatingModal({
  isOpen,
  onClose,
  mentorship,
  onSubmit,
  isSubmitting = false,
}: RatingModalProps) {
  const t = useTranslations()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, feedback.trim() || undefined)
    }
  }

  const handleClose = () => {
    setRating(0)
    setHoveredRating(0)
    setFeedback('')
    onClose()
  }

  if (!isOpen) return null

  const displayRating = hoveredRating || rating
  const mentor = mentorship.mentor

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('mentoring.rateMentor')}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('mentoring.rateDescription')}
          </p>
        </div>

        {/* Mentor info */}
        <div className="mb-6 flex items-center justify-center gap-3">
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
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{mentor.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mentorship.sessionsCount} {t('mentoring.sessions')}
            </p>
          </div>
        </div>

        {/* Star rating */}
        <div className="mb-6">
          <label className="mb-2 block text-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('mentoring.yourRating')}
          </label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= displayRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
          {displayRating > 0 && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {displayRating === 1 && t('mentoring.ratingLabels.poor')}
              {displayRating === 2 && t('mentoring.ratingLabels.fair')}
              {displayRating === 3 && t('mentoring.ratingLabels.good')}
              {displayRating === 4 && t('mentoring.ratingLabels.veryGood')}
              {displayRating === 5 && t('mentoring.ratingLabels.excellent')}
            </p>
          )}
        </div>

        {/* Feedback textarea */}
        <div className="mb-6">
          <label
            htmlFor="feedback"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('mentoring.feedback')} <span className="text-gray-400">({t('common.optional')})</span>
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t('mentoring.feedbackPlaceholder')}
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="default"
            className="flex-1"
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? t('common.submitting') : t('common.submit')}
          </Button>
        </div>
      </div>
    </div>
  )
}
