'use client'

import { useState, useCallback } from 'react'
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin,
  Globe,
  ImageIcon,
} from 'lucide-react'
import type { User, UpdateUserInput, SocialLinks } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'

interface ProfileFormProps {
  user: User
  onSave: (data: UpdateUserInput) => Promise<void>
  onCancel: () => void
}

interface FormErrors {
  name?: string
  bio?: string
  department?: string
  avatarUrl?: string
  github?: string
  twitter?: string
  linkedin?: string
  website?: string
}

// URL validation regex
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

// GitHub username validation regex
const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

// Twitter username validation regex
const TWITTER_USERNAME_REGEX = /^[A-Za-z0-9_]{1,15}$/

// LinkedIn profile URL or username validation
const LINKEDIN_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$|^[\w-]+$/

export function ProfileForm({ user, onSave, onCancel }: ProfileFormProps) {
  const t = useTranslations()
  const [formData, setFormData] = useState<UpdateUserInput>({
    name: user.name,
    bio: user.bio || '',
    department: user.department || '',
    grade: user.grade || 1,
    avatarUrl: user.avatarUrl || user.avatar || user.profileImage || '',
    socialLinks: {
      github: user.socialLinks?.github || user.githubId || '',
      twitter: user.socialLinks?.twitter || '',
      linkedin: user.socialLinks?.linkedin || '',
      website: user.socialLinks?.website || '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState<string>('')

  // Validate individual field
  const validateField = useCallback(
    (field: string, value: string): string | undefined => {
      switch (field) {
        case 'name':
          if (!value.trim()) {
            return t('profile.validation.nameRequired')
          }
          if (value.length < 2) {
            return t('profile.validation.nameMinLength')
          }
          if (value.length > 50) {
            return t('profile.validation.nameMaxLength')
          }
          break
        case 'bio':
          if (value.length > 500) {
            return t('profile.validation.bioMaxLength')
          }
          break
        case 'department':
          if (value.length > 100) {
            return t('profile.validation.departmentMaxLength')
          }
          break
        case 'avatarUrl':
          if (value && !URL_REGEX.test(value)) {
            return t('profile.validation.invalidUrl')
          }
          break
        case 'github':
          if (value && !GITHUB_USERNAME_REGEX.test(value)) {
            return t('profile.validation.invalidGithub')
          }
          break
        case 'twitter':
          if (value && !TWITTER_USERNAME_REGEX.test(value.replace('@', ''))) {
            return t('profile.validation.invalidTwitter')
          }
          break
        case 'linkedin':
          if (value && !LINKEDIN_REGEX.test(value)) {
            return t('profile.validation.invalidLinkedin')
          }
          break
        case 'website':
          if (value && !URL_REGEX.test(value)) {
            return t('profile.validation.invalidUrl')
          }
          break
      }
      return undefined
    },
    [t]
  )

  // Handle field change with validation
  const handleFieldChange = useCallback(
    (field: string, value: string | number) => {
      if (field.startsWith('social.')) {
        const socialField = field.replace('social.', '') as keyof SocialLinks
        setFormData((prev) => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [socialField]: value,
          },
        }))
        // Validate social link field
        const error = validateField(socialField, value as string)
        setErrors((prev) => ({
          ...prev,
          [socialField]: error,
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }))
        // Validate field
        if (typeof value === 'string') {
          const error = validateField(field, value)
          setErrors((prev) => ({
            ...prev,
            [field]: error,
          }))
        }
      }
      // Clear submit status when user makes changes
      if (submitStatus !== 'idle') {
        setSubmitStatus('idle')
        setSubmitMessage('')
      }
    },
    [validateField, submitStatus]
  )

  // Validate all fields before submission
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    newErrors.name = validateField('name', formData.name || '')
    newErrors.bio = validateField('bio', formData.bio || '')
    newErrors.department = validateField('department', formData.department || '')
    newErrors.avatarUrl = validateField('avatarUrl', formData.avatarUrl || '')
    newErrors.github = validateField('github', formData.socialLinks?.github || '')
    newErrors.twitter = validateField('twitter', formData.socialLinks?.twitter || '')
    newErrors.linkedin = validateField('linkedin', formData.socialLinks?.linkedin || '')
    newErrors.website = validateField('website', formData.socialLinks?.website || '')

    // Filter out undefined errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, value]) => value !== undefined)
    ) as FormErrors

    setErrors(filteredErrors)
    return Object.keys(filteredErrors).length === 0
  }, [formData, validateField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      await onSave(formData)
      setSubmitStatus('success')
      setSubmitMessage(t('profile.saveSuccess'))
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
        setSubmitMessage('')
      }, 3000)
    } catch (err) {
      setSubmitStatus('error')
      setSubmitMessage(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get current avatar URL for preview
  const currentAvatarUrl = formData.avatarUrl || user.profileImage || user.avatar

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success/Error Feedback */}
      {submitStatus === 'success' && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>{submitMessage}</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{submitMessage}</span>
        </div>
      )}

      {/* Profile Image Section */}
      <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <h4 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
          <ImageIcon className="h-4 w-4" />
          {t('profile.avatarSection')}
        </h4>

        <div className="flex items-start gap-4">
          <div className="relative">
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover ring-2 ring-blue-500"
                onError={(e) => {
                  // Handle broken image URLs
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-blue-500">
                <UserIcon className="h-12 w-12 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <label
              htmlFor="avatarUrl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('profile.avatarUrl')}
            </label>
            <input
              id="avatarUrl"
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => handleFieldChange('avatarUrl', e.target.value)}
              placeholder={t('profile.avatarUrlPlaceholder')}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white ${
                errors.avatarUrl
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
            />
            {errors.avatarUrl && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.avatarUrl}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('profile.imageNote')}</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('profile.name')} <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white ${
              errors.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
            }`}
            required
          />
          {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
        </div>

        {/* Email (readonly) */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('profile.email')}
          </label>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('profile.bio')}
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
            rows={3}
            maxLength={500}
            className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white ${
              errors.bio
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
            }`}
            placeholder={t('profile.bioPlaceholder')}
          />
          <div className="mt-1 flex justify-between">
            {errors.bio && <p className="text-sm text-red-600 dark:text-red-400">{errors.bio}</p>}
            <p className="ml-auto text-xs text-gray-500 dark:text-gray-400">
              {(formData.bio || '').length}/500
            </p>
          </div>
        </div>

        {/* Department */}
        <div>
          <label
            htmlFor="department"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('profile.department')}
          </label>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gray-400" />
            <input
              id="department"
              type="text"
              value={formData.department}
              onChange={(e) => handleFieldChange('department', e.target.value)}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white ${
                errors.department
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
              placeholder={t('profile.departmentPlaceholder')}
            />
          </div>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department}</p>
          )}
        </div>

        {/* Grade */}
        <div>
          <label
            htmlFor="grade"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('profile.grade')}
          </label>
          <select
            id="grade"
            value={formData.grade}
            onChange={(e) => handleFieldChange('grade', Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value={1}>{t('profile.gradeYear', { year: 1 })}</option>
            <option value={2}>{t('profile.gradeYear', { year: 2 })}</option>
            <option value={3}>{t('profile.gradeYear', { year: 3 })}</option>
            <option value={4}>{t('profile.gradeYear', { year: 4 })}</option>
          </select>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <h4 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
          <LinkIcon className="h-4 w-4" />
          {t('profile.socialLinks')}
        </h4>

        {/* GitHub */}
        <div>
          <label
            htmlFor="github"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Github className="h-4 w-4" />
            GitHub
          </label>
          <div className="flex items-center">
            <span className="rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              github.com/
            </span>
            <input
              id="github"
              type="text"
              value={formData.socialLinks?.github || ''}
              onChange={(e) => handleFieldChange('social.github', e.target.value)}
              placeholder={t('profile.socialPlaceholder.github')}
              className={`w-full rounded-r-lg border px-4 py-2 focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white ${
                errors.github
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
            />
          </div>
          {errors.github && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.github}</p>
          )}
        </div>

        {/* Twitter */}
        <div>
          <label
            htmlFor="twitter"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Twitter className="h-4 w-4" />
            Twitter / X
          </label>
          <div className="flex items-center">
            <span className="rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              @
            </span>
            <input
              id="twitter"
              type="text"
              value={formData.socialLinks?.twitter || ''}
              onChange={(e) => handleFieldChange('social.twitter', e.target.value.replace('@', ''))}
              placeholder={t('profile.socialPlaceholder.twitter')}
              className={`w-full rounded-r-lg border px-4 py-2 focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white ${
                errors.twitter
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
            />
          </div>
          {errors.twitter && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.twitter}</p>
          )}
        </div>

        {/* LinkedIn */}
        <div>
          <label
            htmlFor="linkedin"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </label>
          <div className="flex items-center">
            <span className="rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              linkedin.com/in/
            </span>
            <input
              id="linkedin"
              type="text"
              value={formData.socialLinks?.linkedin || ''}
              onChange={(e) => handleFieldChange('social.linkedin', e.target.value)}
              placeholder={t('profile.socialPlaceholder.linkedin')}
              className={`w-full rounded-r-lg border px-4 py-2 focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white ${
                errors.linkedin
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
            />
          </div>
          {errors.linkedin && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.linkedin}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label
            htmlFor="website"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Globe className="h-4 w-4" />
            {t('profile.website')}
          </label>
          <input
            id="website"
            type="url"
            value={formData.socialLinks?.website || ''}
            onChange={(e) => handleFieldChange('social.website', e.target.value)}
            placeholder={t('profile.socialPlaceholder.website')}
            className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white ${
              errors.website
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
            }`}
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('common.loading')}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t('common.save')}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <X className="h-4 w-4" />
          {t('common.cancel')}
        </button>
      </div>
    </form>
  )
}
