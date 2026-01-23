import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * User Response DTO
 * Data Transfer Object for user profile responses
 * Excludes sensitive information like password
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  email: string

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
  })
  name: string

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://avatars.githubusercontent.com/u/12345678',
  })
  avatar?: string

  @ApiPropertyOptional({
    description: 'User biography or introduction',
    example: 'Full-stack developer passionate about open source',
  })
  bio?: string

  @ApiPropertyOptional({
    description: 'University department',
    example: 'Computer Science',
  })
  department?: string

  @ApiPropertyOptional({
    description: 'Academic grade (1-6)',
    example: 3,
    minimum: 1,
    maximum: 6,
  })
  grade?: number

  @ApiProperty({
    description: 'User level from gamification system',
    example: 5,
    minimum: 1,
  })
  level: number

  @ApiProperty({
    description: 'Experience points',
    example: 1500,
    minimum: 0,
  })
  xp: number

  @ApiProperty({
    description: 'User rank title',
    example: 'Intermediate Developer',
    enum: ['Beginner', 'Novice', 'Intermediate Developer', 'Advanced Developer', 'Expert', 'Master'],
  })
  rank: string

  @ApiProperty({
    description: 'UI theme preference',
    example: 'dark',
    enum: ['light', 'dark'],
  })
  theme: string

  @ApiProperty({
    description: 'Preferred language',
    example: 'ko',
    enum: ['ko', 'en'],
  })
  language: string

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T12:30:00.000Z',
    format: 'date-time',
  })
  updatedAt: Date

  @ApiPropertyOptional({
    description: 'Activity counts',
    example: {
      projects: 5,
      posts: 12,
      comments: 48,
    },
  })
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
  @ApiPropertyOptional({
    description: 'User course enrollments with progress',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        courseId: { type: 'string', format: 'uuid' },
        courseName: { type: 'string' },
        progress: { type: 'number', minimum: 0, maximum: 100 },
        enrolledAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  enrollments?: any[]

  @ApiPropertyOptional({
    description: 'User project memberships',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        projectId: { type: 'string', format: 'uuid' },
        projectName: { type: 'string' },
        role: { type: 'string', enum: ['OWNER', 'ADMIN', 'MEMBER'] },
        joinedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  projects?: any[]
}
