'use client'

import { useState } from 'react'
import { Plus, Loader2, Paintbrush, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCanvases, useCreateCanvas, useDeleteCanvas } from '@/lib/hooks/use-canvas'
import { CanvasCard } from '@/components/canvas/CanvasCard'
import type { Canvas } from '@/lib/api/canvas'
import { useTranslations } from '@/i18n/LanguageContext'
import { useUserStore } from '@/store/user-store'
import { useRouter } from 'next/navigation'

export default function CanvasListPage() {
  const t = useTranslations()
  const router = useRouter()
  const { user } = useUserStore()
  const { data: canvases, isLoading, error } = useCanvases()
  const createCanvas = useCreateCanvas()
  const deleteCanvas = useDeleteCanvas()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!user) return
    setIsCreating(true)
    try {
      const canvas = await createCanvas.mutateAsync({
        name: `Canvas ${new Date().toLocaleDateString()}`,
      })
      router.push(`/canvas/${canvas.id}`)
    } catch (err) {
      console.error('Failed to create canvas:', err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = (id: string) => {
    deleteCanvas.mutate(id)
  }

  // Demo data fallback
  const demoCanvases = [
    {
      id: 'demo-1',
      name: 'Architecture Diagram',
      description: 'System architecture overview',
      ownerId: 'demo',
      owner: { id: 'demo', name: 'Demo User' },
      isPublic: true,
      _count: { members: 3 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      name: 'UI Wireframe',
      description: 'Landing page wireframe',
      ownerId: 'demo',
      owner: { id: 'demo', name: 'Demo User' },
      isPublic: true,
      _count: { members: 2 },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]

  const displayCanvases = canvases && canvases.length > 0 ? canvases : (error ? demoCanvases : canvases)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('canvas.title')}
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {t('canvas.subtitle')}
          </p>
        </div>
        {user && (
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {t('canvas.create')}
          </button>
        )}
      </div>

      {/* Demo Banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {t('canvas.demoBanner')}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Canvas Grid */}
      {!isLoading && displayCanvases && displayCanvases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {displayCanvases.map((canvas: Canvas) => (
            <CanvasCard
              key={canvas.id}
              canvas={canvas}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && (!displayCanvases || displayCanvases.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20">
          <Paintbrush className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('canvas.noCanvases')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('canvas.createFirst')}
          </p>
          {user && (
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {t('canvas.create')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
