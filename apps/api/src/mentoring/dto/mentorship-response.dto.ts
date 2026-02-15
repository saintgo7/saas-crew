import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MentorshipStatus, UserRank } from '@prisma/client'

/**
 * Mentor/Mentee User Info DTO
 * Basic user information for mentorship responses
 */
export class MentorshipUserDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string

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

  @ApiProperty({
    description: 'User rank',
    enum: UserRank,
    example: UserRank.SENIOR,
  })
  rank: UserRank

  @ApiProperty({
    description: 'User level',
    example: 5,
  })
  level: number

  @ApiPropertyOptional({
    description: 'User department',
    example: 'Computer Science',
  })
  department?: string
}

/**
 * Mentorship Response DTO
 * Data Transfer Object for mentorship responses
 */
export class MentorshipResponseDto {
  @ApiProperty({
    description: 'Mentorship ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    description: 'Mentor information',
    type: MentorshipUserDto,
  })
  mentor: MentorshipUserDto

  @ApiProperty({
    description: 'Mentee information',
    type: MentorshipUserDto,
  })
  mentee: MentorshipUserDto

  @ApiProperty({
    description: 'Mentorship status',
    enum: MentorshipStatus,
    example: MentorshipStatus.ACTIVE,
  })
  status: MentorshipStatus

  @ApiProperty({
    description: 'Number of mentoring sessions',
    example: 5,
  })
  sessionsCount: number

  @ApiPropertyOptional({
    description: 'Last session timestamp',
    example: '2024-01-15T12:30:00.000Z',
    format: 'date-time',
  })
  lastSessionAt?: Date

  @ApiPropertyOptional({
    description: 'Rating given by mentee to mentor (1-5)',
    example: 4.5,
    minimum: 1,
    maximum: 5,
  })
  mentorRating?: number

  @ApiPropertyOptional({
    description: 'Rating given by mentor to mentee (1-5)',
    example: 4.0,
    minimum: 1,
    maximum: 5,
  })
  menteeRating?: number

  @ApiPropertyOptional({
    description: 'Mentorship start timestamp',
    example: '2024-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  startedAt?: Date

  @ApiPropertyOptional({
    description: 'Mentorship end timestamp',
    example: '2024-06-01T00:00:00.000Z',
    format: 'date-time',
  })
  endedAt?: Date

  @ApiProperty({
    description: 'Request creation timestamp',
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
}

/**
 * Available Mentor Response DTO
 * User information for available mentors list
 */
export class AvailableMentorDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string

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
    description: 'User biography',
    example: 'Senior developer with 5 years of experience',
  })
  bio?: string

  @ApiProperty({
    description: 'User rank',
    enum: UserRank,
    example: UserRank.MASTER,
  })
  rank: UserRank

  @ApiProperty({
    description: 'User level',
    example: 10,
  })
  level: number

  @ApiPropertyOptional({
    description: 'User department',
    example: 'Computer Science',
  })
  department?: string

  @ApiProperty({
    description: 'Number of active mentees',
    example: 3,
  })
  activeMenteesCount: number

  @ApiPropertyOptional({
    description: 'Average mentor rating',
    example: 4.8,
    minimum: 1,
    maximum: 5,
  })
  averageRating?: number
}
