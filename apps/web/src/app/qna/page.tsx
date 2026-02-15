'use client'

import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { QuestionList } from '@/components/qna/QuestionList'
import { useTranslations } from '@/i18n/LanguageContext'

export default function QnAPage() {
  const router = useRouter()
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Q&A
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('qna.description')}
          </p>
        </div>
        <button
          onClick={() => router.push('/qna/new')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          {t('qna.askQuestion')}
        </button>
      </div>

      {/* Question List */}
      <QuestionList />
    </div>
  )
}
