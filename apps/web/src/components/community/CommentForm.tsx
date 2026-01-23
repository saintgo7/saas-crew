'use client'

import { useState, useCallback } from 'react'
import { Send, Loader2, AlertCircle } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

// Validation constants
const MIN_CONTENT_LENGTH = 5
const MAX_CONTENT_LENGTH = 5000

interface CommentFormProps {
  postId: string
  parentId?: string
  initialContent?: string
  onSubmit: (content: string) => Promise<void>
  onCancel?: () => void
  placeholder?: string
  buttonText?: string
  isEditing?: boolean
}

export function CommentForm({
  postId,
  parentId,
  initialContent = '',
  onSubmit,
  onCancel,
  placeholder,
  buttonText,
  isEditing = false,
}: CommentFormProps) {
  const t = useTranslations()
  const defaultPlaceholder = placeholder || t('community.comment.placeholder')
  const defaultButtonText = buttonText || t('community.comment.submit')
  const [content, setContent] = useState(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  // Validate content
  const validateContent = useCallback((value: string): string | null => {
    const trimmed = value.trim()
    if (!trimmed) {
      return t('community.comment.validation.required')
    }
    if (trimmed.length < MIN_CONTENT_LENGTH) {
      return t('community.comment.validation.minLength', { min: MIN_CONTENT_LENGTH })
    }
    if (trimmed.length > MAX_CONTENT_LENGTH) {
      return t('community.comment.validation.maxLength', { max: MAX_CONTENT_LENGTH })
    }
    return null
  }, [t])

  const validationError = touched ? validateContent(content) : null
  const isValid = !validateContent(content)
  const charactersRemaining = MAX_CONTENT_LENGTH - content.length

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    // Prevent exceeding max length
    if (newValue.length <= MAX_CONTENT_LENGTH) {
      setContent(newValue)
      setError(null)
    }
  }

  const handleBlur = () => {
    setTouched(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    const validationResult = validateContent(content)
    if (validationResult) {
      setError(validationResult)
      return
    }

    if (isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(content.trim())
      if (!isEditing) {
        setContent('')
        setTouched(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('community.comment.error.submitFailed')
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={defaultPlaceholder}
          rows={parentId ? 3 : 4}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
            validationError || error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
          }`}
          disabled={isSubmitting}
          aria-invalid={!!(validationError || error)}
          aria-describedby={validationError || error ? 'comment-error' : undefined}
        />

        {/* Character counter */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          <span className={charactersRemaining < 100 ? 'text-orange-500' : ''}>
            {content.length}/{MAX_CONTENT_LENGTH}
          </span>
        </div>
      </div>

      {/* Error message */}
      {(validationError || error) && (
        <div
          id="comment-error"
          className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{validationError || error}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        {/* Helper text */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('community.comment.markdownSupported')}
        </p>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {t('community.comment.cancel')}
            </button>
          )}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('community.comment.submittingComment')}</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>{isEditing ? t('community.comment.update') : defaultButtonText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
