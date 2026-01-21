// ===========================================
// WKU Software Crew - Shared Types & Utils
// ===========================================

// ============ User Types ============

export type UserRank = 'JUNIOR' | 'SENIOR' | 'MASTER'

export interface User {
  id: string
  email: string
  name: string
  githubId: string
  avatar?: string

  // Level System
  rank: UserRank
  level: number // 1-50
  xp: number

  // Profile
  bio?: string
  skills: string[]
  department?: string
  grade?: number

  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  projectCount: number
  completedProjectCount: number
}

// ============ Project Types ============

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE' | 'CREW_ONLY'

export interface Project {
  id: string
  title: string
  description: string

  ownerId: string
  owner?: User

  status: ProjectStatus
  visibility: ProjectVisibility
  courseLevel: UserRank

  techStack: string[]
  githubUrl?: string
  deployUrl?: string
  thumbnailUrl?: string

  viewCount: number
  likeCount: number

  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface ProjectWithOwner extends Project {
  owner: User
}

// ============ Course Types ============

export interface Course {
  id: string
  title: string
  description: string
  level: UserRank

  requiredProjects: number
  requiredXP: number

  order: number

  createdAt: Date
}

export interface CourseProgress {
  courseId: string
  userId: string
  completedProjects: number
  currentXP: number
  progress: number // 0-100
  completedAt?: Date
}

// ============ API Types ============

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============ Auth Types ============

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  rank: UserRank
  level: number
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

// ============ Utils ============

export const RANK_LEVELS = {
  JUNIOR: { min: 1, max: 10 },
  SENIOR: { min: 11, max: 30 },
  MASTER: { min: 31, max: 50 },
} as const

export function getRankFromLevel(level: number): UserRank {
  if (level <= 10) return 'JUNIOR'
  if (level <= 30) return 'SENIOR'
  return 'MASTER'
}

export function getXPForLevel(level: number): number {
  // XP needed to reach this level
  return level * 100 + (level - 1) * 50
}

export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0
  return Math.round((current / total) * 100)
}
