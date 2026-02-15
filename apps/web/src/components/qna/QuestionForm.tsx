'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateQuestion, useQnaTags } from '@/lib/hooks/use-qna'
import { Loader2, Send, X, Coins, AlertCircle } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

// Validation constants
const MIN_TITLE_LENGTH = 10
const MAX_TITLE_LENGTH = 200
const MIN_CONTENT_LENGTH = 20
const MAX_CONTENT_LENGTH = 30000

interface QuestionFormProps {
  initialData?: {
    title: string
    content: string
    tags: string[]
    bounty?: number
  }
  onSubmit?: (data: {
    title: string
    content: string
    tags: string[]
    bounty?: number
  }) => Promise<void>
  isEditing?: boolean
}

export function QuestionForm({ initialData, onSubmit, isEditing = false }: QuestionFormProps) {
  const t = useTranslations()
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [bounty, setBounty] = useState<number | undefined>(initialData?.bounty)
  const [showBounty, setShowBounty] = useState(!!initialData?.bounty)
  const [touched, setTouched] = useState({ title: false, content: false })

  const { data: availableTags } = useQnaTags()
  const createQuestion = useCreateQuestion()

  // Validation functions
  const validateTitle = useCallback(
    (value: string): string | null => {
      const trimmed = value.trim()
      if (!trimmed) return t('qna.form.validation.titleRequired')
      if (trimmed.length < MIN_TITLE_LENGTH)
        return t('qna.form.validation.titleMinLength', { min: MIN_TITLE_LENGTH })
      if (trimmed.length > MAX_TITLE_LENGTH)
        return t('qna.form.validation.titleMaxLength', { max: MAX_TITLE_LENGTH })
      return null
    },
    [t]
  )

  const validateContent = useCallback(
    (value: string): string | null => {
      const trimmed = value.trim()
      if (!trimmed) return t('qna.form.validation.contentRequired')
      if (trimmed.length < MIN_CONTENT_LENGTH)
        return t('qna.form.validation.contentMinLength', { min: MIN_CONTENT_LENGTH })
      if (trimmed.length > MAX_CONTENT_LENGTH)
        return t('qna.form.validation.contentMaxLength', { max: MAX_CONTENT_LENGTH })
      return null
    },
    [t]
  )

  const titleError = touched.title ? validateTitle(title) : null
  const contentError = touched.content ? validateContent(content) : null
  const isValid = !validateTitle(title) && !validateContent(content)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ title: true, content: true })

    if (!isValid) return

    const data = {
      title: title.trim(),
      content: content.trim(),
      tags: selectedTags,
      bounty: showBounty && bounty && bounty >= 10 ? bounty : undefined,
    }

    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        const question = await createQuestion.mutateAsync(data)
        router.push(`/qna/${question.id}`)
      }
    } catch (error) {
      console.error('Failed to create question:', error)
    }
  }

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleAddNewTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag) {
      handleAddTag(trimmedTag)
      setNewTag('')
    }
  }

  const suggestedTags = availableTags?.filter((tag) => !selectedTags.includes(tag))
  const isPending = createQuestion.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t('qna.form.title')} *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          placeholder={t('qna.form.titlePlaceholder')}
          className={`mt-1 w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
            titleError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
          }`}
          disabled={isPending}
          maxLength={MAX_TITLE_LENGTH}
        />
        <div className="mt-1 flex justify-between">
          {titleError && (
            <span className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              {titleError}
            </span>
          )}
          <span className="ml-auto text-xs text-gray-500">
            {title.length}/{MAX_TITLE_LENGTH}
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t('qna.form.content')} *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, content: true }))}
          placeholder={t('qna.form.contentPlaceholder')}
          rows={12}
          className={`mt-1 w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
            contentError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
          }`}
          disabled={isPending}
        />
        <div className="mt-1 flex justify-between">
          {contentError && (
            <span className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              {contentError}
            </span>
          )}
          <span className="ml-auto text-xs text-gray-500">
            {content.length}/{MAX_CONTENT_LENGTH}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {t('qna.form.markdownHint')}
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('qna.form.tags')}
        </label>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
                  disabled={isPending}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add New Tag */}
        {selectedTags.length < 5 && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddNewTag()
                }
              }}
              placeholder={t('qna.form.newTagPlaceholder')}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={handleAddNewTag}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              disabled={isPending}
            >
              {t('qna.form.addTag')}
            </button>
          </div>
        )}

        {/* Suggested Tags */}
        {suggestedTags && suggestedTags.length > 0 && selectedTags.length < 5 && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              {t('qna.form.suggestedTags')}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  disabled={isPending}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bounty (Optional) */}
      {!isEditing && (
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('qna.form.bounty')}
            </label>
            <button
              type="button"
              onClick={() => setShowBounty(!showBounty)}
              className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              <Coins className="h-4 w-4" />
              {showBounty ? t('qna.form.removeBounty') : t('qna.form.addBounty')}
            </button>
          </div>

          {showBounty && (
            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
              <p className="mb-2 text-sm text-amber-800 dark:text-amber-200">
                {t('qna.form.bountyDescription')}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={bounty || ''}
                  onChange={(e) =>
                    setBounty(Math.max(10, Math.min(500, Number(e.target.value) || 0)))
                  }
                  min={10}
                  max={500}
                  step={10}
                  placeholder="50"
                  className="w-24 rounded border border-amber-300 bg-white px-3 py-2 text-sm dark:border-amber-700 dark:bg-gray-800"
                  disabled={isPending}
                />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  XP
                </span>
                <span className="text-xs text-gray-500">
                  ({t('qna.form.bountyRange')})
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={!isValid || isPending}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t('qna.form.submitting')}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{isEditing ? t('qna.form.update') : t('qna.form.submit')}</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {createQuestion.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-300">
            {createQuestion.error instanceof Error
              ? createQuestion.error.message
              : t('qna.form.error')}
          </p>
        </div>
      )}
    </form>
  )
}
