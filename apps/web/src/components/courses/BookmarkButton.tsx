'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/LanguageContext'

const BOOKMARKS_KEY = 'crewspace-bookmarks'

function getBookmarks(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setBookmarks(ids: string[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids))
}

interface BookmarkButtonProps {
  courseId: string
  className?: string
  size?: 'sm' | 'md'
}

export function BookmarkButton({ courseId, className, size = 'md' }: BookmarkButtonProps) {
  const t = useTranslations()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    setIsBookmarked(getBookmarks().includes(courseId))
  }, [courseId])

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const current = getBookmarks()
      let next: string[]
      let message: string

      if (current.includes(courseId)) {
        next = current.filter((id) => id !== courseId)
        message = t('courses.bookmark.removed')
        setIsBookmarked(false)
      } else {
        next = [...current, courseId]
        message = t('courses.bookmark.added')
        setIsBookmarked(true)
      }

      setBookmarks(next)
      setToastMessage(message)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    },
    [courseId, t]
  )

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const buttonSize = size === 'sm' ? 'p-1.5' : 'p-2'

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={cn(
          'rounded-full bg-white/90 shadow-sm transition-all hover:bg-white hover:shadow-md dark:bg-gray-800/90 dark:hover:bg-gray-800',
          buttonSize,
          className
        )}
        aria-label={isBookmarked ? t('courses.bookmark.removed') : t('courses.bookmark.added')}
      >
        <Bookmark
          className={cn(
            iconSize,
            'transition-colors',
            isBookmarked
              ? 'fill-blue-600 text-blue-600'
              : 'text-gray-600 dark:text-gray-400'
          )}
        />
      </button>

      {/* Toast */}
      {showToast && (
        <div className="absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white shadow-lg dark:bg-gray-700">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
