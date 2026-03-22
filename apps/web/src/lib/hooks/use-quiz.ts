import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getChapterQuizzes,
  submitQuiz,
  getMyAttempts,
  getAttemptDetails,
} from '@/lib/api/quizzes'
import type { SubmitQuizDto } from '@/lib/api/quizzes'

const quizKeys = {
  all: ['quiz'] as const,
  chapter: (chapterId: string) => [...quizKeys.all, 'chapter', chapterId] as const,
  attempts: (quizId: string) => [...quizKeys.all, 'attempts', quizId] as const,
  attempt: (attemptId: string) => [...quizKeys.all, 'attempt', attemptId] as const,
}

/**
 * Hook to fetch quizzes for a chapter
 */
export const useChapterQuiz = (chapterId: string, enabled = true) => {
  return useQuery({
    queryKey: quizKeys.chapter(chapterId),
    queryFn: () => getChapterQuizzes(chapterId),
    enabled: enabled && !!chapterId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

/**
 * Hook to submit a quiz attempt
 */
export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: SubmitQuizDto }) =>
      submitQuiz(quizId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.attempts(variables.quizId),
      })
    },
  })
}

/**
 * Hook to fetch user's quiz attempts
 */
export const useMyQuizAttempts = (quizId: string, enabled = true) => {
  return useQuery({
    queryKey: quizKeys.attempts(quizId),
    queryFn: () => getMyAttempts(quizId),
    enabled: enabled && !!quizId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })
}

/**
 * Hook to fetch attempt details
 */
export const useQuizAttemptDetails = (attemptId: string, enabled = true) => {
  return useQuery({
    queryKey: quizKeys.attempt(attemptId),
    queryFn: () => getAttemptDetails(attemptId),
    enabled: enabled && !!attemptId,
    staleTime: 5 * 60 * 1000,
  })
}
