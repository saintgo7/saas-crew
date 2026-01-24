'use client'

import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from '@/i18n/LanguageContext'

interface VoteButtonsProps {
  votes: number
  hasVoted?: boolean
  voteType?: 'upvote' | 'downvote'
  onVote: (type: 'upvote' | 'downvote') => Promise<void>
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'vertical' | 'horizontal'
}

export function VoteButtons({
  votes,
  hasVoted,
  voteType,
  onVote,
  disabled = false,
  size = 'md',
  orientation = 'vertical',
}: VoteButtonsProps) {
  const t = useTranslations()
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (isVoting || disabled) return
    setIsVoting(true)
    try {
      await onVote(type)
    } finally {
      setIsVoting(false)
    }
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const buttonSizes = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const containerClasses =
    orientation === 'vertical'
      ? 'flex flex-col items-center gap-1'
      : 'flex items-center gap-2'

  return (
    <div className={containerClasses}>
      {/* Upvote Button */}
      <button
        onClick={() => handleVote('upvote')}
        disabled={disabled || isVoting}
        className={`${buttonSizes[size]} rounded transition-colors disabled:opacity-50 ${
          hasVoted && voteType === 'upvote'
            ? 'text-blue-600 hover:text-blue-700 dark:text-blue-400'
            : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
        aria-label={t('accessibility.upvote')}
      >
        <ChevronUp className={iconSizes[size]} />
      </button>

      {/* Vote Count */}
      <span
        className={`${textSizes[size]} font-semibold ${
          hasVoted
            ? voteType === 'upvote'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-orange-600 dark:text-orange-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {votes}
      </span>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote('downvote')}
        disabled={disabled || isVoting}
        className={`${buttonSizes[size]} rounded transition-colors disabled:opacity-50 ${
          hasVoted && voteType === 'downvote'
            ? 'text-orange-600 hover:text-orange-700 dark:text-orange-400'
            : 'text-gray-400 hover:text-orange-600 dark:hover:text-orange-400'
        }`}
        aria-label={t('accessibility.downvote')}
      >
        <ChevronDown className={iconSizes[size]} />
      </button>
    </div>
  )
}
