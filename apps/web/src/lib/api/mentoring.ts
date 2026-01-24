import { apiClient } from './client'
import type {
  MentoringDashboard,
  Mentorship,
  MentorshipRequest,
  MentorInfo,
  AvailableMentorsParams,
  AvailableMentorsResponse,
  RequestMentorshipInput,
  RateMentorshipInput,
} from './types'

export const mentoringApi = {
  // Get current user's mentors
  // Backend: GET /api/mentoring/mentors
  async getMyMentors(): Promise<Mentorship[]> {
    return apiClient.get<Mentorship[]>('/api/mentoring/mentors')
  },

  // Get current user's mentees
  // Backend: GET /api/mentoring/mentees
  async getMyMentees(): Promise<Mentorship[]> {
    return apiClient.get<Mentorship[]>('/api/mentoring/mentees')
  },

  // Get available mentors (users with higher rank)
  // Backend: GET /api/mentoring/available-mentors
  async getAvailableMentors(params?: AvailableMentorsParams): Promise<AvailableMentorsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.expertise) searchParams.append('expertise', params.expertise)
    if (params?.page) searchParams.append('page', String(params.page))
    if (params?.pageSize) searchParams.append('pageSize', String(params.pageSize))

    const queryString = searchParams.toString()
    return apiClient.get<AvailableMentorsResponse>(
      `/api/mentoring/available-mentors${queryString ? `?${queryString}` : ''}`
    )
  },

  // Get mentorship history (completed and cancelled)
  // Backend: GET /api/mentoring/history
  async getMentorshipHistory(): Promise<Mentorship[]> {
    return apiClient.get<Mentorship[]>('/api/mentoring/history')
  },

  // Compose dashboard data from multiple endpoints
  // Note: Backend doesn't have a /dashboard endpoint, so we compose it client-side
  async getDashboard(): Promise<MentoringDashboard> {
    const [mentors, mentees, availableMentorsResponse] = await Promise.all([
      this.getMyMentors(),
      this.getMyMentees(),
      this.getAvailableMentors(),
    ])

    // Filter pending requests from mentors and mentees
    const pendingFromMentors = mentors.filter((m) => m.status === 'PENDING')
    const pendingFromMentees = mentees.filter((m) => m.status === 'PENDING')

    // Convert pending mentorships to MentorshipRequest format
    const pendingRequests: MentorshipRequest[] = [
      ...pendingFromMentees.map((m) => ({
        id: m.id,
        mentorId: m.mentorId,
        menteeId: m.menteeId,
        status: m.status as 'PENDING',
        createdAt: m.createdAt,
        mentor: m.mentor,
        mentee: m.mentee,
      })),
    ]

    return {
      myMentors: mentors,
      myMentees: mentees,
      pendingRequests,
      availableMentors: availableMentorsResponse.mentors || [],
    }
  },

  // Request mentorship from a mentor
  // Backend: POST /api/mentoring/request
  async requestMentorship(data: RequestMentorshipInput): Promise<Mentorship> {
    return apiClient.post<Mentorship>('/api/mentoring/request', data)
  },

  // Accept a mentorship request (as mentor)
  // Backend: POST /api/mentoring/:id/accept
  async acceptMentorship(mentorshipId: string): Promise<Mentorship> {
    return apiClient.post<Mentorship>(`/api/mentoring/${mentorshipId}/accept`)
  },

  // Reject a mentorship request (as mentor)
  // Backend: POST /api/mentoring/:id/reject
  async rejectMentorship(mentorshipId: string): Promise<Mentorship> {
    return apiClient.post<Mentorship>(`/api/mentoring/${mentorshipId}/reject`)
  },

  // Cancel a mentorship (as mentee or mentor)
  // Backend: POST /api/mentoring/:id/cancel
  async cancelMentorship(mentorshipId: string): Promise<Mentorship> {
    return apiClient.post<Mentorship>(`/api/mentoring/${mentorshipId}/cancel`)
  },

  // Record a mentoring session
  // Backend: POST /api/mentoring/:id/session
  async recordSession(mentorshipId: string): Promise<Mentorship> {
    return apiClient.post<Mentorship>(`/api/mentoring/${mentorshipId}/session`)
  },

  // Complete a mentorship (as mentor)
  // Backend: POST /api/mentoring/:id/complete
  async completeMentorship(mentorshipId: string): Promise<Mentorship> {
    return apiClient.post<Mentorship>(`/api/mentoring/${mentorshipId}/complete`)
  },

  // Rate a mentorship (mentor or mentee)
  // Backend: POST /api/mentoring/:id/rate
  async rateMentorship(data: RateMentorshipInput): Promise<Mentorship> {
    return apiClient.post<Mentorship>(`/api/mentoring/${data.mentorshipId}/rate`, {
      rating: data.rating,
      feedback: data.feedback,
    })
  },

  // Get a single mentorship details
  // Backend: GET /api/mentoring/:id
  async getMentorship(mentorshipId: string): Promise<Mentorship> {
    return apiClient.get<Mentorship>(`/api/mentoring/${mentorshipId}`)
  },

  // Deprecated: cancelRequest - use cancelMentorship instead
  // Kept for backward compatibility
  async cancelRequest(mentorshipId: string): Promise<Mentorship> {
    return this.cancelMentorship(mentorshipId)
  },

  // Note: The following endpoints don't exist on the backend
  // - GET /api/mentoring/mentors/:id (getMentorProfile)
  // - GET /api/mentoring/expertise-tags (getExpertiseTags)
  // If needed, these should be implemented on the backend first
}
