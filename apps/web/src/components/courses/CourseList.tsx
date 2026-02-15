'use client'

import { useState, useMemo } from 'react'
import { useCourses } from '@/lib/hooks/use-courses'
import { CourseCard } from './CourseCard'
import { Loader2, BookOpen, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { CourseLevel } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'
import { DEMO_COURSES } from '@/lib/data/demo-courses'

const COURSES_PER_PAGE = 12

const CATEGORY_TAGS: Record<string, string[]> = {
  Frontend: ['React', 'Vue.js', 'Svelte', 'Angular', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Three.js', 'Web', 'Frontend', 'Hooks', 'Redux', 'Composition API', 'Pinia', 'SvelteKit', 'Animation', 'Flexbox', 'Grid', 'UI', 'Responsive', 'Figma', 'Design System', 'Storybook', 'Accessibility', 'A11y', 'WCAG', 'Performance', 'Core Web Vitals', 'Optimization', 'Zustand', 'Jotai', 'State Management'],
  Backend: ['Node.js', 'Express', 'NestJS', 'Django', 'Spring Boot', 'Go', 'Gin', 'REST API', 'Python', 'Java', 'Prisma', 'Full-Stack', 'DRF', 'gRPC', 'Microservices', 'GraphQL', 'Apollo', 'API', 'API Design', 'HTTP', 'OpenAPI', 'Protobuf', 'RPC', 'Actix-web', 'Rust', 'Backend'],
  DevOps: ['Docker', 'Kubernetes', 'Helm', 'DevOps', 'CI/CD', 'GitHub Actions', 'Automation', 'AWS', 'Cloud', 'EC2', 'Lambda', 'Linux', 'Bash', 'Shell', 'CLI', 'Terraform', 'IaC', 'GCP', 'BigQuery', 'Cloud Run', 'Serverless', 'DynamoDB', 'API Gateway', 'Nginx', 'Reverse Proxy', 'Load Balancing', 'SSL', 'Prometheus', 'Grafana', 'ELK', 'Observability', 'DevSecOps'],
  Design: ['Figma', 'Design System', 'Storybook', 'UI', 'Blender', '3D Modeling', 'Rendering', 'Animation'],
  'AI/ML': ['Machine Learning', 'Python', 'scikit-learn', 'Data Science', 'LLM', 'LangChain', 'RAG', 'Prompt Engineering', 'Deep Learning', 'PyTorch', 'CNN', 'Transformer', 'Pandas', 'Data Analysis', 'Visualization', 'Kafka', 'Streaming', 'Power BI', 'Dashboard', 'DAX', 'Spark', 'PySpark', 'Big Data', 'ETL', 'Airflow', 'dbt', 'Snowflake', 'Data Engineering'],
  Database: ['SQL', 'PostgreSQL', 'Database', 'MongoDB', 'NoSQL', 'Mongoose', 'Redis', 'Caching', 'Pub/Sub', 'Database Design', 'ERD', 'Normalization', 'Architecture'],
  Mobile: ['React Native', 'Expo', 'Mobile', 'Cross-Platform', 'Flutter', 'Dart', 'Firebase', 'iOS', 'Swift', 'SwiftUI', 'Kotlin', 'Android', 'Jetpack Compose', 'KMP', 'Compose', 'Coroutines', 'Flow'],
  Security: ['Security', 'OWASP', 'XSS', 'SQL Injection', 'Ethical Hacking', 'Penetration Testing', 'Kali Linux', 'OAuth', 'JWT', 'Authentication', 'SSO', 'SAST', 'Snyk', 'SonarQube'],
}

export function CourseList() {
  const t = useTranslations()
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | undefined>(
    undefined
  )
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const levelFilters = [
    { value: undefined, label: t('courses.level.all') },
    { value: 'JUNIOR' as CourseLevel, label: t('courses.level.junior') },
    { value: 'SENIOR' as CourseLevel, label: t('courses.level.senior') },
    { value: 'MASTER' as CourseLevel, label: t('courses.level.master') },
  ]

  const categoryFilters = [
    { value: undefined, label: t('courses.categories.all') },
    { value: 'Frontend', label: t('courses.categories.frontend') },
    { value: 'Backend', label: t('courses.categories.backend') },
    { value: 'DevOps', label: t('courses.categories.devops') },
    { value: 'Design', label: t('courses.categories.design') },
    { value: 'AI/ML', label: t('courses.categories.aiml') },
    { value: 'Database', label: t('courses.categories.database') },
    { value: 'Mobile', label: t('courses.categories.mobile') },
    { value: 'Security', label: t('courses.categories.security') },
  ]

  const { data, isLoading, error } = useCourses({
    level: selectedLevel,
    pageSize: 30,
  })

  const isDemo = !!error || (!isLoading && !data)

  const filteredCourses = useMemo(() => {
    if (!isDemo) return data?.courses ?? []

    let filtered = DEMO_COURSES.filter(
      (c) => !selectedLevel || c.level === selectedLevel
    )

    if (selectedCategory && CATEGORY_TAGS[selectedCategory]) {
      const categoryTags = CATEGORY_TAGS[selectedCategory]
      filtered = filtered.filter((c) =>
        c.tags.some((tag) => categoryTags.includes(tag))
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (c.instructorName && c.instructorName.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [isDemo, data, selectedLevel, selectedCategory, searchQuery])

  const totalCount = filteredCourses.length
  const totalPages = Math.ceil(totalCount / COURSES_PER_PAGE)
  const paginatedCourses = isDemo
    ? filteredCourses.slice(
        (currentPage - 1) * COURSES_PER_PAGE,
        currentPage * COURSES_PER_PAGE
      )
    : filteredCourses

  const handleLevelChange = (level: CourseLevel | undefined) => {
    setSelectedLevel(level)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t('courses.searchPlaceholder')}
          className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* Level Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {levelFilters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => handleLevelChange(filter.value)}
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

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categoryFilters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => handleCategoryChange(filter.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === filter.value
                ? 'bg-indigo-600 text-white'
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
          {paginatedCourses.length === 0 ? (
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
                {paginatedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {/* Pagination */}
              {isDemo && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t('common.previous')}
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('common.page')} {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    {t('common.next')}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

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
