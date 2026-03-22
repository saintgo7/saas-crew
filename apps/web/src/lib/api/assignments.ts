import { apiClient } from './client'

/**
 * Assignment types
 */
export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'REVIEWED' | 'RETURNED'

export interface Assignment {
  id: string
  title: string
  description: string
  chapterId: string
  dueDate?: string
  maxScore: number
  isPublished: boolean
  chapter?: {
    id: string
    title: string
    courseId: string
  }
  createdAt: string
  updatedAt: string
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  userId: string
  content: string
  githubUrl?: string
  status: SubmissionStatus
  score?: number
  feedback?: string
  submittedAt: string
  reviewedAt?: string
}

export interface SubmitAssignmentDto {
  content: string
  githubUrl?: string
}

export interface UpdateSubmissionDto {
  content?: string
  githubUrl?: string
}

/**
 * Get assignments for a chapter
 */
export async function getChapterAssignments(
  chapterId: string,
): Promise<Assignment[]> {
  return apiClient.get(`/api/chapters/${chapterId}/assignments`)
}

/**
 * Get assignment by ID
 */
export async function getAssignment(
  assignmentId: string,
): Promise<Assignment> {
  return apiClient.get(`/api/assignments/${assignmentId}`)
}

/**
 * Submit an assignment
 */
export async function submitAssignment(
  assignmentId: string,
  data: SubmitAssignmentDto,
): Promise<AssignmentSubmission> {
  return apiClient.post(`/api/assignments/${assignmentId}/submit`, data)
}

/**
 * Update a submission
 */
export async function updateSubmission(
  submissionId: string,
  data: UpdateSubmissionDto,
): Promise<AssignmentSubmission> {
  return apiClient.patch(`/api/submissions/${submissionId}`, data)
}

/**
 * Get current user's submissions
 */
export async function getMySubmissions(): Promise<AssignmentSubmission[]> {
  return apiClient.get('/api/assignments/my-submissions')
}

/**
 * Get submission for a specific assignment
 */
export async function getMySubmissionForAssignment(
  assignmentId: string,
): Promise<AssignmentSubmission | null> {
  return apiClient.get(`/api/assignments/${assignmentId}/my-submission`)
}
