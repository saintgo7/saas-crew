'use client'

import { PostForm } from '@/components/community'
import { useTranslations } from '@/i18n/LanguageContext'

export function NewPostPageContent() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('community.newPage.title')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('community.newPage.subtitle')}
        </p>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <PostForm />
      </div>

      {/* Guidelines */}
      <div className="mx-auto mt-6 max-w-4xl rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
          {t('community.newPage.tips.title')}
        </h3>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <li>{t('community.newPage.tips.tip1')}</li>
          <li>{t('community.newPage.tips.tip2')}</li>
          <li>{t('community.newPage.tips.tip3')}</li>
          <li>{t('community.newPage.tips.tip4')}</li>
          <li>{t('community.newPage.tips.tip5')}</li>
        </ul>
      </div>
    </div>
  )
}
