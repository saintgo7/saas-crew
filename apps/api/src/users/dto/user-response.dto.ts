/**
 * User Response DTO
 * Data Transfer Object for user profile responses
 * Excludes sensitive information like password
 */
export class UserResponseDto {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  department?: string
  grade?: number
  level: number
  xp: number
  rank: string
  theme: string
  language: string
  createdAt: Date
  updatedAt: Date
  _count?: {
    projects: number
    posts: number
    comments: number
  }
}

/**
 * User Profile Response DTO
 * Extended user information for profile pages
 */
export class UserProfileResponseDto extends UserResponseDto {
  enrollments?: any[]
  projects?: any[]
}
