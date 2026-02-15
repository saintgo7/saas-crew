'use client'

import { useState, useMemo } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/LanguageContext'

interface Review {
  id: string
  userName: string
  rating: number
  date: string
  comment: string
}

// Generate deterministic demo reviews based on courseId
function generateDemoReviews(courseId: string): Review[] {
  const names = [
    'Kim Minjun', 'Lee Soyeon', 'Park Jihoon', 'Choi Yuna', 'Jeong Taehyun',
    'Kang Minji', 'Yoon Seojin', 'Han Donghyun', 'Lim Hayeon', 'Song Jaeho',
  ]
  const comments = [
    '정말 유익한 코스였습니다. 실무에 바로 적용할 수 있는 내용이 많았어요.',
    '강의 구성이 체계적이고 설명이 명확합니다. 초보자에게도 추천합니다.',
    '프로젝트 기반 학습이 좋았습니다. 이론만이 아닌 실전 경험을 쌓을 수 있었어요.',
    '기대 이상이었습니다. 특히 고급 주제를 쉽게 설명해주셔서 이해하기 좋았습니다.',
    '내용은 좋지만 일부 섹션이 좀 더 깊이 있었으면 합니다. 전체적으로는 만족스럽습니다.',
    '실습 과제가 풍부해서 배운 내용을 바로 연습할 수 있었습니다.',
    '강사님의 열정이 느껴지는 코스입니다. 질문에 대한 답변도 빠르고 정확합니다.',
    '다른 코스와 비교했을 때 퀄리티가 높습니다. 재수강하고 싶을 정도입니다.',
  ]

  // Simple hash from courseId for deterministic output
  let hash = 0
  for (let i = 0; i < courseId.length; i++) {
    hash = ((hash << 5) - hash + courseId.charCodeAt(i)) | 0
  }

  const count = 3 + (Math.abs(hash) % 3) // 3-5 reviews
  return Array.from({ length: count }, (_, i) => {
    const idx = Math.abs(hash + i * 7) % names.length
    const cidx = Math.abs(hash + i * 13) % comments.length
    const rating = 3 + (Math.abs(hash + i * 3) % 3) // 3-5
    const daysAgo = 1 + (Math.abs(hash + i * 11) % 60)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    return {
      id: `review-${courseId}-${i}`,
      userName: names[idx],
      rating,
      date: date.toISOString(),
      comment: comments[cidx],
    }
  })
}

function StarRating({ rating, max = 5, size = 'sm' }: { rating: number; max?: number; size?: 'sm' | 'md' }) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            iconSize,
            i < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          )}
        />
      ))}
    </div>
  )
}

function StarPicker({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const value = i + 1
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                'h-6 w-6',
                (hover || rating) >= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

interface CourseReviewsProps {
  courseId: string
}

export function CourseReviews({ courseId }: CourseReviewsProps) {
  const t = useTranslations()
  const [showForm, setShowForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [localReviews, setLocalReviews] = useState<Review[]>([])

  const demoReviews = useMemo(() => generateDemoReviews(courseId), [courseId])
  const allReviews = [...localReviews, ...demoReviews]

  const averageRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRating === 0 || !newComment.trim()) return

    const review: Review = {
      id: `local-${Date.now()}`,
      userName: 'You',
      rating: newRating,
      date: new Date().toISOString(),
      comment: newComment.trim(),
    }

    setLocalReviews((prev) => [review, ...prev])
    setNewRating(0)
    setNewComment('')
    setShowForm(false)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t('courses.reviews.title')}
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t('courses.reviews.writeReview')}
        </button>
      </div>

      {/* Average Rating */}
      <div className="mb-6 flex items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-750">
        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {averageRating.toFixed(1)}
        </div>
        <div>
          <StarRating rating={Math.round(averageRating)} size="md" />
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('courses.reviews.averageRating')} ({allReviews.length})
          </p>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-4">
            <StarPicker rating={newRating} onChange={setNewRating} />
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('courses.reviews.placeholder')}
            className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            rows={3}
          />
          <button
            type="submit"
            disabled={newRating === 0 || !newComment.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('courses.reviews.submitReview')}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {allReviews.length === 0 ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('courses.reviews.noReviews')}
        </p>
      ) : (
        <div className="space-y-4">
          {allReviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-4 last:border-b-0 dark:border-gray-700"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                  {review.userName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {review.userName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
