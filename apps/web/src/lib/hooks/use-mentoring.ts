import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mentoringApi } from '../api/mentoring'
import type {
  AvailableMentorsParams,
  RequestMentorshipInput,
  RateMentorshipInput,
  Mentorship,
} from '../api/types'

// Query keys for cache management
export const mentoringKeys = {
  all: ['mentoring'] as const,
  dashboard: () => [...mentoringKeys.all, 'dashboard'] as const,
  myMentors: () => [...mentoringKeys.all, 'mentors'] as const,
  myMentees: () => [...mentoringKeys.all, 'mentees'] as const,
  availableMentors: (params?: AvailableMentorsParams) =>
    [...mentoringKeys.all, 'available-mentors', params] as const,
  history: () => [...mentoringKeys.all, 'history'] as const,
  mentorship: (id: string) => [...mentoringKeys.all, 'mentorship', id] as const,
}

// Get mentoring dashboard data (composed from multiple endpoints)
export function useMentoringDashboard() {
  return useQuery({
    queryKey: mentoringKeys.dashboard(),
    queryFn: () => mentoringApi.getDashboard(),
  })
}

// Get current user's mentors
export function useMyMentors() {
  return useQuery({
    queryKey: mentoringKeys.myMentors(),
    queryFn: () => mentoringApi.getMyMentors(),
  })
}

// Get current user's mentees
export function useMyMentees() {
  return useQuery({
    queryKey: mentoringKeys.myMentees(),
    queryFn: () => mentoringApi.getMyMentees(),
  })
}

// Get available mentors
export function useAvailableMentors(params?: AvailableMentorsParams) {
  return useQuery({
    queryKey: mentoringKeys.availableMentors(params),
    queryFn: () => mentoringApi.getAvailableMentors(params),
  })
}

// Get mentorship history (completed and cancelled)
export function useMentorshipHistory() {
  return useQuery({
    queryKey: mentoringKeys.history(),
    queryFn: () => mentoringApi.getMentorshipHistory(),
  })
}

// Get pending mentorship requests (filtered from mentors/mentees)
// Note: Backend doesn't have a separate /requests endpoint
// We derive pending requests from the dashboard data
export function usePendingRequests() {
  const { data: dashboard, ...rest } = useMentoringDashboard()

  return {
    ...rest,
    data: dashboard?.pendingRequests,
  }
}

// Get a single mentorship
export function useMentorship(mentorshipId: string) {
  return useQuery({
    queryKey: mentoringKeys.mentorship(mentorshipId),
    queryFn: () => mentoringApi.getMentorship(mentorshipId),
    enabled: !!mentorshipId,
  })
}

// Request mentorship mutation
export function useRequestMentorship() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestMentorshipInput) => mentoringApi.requestMentorship(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mentoringKeys.dashboard() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.myMentors() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.availableMentors() })
    },
  })
}

// Accept mentorship mutation
export function useAcceptMentorship() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mentorshipId: string) => mentoringApi.acceptMentorship(mentorshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mentoringKeys.dashboard() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.myMentees() })
    },
  })
}

// Reject mentorship mutation
export function useRejectMentorship() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mentorshipId: string) => mentoringApi.rejectMentorship(mentorshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mentoringKeys.dashboard() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.myMentees() })
    },
  })
}

// Cancel mentorship mutation (replaces cancelRequest)
export function useCancelMentorship() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mentorshipId: string) => mentoringApi.cancelMentorship(mentorshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mentoringKeys.dashboard() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.myMentors() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.myMentees() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.availableMentors() })
    },
  })
}

// Deprecated: useCancelRequest - use useCancelMentorship instead
// Kept for backward compatibility
export function useCancelRequest() {
  return useCancelMentorship()
}

// Record session mutation
export function useRecordSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mentorshipId: string) => mentoringApi.recordSession(mentorshipId),
    onSuccess: (_, mentorshipId) => {
      queryClient.invalidateQueries({ queryKey: mentoringKeys.dashboard() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.myMentees() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.mentorship(mentorshipId) })
    },
  })
}

// Complete mentorship mutation
export function useCompleteMentorship() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mentorshipId: string) => mentoringApi.completeMentorship(mentorshipId),
    onSuccess: (_, mentorshipId) => {
      queryClient.invalidateQueries({ queryKey: mentoringKeys.dashboard() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.myMentees() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.mentorship(mentorshipId) })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.history() })
    },
  })
}

// Rate mentorship mutation
export function useRateMentorship() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RateMentorshipInput) => mentoringApi.rateMentorship(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mentoringKeys.dashboard() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.myMentors() })
      queryClient.invalidateQueries({ queryKey: mentoringKeys.mentorship(variables.mentorshipId) })
    },
  })
}

// Note: The following hooks have been removed as they don't have backend support:
// - useMentorProfile: Backend doesn't have GET /api/mentoring/mentors/:id
// - useExpertiseTags: Backend doesn't have GET /api/mentoring/expertise-tags
// If these are needed, implement the backend endpoints first
