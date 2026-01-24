'use client'

import { memo, useMemo, useState } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { CheckCircle2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useLanguage, useTranslations } from '@/i18n/LanguageContext'
import { VoteButtons } from './VoteButtons'
import { AnswerForm } from './AnswerForm'
import type { Answer } from '@/lib/api/qna-types'

interface AnswerCardProps {
  answer: Answer
  questionId: string
  questionAuthorId: string
  currentUserId?: string
  onVote: (type: 'upvote' | 'downvote') => Promise<void>
  onAccept?: () => Promise<void>
  onEdit?: (content: string) => Promise<void>
  onDelete?: () => Promise<void>
}

function AnswerCardComponent({
  answer,
  questionId,
  questionAuthorId,
  currentUserId,
  onVote,
  onAccept,
  onEdit,
  onDelete,
}: AnswerCardProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS
  const [isEditing, setIsEditing] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const isQuestionAuthor = currentUserId === questionAuthorId
  const isAnswerAuthor = currentUserId === answer.authorId
  const canAccept = isQuestionAuthor && !answer.isAccepted && onAccept

  const formattedDate = useMemo(
    () =>
      formatDistanceToNow(new Date(answer.createdAt), {
        addSuffix: true,
        locale: dateLocale,
      }),
    [answer.createdAt, dateLocale]
  )

  const authorInitial = useMemo(
    () => answer.author.name.charAt(0).toUpperCase(),
    [answer.author.name]
  )

  const handleEdit = async (content: string) => {
    if (onEdit) {
      await onEdit(content)
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (onDelete && confirm(t('qna.answer.confirmDelete'))) {
      await onDelete()
    }
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800 dark:bg-blue-900/10">
        <AnswerForm
          questionId={questionId}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          initialContent={answer.content}
          isEditing
        />
      </div>
    )
  }

  return (
    <div
      className={`rounded-lg border p-6 ${
        answer.isAccepted
          ? 'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10'
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
      }`}
    >
      <div className="flex gap-4">
        {/* Vote Buttons */}
        <div className="flex flex-col items-center gap-2">
          <VoteButtons
            votes={answer.votes}
            hasVoted={answer.hasVoted}
            voteType={answer.voteType}
            onVote={onVote}
            disabled={!currentUserId}
          />

          {/* Accepted Badge */}
          {answer.isAccepted && (
            <div className="flex flex-col items-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-8 w-8" />
              <span className="text-xs font-medium">
                {t('qna.answer.accepted')}
              </span>
            </div>
          )}

          {/* Accept Button */}
          {canAccept && (
            <button
              onClick={onAccept}
              className="flex flex-col items-center text-gray-400 transition-colors hover:text-green-600 dark:hover:text-green-400"
              title={t('qna.answer.acceptAnswer')}
            >
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-[10px]">{t('qna.answer.accept')}</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {answer.author.profileImage ? (
                <Image
                  src={answer.author.profileImage}
                  alt={answer.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {authorInitial}
                </div>
              )}
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {answer.author.name}
                </span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  Lv.{answer.author.level}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formattedDate}
              </span>

              {/* Actions Menu */}
              {isAnswerAuthor && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 z-20 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <button
                          onClick={() => {
                            setShowMenu(false)
                            setIsEditing(true)
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <Pencil className="h-4 w-4" />
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => {
                            setShowMenu(false)
                            handleDelete()
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t('common.delete')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Answer Content */}
          <div className="prose prose-gray max-w-none dark:prose-invert prose-headings:text-gray-900 prose-headings:dark:text-white prose-p:text-gray-700 prose-p:dark:text-gray-300 prose-a:text-blue-600 prose-a:dark:text-blue-400 prose-strong:text-gray-900 prose-strong:dark:text-white prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-gray-900 prose-code:dark:bg-gray-700 prose-code:dark:text-gray-100 prose-pre:bg-gray-900 prose-pre:dark:bg-gray-950">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {answer.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export const AnswerCard = memo(AnswerCardComponent)
