'use client'

import { useMemo } from 'react'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { MessageSquare, Loader2 } from 'lucide-react'
import type { Comment } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'

interface CommentListProps {
  comments: Comment[]
  postId: string
  postAuthorId: string
  currentUserId?: string
  isLoading?: boolean
  onVote: (commentId: string, type: 'upvote' | 'downvote') => Promise<void>
  onReply: (parentId: string, content: string) => Promise<void>
  onCreateComment: (content: string) => Promise<void>
  onAccept?: (commentId: string) => Promise<void>
  onEdit?: (commentId: string, content: string) => Promise<void>
  onDelete?: (commentId: string) => Promise<void>
}

export function CommentList({
  comments,
  postId,
  postAuthorId,
  currentUserId,
  isLoading = false,
  onVote,
  onReply,
  onCreateComment,
  onAccept,
  onEdit,
  onDelete,
}: CommentListProps) {
  const t = useTranslations()

  // Filter and sort comments - accepted answers first, then by votes
  const sortedComments = useMemo(() => {
    const topLevelComments = comments.filter((comment) => !comment.parentId)

    return topLevelComments.sort((a, b) => {
      // Accepted answers come first
      if (a.isAccepted && !b.isAccepted) return -1
      if (!a.isAccepted && b.isAccepted) return 1
      // Then sort by votes (descending)
      return b.votes - a.votes
    })
  }, [comments])

  // Count total comments including replies
  const totalCommentsCount = useMemo(() => {
    const countReplies = (comment: Comment): number => {
      let count = 1
      if (comment.replies) {
        comment.replies.forEach((reply) => {
          count += countReplies(reply)
        })
      }
      return count
    }

    return comments.reduce((total, comment) => total + countReplies(comment), 0)
  }, [comments])

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('community.comment.answerCount', { count: totalCommentsCount })}
          </h2>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t('common.loading')}</span>
          </div>
        )}
      </div>

      {/* New Comment Form */}
      {currentUserId && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <CommentForm
            postId={postId}
            onSubmit={onCreateComment}
            placeholder={t('community.comment.answerPlaceholder')}
            buttonText={t('community.comment.answerSubmit')}
          />
        </div>
      )}

      {/* Login prompt for unauthenticated users */}
      {!currentUserId && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('community.comment.loginToComment')}
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {t('community.comment.noAnswers')}
              </p>
            </div>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              onVote={onVote}
              onReply={onReply}
              onAccept={onAccept}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
