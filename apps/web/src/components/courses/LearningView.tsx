'use client'

import { useState, useMemo } from 'react'
import { useCourse, useCourseProgress, useUpdateChapterProgress } from '@/lib/hooks/use-courses'
import { ProgressBar } from './ProgressBar'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  BookOpen,
  Loader2,
  Menu,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from '@/i18n/LanguageContext'
import { getDemoCourseDetail } from '@/lib/data/demo-courses'
import type { Chapter, CourseWithChapters } from '@/lib/api/types'
import { cn } from '@/lib/utils'

interface LearningViewProps {
  courseId: string
}

export function LearningView({ courseId }: LearningViewProps) {
  const t = useTranslations()
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data, isLoading, error } = useCourse(courseId)
  const { data: progressData } = useCourseProgress(courseId, !error)
  const updateProgress = useUpdateChapterProgress()

  const isDemo = !!error || (!isLoading && !data)

  const courseData = useMemo(() => {
    if (!isDemo && data) return data
    return getDemoCourseDetail(courseId)
  }, [isDemo, data, courseId])

  // Initialize completed chapters from progress data
  useMemo(() => {
    if (progressData?.chaptersProgress) {
      const completed = new Set<string>(
        progressData.chaptersProgress
          .filter((cp) => cp.completed)
          .map((cp) => cp.chapterId)
      )
      setCompletedChapters(completed)
    } else if (isDemo && courseData?.course?.chapters) {
      // Demo: mark first 2 chapters as completed
      const demoCompleted = new Set<string>(
        courseData.course.chapters.slice(0, 2).map((ch) => ch.id)
      )
      setCompletedChapters(demoCompleted)
    }
  }, [progressData, isDemo, courseData])

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {t('courses.loadingDetail')}
          </p>
        </div>
      </div>
    )
  }

  if (!courseData?.course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('courses.notFound')}
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {t('courses.backToList')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const course = courseData.course
  const chapters = course.chapters || []
  const activeChapter = chapters[activeChapterIndex]
  const totalChapters = chapters.length
  const completedCount = completedChapters.size
  const overallProgress = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0

  const handleChapterSelect = (index: number) => {
    setActiveChapterIndex(index)
    setSidebarOpen(false)
  }

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      setActiveChapterIndex(activeChapterIndex - 1)
    }
  }

  const handleNextChapter = () => {
    if (activeChapterIndex < totalChapters - 1) {
      setActiveChapterIndex(activeChapterIndex + 1)
    }
  }

  const handleToggleComplete = (chapterId: string) => {
    const isCompleted = completedChapters.has(chapterId)
    const newCompleted = new Set(completedChapters)
    if (isCompleted) {
      newCompleted.delete(chapterId)
    } else {
      newCompleted.add(chapterId)
    }
    setCompletedChapters(newCompleted)

    if (!isDemo) {
      updateProgress.mutate({
        chapterId,
        completed: !isCompleted,
      })
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t('courses.learn.backToCourse')}</span>
          </Link>
          <div className="hidden h-6 w-px bg-gray-200 dark:bg-gray-700 sm:block" />
          <h1 className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
            {course.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
            {completedCount}/{totalChapters}
          </span>
          <ProgressBar progress={overallProgress} showLabel={false} size="sm" className="w-24 sm:w-32" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {overallProgress}%
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            'w-80 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50',
            'absolute inset-y-0 left-0 z-20 mt-[57px] transform transition-transform lg:relative lg:mt-0 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="p-4">
            <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              {t('courses.learn.sidebar.chapters')}
            </h2>
            <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              {t('courses.learn.sidebar.progress')}: {completedCount}/{totalChapters}
            </p>
          </div>
          <nav className="space-y-1 px-2 pb-4">
            {chapters.map((chapter, index) => {
              const isCompleted = completedChapters.has(chapter.id)
              const isActive = index === activeChapterIndex

              return (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(index)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  )}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className={cn('h-5 w-5', isActive ? 'text-blue-500' : 'text-gray-400')} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn('line-clamp-2 font-medium', isActive && 'text-blue-700 dark:text-blue-300')}>
                      {chapter.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {t('courses.chapter.duration', { minutes: chapter.duration.toString() })}
                    </p>
                  </div>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {activeChapter ? (
            <div className="mx-auto max-w-3xl px-6 py-8">
              {/* Chapter Header */}
              <div className="mb-8">
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('courses.chapter.title', { number: (activeChapterIndex + 1).toString() })}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeChapter.title}
                </h2>
                {activeChapter.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {activeChapter.description}
                  </p>
                )}
              </div>

              {/* Chapter Content */}
              {activeChapter.content && (
                <div className="prose prose-gray max-w-none dark:prose-invert">
                  {activeChapter.content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return (
                        <h1 key={i} className="text-2xl font-bold text-gray-900 dark:text-white">
                          {line.slice(2)}
                        </h1>
                      )
                    }
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={i} className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                          {line.slice(3)}
                        </h2>
                      )
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <li key={i} className="ml-4 text-gray-700 dark:text-gray-300">
                          {line.slice(2)}
                        </li>
                      )
                    }
                    if (line.startsWith('> ')) {
                      return (
                        <blockquote
                          key={i}
                          className="border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 text-gray-700 dark:bg-blue-900/20 dark:text-gray-300"
                        >
                          {line.slice(2)}
                        </blockquote>
                      )
                    }
                    if (line.trim() === '') {
                      return <br key={i} />
                    }
                    // Handle bold text
                    const parts = line.split(/\*\*(.*?)\*\*/)
                    return (
                      <p key={i} className="text-gray-700 dark:text-gray-300">
                        {parts.map((part, j) =>
                          j % 2 === 1 ? (
                            <strong key={j} className="font-semibold text-gray-900 dark:text-white">
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    )
                  })}
                </div>
              )}

              {/* Complete Chapter Button */}
              <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                <button
                  onClick={() => handleToggleComplete(activeChapter.id)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    completedChapters.has(activeChapter.id)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  {completedChapters.has(activeChapter.id) ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {t('courses.chapter.completed')}
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4" />
                      {t('courses.learn.completeChapter')}
                    </>
                  )}
                </button>
              </div>

              {/* Previous/Next Navigation */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
                <button
                  onClick={handlePrevChapter}
                  disabled={activeChapterIndex === 0}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('courses.learn.prevChapter')}
                </button>
                <button
                  onClick={handleNextChapter}
                  disabled={activeChapterIndex === totalChapters - 1}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  {t('courses.learn.nextChapter')}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {t('courses.chapter.noChapters')}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
