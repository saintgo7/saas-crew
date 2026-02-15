'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Mail,
  Clock,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { projectsApi } from '@/lib/api/projects'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'

interface PendingInvitationsProps {
  projectId: string
}

export function PendingInvitations({ projectId }: PendingInvitationsProps) {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS
  const queryClient = useQueryClient()

  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['project-invitations', projectId],
    queryFn: () => projectsApi.getInvitations(projectId),
  })

  const cancelMutation = useMutation({
    mutationFn: (invitationId: string) =>
      projectsApi.cancelInvitation(projectId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-invitations', projectId] })
    },
  })

  const handleCancel = (invitationId: string) => {
    if (confirm(t('projects.invite.confirmCancel'))) {
      cancelMutation.mutate(invitationId)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return null // Silently fail for invitations
  }

  const pendingInvitations = invitations?.filter(
    (inv: any) => inv.status === 'PENDING',
  )

  if (!pendingInvitations || pendingInvitations.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('projects.invite.pending')}
          </h3>
          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            {pendingInvitations.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {pendingInvitations.map((invitation: any) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between px-6 py-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {invitation.email || invitation.userId}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {t('projects.invite.expiresIn', {
                      time: formatDistanceToNow(new Date(invitation.expiresAt), {
                        locale: dateLocale,
                      }),
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {t(`projects.team.roles.${invitation.role.toLowerCase()}`)}
              </span>
              <button
                onClick={() => handleCancel(invitation.id)}
                disabled={cancelMutation.isPending}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400"
                title={t('projects.invite.cancel')}
              >
                {cancelMutation.isPending &&
                cancelMutation.variables === invitation.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
