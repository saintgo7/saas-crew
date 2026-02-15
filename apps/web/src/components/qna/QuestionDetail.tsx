'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { Eye, Calendar, CheckCircle2, Coins, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { VoteButtons } from './VoteButtons'
import { TagBadge } from './TagBadge'
import { BountyBadge } from './BountyBadge'
import { AnswerCard } from './AnswerCard'
import { AnswerForm } from './AnswerForm'
import type { QuestionWithAnswers } from '@/lib/api/qna-types'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

interface QuestionDetailProps {
  question: QuestionWithAnswers
  currentUserId?: string
  onVote: (type: 'upvote' | 'downvote') => Promise<void>
  onAnswerVote: (answerId: string, type: 'upvote' | 'downvote') => Promise<void>
  onCreateAnswer: (content: string) => Promise<void>
  onAcceptAnswer?: (answerId: string) => Promise<void>
  onEditAnswer?: (answerId: string, content: string) => Promise<void>
  onDeleteAnswer?: (answerId: string) => Promise<void>
  onEdit?: () => void
  onDelete?: () => Promise<void>
  onSetBounty?: (amount: number) => Promise<void>
}

export function QuestionDetail({
  question,
  currentUserId,
  onVote,
  onAnswerVote,
  onCreateAnswer,
  onAcceptAnswer,
  onEditAnswer,
  onDeleteAnswer,
  onEdit,
  onDelete,
  onSetBounty,
}: QuestionDetailProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS
  const isAuthor = currentUserId === question.authorId
  const [showMenu, setShowMenu] = useState(false)

  // Sort answers: accepted first, then by votes (descending)
  const sortedAnswers = useMemo(() => {
    return [...question.answers].sort((a, b) => {
      if (a.isAccepted && !b.isAccepted) return -1
      if (!a.isAccepted && b.isAccepted) return 1
      return b.votes - a.votes
    })
  }, [question.answers])

  const handleDelete = async () => {
    if (onDelete && confirm(t('qna.question.confirmDelete'))) {
      await onDelete()
    }
  }

  return (
    <div className="space-y-8">
      {/* Question Content */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="mb-4 flex items-start gap-4">
            <VoteButtons
              votes={question.votes}
              hasVoted={question.hasVoted}
              voteType={question.voteType}
              onVote={onVote}
              disabled={!currentUserId}
              size="lg"
            />

            <div className="flex-1">
              {/* Title */}
              <div className="mb-4 flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {question.title}
                  {question.hasAcceptedAnswer && (
                    <CheckCircle2 className="ml-3 inline-block h-7 w-7 text-green-600" />
                  )}
                </h1>

                {/* Actions Menu */}
                {isAuthor && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {showMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                          {onEdit && (
                            <button
                              onClick={() => {
                                setShowMenu(false)
                                onEdit()
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Pencil className="h-4 w-4" />
                              {t('common.edit')}
                            </button>
                          )}
                          {onDelete && (
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
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Bounty */}
              {question.bounty && question.bounty > 0 && (
                <div className="mb-4">
                  <BountyBadge
                    amount={question.bounty}
                    expiresAt={question.bountyExpiresAt}
                    size="md"
                    showExpiry
                  />
                </div>
              )}

              {/* Tags */}
              {question.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {/* Author */}
                <div className="flex items-center gap-2">
                  {question.author.profileImage ? (
                    <Image
                      src={question.author.profileImage}
                      alt={question.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                      {question.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {question.author.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Lv.{question.author.level}
                  </span>
                </div>

                {/* Created At */}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(question.createdAt), {
                      addSuffix: true,
                      locale: dateLocale,
                    })}
                  </span>
                </div>

                {/* Views */}
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>
                    {t('qna.views')} {question.views}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 prose-headings:dark:text-white prose-p:text-gray-700 prose-p:dark:text-gray-300 prose-a:text-blue-600 prose-a:dark:text-blue-400 prose-strong:text-gray-900 prose-strong:dark:text-white prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-gray-900 prose-code:dark:bg-gray-700 prose-code:dark:text-gray-100 prose-pre:bg-gray-900 prose-pre:dark:bg-gray-950">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {question.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Set Bounty (for author, if no bounty set) */}
        {isAuthor && !question.bounty && onSetBounty && !question.hasAcceptedAnswer && (
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <BountySection onSetBounty={onSetBounty} />
          </div>
        )}
      </div>

      {/* Answers Section */}
      <div className="space-y-6">
        {/* Answers Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('qna.answersCount', { count: question.answers.length })}
          </h2>
        </div>

        {/* Answer Form */}
        {currentUserId && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
              {t('qna.answer.yourAnswer')}
            </h3>
            <AnswerForm questionId={question.id} onSubmit={onCreateAnswer} />
          </div>
        )}

        {/* Login prompt for unauthenticated users */}
        {!currentUserId && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('qna.answer.loginRequired')}
            </p>
          </div>
        )}

        {/* Answers List */}
        {sortedAnswers.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {t('qna.answer.noAnswers')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAnswers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                questionId={question.id}
                questionAuthorId={question.authorId}
                currentUserId={currentUserId}
                onVote={(type) => onAnswerVote(answer.id, type)}
                onAccept={
                  onAcceptAnswer && currentUserId === question.authorId && !answer.isAccepted
                    ? () => onAcceptAnswer(answer.id)
                    : undefined
                }
                onEdit={
                  onEditAnswer && currentUserId === answer.authorId
                    ? (content) => onEditAnswer(answer.id, content)
                    : undefined
                }
                onDelete={
                  onDeleteAnswer && currentUserId === answer.authorId
                    ? () => onDeleteAnswer(answer.id)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Bounty Section Component
function BountySection({ onSetBounty }: { onSetBounty: (amount: number) => Promise<void> }) {
  const t = useTranslations()
  const [showInput, setShowInput] = useState(false)
  const [amount, setAmount] = useState(50)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (amount < 10 || amount > 500) return
    setIsSubmitting(true)
    try {
      await onSetBounty(amount)
      setShowInput(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
      >
        <Coins className="h-4 w-4" />
        {t('qna.bounty.addBounty')}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Coins className="h-4 w-4 text-amber-600" />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Math.max(10, Math.min(500, Number(e.target.value))))}
          min={10}
          max={500}
          step={10}
          className="w-20 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">XP</span>
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="rounded bg-amber-600 px-3 py-1 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {isSubmitting ? t('common.loading') : t('qna.bounty.set')}
      </button>
      <button
        onClick={() => setShowInput(false)}
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        {t('common.cancel')}
      </button>
    </div>
  )
}
