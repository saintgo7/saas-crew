'use client'

import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

export function NotFoundContent() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <FileQuestion className="mx-auto h-16 w-16 text-gray-400" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          {t('projects.notFound.title')}
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {t('projects.notFound.description')}
        </p>
        <div className="mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t('projects.backToList')}
          </Link>
        </div>
      </div>
    </div>
  )
}
