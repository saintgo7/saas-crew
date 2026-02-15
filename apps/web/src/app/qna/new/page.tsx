'use client'

import { QuestionForm } from '@/components/qna/QuestionForm'
import { useTranslations } from '@/i18n/LanguageContext'

export default function NewQuestionPage() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          {t('qna.askQuestion')}
        </h1>
        <QuestionForm />
      </div>
    </div>
  )
}
