'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Reply, CheckCircle2 } from 'lucide-react'
import { VoteButtons } from './VoteButtons'
import { CommentForm } from './CommentForm'
import type { Comment } from '@/lib/api/types'

interface CommentItemProps {
  comment: Comment
  postId: string
  postAuthorId: string
  currentUserId?: string
  depth?: number
  onVote: (commentId: string, type: 'upvote' | 'downvote') => Promise<void>
  onReply: (parentId: string, content: string) => Promise<void>
  onAccept?: (commentId: string) => Promise<void>
}

export function CommentItem({
  comment,
  postId,
  postAuthorId,
  currentUserId,
  depth = 0,
  onVote,
  onReply,
  onAccept,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const isPostAuthor = currentUserId === postAuthorId
  const isCommentAuthor = currentUserId === comment.authorId
  const maxDepth = 3 // Maximum nesting level

  const handleReply = async (content: string) => {
    await onReply(comment.id, content)
    setShowReplyForm(false)
  }

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4 dark:border-gray-700' : ''}`}>
      <div className="group rounded-lg bg-white p-4 dark:bg-gray-800">
        <div className="flex gap-4">
          {/* Vote Buttons */}
          <div className="flex-shrink-0">
            <VoteButtons
              votes={comment.votes}
              hasVoted={comment.hasVoted}
              voteType={comment.voteType}
              onVote={(type) => onVote(comment.id, type)}
              size="sm"
            />
          </div>

          {/* Comment Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Author Avatar */}
                {comment.author.profileImage ? (
                  <img
                    src={comment.author.profileImage}
                    alt={comment.author.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Author Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      Lv.{comment.author.level}
                    </span>
                    {comment.isAccepted && (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="h-3 w-3" />
                        베스트 답변
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
              </div>

              {/* Accept Button (only for post author on non-accepted comments) */}
              {isPostAuthor && !comment.isAccepted && onAccept && (
                <button
                  onClick={() => onAccept(comment.id)}
                  className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>답변 채택</span>
                </button>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </div>

            {/* Actions */}
            {depth < maxDepth && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  <Reply className="h-4 w-4" />
                  <span>답글</span>
                </button>
              </div>
            )}

            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-3">
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  onSubmit={handleReply}
                  onCancel={() => setShowReplyForm(false)}
                  placeholder={`${comment.author.name}님에게 답글 작성...`}
                  buttonText="답글 작성"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              depth={depth + 1}
              onVote={onVote}
              onReply={onReply}
              onAccept={onAccept}
            />
          ))}
        </div>
      )}
    </div>
  )
}
