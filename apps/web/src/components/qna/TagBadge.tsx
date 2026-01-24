'use client'

import { memo } from 'react'

interface TagBadgeProps {
  tag: string
  onClick?: (tag: string) => void
  isActive?: boolean
  size?: 'sm' | 'md'
}

function TagBadgeComponent({ tag, onClick, isActive = false, size = 'md' }: TagBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(tag)}
        className={`rounded-full font-medium transition-colors ${sizeClasses} ${
          isActive
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
        }`}
      >
        {tag}
      </button>
    )
  }

  return (
    <span
      className={`rounded-full bg-blue-100 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ${sizeClasses}`}
    >
      {tag}
    </span>
  )
}

export const TagBadge = memo(TagBadgeComponent)
