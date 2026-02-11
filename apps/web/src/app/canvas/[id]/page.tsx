'use client'

import { use } from 'react'
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import '@excalidraw/excalidraw/index.css'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useCanvas } from '@/lib/hooks/use-canvas'
import { CollaborativeCanvas } from '@/components/canvas/CollaborativeCanvas'

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((mod) => ({ default: mod.Excalidraw })),
  { ssr: false },
)

const DEMO_CANVASES: Record<string, { name: string }> = {
  'demo-1': { name: 'Architecture Diagram' },
  'demo-2': { name: 'UI Wireframe' },
}

interface CanvasPageProps {
  params: Promise<{ id: string }>
}

export default function CanvasPage({ params }: CanvasPageProps) {
  const { id } = use(params)
  const demo = DEMO_CANVASES[id]
  const { data: canvas, isLoading, error } = useCanvas(id, { enabled: !demo })

  if (demo) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col">
        <div className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
          <Link
            href="/canvas"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {demo.name}
          </span>
          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Demo
          </span>
        </div>
        <div className="relative flex-1">
          <Excalidraw
            UIOptions={{
              canvasActions: { export: { saveFileToDisk: true } },
            }}
            theme={
              typeof window !== 'undefined' &&
              document.documentElement.classList.contains('dark')
                ? 'dark'
                : 'light'
            }
          />
        </div>
      </div>
    )
  }

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
