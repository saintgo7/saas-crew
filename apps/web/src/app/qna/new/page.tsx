'use client'

import { QuestionForm } from '@/components/qna/QuestionForm'

export default function NewQuestionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Ask a Question
        </h1>
        <QuestionForm />
      </div>
    </div>
  )
}
