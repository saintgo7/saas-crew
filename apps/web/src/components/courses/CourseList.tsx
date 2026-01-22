'use client'

import { useState } from 'react'
import { useCourses } from '@/lib/hooks/use-courses'
import { CourseCard } from './CourseCard'
import { AlertCircle, Loader2, BookOpen } from 'lucide-react'
import type { CourseLevel } from '@/lib/api/types'

const levelFilters = [
  { value: undefined, label: '전체' },
  { value: 'JUNIOR' as CourseLevel, label: 'Junior' },
  { value: 'SENIOR' as CourseLevel, label: 'Senior' },
  { value: 'MASTER' as CourseLevel, label: 'Master' },
]

export function CourseList() {
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | undefined>(
    undefined
  )

  const { data, isLoading, error } = useCourses({
    level: selectedLevel,
    pageSize: 20,
  })

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              코스 목록을 불러오는데 실패했습니다
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

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {levelFilters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setSelectedLevel(filter.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedLevel === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              코스를 불러오는 중...
            </p>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && data && (
        <>
          {data.courses.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  표시할 코스가 없습니다
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {/* Course Count */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                총 {data.total}개의 코스
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
