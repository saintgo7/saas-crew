'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, Paintbrush } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProjectCanvases, useCreateCanvas } from '@/lib/hooks/use-canvas'
import { CanvasCard } from '@/components/canvas/CanvasCard'
import { useDeleteCanvas } from '@/lib/hooks/use-canvas'
import { useTranslations } from '@/i18n/LanguageContext'
import { useUserStore } from '@/store/user-store'

interface ProjectCanvasProps {
  projectId: string
}

export function ProjectCanvas({ projectId }: ProjectCanvasProps) {
  const t = useTranslations()
  const router = useRouter()
  const { user } = useUserStore()
  const { data: canvases, isLoading } = useProjectCanvases(projectId)
  const createCanvas = useCreateCanvas()
  const deleteCanvas = useDeleteCanvas()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!user) return
    setIsCreating(true)
    try {
      const canvas = await createCanvas.mutateAsync({
        name: `Canvas ${new Date().toLocaleDateString()}`,
        projectId,
      })
      router.push(`/canvas/${canvas.id}`)
    } catch (err) {
      console.error('Failed to create canvas:', err)
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!canvases || canvases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Paintbrush className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('canvas.noCanvases')}
        </p>
        {user && (
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="mt-3 flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {t('canvas.create')}
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('canvas.title')}
        </h3>
        {user && (
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            {t('canvas.create')}
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {canvases.map((canvas: any) => (
          <CanvasCard
            key={canvas.id}
            canvas={canvas}
            onDelete={(id) => deleteCanvas.mutate(id)}
          />
        ))}
      </motion.div>
    </div>
  )
}
