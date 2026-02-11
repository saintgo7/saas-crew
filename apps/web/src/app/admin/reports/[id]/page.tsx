'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Printer,
} from 'lucide-react'
import { useReport, useDeleteReport } from '@/lib/hooks/use-reports'
import { cn } from '@/lib/utils'
import type { ReportSections } from '@/lib/api/reports'
import { useState } from 'react'

const statusColors: Record<string, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
}

const statusLabels: Record<string, string> = {
  DRAFT: '임시저장',
  PUBLISHED: '발행',
}

const sectionLabels: Record<keyof ReportSections, string> = {
  learningSummary: '학습 현황 요약',
  achievements: '주요 성과',
  courseDetails: '코스별 상세 현황',
  issues: '이슈 및 개선사항',
  nextPlans: '차기 계획',
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { data: report, isLoading, error } = useReport(id)
  const deleteMutation = useDeleteReport()
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => router.push('/admin/reports'),
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        보고서를 불러오는데 실패했습니다
      </div>
    )
  }

  const sections = report.sections as ReportSections

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/reports"
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {report.title}
              </h1>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-xs font-medium',
                  statusColors[report.status]
                )}
              >
                {statusLabels[report.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {formatDate(report.periodStart)} ~{' '}
              {formatDate(report.periodEnd)} | 작성자: {report.author.name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Printer className="h-4 w-4" />
            인쇄
          </button>
          <Link
            href={`/admin/reports/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Edit className="h-4 w-4" />
            수정
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            삭제
          </button>
        </div>
      </div>

      {/* Summary */}
      {report.summary && (
        <div className="rounded-lg border border-gray-200 bg-blue-50 p-6 dark:border-gray-700 dark:bg-blue-900/10">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            요약
          </h2>
          <p className="whitespace-pre-wrap text-gray-900 dark:text-white">
            {report.summary}
          </p>
        </div>
      )}

      {/* Sections */}
      {(Object.keys(sectionLabels) as Array<keyof ReportSections>).map(
        (key) => {
          const content = sections[key]
          if (!content) return null
          return (
            <div
              key={key}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {sectionLabels[key]}
              </h2>
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {content}
              </div>
            </div>
          )
        }
      )}

      {/* Meta */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        작성일: {formatDate(report.createdAt)} | 수정일:{' '}
        {formatDate(report.updatedAt)}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              보고서 삭제
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              정말로 이 보고서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
