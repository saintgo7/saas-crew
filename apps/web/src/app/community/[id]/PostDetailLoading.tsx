'use client'

import { Loader2 } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

export function PostDetailLoading() {
  const t = useTranslations()

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {t('community.loadingDetail')}
        </p>
      </div>
    </div>
  )
}
