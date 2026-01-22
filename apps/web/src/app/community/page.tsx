'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { PostList } from '@/components/community'
import { Loader2, Plus } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

function CommunityLoading() {
  const t = useTranslations()
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {t('community.loading')}
        </p>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('community.title')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('community.subtitle')}
          </p>
        </div>

        <Link
          href="/community/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>{t('community.createPost')}</span>
        </Link>
      </div>

      {/* Post List */}
      <Suspense fallback={<CommunityLoading />}>
        <PostList />
      </Suspense>
    </div>
  )
}
