import { apiClient } from './client'
import type {
  User,
  Project,
  CourseProgress,
  LevelProgress,
  ActivityItem,
  DashboardStats,
} from './types'

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

  // Get user activity feed
  getActivityFeed: async (userId: string, limit = 10): Promise<ActivityItem[]> => {
    try {
      return await apiClient.get<ActivityItem[]>(
        `/api/users/${userId}/activities?limit=${limit}`
      )
    } catch {
      // Return empty array if endpoint is not available
      return []
    }
  },

  // Get dashboard stats
  getDashboardStats: async (userId: string): Promise<DashboardStats> => {
    try {
      return await apiClient.get<DashboardStats>(`/api/users/${userId}/stats`)
    } catch {
      // Return default stats if endpoint is not available
      return {
        totalCoursesEnrolled: 0,
        totalCoursesCompleted: 0,
        totalProjects: 0,
        totalContributions: 0,
        daysActive: 0,
        postsCreated: 0,
        commentsCreated: 0,
      }
    }
  },
}
