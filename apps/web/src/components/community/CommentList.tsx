'use client'

import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { MessageSquare } from 'lucide-react'
import type { Comment } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'

interface CommentListProps {
  comments: Comment[]
  postId: string
  postAuthorId: string
  currentUserId?: string
  onVote: (commentId: string, type: 'upvote' | 'downvote') => Promise<void>
  onReply: (parentId: string, content: string) => Promise<void>
  onCreateComment: (content: string) => Promise<void>
  onAccept?: (commentId: string) => Promise<void>
}

export function CommentList({
  comments,
  postId,
  postAuthorId,
  currentUserId,
  onVote,
  onReply,
  onCreateComment,
  onAccept,
}: CommentListProps) {
  const t = useTranslations()
  // Filter top-level comments (those without parentId)
  const topLevelComments = comments.filter((comment) => !comment.parentId)

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('community.comment.answerCount', { count: comments.length })}
        </h2>
      </div>

      {/* New Comment Form */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <CommentForm
          postId={postId}
          onSubmit={onCreateComment}
          placeholder={t('community.comment.answerPlaceholder')}
          buttonText={t('community.comment.answerSubmit')}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {t('community.comment.noAnswers')}
              </p>
            </div>
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              onVote={onVote}
              onReply={onReply}
              onAccept={onAccept}
            />
          ))
        )}
      </div>
    </div>
  )
}
