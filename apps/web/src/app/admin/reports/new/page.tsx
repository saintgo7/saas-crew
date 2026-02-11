'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Send, BarChart3 } from 'lucide-react'
import { useCreateReport, useLearningStats } from '@/lib/hooks/use-reports'
import type { ReportSections } from '@/lib/api/reports'

const sectionConfig = [
  {
    key: 'learningSummary' as const,
    label: '학습 현황 요약',
    placeholder: '해당 기간 전체 학습 운영 현황을 요약합니다',
  },
  {
    key: 'achievements' as const,
    label: '주요 성과',
    placeholder: '목표 달성, 수료 현황, 우수 학습자 등',
  },
  {
    key: 'courseDetails' as const,
    label: '코스별 상세 현황',
    placeholder: '각 코스의 수강 인원, 완료율, 만족도 등',
  },
  {
    key: 'issues' as const,
    label: '이슈 및 개선사항',
    placeholder: '운영 중 발생한 문제, 개선이 필요한 사항',
  },
  {
    key: 'nextPlans' as const,
    label: '차기 계획',
    placeholder: '다음 기간 학습 운영 계획',
  },
]

export default function NewReportPage() {
  const router = useRouter()
  const createMutation = useCreateReport()

  const [title, setTitle] = useState('')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [summary, setSummary] = useState('')
  const [sections, setSections] = useState<ReportSections>({
    learningSummary: '',
    achievements: '',
    courseDetails: '',
    issues: '',
    nextPlans: '',
  })
  const [showStats, setShowStats] = useState(false)

  const { data: stats, isLoading: statsLoading } = useLearningStats(
    periodStart ? new Date(periodStart).toISOString() : '',
    periodEnd ? new Date(periodEnd).toISOString() : '',
    !!(periodStart && periodEnd)
  )

  const handleSectionChange = (key: keyof ReportSections, value: string) => {
    setSections((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title || !periodStart || !periodEnd) return

    createMutation.mutate(
      {
        title,
        periodStart: new Date(periodStart).toISOString(),
        periodEnd: new Date(periodEnd).toISOString(),
        summary: summary || undefined,
        sections,
        status,
      },
      {
        onSuccess: () => router.push('/admin/reports'),
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/reports"
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            새 보고서 작성
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            학습 운영 보고서 템플릿에 맞춰 작성합니다
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              기본 정보
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  보고서 제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 2026년 1월 학습 운영 보고서"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    시작일
                  </label>
                  <input
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    종료일
                  </label>
                  <input
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  요약 (선택)
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="보고서 전체 요약"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          {sectionConfig.map((section) => (
            <div
              key={section.key}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {section.label}
              </h2>
              <textarea
                value={sections[section.key]}
                onChange={(e) =>
                  handleSectionChange(section.key, e.target.value)
                }
                placeholder={section.placeholder}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          ))}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit('DRAFT')}
              disabled={createMutation.isPending || !title || !periodStart || !periodEnd}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Save className="h-4 w-4" />
              임시 저장
            </button>
            <button
              onClick={() => handleSubmit('PUBLISHED')}
              disabled={createMutation.isPending || !title || !periodStart || !periodEnd}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              발행
            </button>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                학습 통계 참고
              </h2>
              <button
                onClick={() => setShowStats(!showStats)}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <BarChart3 className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {!periodStart || !periodEnd ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                보고 기간을 설정하면 해당 기간의 학습 통계를 확인할 수 있습니다
              </p>
            ) : statsLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              </div>
            ) : stats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      총 수강
                    </p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {stats.totalEnrollments}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      완료
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {stats.completedEnrollments}
                    </p>
                  </div>
                  <div className="col-span-2 rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      완료율
                    </p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {stats.completionRate}%
                    </p>
                  </div>
                </div>

                {stats.courses.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      코스별 현황
                    </h3>
                    <div className="space-y-2">
                      {stats.courses
                        .filter((c) => c.periodEnrollments > 0)
                        .map((course) => (
                          <div
                            key={course.id}
                            className="rounded-lg border border-gray-100 p-2 dark:border-gray-700"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.title}
                            </p>
                            <div className="mt-1 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>수강 {course.periodEnrollments}</span>
                              <span>완료 {course.periodCompleted}</span>
                              <span>평균 {course.avgProgress}%</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                통계를 불러올 수 없습니다
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
