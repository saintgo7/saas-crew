'use client'

import type { CollaboratorInfo } from '@/hooks/useCanvasCollaboration'

interface UserCursorsProps {
  collaborators: CollaboratorInfo[]
  currentUserId?: string
}

export function UserCursors({ collaborators, currentUserId }: UserCursorsProps) {
  const otherUsers = collaborators.filter(
    (c) => c.userId !== currentUserId && c.cursor,
  )

  return (
    <>
      {otherUsers.map((user) => (
        <div
          key={user.userId}
          className="pointer-events-none fixed z-50 transition-all duration-100"
          style={{
            left: user.cursor!.x,
            top: user.cursor!.y,
          }}
        >
          {/* Cursor SVG */}
          <svg
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
          >
            <path
              d="M0 0L16 12L8 12L4 20L0 0Z"
              fill={user.color}
            />
          </svg>
          {/* Name Label */}
          <div
            className="ml-4 -mt-1 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: user.color }}
          >
            {user.name}
          </div>
        </div>
      ))}
    </>
  )
}
