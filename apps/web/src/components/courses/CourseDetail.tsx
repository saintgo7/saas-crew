'use client'

import { useCourse, useEnrollCourse, useUnenrollCourse } from '@/lib/hooks/use-courses'
import { ChapterList } from './ChapterList'
import { ProgressBar } from './ProgressBar'
import Image from 'next/image'
import {
  AlertCircle,
  BookOpen,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

interface CourseDetailProps {
  courseId: string
}

const levelColors = {
  JUNIOR: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  SENIOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  MASTER: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
}

export function CourseDetail({ courseId }: CourseDetailProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const { data, isLoading, error } = useCourse(courseId)
  const enrollMutation = useEnrollCourse()
  const unenrollMutation = useUnenrollCourse()

  const getLevelLabel = (level: string) => t(`courses.level.${level.toLowerCase()}`)
  const getDifficultyLabel = (difficulty?: string) => {
    if (!difficulty) return t('courses.difficulty.beginner')
    return t(`courses.difficulty.${difficulty}`)
  }

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

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              {t('courses.errorDetail')}
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error instanceof Error
                ? error.message
                : t('courses.unknownError')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          {t('courses.notFound')}
        </p>
      </div>
    )
  }

  // Support both response formats
  const course = 'course' in data ? data.course : data
  const enrollment = 'enrollment' in data ? data.enrollment : undefined
  const isEnrolled = 'isEnrolled' in data ? data.isEnrolled : false

  if (!course) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          {t('courses.notFound')}
        </p>
      </div>
    )
  }

  const handleEnroll = async () => {
    try {
      await enrollMutation.mutateAsync(courseId)
    } catch (err) {
      console.error('Failed to enroll:', err)
    }
  }

  const handleUnenroll = async () => {
    if (!confirm(t('courses.confirmUnenroll'))) return

    try {
      await unenrollMutation.mutateAsync(courseId)
    } catch (err) {
      console.error('Failed to unenroll:', err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cover Image */}
          <div className="relative h-64 lg:col-span-1 lg:h-auto">
            {course.coverImage ? (
              <Image
                src={course.coverImage}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                <BookOpen className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="p-6 lg:col-span-2">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold',
                      levelColors[course.level]
                    )}
                  >
                    {getLevelLabel(course.level)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getDifficultyLabel(course.difficulty)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {course.title}
                </h1>
              </div>
            </div>

            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {course.description}
            </p>

            {/* Meta Info */}
            <div className="mb-6 flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{t('courses.hours', { hours: Math.floor(course.duration / 60) })}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>{t('courses.chaptersCount', { count: course.chaptersCount ?? course._count?.chapters ?? 0 })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{t('courses.enrolledCount', { count: course.enrolledCount ?? course._count?.enrollments ?? 0 })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(course.createdAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}
                </span>
              </div>
            </div>

            {/* Instructor */}
            <div className="mb-6 flex items-center gap-3">
              {course.instructorImage ? (
                <Image
                  src={course.instructorImage}
                  alt={course.instructorName || 'Instructor'}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('courses.instructor')}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {course.instructorName}
                </p>
              </div>
            </div>

            {/* Enrollment Button */}
            <div className="flex items-center gap-4">
              {isEnrolled ? (
                <>
                  <button
                    onClick={handleUnenroll}
                    disabled={unenrollMutation.isPending}
                    className="rounded-lg border border-red-600 px-6 py-2 font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-900/20"
                  >
                    {unenrollMutation.isPending ? t('courses.processing') : t('courses.detail.unenroll')}
                  </button>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{t('courses.detail.enrolled')}</span>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {enrollMutation.isPending ? t('courses.processing') : t('courses.detail.enroll')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar (for enrolled users) */}
        {isEnrolled && enrollment && (
          <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-750">
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
              {t('courses.detail.progress')}
            </h3>
            <ProgressBar progress={enrollment.progress} size="lg" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('courses.lastAccess')}:{' '}
              {enrollment.lastAccessedAt
                ? new Date(enrollment.lastAccessedAt).toLocaleDateString(
                    locale === 'ko' ? 'ko-KR' : 'en-US'
                  )
                : t('courses.none')}
            </p>
          </div>
        )}
      </div>

      {/* Learning Objectives */}
      {course.topics && course.topics.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            {t('courses.detail.objectives')}
          </h2>
          <ul className="space-y-2">
            {course.topics.map((objective, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prerequisites */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            {t('courses.detail.prerequisites')}
          </h2>
          <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
            {course.prerequisites.map((prerequisite, index) => (
              <li key={index}>{prerequisite}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Chapters */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {t('courses.detail.curriculum')}
        </h2>
        <ChapterList
          chapters={course.chapters}
          chaptersProgress={enrollment?.chaptersProgress}
          isEnrolled={isEnrolled}
        />
      </div>

      {/* Tags */}
      {course.tags && course.tags.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            {t('courses.detail.tags')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
