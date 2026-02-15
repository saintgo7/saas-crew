import { apiClient } from './client'

/**
 * Admin types
 */
export type UserRank = 'JUNIOR' | 'SENIOR' | 'MASTER'

export interface AdminStats {
  overview: {
    users: number
    courses: number
    projects: number
    enrollments: number
    posts: number
    questions: number
    channels: number
    certificates: number
  }
  growth: {
    newUsersLast30Days: number
    newEnrollmentsLast30Days: number
    newPostsLast30Days: number
    newCertificatesLast30Days: number
  }
  rankDistribution: Record<string, number>
  recentUsers: Array<{
    id: string
    name: string
    email: string
    avatar?: string
    rank: UserRank
    level: number
    createdAt: string
  }>
  recentCourses: Array<{
    id: string
    title: string
    slug: string
    published: boolean
    level: string
    createdAt: string
    _count: { enrollments: number }
  }>
  recentProjects: Array<{
    id: string
    name: string
    visibility: string
    createdAt: string
    _count: { members: number }
  }>
  topCourses: Array<{
    id: string
    title: string
    slug: string
    level: string
    _count: { enrollments: number }
  }>
}

export interface AdminUser {
  id: string
  name: string
  email: string
  avatar?: string
  rank: UserRank
  level: number
  xp: number
  department?: string
  grade?: number
  createdAt: string
  updatedAt: string
  _count: {
    posts: number
    comments: number
    projects: number
    enrollments: number
  }
}

export interface UsersResponse {
  users: AdminUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ActivityAnalytics {
  period: {
    start: string
    end: string
    days: number
  }
  userSignups: Array<{ date: string; count: number }>
  posts: Array<{ date: string; count: number }>
  enrollments: Array<{ date: string; count: number }>
}

export interface CourseAnalytics {
  id: string
  title: string
  slug: string
  level: string
  published: boolean
  completedEnrollments: number
  completionRate: number
  certificates: number
  _count: {
    enrollments: number
    chapters: number
  }
}

export interface LeaderboardUser {
  id: string
  name: string
  avatar?: string
  rank: UserRank
  level: number
  xp: number
  position: number
  _count: {
    posts: number
    certificates: number
  }
}

/**
 * Build query string from params
 */
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return ''
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined,
  )
  if (entries.length === 0) return ''
  return '?' + entries.map(([key, value]) => `${key}=${value}`).join('&')
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<AdminStats> {
  return apiClient.get('/admin/stats')
}

/**
 * Get users list with pagination and filters
 */
export async function getUsers(params?: {
  page?: number
  limit?: number
  search?: string
  rank?: UserRank
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}): Promise<UsersResponse> {
  return apiClient.get(`/admin/users${buildQueryString(params)}`)
}

/**
 * Get user details by ID
 */
export async function getUserById(id: string): Promise<AdminUser> {
  return apiClient.get(`/admin/users/${id}`)
}

/**
 * Update user rank
 */
export async function updateUserRank(
  id: string,
  rank: UserRank,
): Promise<AdminUser> {
  return apiClient.patch(`/admin/users/${id}/rank`, { rank })
}

/**
 * Update user level and XP
 */
export async function updateUserLevel(
  id: string,
  data: { level?: number; xp?: number },
): Promise<AdminUser> {
  return apiClient.patch(`/admin/users/${id}/level`, data)
}

/**
 * Get activity analytics
 */
export async function getActivityAnalytics(
  days?: number,
): Promise<ActivityAnalytics> {
  const query = days ? `?days=${days}` : ''
  return apiClient.get(`/admin/analytics/activity${query}`)
}

/**
 * Get course analytics
 */
export async function getCourseAnalytics(): Promise<CourseAnalytics[]> {
  return apiClient.get('/admin/analytics/courses')
}

/**
 * Get leaderboard data
 */
export async function getLeaderboard(params?: {
  limit?: number
  rank?: UserRank
}): Promise<LeaderboardUser[]> {
  return apiClient.get(`/admin/leaderboard${buildQueryString(params)}`)
}
