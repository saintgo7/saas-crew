'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Mail, User, Loader2, Check, AlertCircle } from 'lucide-react'
import { projectsApi } from '@/lib/api/projects'
import { useTranslations } from '@/i18n/LanguageContext'

interface InviteModalProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
}

const roles = [
  { value: 'ADMIN', label: 'Admin', description: 'Can manage members and settings' },
  { value: 'MEMBER', label: 'Member', description: 'Can contribute to the project' },
  { value: 'VIEWER', label: 'Viewer', description: 'Can only view the project' },
]

export function InviteModal({ projectId, isOpen, onClose }: InviteModalProps) {
  const t = useTranslations()
  const queryClient = useQueryClient()

  const [email, setEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState('MEMBER')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const inviteMutation = useMutation({
    mutationFn: (data: { email: string; role: string }) =>
      projectsApi.createInvitation(projectId, data),
    onSuccess: () => {
      setSuccess(true)
      setEmail('')
      queryClient.invalidateQueries({ queryKey: ['project-invitations', projectId] })
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1500)
    },
    onError: (err: any) => {
      setError(err.message || t('projects.invite.error'))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError(t('projects.invite.emailRequired'))
      return
    }

    if (!email.includes('@')) {
      setError(t('projects.invite.invalidEmail'))
      return
    }

    inviteMutation.mutate({ email, role: selectedRole })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('projects.invite.title')}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div className="flex flex-col items-center py-8">
            <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {t('projects.invite.sent')}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('projects.invite.sentDescription')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('projects.invite.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('projects.invite.emailPlaceholder')}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('projects.invite.role')}
              </label>
              <div className="space-y-2">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                      selectedRole === role.value
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={selectedRole === role.value}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t(`projects.team.roles.${role.value.toLowerCase()}`)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(`projects.invite.roleDesc.${role.value.toLowerCase()}`)}
                      </p>
                    </div>
                    {selectedRole === role.value && (
                      <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={inviteMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {inviteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('projects.invite.sending')}
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    {t('projects.invite.send')}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
