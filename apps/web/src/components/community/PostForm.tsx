'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreatePost, useTags } from '@/lib/hooks/use-community'
import { Loader2, Send, X } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

export function PostForm() {
  const t = useTranslations()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  const { data: availableTags } = useTags()
  const createPost = useCreatePost()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      const post = await createPost.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags,
      })
      router.push(`/community/${post.id}`)
    } catch (error) {
      console.error('Failed to create post:', error)
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
    const trimmedTag = newTag.trim()
    if (trimmedTag) {
      handleAddTag(trimmedTag)
      setNewTag('')
    }
  }

  const suggestedTags = availableTags?.filter(
    (tag) => !selectedTags.includes(tag)
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t('community.form.title')}
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('community.form.titlePlaceholder')}
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          required
          disabled={createPost.isPending}
        />
      </div>

      {/* Content */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t('community.form.content')}
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('community.form.contentPlaceholder')}
          rows={12}
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          required
          disabled={createPost.isPending}
        />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {t('community.form.markdownHint')}
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('community.form.tags')}
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
                  disabled={createPost.isPending}
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
              placeholder={t('community.form.newTagPlaceholder')}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              disabled={createPost.isPending}
            />
            <button
              type="button"
              onClick={handleAddNewTag}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              disabled={createPost.isPending}
            >
              {t('community.form.addTag')}
            </button>
          </div>
        )}

        {/* Suggested Tags */}
        {suggestedTags && suggestedTags.length > 0 && selectedTags.length < 5 && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              {t('community.form.suggestedTags')}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  disabled={createPost.isPending}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={createPost.isPending}
          className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {t('community.form.cancel')}
        </button>
        <button
          type="submit"
          disabled={!title.trim() || !content.trim() || createPost.isPending}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {createPost.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t('community.form.submitting')}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{t('community.form.submit')}</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {createPost.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-300">
            {createPost.error instanceof Error
              ? createPost.error.message
              : t('community.form.error')}
          </p>
        </div>
      )}
    </form>
  )
}
