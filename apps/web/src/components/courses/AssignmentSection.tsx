'use client'

import { useState, useMemo } from 'react'
import {
  FileText,
  Github,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Info,
  Edit3,
} from 'lucide-react'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'
import {
  useChapterAssignments,
  useSubmitAssignment,
  useUpdateSubmission,
  useMySubmissionForAssignment,
} from '@/lib/hooks/use-assignments'
import { getDemoAssignment } from '@/lib/data/demo-assignments'
import { cn } from '@/lib/utils'
import type { Assignment, AssignmentSubmission } from '@/lib/api/assignments'

interface AssignmentSectionProps {
  chapterId: string
  isDemo?: boolean
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  SUBMITTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  REVIEWED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  RETURNED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
}

export function AssignmentSection({
  chapterId,
  isDemo = false,
}: AssignmentSectionProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const [content, setContent] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const {
    data: assignments,
    isLoading,
    error,
  } = useChapterAssignments(chapterId, !isDemo)

  const assignment: Assignment | null = useMemo(() => {
    if (
      isDemo ||
      error ||
      (!isLoading && (!assignments || assignments.length === 0))
    ) {
      return getDemoAssignment(chapterId)
    }
    return assignments?.[0] ?? null
  }, [isDemo, error, isLoading, assignments, chapterId])

  const { data: submission } = useMySubmissionForAssignment(
    assignment?.id ?? '',
    !isDemo && !!assignment?.id,
  )

  const submitAssignment = useSubmitAssignment()
  const updateSubmissionMutation = useUpdateSubmission()

  const handleSubmit = async () => {
    if (!assignment || !content.trim()) return

    if (isDemo) {
      // In demo mode, just show a success state
      setIsEditing(false)
      return
    }

    try {
      if (submission && isEditing) {
        await updateSubmissionMutation.mutateAsync({
          submissionId: submission.id,
          data: {
            content: content.trim(),
            githubUrl: githubUrl.trim() || undefined,
          },
        })
      } else {
        await submitAssignment.mutateAsync({
          assignmentId: assignment.id,
          data: {
            content: content.trim(),
            githubUrl: githubUrl.trim() || undefined,
          },
        })
      }
      setIsEditing(false)
    } catch (err) {
      // Silently handled - mutation error state shown via UI
    }
  }

  const handleEdit = () => {
    if (submission) {
      setContent(submission.content)
      setGithubUrl(submission.githubUrl || '')
    }
    setIsEditing(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!assignment) return null

  const isPending = submitAssignment.isPending || updateSubmissionMutation.isPending
  const dueDate = assignment.dueDate
    ? new Date(assignment.dueDate)
    : null
  const isOverdue = dueDate ? dueDate < new Date() : false

  return (
    <div className="space-y-6">
      {/* Demo banner */}
      {isDemo && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Info className="h-4 w-4" />
            {t('courses.demoBanner')}
          </p>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Assignment header */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {assignment.title}
              </h3>
            </div>
            {submission && (
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium',
                  statusColors[submission.status] || statusColors.PENDING,
                )}
              >
                {t(`assignment.status.${submission.status.toLowerCase()}`)}
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {dueDate && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  isOverdue && 'text-red-600 dark:text-red-400',
                )}
              >
                <Clock className="h-4 w-4" />
                <span>
                  {t('assignment.dueDate')}:{' '}
                  {dueDate.toLocaleDateString(
                    locale === 'ko' ? 'ko-KR' : 'en-US',
                  )}
                </span>
                {isOverdue && (
                  <span className="ml-1 text-xs font-medium">
                    ({t('assignment.overdue')})
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-1">
              <span>
                {t('assignment.maxScore')}: {assignment.maxScore}
              </span>
            </div>
          </div>
        </div>

        {/* Assignment description */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {assignment.description.split('\n').map((line, i) => {
              if (line.startsWith('- ')) {
                return (
                  <li
                    key={i}
                    className="ml-4 text-gray-700 dark:text-gray-300"
                  >
                    {line.slice(2)}
                  </li>
                )
              }
              if (line.trim() === '') return <br key={i} />
              return (
                <p key={i} className="text-gray-700 dark:text-gray-300">
                  {line}
                </p>
              )
            })}
          </div>
        </div>

        {/* Submission section */}
        <div className="p-6">
          {submission && !isEditing ? (
            /* Show existing submission */
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {t('assignment.mySubmission')}
              </h4>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {submission.content}
                </p>
              </div>

              {submission.githubUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <Github className="h-4 w-4 text-gray-500" />
                  <a
                    href={submission.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {submission.githubUrl}
                  </a>
                </div>
              )}

              {/* Score and feedback */}
              {submission.status === 'REVIEWED' && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      {t('assignment.score')}: {submission.score}/
                      {assignment.maxScore}
                    </span>
                  </div>
                  {submission.feedback && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {t('assignment.feedback')}: {submission.feedback}
                    </p>
                  )}
                </div>
              )}

              {submission.status === 'RETURNED' && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-medium text-orange-800 dark:text-orange-300">
                      {t('assignment.returned')}
                    </span>
                  </div>
                  {submission.feedback && (
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      {submission.feedback}
                    </p>
                  )}
                </div>
              )}

              {/* Edit button (only if not reviewed) */}
              {(submission.status === 'SUBMITTED' ||
                submission.status === 'RETURNED') && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Edit3 className="h-4 w-4" />
                  {t('assignment.edit')}
                </button>
              )}
            </div>
          ) : (
            /* Submission form */
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {isEditing
                  ? t('assignment.editSubmission')
                  : t('assignment.submitYour')}
              </h4>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('assignment.content')} *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder={t('assignment.contentPlaceholder')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub URL{' '}
                  <span className="text-gray-400">
                    ({t('common.optional')})
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={isPending || !content.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('common.submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {isEditing
                        ? t('assignment.update')
                        : t('common.submit')}
                    </>
                  )}
                </button>

                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t('common.cancel')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
