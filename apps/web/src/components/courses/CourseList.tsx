'use client'

import { useState } from 'react'
import { useCourses } from '@/lib/hooks/use-courses'
import { CourseCard } from './CourseCard'
import { Loader2, BookOpen } from 'lucide-react'
import type { Course, CourseLevel } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'

const DEMO_COURSES: Course[] = [
  {
    id: 'demo-c1',
    slug: 'git-github-basics',
    title: 'Git & GitHub 완전 정복',
    description: 'Git 기초부터 GitHub 협업까지. 브랜치, 머지, PR, 코드 리뷰 등 실무에서 바로 쓸 수 있는 Git 워크플로우를 배웁니다.',
    level: 'JUNIOR',
    difficulty: 'beginner',
    duration: 480,
    chaptersCount: 8,
    enrolledCount: 24,
    tags: ['Git', 'GitHub', 'Version Control'],
    instructorName: 'Go Seongmin',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'demo-c2',
    slug: 'typescript-fundamentals',
    title: 'TypeScript 기초부터 실전까지',
    description: '타입 시스템, 제네릭, 유틸리티 타입 등 TypeScript 핵심 개념을 학습하고 Next.js 프로젝트에 적용합니다.',
    level: 'JUNIOR',
    difficulty: 'beginner',
    duration: 720,
    chaptersCount: 12,
    enrolledCount: 18,
    tags: ['TypeScript', 'JavaScript', 'Web'],
    instructorName: 'Kim Jihye',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 'demo-c3',
    slug: 'react-hooks-patterns',
    title: 'React Hooks & 디자인 패턴',
    description: 'useState, useEffect를 넘어 커스텀 훅, Context API, 상태 관리 패턴까지 React 고급 기법을 다룹니다.',
    level: 'SENIOR',
    difficulty: 'intermediate',
    duration: 600,
    chaptersCount: 10,
    enrolledCount: 12,
    tags: ['React', 'Hooks', 'State Management'],
    instructorName: 'Park Junhyuk',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-02-08T00:00:00Z',
  },
  {
    id: 'demo-c4',
    slug: 'docker-deployment',
    title: 'Docker로 배우는 배포 자동화',
    description: 'Dockerfile 작성, Docker Compose, CI/CD 파이프라인 구축까지. 실제 서비스 배포 경험을 쌓습니다.',
    level: 'SENIOR',
    difficulty: 'intermediate',
    duration: 540,
    chaptersCount: 9,
    enrolledCount: 8,
    tags: ['Docker', 'CI/CD', 'DevOps'],
    instructorName: 'Lee Dongwoo',
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'demo-c5',
    slug: 'nestjs-api-design',
    title: 'NestJS REST API 설계',
    description: 'NestJS 모듈 시스템, Prisma ORM, 인증/인가, Swagger 문서화까지 백엔드 API 설계의 모든 것.',
    level: 'MASTER',
    difficulty: 'advanced',
    duration: 900,
    chaptersCount: 15,
    enrolledCount: 6,
    tags: ['NestJS', 'REST API', 'Prisma'],
    instructorName: 'Go Seongmin',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
  },
]

export function CourseList() {
  const t = useTranslations()
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | undefined>(
    undefined
  )

  const levelFilters = [
    { value: undefined, label: t('courses.level.all') },
    { value: 'JUNIOR' as CourseLevel, label: t('courses.level.junior') },
    { value: 'SENIOR' as CourseLevel, label: t('courses.level.senior') },
    { value: 'MASTER' as CourseLevel, label: t('courses.level.master') },
  ]

  const { data, isLoading, error } = useCourses({
    level: selectedLevel,
    pageSize: 20,
  })

  const isDemo = !!error || (!isLoading && !data)
  const courses = isDemo
    ? DEMO_COURSES.filter((c) => !selectedLevel || c.level === selectedLevel)
    : data?.courses ?? []
  const totalCount = isDemo ? courses.length : data?.total ?? 0

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      {isDemo && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t('courses.demoBanner')}
          </p>
        </div>
      )}

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
              {t('courses.loading')}
            </p>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && (
        <>
          {courses.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {t('courses.noCoursesToShow')}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {/* Course Count */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('courses.totalCourses', { count: totalCount })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
