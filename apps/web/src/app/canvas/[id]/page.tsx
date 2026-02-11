'use client'

import { use } from 'react'
import { Loader2 } from 'lucide-react'
import { useCanvas } from '@/lib/hooks/use-canvas'
import { CollaborativeCanvas } from '@/components/canvas/CollaborativeCanvas'

interface CanvasPageProps {
  params: Promise<{ id: string }>
}

export default function CanvasPage({ params }: CanvasPageProps) {
  const { id } = use(params)
  const { data: canvas, isLoading, error } = useCanvas(id)

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !canvas) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Canvas not found
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)]">
      <CollaborativeCanvas
        canvasId={canvas.id}
        canvasName={canvas.name}
        initialData={canvas.data}
      />
    </div>
  )
}
