'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import {
  Reply,
  CheckCircle2,
  MoreHorizontal,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { VoteButtons } from './VoteButtons'
import { CommentForm } from './CommentForm'
import type { Comment } from '@/lib/api/types'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

interface CommentItemProps {
  comment: Comment
  postId: string
  postAuthorId: string
  currentUserId?: string
  depth?: number
  onVote: (commentId: string, type: 'upvote' | 'downvote') => Promise<void>
  onReply: (parentId: string, content: string) => Promise<void>
  onAccept?: (commentId: string) => Promise<void>
  onEdit?: (commentId: string, content: string) => Promise<void>
  onDelete?: (commentId: string) => Promise<void>
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
  onEdit,
  onDelete,
}: CommentItemProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPostAuthor = currentUserId === postAuthorId
  const isCommentAuthor = currentUserId === comment.authorId
  const canModify = isCommentAuthor && !comment.isAccepted
  const maxDepth = 3 // Maximum nesting level

  const handleReply = async (content: string) => {
    await onReply(comment.id, content)
    setShowReplyForm(false)
  }

  const handleEdit = async (content: string) => {
    if (!onEdit) return
    try {
      setError(null)
      await onEdit(comment.id, content)
      setShowEditForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('community.comment.error.editFailed'))
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    try {
      setError(null)
      setIsDeleting(true)
      await onDelete(comment.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('community.comment.error.deleteFailed'))
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleMenuToggle = () => {
    setShowMenu(!showMenu)
    setShowDeleteConfirm(false)
  }

  // Close menu when clicking outside
  const handleClickOutside = () => {
    setShowMenu(false)
    setShowDeleteConfirm(false)
  }

  // Check if comment was edited
  const wasEdited = comment.updatedAt && comment.updatedAt !== comment.createdAt

  return (
    <div
      className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4 dark:border-gray-700' : ''}`}
    >
      <div
        className={`group rounded-lg p-4 ${
          comment.isAccepted
            ? 'border-2 border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/10'
            : 'bg-white dark:bg-gray-800'
        }`}
      >
        {/* Error message */}
        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              &times;
            </button>
          </div>
        )}

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
                        {t('community.comment.bestAnswer')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: dateLocale,
                      })}
                    </span>
                    {wasEdited && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ({t('community.comment.edited')})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Accept Button (only for post author on non-accepted comments) */}
                {isPostAuthor && !comment.isAccepted && onAccept && !isCommentAuthor && (
                  <button
                    onClick={() => onAccept(comment.id)}
                    className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{t('community.comment.acceptAnswer')}</span>
                  </button>
                )}

                {/* More Menu (Edit/Delete) */}
                {canModify && (onEdit || onDelete) && (
                  <div className="relative">
                    <button
                      onClick={handleMenuToggle}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      aria-label={t('community.comment.moreActions')}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {showMenu && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={handleClickOutside}
                        />
                        {/* Menu */}
                        <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                          {onEdit && (
                            <button
                              onClick={() => {
                                setShowEditForm(true)
                                setShowMenu(false)
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Edit2 className="h-4 w-4" />
                              <span>{t('community.comment.edit')}</span>
                            </button>
                          )}
                          {onDelete && (
                            <>
                              {!showDeleteConfirm ? (
                                <button
                                  onClick={() => setShowDeleteConfirm(true)}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>{t('community.comment.delete')}</span>
                                </button>
                              ) : (
                                <div className="px-3 py-2">
                                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                    {t('community.comment.confirmDelete')}
                                  </p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={handleDelete}
                                      disabled={isDeleting}
                                      className="flex flex-1 items-center justify-center gap-1 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                    >
                                      {isDeleting ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        t('common.delete')
                                      )}
                                    </button>
                                    <button
                                      onClick={() => setShowDeleteConfirm(false)}
                                      disabled={isDeleting}
                                      className="flex-1 rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                    >
                                      {t('common.cancel')}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Content or Edit Form */}
            {showEditForm ? (
              <div className="mt-3">
                <CommentForm
                  postId={postId}
                  initialContent={comment.content}
                  onSubmit={handleEdit}
                  onCancel={() => setShowEditForm(false)}
                  buttonText={t('community.comment.update')}
                  isEditing
                />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {comment.content}
                </p>
              </div>
            )}

            {/* Actions */}
            {depth < maxDepth && !showEditForm && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  <Reply className="h-4 w-4" />
                  <span>{t('community.comment.reply')}</span>
                </button>
              </div>
            )}

            {/* Reply Form */}
            {showReplyForm && !showEditForm && (
              <div className="mt-3">
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  onSubmit={handleReply}
                  onCancel={() => setShowReplyForm(false)}
                  placeholder={t('community.comment.replyPlaceholder', {
                    name: comment.author.name,
                  })}
                  buttonText={t('community.comment.replySubmit')}
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
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
