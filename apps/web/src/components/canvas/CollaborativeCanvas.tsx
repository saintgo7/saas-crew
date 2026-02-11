'use client'

import { useCallback, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import '@excalidraw/excalidraw/index.css'
import { useCanvasCollaboration } from '@/hooks/useCanvasCollaboration'
import { useUserStore } from '@/store/user-store'
import { CanvasToolbar } from './CanvasToolbar'
import { useUpdateCanvas } from '@/lib/hooks/use-canvas'

// Dynamic import of Excalidraw (no SSR)
const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((mod) => ({ default: mod.Excalidraw })),
  { ssr: false },
)

interface CollaborativeCanvasProps {
  canvasId: string
  canvasName: string
  initialData?: any
  backHref?: string
}

export function CollaborativeCanvas({
  canvasId,
  canvasName,
  initialData,
  backHref,
}: CollaborativeCanvasProps) {
  const { user } = useUserStore()
  const updateCanvas = useUpdateCanvas()
  const excalidrawAPIRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const lastSyncRef = useRef<string>('')

  const handleLoad = useCallback((data: any) => {
    if (excalidrawAPIRef.current && data) {
      const elements = data.elements || []
      const appState = data.appState || {}
      excalidrawAPIRef.current.updateScene({ elements, appState })
    }
  }, [])

  const handleSync = useCallback((data: { elements: any; appState?: any; userId: string }) => {
    if (excalidrawAPIRef.current && data.userId !== user?.id) {
      excalidrawAPIRef.current.updateScene({
        elements: data.elements,
      })
    }
  }, [user?.id])

  const {
    status,
    collaborators,
    saveStatus,
    syncElements,
    updateAwareness,
  } = useCanvasCollaboration({
    canvasId,
    onLoad: handleLoad,
    onSync: handleSync,
  })

  const handleChange = useCallback(
    (elements: readonly any[], appState: any) => {
      if (!isReady) return

      // Simple change detection: serialize element IDs and versions
      const key = elements.map((e: any) => `${e.id}:${e.version}`).join(',')
      if (key === lastSyncRef.current) return
      lastSyncRef.current = key

      syncElements([...elements], { theme: appState.theme })
    },
    [isReady, syncElements],
  )

  const handlePointerUpdate = useCallback(
    (payload: { pointer: { x: number; y: number }; button: string }) => {
      updateAwareness(payload.pointer)
    },
    [updateAwareness],
  )

  const handleNameChange = (newName: string) => {
    updateCanvas.mutate({ id: canvasId, data: { name: newName } })
  }

  return (
    <div className="flex h-full flex-col">
      <CanvasToolbar
        canvasName={canvasName}
        onNameChange={handleNameChange}
        collaborators={collaborators}
        connectionStatus={status}
        saveStatus={saveStatus}
        backHref={backHref}
      />

      <div className="relative flex-1">
        <Excalidraw
          excalidrawAPI={(api: any) => {
            excalidrawAPIRef.current = api
          }}
          initialData={initialData ? {
            elements: initialData.elements || [],
            appState: {
              ...(initialData.appState || {}),
              collaborators: new Map(
                collaborators.map((c) => [
                  c.userId,
                  { username: c.name, color: { background: c.color, stroke: c.color } },
                ]),
              ),
            },
          } : undefined}
          onChange={handleChange}
          onPointerUpdate={handlePointerUpdate}
          onPointerDown={() => setIsReady(true)}
          UIOptions={{
            canvasActions: {
              export: { saveFileToDisk: true },
            },
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
