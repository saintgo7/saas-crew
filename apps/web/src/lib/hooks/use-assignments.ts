import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getChapterAssignments,
  submitAssignment,
  updateSubmission,
  getMySubmissions,
  getMySubmissionForAssignment,
} from '@/lib/api/assignments'
import type { SubmitAssignmentDto, UpdateSubmissionDto } from '@/lib/api/assignments'

const ASSIGNMENT_BASE = ['assignment'] as const

const assignmentKeys = {
  all: ASSIGNMENT_BASE,
  chapter: (chapterId: string) =>
    [...ASSIGNMENT_BASE, 'chapter', chapterId] as const,
  submission: (assignmentId: string) =>
    [...ASSIGNMENT_BASE, 'submission', assignmentId] as const,
  mySubmissions: [...ASSIGNMENT_BASE, 'my-submissions'] as const,
}

/**
 * Hook to fetch assignments for a chapter
 */
export const useChapterAssignments = (chapterId: string, enabled = true) => {
  return useQuery({
    queryKey: assignmentKeys.chapter(chapterId),
    queryFn: () => getChapterAssignments(chapterId),
    enabled: enabled && !!chapterId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

/**
 * Hook to submit an assignment
 */
export const useSubmitAssignment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      assignmentId,
      data,
    }: {
      assignmentId: string
      data: SubmitAssignmentDto
    }) => submitAssignment(assignmentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submission(variables.assignmentId),
      })
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.mySubmissions,
      })
    },
  })
}

/**
 * Hook to update a submission
 */
export const useUpdateSubmission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      submissionId,
      data,
    }: {
      submissionId: string
      data: UpdateSubmissionDto
    }) => updateSubmission(submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.all,
      })
    },
  })
}

/**
 * Hook to fetch current user's submissions
 */
export const useMySubmissions = () => {
  return useQuery({
    queryKey: assignmentKeys.mySubmissions,
    queryFn: () => getMySubmissions(),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })
}

/**
 * Hook to fetch user's submission for a specific assignment
 */
export const useMySubmissionForAssignment = (
  assignmentId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: assignmentKeys.submission(assignmentId),
    queryFn: () => getMySubmissionForAssignment(assignmentId),
    enabled: enabled && !!assignmentId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })
}
