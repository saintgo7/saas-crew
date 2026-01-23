'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Save,
  X,
  Plus,
  Github,
  ExternalLink,
  Eye,
  Lock,
} from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/lib/api/types'

interface ProjectFormProps {
  mode: 'create' | 'edit'
  project?: Project
  onSubmit: (data: CreateProjectInput) => Promise<Project>
  isSubmitting?: boolean
  error?: Error | null
}

export function ProjectForm({
  mode,
  project,
  onSubmit,
  isSubmitting = false,
  error,
}: ProjectFormProps) {
  const t = useTranslations()
  const router = useRouter()

  const [formData, setFormData] = useState<CreateProjectInput>({
    name: '',
    description: '',
    visibility: 'PUBLIC',
    tags: [],
    techStack: [],
    githubRepo: '',
    deployUrl: '',
    coverImage: '',
  })

  const [newTag, setNewTag] = useState('')
  const [newTech, setNewTech] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Initialize form with existing project data in edit mode
  useEffect(() => {
    if (mode === 'edit' && project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        visibility: project.visibility || 'PUBLIC',
        tags: project.tags || [],
        techStack: (project as any).techStack || [],
        githubRepo: project.githubRepo || '',
        deployUrl: project.deployUrl || '',
        coverImage: project.coverImage || '',
      })
    }
  }, [mode, project])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = t('projects.form.nameRequired')
    } else if (formData.name.length < 3) {
      errors.name = t('projects.form.nameTooShort')
    } else if (formData.name.length > 100) {
      errors.name = t('projects.form.nameTooLong')
    }

    if (!formData.description.trim()) {
      errors.description = t('projects.form.descriptionRequired')
    } else if (formData.description.length < 10) {
      errors.description = t('projects.form.descriptionTooShort')
    }

    if (formData.githubRepo && !isValidUrl(formData.githubRepo)) {
      errors.githubRepo = t('projects.form.invalidUrl')
    }

    if (formData.deployUrl && !isValidUrl(formData.deployUrl)) {
      errors.deployUrl = t('projects.form.invalidUrl')
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const result = await onSubmit(formData)
      router.push(`/projects/${result.id}`)
    } catch (err) {
      console.error('Failed to submit project:', err)
    }
  }

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag && !formData.tags?.includes(trimmedTag) && (formData.tags?.length || 0) < 10) {
      setFormData({ ...formData, tags: [...(formData.tags || []), trimmedTag] })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter((t) => t !== tag) || [] })
  }

  const handleAddTech = () => {
    const trimmedTech = newTech.trim()
    if (trimmedTech && !formData.techStack?.includes(trimmedTech) && (formData.techStack?.length || 0) < 15) {
      setFormData({ ...formData, techStack: [...(formData.techStack || []), trimmedTech] })
      setNewTech('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({ ...formData, techStack: formData.techStack?.filter((t) => t !== tech) || [] })
  }

  const suggestedTags = [
    'web',
    'mobile',
    'backend',
    'frontend',
    'ai',
    'data',
    'devops',
    'game',
    'iot',
    'blockchain',
  ]

  const suggestedTechStack = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'Java',
    'Go',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'AWS',
    'Firebase',
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-300">
            {error.message || t('projects.form.error')}
          </p>
        </div>
      )}

      {/* Project Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t('projects.form.name')} <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t('projects.form.namePlaceholder')}
          className={`mt-1 w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
            validationErrors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
          }`}
          disabled={isSubmitting}
        />
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t('projects.form.description')} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={t('projects.form.descriptionPlaceholder')}
          rows={4}
          className={`mt-1 w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
            validationErrors.description
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
          }`}
          disabled={isSubmitting}
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {validationErrors.description}
          </p>
        )}
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('projects.form.visibility')}
        </label>
        <div className="mt-2 flex gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="visibility"
              value="PUBLIC"
              checked={formData.visibility === 'PUBLIC'}
              onChange={() => setFormData({ ...formData, visibility: 'PUBLIC' })}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('projects.visibility.public')}
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="visibility"
              value="PRIVATE"
              checked={formData.visibility === 'PRIVATE'}
              onChange={() => setFormData({ ...formData, visibility: 'PRIVATE' })}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('projects.visibility.private')}
            </span>
          </label>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('projects.form.tags')}
        </label>

        {/* Selected Tags */}
        {formData.tags && formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add Tag Input */}
        {(formData.tags?.length || 0) < 10 && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder={t('projects.form.newTagPlaceholder')}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Suggested Tags */}
        {(formData.tags?.length || 0) < 10 && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              {t('projects.form.suggestedTags')}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter((tag) => !formData.tags?.includes(tag))
                .slice(0, 8)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tags: [...(formData.tags || []), tag] })
                    }
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    disabled={isSubmitting}
                  >
                    + {tag}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('projects.form.techStack')}
        </label>

        {/* Selected Tech Stack */}
        {formData.techStack && formData.techStack.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.techStack.map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="ml-1 rounded-full p-0.5 hover:bg-green-200 dark:hover:bg-green-800"
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add Tech Input */}
        {(formData.techStack?.length || 0) < 15 && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTech()
                }
              }}
              placeholder={t('projects.form.newTechPlaceholder')}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Suggested Tech Stack */}
        {(formData.techStack?.length || 0) < 15 && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              {t('projects.form.suggestedTech')}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTechStack
                .filter((tech) => !formData.techStack?.includes(tech))
                .slice(0, 8)
                .map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, techStack: [...(formData.techStack || []), tech] })
                    }
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    disabled={isSubmitting}
                  >
                    + {tech}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* GitHub Repository */}
      <div>
        <label
          htmlFor="githubRepo"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            {t('projects.form.githubRepo')}
          </div>
        </label>
        <input
          id="githubRepo"
          type="url"
          value={formData.githubRepo}
          onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
          placeholder="https://github.com/username/repository"
          className={`mt-1 w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
            validationErrors.githubRepo
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
          }`}
          disabled={isSubmitting}
        />
        {validationErrors.githubRepo && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {validationErrors.githubRepo}
          </p>
        )}
      </div>

      {/* Deploy URL */}
      <div>
        <label
          htmlFor="deployUrl"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            {t('projects.form.deployUrl')}
          </div>
        </label>
        <input
          id="deployUrl"
          type="url"
          value={formData.deployUrl}
          onChange={(e) => setFormData({ ...formData, deployUrl: e.target.value })}
          placeholder="https://myproject.vercel.app"
          className={`mt-1 w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
            validationErrors.deployUrl
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
          }`}
          disabled={isSubmitting}
        />
        {validationErrors.deployUrl && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {validationErrors.deployUrl}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t('projects.form.submitting')}</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{mode === 'create' ? t('projects.form.create') : t('projects.form.update')}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
