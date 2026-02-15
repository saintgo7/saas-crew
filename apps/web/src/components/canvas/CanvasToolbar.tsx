'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Share2, Users, Wifi, WifiOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { CollaboratorInfo, ConnectionStatus } from '@/hooks/useCanvasCollaboration'
import { useTranslations } from '@/i18n/LanguageContext'

interface CanvasToolbarProps {
  canvasName: string
  onNameChange?: (name: string) => void
  collaborators: CollaboratorInfo[]
  connectionStatus: ConnectionStatus
  saveStatus: 'saved' | 'saving' | 'unsaved'
  backHref?: string
}

export function CanvasToolbar({
  canvasName,
  onNameChange,
  collaborators,
  connectionStatus,
  saveStatus,
  backHref = '/canvas',
}: CanvasToolbarProps) {
  const t = useTranslations()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(canvasName)

  const handleNameSubmit = () => {
    if (editName.trim() && editName !== canvasName) {
      onNameChange?.(editName.trim())
    }
    setIsEditing(false)
  }

  return (
    <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      {/* Left: Back + Name */}
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            className="rounded border border-blue-500 bg-transparent px-2 py-1 text-lg font-semibold outline-none dark:text-white"
            autoFocus
          />
        ) : (
          <button
            onClick={() => {
              setEditName(canvasName)
              setIsEditing(true)
            }}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          >
            {canvasName}
          </button>
        )}
      </div>

      {/* Right: Status + Collaborators */}
      <div className="flex items-center gap-3">
        {/* Save Status */}
        <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t('canvas.saving')}
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Save className="h-3.5 w-3.5" />
              {t('canvas.saved')}
            </>
          )}
        </span>

        {/* Connection Status */}
        <span className="flex items-center gap-1.5">
          {connectionStatus === 'connected' ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : connectionStatus === 'connecting' ? (
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
        </span>

        {/* Collaborators */}
        {collaborators.length > 0 && (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-400" />
            <div className="flex -space-x-2">
              {collaborators.slice(0, 5).map((user) => (
                <div
                  key={user.userId}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white dark:border-gray-900"
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {collaborators.length > 5 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-400 text-xs font-medium text-white dark:border-gray-900">
                  +{collaborators.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
