'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { QuestionDetail } from '@/components/qna/QuestionDetail'
import {
  useQuestion,
  useVoteQuestion,
  useVoteAnswer,
  useCreateAnswer,
  useAcceptAnswer,
  useUpdateAnswer,
  useDeleteAnswer,
  useDeleteQuestion,
  useSetBounty,
} from '@/lib/hooks/use-qna'
import { useUserStore } from '@/store/user-store'

interface QnADetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function QnADetailPage({ params }: QnADetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useUserStore()

  const { data: question, isLoading, error } = useQuestion(id)
  const voteQuestion = useVoteQuestion()
  const voteAnswer = useVoteAnswer()
  const createAnswer = useCreateAnswer()
  const acceptAnswer = useAcceptAnswer()
  const updateAnswer = useUpdateAnswer()
  const deleteAnswer = useDeleteAnswer()
  const deleteQuestion = useDeleteQuestion()
  const setBounty = useSetBounty()

  const handleVote = async (type: 'upvote' | 'downvote') => {
    await voteQuestion.mutateAsync({ questionId: id, vote: { type } })
  }

  const handleAnswerVote = async (answerId: string, type: 'upvote' | 'downvote') => {
    await voteAnswer.mutateAsync({ answerId, questionId: id, vote: { type } })
  }

  const handleCreateAnswer = async (content: string) => {
    await createAnswer.mutateAsync({ questionId: id, content })
  }

  const handleAcceptAnswer = async (answerId: string) => {
    await acceptAnswer.mutateAsync({ answerId, questionId: id })
  }

  const handleEditAnswer = async (answerId: string, content: string) => {
    await updateAnswer.mutateAsync({ answerId, questionId: id, content })
  }

  const handleDeleteAnswer = async (answerId: string) => {
    await deleteAnswer.mutateAsync({ answerId, questionId: id })
  }

  const handleEdit = () => {
    router.push(`/qna/${id}/edit`)
  }

  const handleDelete = async () => {
    await deleteQuestion.mutateAsync(id)
    router.push('/qna')
  }

  const handleSetBounty = async (amount: number) => {
    await setBounty.mutateAsync({ questionId: id, amount })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-red-700 dark:text-red-400">
            Question not found
          </h2>
          <p className="mt-2 text-red-600 dark:text-red-300">
            The question you are looking for does not exist or has been deleted.
          </p>
          <button
            onClick={() => router.push('/qna')}
            className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Q&A
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.push('/qna')}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Q&A
      </button>

      <QuestionDetail
        question={question}
        currentUserId={user?.id}
        onVote={handleVote}
        onAnswerVote={handleAnswerVote}
        onCreateAnswer={handleCreateAnswer}
        onAcceptAnswer={question.authorId === user?.id ? handleAcceptAnswer : undefined}
        onEditAnswer={handleEditAnswer}
        onDeleteAnswer={handleDeleteAnswer}
        onEdit={question.authorId === user?.id ? handleEdit : undefined}
        onDelete={question.authorId === user?.id ? handleDelete : undefined}
        onSetBounty={question.authorId === user?.id ? handleSetBounty : undefined}
      />
    </div>
  )
}
