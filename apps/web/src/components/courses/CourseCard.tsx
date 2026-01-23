'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, BookOpen } from 'lucide-react'
import type { Course } from '@/lib/api/types'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/LanguageContext'

interface CourseCardProps {
  course: Course
  className?: string
}

const levelColors = {
  JUNIOR: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  SENIOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  MASTER: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
}

export function CourseCard({ course, className }: CourseCardProps) {
  const t = useTranslations()

  const getLevelLabel = (level: string) => t(`courses.level.${level.toLowerCase()}`)
  const getDifficultyLabel = (difficulty?: string) => {
    if (!difficulty) return t('courses.difficulty.beginner')
    return t(`courses.difficulty.${difficulty}`)
  }

  return (
    <Link href={`/courses/${course.id}`}>
      <article
        className={cn(
          'group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800',
          className
        )}
      >
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          {course.coverImage ? (
            <Image
              src={course.coverImage}
              alt={course.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-16 w-16 text-gray-400" />
            </div>
          )}

          {/* Level Badge */}
          <div className="absolute left-3 top-3">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold',
                levelColors[course.level]
              )}
            >
              {getLevelLabel(course.level)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
            {course.title}
          </h3>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {course.description}
          </p>

          {/* Meta Information */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{t('courses.hours', { hours: Math.floor((course.duration || 0) / 60) })}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{t('courses.chaptersCount', { count: course.chaptersCount ?? course._count?.chapters ?? 0 })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{t('courses.enrolledCount', { count: course.enrolledCount ?? course._count?.enrollments ?? 0 })}</span>
            </div>
          </div>

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {course.instructorImage ? (
                <Image
                  src={course.instructorImage}
                  alt={course.instructorName || 'Instructor'}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {course.instructorName || 'Unknown Instructor'}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {getDifficultyLabel(course.difficulty)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
