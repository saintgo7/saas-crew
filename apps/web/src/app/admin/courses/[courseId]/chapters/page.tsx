'use client'

export const runtime = 'edge';

import { useState, use } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Video,
  GripVertical,
  Play,
  Clock,
  FileText,
  Upload,
  X,
  Save,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface Chapter {
  id: string
  title: string
  slug: string
  order: number
  duration: number
  videoUrl?: string
  content?: string
  createdAt: string
}

interface CourseDetail {
  id: string
  title: string
  slug: string
  chapters: Chapter[]
}

interface ChapterFormData {
  title: string
  slug: string
  order: number
  duration: number
  videoUrl: string
  content: string
}

export default function ChaptersPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = use(params)
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<ChapterFormData>({
    title: '',
    slug: '',
    order: 0,
    duration: 0,
    videoUrl: '',
    content: '',
  })

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['admin-course', courseId],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch course')
      const data = await res.json()
      return data.course as CourseDetail
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: ChapterFormData) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create chapter')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-course', courseId] })
      closeModal()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ChapterFormData }) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/chapters/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update chapter')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-course', courseId] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (chapterId: string) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/chapters/${chapterId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete chapter')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-course', courseId] })
      setDeleteConfirm(null)
    },
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const openCreateModal = () => {
    setEditingChapter(null)
    setFormData({
      title: '',
      slug: '',
      order: (course?.chapters.length || 0) + 1,
      duration: 0,
      videoUrl: '',
      content: '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (chapter: Chapter) => {
    setEditingChapter(chapter)
    setFormData({
      title: chapter.title,
      slug: chapter.slug,
      order: chapter.order,
      duration: chapter.duration,
      videoUrl: chapter.videoUrl || '',
      content: chapter.content || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingChapter(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingChapter) {
      updateMutation.mutate({ id: editingChapter.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hrs > 0) {
      return `${hrs}시간 ${mins}분`
    }
    return `${mins}분`
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        코스를 불러오는데 실패했습니다
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/courses"
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              챕터 관리
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {course.title}
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          새 챕터 추가
        </button>
      </div>

      {/* Chapter List */}
      <div className="space-y-3">
        {course.chapters.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <Video className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              챕터가 없습니다
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              첫 번째 챕터를 추가해보세요
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              챕터 추가
            </button>
          </div>
        ) : (
          course.chapters
            .sort((a, b) => a.order - b.order)
            .map((chapter, index) => (
              <div
                key={chapter.id}
                className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Drag Handle */}
                <div className="cursor-grab text-gray-400">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Order Number */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {chapter.order}
                </div>

                {/* Chapter Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {chapter.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(chapter.duration)}
                    </span>
                    {chapter.videoUrl && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Play className="h-4 w-4" />
                        동영상 있음
                      </span>
                    )}
                    {chapter.content && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        자료 있음
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(chapter)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                    title="수정"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(chapter.id)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingChapter ? '챕터 수정' : '새 챕터 추가'}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="max-h-[60vh] space-y-4 overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    챕터 제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="예: 1. React 소개"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    슬러그
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Order & Duration */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      순서
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      예상 시간 (분)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="15"
                    />
                  </div>
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    동영상 URL
                  </label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="https://youtube.com/watch?v=... 또는 https://vimeo.com/..."
                    />
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <Upload className="h-4 w-4" />
                      업로드
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    YouTube, Vimeo 등의 동영상 URL을 입력하세요
                  </p>
                </div>

                {/* Content (Markdown) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    학습 자료 (Markdown)
                  </label>
                  <textarea
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="# 학습 목표&#10;&#10;이 챕터에서는...&#10;&#10;## 주요 내용&#10;&#10;- 항목 1&#10;- 항목 2"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingChapter ? '수정' : '추가'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              챕터 삭제
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              정말로 이 챕터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        총 {course.chapters.length}개의 챕터
      </div>
    </div>
  )
}
