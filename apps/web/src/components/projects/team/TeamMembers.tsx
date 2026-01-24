'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Users,
  Crown,
  Shield,
  User,
  Eye,
  MoreVertical,
  UserMinus,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react'
import { projectsApi } from '@/lib/api/projects'
import { useTranslations } from '@/i18n/LanguageContext'

interface Member {
  id: string
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  joinedAt: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

interface TeamMembersProps {
  projectId: string
  members: Member[]
  currentUserId?: string
  currentUserRole?: string
}

const roleIcons = {
  OWNER: Crown,
  ADMIN: Shield,
  MEMBER: User,
  VIEWER: Eye,
}

const roleColors = {
  OWNER: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
  ADMIN: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
  MEMBER: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  VIEWER: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700',
}

const roleOrder = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'] as const

export function TeamMembers({
  projectId,
  members,
  currentUserId,
  currentUserRole,
}: TeamMembersProps) {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const isOwner = currentUserRole === 'OWNER'
  const isAdmin = currentUserRole === 'ADMIN' || isOwner

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      projectsApi.updateMemberRole(projectId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      setOpenMenuId(null)
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => projectsApi.removeMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      setOpenMenuId(null)
    },
  })

  const handleRoleChange = (userId: string, newRole: string) => {
    if (confirm(t('projects.team.confirmRoleChange'))) {
      updateRoleMutation.mutate({ userId, role: newRole })
    }
  }

  const handleRemoveMember = (userId: string, userName: string) => {
    if (confirm(t('projects.team.confirmRemove', { name: userName }))) {
      removeMemberMutation.mutate(userId)
    }
  }

  const getNextRole = (currentRole: string, direction: 'up' | 'down') => {
    const currentIndex = roleOrder.indexOf(currentRole as any)
    if (direction === 'up' && currentIndex > 1) {
      // Cannot promote to OWNER
      return roleOrder[currentIndex - 1]
    }
    if (direction === 'down' && currentIndex < roleOrder.length - 1) {
      return roleOrder[currentIndex + 1]
    }
    return null
  }

  // Sort members by role
  const sortedMembers = [...members].sort((a, b) => {
    return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  })

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('projects.team.title')}
          </h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {members.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedMembers.map((member) => {
          const RoleIcon = roleIcons[member.role]
          const canManage =
            isOwner &&
            member.role !== 'OWNER' &&
            member.userId !== currentUserId
          const canAdminManage =
            isAdmin &&
            member.role !== 'OWNER' &&
            member.role !== 'ADMIN' &&
            member.userId !== currentUserId

          return (
            <div
              key={member.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-4">
                {member.user.avatar ? (
                  <img
                    src={member.user.avatar}
                    alt={member.user.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {member.user.name}
                    {member.userId === currentUserId && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({t('common.you')})
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${roleColors[member.role]}`}
                >
                  <RoleIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {t(`projects.team.roles.${member.role.toLowerCase()}`)}
                  </span>
                </div>

                {(canManage || canAdminManage) && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === member.id ? null : member.id,
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {openMenuId === member.id && (
                      <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        {isOwner && member.role !== 'ADMIN' && (
                          <button
                            onClick={() =>
                              handleRoleChange(member.userId, 'ADMIN')
                            }
                            disabled={updateRoleMutation.isPending}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <ArrowUp className="h-4 w-4" />
                            {t('projects.team.promoteToAdmin')}
                          </button>
                        )}
                        {isOwner && member.role === 'ADMIN' && (
                          <button
                            onClick={() =>
                              handleRoleChange(member.userId, 'MEMBER')
                            }
                            disabled={updateRoleMutation.isPending}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <ArrowDown className="h-4 w-4" />
                            {t('projects.team.demoteToMember')}
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleRemoveMember(member.userId, member.user.name)
                          }
                          disabled={removeMemberMutation.isPending}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          {removeMemberMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserMinus className="h-4 w-4" />
                          )}
                          {t('projects.team.remove')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
