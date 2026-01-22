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
  size?: 'sm' | 'md'
}

export function VoteButtons({
  votes,
  hasVoted,
  voteType,
  onVote,
  disabled = false,
  size = 'md',
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

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const buttonSize = size === 'sm' ? 'p-1' : 'p-1.5'
  const textSize = size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote('upvote')}
        disabled={disabled || isVoting}
        className={`${buttonSize} rounded transition-colors disabled:opacity-50 ${
          hasVoted && voteType === 'upvote'
            ? 'text-blue-600 hover:text-blue-700'
            : 'text-gray-400 hover:text-blue-600'
        }`}
        aria-label={t('accessibility.upvote')}
      >
        <ChevronUp className={iconSize} />
      </button>

      {/* Vote Count */}
      <span
        className={`${textSize} font-semibold ${
          hasVoted
            ? voteType === 'upvote'
              ? 'text-blue-600'
              : 'text-orange-600'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {votes}
      </span>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote('downvote')}
        disabled={disabled || isVoting}
        className={`${buttonSize} rounded transition-colors disabled:opacity-50 ${
          hasVoted && voteType === 'downvote'
            ? 'text-orange-600 hover:text-orange-700'
            : 'text-gray-400 hover:text-orange-600'
        }`}
        aria-label={t('accessibility.downvote')}
      >
        <ChevronDown className={iconSize} />
      </button>
    </div>
  )
}
