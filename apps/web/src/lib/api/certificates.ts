import { apiClient } from './client'

/**
 * Certificate types
 */
export interface Certificate {
  id: string
  certificateNumber: string
  userId: string
  courseId: string
  courseName: string
  courseLevel: string
  issuedAt: string
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  course?: {
    id: string
    title: string
    level: string
    thumbnailUrl?: string
    description?: string
  }
}

export interface CourseCompletion {
  isComplete: boolean
  totalChapters: number
  completedChapters: number
  requiredQuizzes: number
  passedQuizzes: number
}

export interface CertificateVerification {
  valid: boolean
  message?: string
  certificate?: {
    certificateNumber: string
    userName: string
    courseName: string
    courseLevel: string
    issuedAt: string
  }
}

export interface CertificateStats {
  totalCertificates: number
  recentCertificates: number
}

/**
 * Issue a certificate for a completed course
 */
export async function issueCertificate(courseId: string): Promise<Certificate> {
  return apiClient.post('/certificates/issue', { courseId })
}

/**
 * Get current user's certificates
 */
export async function getMyCertificates(): Promise<Certificate[]> {
  return apiClient.get('/certificates/my')
}

/**
 * Verify a certificate by number
 */
export async function verifyCertificate(
  certificateNumber: string,
): Promise<CertificateVerification> {
  return apiClient.post('/certificates/verify', { certificateNumber })
}

/**
 * Check if user can get a certificate for a course
 */
export async function checkCourseCompletion(
  courseId: string,
): Promise<CourseCompletion> {
  return apiClient.get(`/certificates/check/${courseId}`)
}

/**
 * Get certificate by ID
 */
export async function getCertificate(id: string): Promise<Certificate> {
  return apiClient.get(`/certificates/${id}`)
}

/**
 * Get all certificates for a course (admin)
 */
export async function getCourseCertificates(
  courseId: string,
): Promise<Certificate[]> {
  return apiClient.get(`/certificates/course/${courseId}`)
}

/**
 * Get certificate statistics for a course
 */
export async function getCourseStats(
  courseId: string,
): Promise<CertificateStats> {
  return apiClient.get(`/certificates/course/${courseId}/stats`)
}
