'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Clock, Play } from 'lucide-react'
import type { Chapter, ChapterProgress } from '@/lib/api/types'
import { cn } from '@/lib/utils'
import { useUpdateChapterProgress } from '@/lib/hooks/use-courses'
import { useTranslations } from '@/i18n/LanguageContext'

interface ChapterListProps {
  chapters: Chapter[]
  chaptersProgress?: ChapterProgress[]
  isEnrolled: boolean
  className?: string
}

export function ChapterList({
  chapters,
  chaptersProgress = [],
  isEnrolled,
  className,
}: ChapterListProps) {
  const t = useTranslations()
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)
  const updateProgress = useUpdateChapterProgress()

  const getChapterProgress = (chapterId: string) => {
    return chaptersProgress.find((cp) => cp.chapterId === chapterId)
  }

  const handleToggleComplete = async (
    chapterId: string,
    currentStatus: boolean
  ) => {
    if (!isEnrolled) return

    await updateProgress.mutateAsync({
      chapterId,
      completed: !currentStatus,
    })
  }

  if (chapters.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          {t('courses.chapter.noChapters')}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {chapters.map((chapter, index) => {
        const progress = getChapterProgress(chapter.id)
        const isCompleted = progress?.completed || false
        const isExpanded = expandedChapter === chapter.id

        return (
          <div
            key={chapter.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Chapter Header */}
            <button
              onClick={() =>
                setExpandedChapter(isExpanded ? null : chapter.id)
              }
              className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-750"
            >
              {/* Completion Status */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleComplete(chapter.id, isCompleted)
                }}
                disabled={!isEnrolled || updateProgress.isPending}
                className="mt-1 flex-shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-400" />
                )}
              </button>

              {/* Chapter Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t('courses.chapter.title', { number: index + 1 })}
                      </span>
                      {isCompleted && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                          {t('courses.chapter.completed')}
                        </span>
                      )}
                    </div>
                    <h4
                      className={cn(
                        'mt-1 font-semibold',
                        isCompleted
                          ? 'text-gray-600 line-through dark:text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      )}
                    >
                      {chapter.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {chapter.description}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{t('courses.chapter.duration', { minutes: chapter.duration })}</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && chapter.content && (
              <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-750">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300">
                    {chapter.content}
                  </p>
                </div>

                {/* Video */}
                {chapter.videoUrl && (
                  <div className="mt-4">
                    <a
                      href={chapter.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      <Play className="h-4 w-4" />
                      {t('courses.chapter.watchVideo')}
                    </a>
                  </div>
                )}

                {/* Resources */}
                {chapter.resources && chapter.resources.length > 0 && (
                  <div className="mt-4">
                    <h5 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                      {t('courses.chapter.resources')}
                    </h5>
                    <ul className="space-y-2">
                      {chapter.resources.map((resource, idx) => (
                        <li key={idx}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            <span>{resource.title}</span>
                            <span className="text-xs text-gray-500">
                              ({resource.type.toUpperCase()})
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
