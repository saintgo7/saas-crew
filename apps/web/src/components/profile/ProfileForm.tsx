'use client'

import { useState } from 'react'
import { User as UserIcon, Mail, GraduationCap, Save, X } from 'lucide-react'
import type { User, UpdateUserInput } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'

interface ProfileFormProps {
  user: User
  onSave: (data: UpdateUserInput) => Promise<void>
  onCancel: () => void
}

export function ProfileForm({ user, onSave, onCancel }: ProfileFormProps) {
  const t = useTranslations()
  const [formData, setFormData] = useState<UpdateUserInput>({
    name: user.name,
    bio: user.bio || '',
    department: user.department || '',
    grade: user.grade || 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await onSave(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Profile Image */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {user.profileImage || user.avatar ? (
            <img
              src={user.profileImage || user.avatar}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover ring-2 ring-blue-500"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-blue-500">
              <UserIcon className="h-12 w-12 text-white" />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('profile.imageNote')}
          </p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('profile.name')}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Email (readonly) */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('profile.email')}
        </label>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('profile.bio')}
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder={t('profile.bioPlaceholder')}
        />
      </div>

      {/* Department */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('profile.department')}
        </label>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder={t('profile.departmentPlaceholder')}
          />
        </div>
      </div>

      {/* Grade */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('profile.grade')}
        </label>
        <select
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value={1}>{t('profile.gradeYear', { year: 1 })}</option>
          <option value={2}>{t('profile.gradeYear', { year: 2 })}</option>
          <option value={3}>{t('profile.gradeYear', { year: 3 })}</option>
          <option value={4}>{t('profile.gradeYear', { year: 4 })}</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? t('common.loading') : t('common.save')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <X className="h-4 w-4" />
          {t('common.cancel')}
        </button>
      </div>
    </form>
  )
}
