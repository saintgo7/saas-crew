'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface CommentFormProps {
  postId: string
  parentId?: string
  onSubmit: (content: string) => Promise<void>
  onCancel?: () => void
  placeholder?: string
  buttonText?: string
}

export function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = '댓글을 작성하세요...',
  buttonText = '댓글 작성',
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(content)
      setContent('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={parentId ? 3 : 4}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        disabled={isSubmitting}
      />

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>작성 중...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
