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

interface CourseDetailProps {
  courseId: string
}

const levelColors = {
  junior: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  senior: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  master: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
}

const levelLabels = {
  junior: 'Junior',
  senior: 'Senior',
  master: 'Master',
}

const difficultyLabels = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

export function CourseDetail({ courseId }: CourseDetailProps) {
  const { data, isLoading, error } = useCourse(courseId)
  const enrollMutation = useEnrollCourse()
  const unenrollMutation = useUnenrollCourse()

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            코스 정보를 불러오는 중...
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
              코스 정보를 불러오는데 실패했습니다
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error instanceof Error
                ? error.message
                : '알 수 없는 오류가 발생했습니다'}
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
          코스를 찾을 수 없습니다
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
          코스를 찾을 수 없습니다
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
    if (!confirm('정말 수강을 취소하시겠습니까?')) return

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
                    {levelLabels[course.level]}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {difficultyLabels[course.difficulty]}
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
                <span>{Math.floor(course.duration / 60)}시간</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>{course.chaptersCount}개 챕터</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{course.enrolledCount}명 수강 중</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(course.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>

            {/* Instructor */}
            <div className="mb-6 flex items-center gap-3">
              {course.instructorImage ? (
                <Image
                  src={course.instructorImage}
                  alt={course.instructorName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  강사
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
                    {unenrollMutation.isPending ? '처리 중...' : '수강 취소'}
                  </button>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">수강 중</span>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {enrollMutation.isPending ? '처리 중...' : '수강 신청'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar (for enrolled users) */}
        {isEnrolled && enrollment && (
          <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-750">
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
              내 진도
            </h3>
            <ProgressBar progress={enrollment.progress} size="lg" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              마지막 학습:{' '}
              {enrollment.lastAccessedAt
                ? new Date(enrollment.lastAccessedAt).toLocaleDateString(
                    'ko-KR'
                  )
                : '없음'}
            </p>
          </div>
        )}
      </div>

      {/* Learning Objectives */}
      {course.learningObjectives && course.learningObjectives.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            학습 목표
          </h2>
          <ul className="space-y-2">
            {course.learningObjectives.map((objective, index) => (
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
            선수 과목
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
          강의 커리큘럼
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
            태그
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
