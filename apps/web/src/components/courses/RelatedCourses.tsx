'use client'

import { useMemo } from 'react'
import { DEMO_COURSES } from '@/lib/data/demo-courses'
import { CourseCard } from './CourseCard'
import { useTranslations } from '@/i18n/LanguageContext'

interface RelatedCoursesProps {
  currentCourseId: string
  tags: string[]
  level: string
}

export function RelatedCourses({ currentCourseId, tags, level }: RelatedCoursesProps) {
  const t = useTranslations()

  const related = useMemo(() => {
    const tagsSet = new Set(tags.map((tag) => tag.toLowerCase()))

    const scored = DEMO_COURSES
      .filter((c) => c.id !== currentCourseId)
      .map((course) => {
        let score = 0
        // Count matching tags
        if (course.tags) {
          for (const tag of course.tags) {
            if (tagsSet.has(tag.toLowerCase())) {
              score += 2
            }
          }
        }
        // Same level bonus
        if (course.level === level) {
          score += 1
        }
        return { course, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ course }) => course)

    return scored
  }, [currentCourseId, tags, level])

  if (related.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        {t('courses.related.title')}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
