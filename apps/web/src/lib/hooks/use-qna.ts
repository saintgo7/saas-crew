import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { qnaApi } from '@/lib/api/qna'
import type {
  QuestionFilters,
  CreateQuestionInput,
  CreateAnswerInput,
} from '@/lib/api/qna-types'
import type { VoteInput } from '@/lib/api/types'

/**
 * Hook to fetch all questions with optional filtering
 */
export const useQuestions = (filters?: QuestionFilters) => {
  return useQuery({
    queryKey: ['qna-questions', filters],
    queryFn: () => qnaApi.getQuestions(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  })
}

/**
 * Hook to fetch a single question with answers
 */
export const useQuestion = (questionId: string) => {
  return useQuery({
    queryKey: ['qna-question', questionId],
    queryFn: () => qnaApi.getQuestionById(questionId),
    enabled: !!questionId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to create a new question
 */
export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateQuestionInput) => qnaApi.createQuestion(input),
    onSuccess: () => {
      // Invalidate questions list to show new question
      queryClient.invalidateQueries({ queryKey: ['qna-questions'] })
    },
  })
}

/**
 * Hook to update a question
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      questionId,
      input,
    }: {
      questionId: string
      input: Partial<CreateQuestionInput>
    }) => qnaApi.updateQuestion(questionId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['qna-question', variables.questionId] })
      queryClient.invalidateQueries({ queryKey: ['qna-questions'] })
    },
  })
}

/**
 * Hook to delete a question
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (questionId: string) => qnaApi.deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qna-questions'] })
    },
  })
}

/**
 * Hook to vote on a question with optimistic updates
 */
export const useVoteQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      questionId,
      vote,
    }: {
      questionId: string
      vote: VoteInput
    }) => qnaApi.voteQuestion(questionId, vote),
    onMutate: async ({ questionId, vote }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['qna-question', questionId] })
      await queryClient.cancelQueries({ queryKey: ['qna-questions'] })

      // Snapshot previous values
      const previousQuestion = queryClient.getQueryData(['qna-question', questionId])
      const previousQuestions = queryClient.getQueryData(['qna-questions'])

      // Optimistically update question detail
      queryClient.setQueryData(['qna-question', questionId], (old: any) => {
        if (!old) return old
        const delta = vote.type === 'upvote' ? 1 : -1
        return {
          ...old,
          votes: old.votes + delta,
          hasVoted: true,
          voteType: vote.type,
        }
      })

      // Optimistically update questions list
      queryClient.setQueriesData({ queryKey: ['qna-questions'] }, (old: any) => {
        if (!old?.questions) return old
        return {
          ...old,
          questions: old.questions.map((question: any) =>
            question.id === questionId
              ? {
                  ...question,
                  votes: question.votes + (vote.type === 'upvote' ? 1 : -1),
                  hasVoted: true,
                  voteType: vote.type,
                }
              : question
          ),
        }
      })

      return { previousQuestion, previousQuestions }
    },
    onError: (err, { questionId }, context) => {
      // Rollback on error
      if (context?.previousQuestion) {
        queryClient.setQueryData(['qna-question', questionId], context.previousQuestion)
      }
      if (context?.previousQuestions) {
        queryClient.setQueryData(['qna-questions'], context.previousQuestions)
      }
    },
    onSettled: (data, error, { questionId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['qna-question', questionId] })
      queryClient.invalidateQueries({ queryKey: ['qna-questions'] })
    },
  })
}

/**
 * Hook to set bounty on a question
 */
export const useSetBounty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      questionId,
      amount,
    }: {
      questionId: string
      amount: number
    }) => qnaApi.setBounty(questionId, amount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['qna-question', variables.questionId] })
      queryClient.invalidateQueries({ queryKey: ['qna-questions'] })
    },
  })
}

/**
 * Hook to create an answer
 */
export const useCreateAnswer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateAnswerInput) => qnaApi.createAnswer(input),
    onSuccess: (_, variables) => {
      // Invalidate question to show new answer
      queryClient.invalidateQueries({ queryKey: ['qna-question', variables.questionId] })
      queryClient.invalidateQueries({ queryKey: ['qna-questions'] })
    },
  })
}

/**
 * Hook to update an answer with optimistic updates
 */
export const useUpdateAnswer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      answerId,
      questionId,
      content,
    }: {
      answerId: string
      questionId: string
      content: string
    }) => qnaApi.updateAnswer(answerId, content),
    onMutate: async ({ answerId, questionId, content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['qna-question', questionId] })

      // Snapshot previous value
      const previousQuestion = queryClient.getQueryData(['qna-question', questionId])

      // Optimistically update answer content
      queryClient.setQueryData(['qna-question', questionId], (old: any) => {
        if (!old?.answers) return old

        return {
          ...old,
          answers: old.answers.map((answer: any) =>
            answer.id === answerId
              ? {
                  ...answer,
                  content,
                  updatedAt: new Date().toISOString(),
                }
              : answer
          ),
        }
      })

      return { previousQuestion }
    },
    onError: (err, { questionId }, context) => {
      // Rollback on error
      if (context?.previousQuestion) {
        queryClient.setQueryData(['qna-question', questionId], context.previousQuestion)
      }
    },
    onSettled: (data, error, { questionId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['qna-question', questionId] })
    },
  })
}

/**
 * Hook to delete an answer with optimistic updates
 */
export const useDeleteAnswer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      answerId,
      questionId,
    }: {
      answerId: string
      questionId: string
    }) => qnaApi.deleteAnswer(answerId),
    onMutate: async ({ answerId, questionId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['qna-question', questionId] })

      // Snapshot previous value
      const previousQuestion = queryClient.getQueryData(['qna-question', questionId])

      // Optimistically remove answer
      queryClient.setQueryData(['qna-question', questionId], (old: any) => {
        if (!old?.answers) return old

        return {
          ...old,
          answers: old.answers.filter((answer: any) => answer.id !== answerId),
          answersCount: old.answersCount - 1,
        }
      })

      return { previousQuestion }
    },
    onError: (err, { questionId }, context) => {
      // Rollback on error
      if (context?.previousQuestion) {
        queryClient.setQueryData(['qna-question', questionId], context.previousQuestion)
      }
    },
    onSettled: (data, error, { questionId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['qna-question', questionId] })
      queryClient.invalidateQueries({ queryKey: ['qna-questions'] })
    },
  })
}

/**
 * Hook to vote on an answer with optimistic updates
 */
export const useVoteAnswer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      answerId,
      questionId,
      vote,
    }: {
      answerId: string
      questionId: string
      vote: VoteInput
    }) => qnaApi.voteAnswer(answerId, vote),
    onMutate: async ({ answerId, questionId, vote }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['qna-question', questionId] })

      // Snapshot previous value
      const previousQuestion = queryClient.getQueryData(['qna-question', questionId])

      // Optimistically update answer votes
      queryClient.setQueryData(['qna-question', questionId], (old: any) => {
        if (!old?.answers) return old

        return {
          ...old,
          answers: old.answers.map((answer: any) =>
            answer.id === answerId
              ? {
                  ...answer,
                  votes: answer.votes + (vote.type === 'upvote' ? 1 : -1),
                  hasVoted: true,
                  voteType: vote.type,
                }
              : answer
          ),
        }
      })

      return { previousQuestion }
    },
    onError: (err, { questionId }, context) => {
      // Rollback on error
      if (context?.previousQuestion) {
        queryClient.setQueryData(['qna-question', questionId], context.previousQuestion)
      }
    },
    onSettled: (data, error, { questionId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['qna-question', questionId] })
    },
  })
}

/**
 * Hook to accept an answer
 */
export const useAcceptAnswer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      answerId,
      questionId,
    }: {
      answerId: string
      questionId: string
    }) => qnaApi.acceptAnswer(answerId),
    onSuccess: (_, variables) => {
      // Invalidate question to update accepted status
      queryClient.invalidateQueries({ queryKey: ['qna-question', variables.questionId] })
      queryClient.invalidateQueries({ queryKey: ['qna-questions'] })
    },
  })
}

/**
 * Hook to fetch available tags
 */
export const useQnaTags = () => {
  return useQuery({
    queryKey: ['qna-tags'],
    queryFn: () => qnaApi.getTags(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
