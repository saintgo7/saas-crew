import { apiClient } from './client'
import type { User, Project, CourseProgress, LevelProgress } from './types'

export const dashboardApi = {
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/api/auth/me')
  },

  // Get user's projects
  getUserProjects: async (userId: string): Promise<Project[]> => {
    return apiClient.get<Project[]>(`/api/users/${userId}/projects`)
  },

  // Get course progress
  getCourseProgress: async (userId: string): Promise<CourseProgress[]> => {
    return apiClient.get<CourseProgress[]>(`/api/users/${userId}/course-progress`)
  },

  // Get level progress
  getLevelProgress: async (userId: string): Promise<LevelProgress> => {
    return apiClient.get<LevelProgress>(`/api/users/${userId}/level-progress`)
  },
}
