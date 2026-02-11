'use client'

import Link from 'next/link'
import { Users, Clock, MoreVertical, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { Canvas } from '@/lib/api/canvas'
import { useTranslations } from '@/i18n/LanguageContext'

interface CanvasCardProps {
  canvas: Canvas
  onDelete?: (id: string) => void
}

export function CanvasCard({ canvas, onDelete }: CanvasCardProps) {
  const t = useTranslations()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const timeAgo = getTimeAgo(canvas.updatedAt)

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {/* Thumbnail / Preview */}
      <Link href={`/canvas/${canvas.id}`} className="block">
        <div className="relative aspect-video bg-gray-50 dark:bg-gray-900">
          {canvas.thumbnail ? (
            <img
              src={canvas.thumbnail}
              alt={canvas.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-4xl text-gray-300 dark:text-gray-600">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <Link href={`/canvas/${canvas.id}`} className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {canvas.name}
            </h3>
            {canvas.description && (
              <p className="mt-0.5 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                {canvas.description}
              </p>
            )}
          </Link>

          {/* Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    if (window.confirm(t('canvas.confirmDelete'))) {
                      onDelete?.(canvas.id)
                    }
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('canvas.delete')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {canvas._count?.members || 1}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>
          <span className="flex items-center gap-1">
            {canvas.owner.name}
          </span>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
