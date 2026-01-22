import { apiClient } from './client'
import type {
  Course,
  CourseDetailResponse,
  CoursesListResponse,
  CourseEnrollment,
  ChapterProgress,
  CourseLevel,
} from './types'

export const coursesApi = {
  /**
   * Get all courses with optional filtering
   */
  async getCourses(params?: {
    level?: CourseLevel
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    page?: number
    pageSize?: number
    search?: string
  }): Promise<CoursesListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.level) searchParams.set('level', params.level)
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.pageSize) searchParams.set('limit', params.pageSize.toString())
    if (params?.search) searchParams.set('search', params.search)

    const query = searchParams.toString()
    return apiClient.get<CoursesListResponse>(
      `/api/courses${query ? `?${query}` : ''}`
    )
  },

  /**
   * Get course by ID with chapters and enrollment status
   */
  async getCourseById(courseId: string): Promise<CourseDetailResponse> {
    return apiClient.get<CourseDetailResponse>(`/api/courses/${courseId}`)
  },

  /**
   * Enroll in a course
   */
  async enrollCourse(courseId: string): Promise<CourseEnrollment> {
    return apiClient.post<CourseEnrollment>(`/api/courses/${courseId}/enroll`)
  },

  /**
   * Unenroll from a course
   */
  async unenrollCourse(courseId: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(
      `/api/courses/${courseId}/enroll`
    )
  },

  /**
   * Get course progress for a user
   */
  async getCourseProgress(courseId: string): Promise<CourseEnrollment> {
    return apiClient.get<CourseEnrollment>(`/api/courses/${courseId}/progress`)
  },

  /**
   * Update chapter progress
   */
  async updateChapterProgress(
    chapterId: string,
    data: {
      completed: boolean
      timeSpent?: number
    }
  ): Promise<ChapterProgress> {
    return apiClient.patch<ChapterProgress>(
      `/api/chapters/${chapterId}/progress`,
      data
    )
  },

  /**
   * Get enrolled courses for current user
   */
  async getEnrolledCourses(): Promise<Course[]> {
    return apiClient.get<Course[]>('/api/courses/enrolled')
  },
}
