import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { XpActivityType, UserRank } from '@prisma/client'

/**
 * DTO for XP activity response
 * Represents a single XP activity entry
 */
export class XpActivityResponseDto {
  @ApiProperty({
    description: 'Activity ID',
    example: '789e0123-e45b-67d8-a901-426614174222',
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  userId: string

  @ApiProperty({
    description: 'Type of XP activity',
    enum: XpActivityType,
    example: 'POST_CREATED',
  })
  type: XpActivityType

  @ApiProperty({
    description: 'XP amount gained or lost',
    example: 5,
  })
  amount: number

  @ApiPropertyOptional({
    description: 'Activity description',
    example: 'Created a community post',
  })
  description?: string

  @ApiPropertyOptional({
    description: 'Reference type',
    example: 'post',
  })
  referenceType?: string

  @ApiPropertyOptional({
    description: 'Reference ID',
    example: '456e7890-e12b-34d5-a678-426614174111',
  })
  referenceId?: string

  @ApiProperty({
    description: 'Activity timestamp',
    example: '2024-01-15T12:30:00.000Z',
    format: 'date-time',
  })
  createdAt: Date
}

/**
 * DTO for XP history response
 * Returns paginated XP activities with user stats
 */
export class XpHistoryResponseDto {
  @ApiProperty({
    description: 'Current total XP',
    example: 1500,
  })
  totalXp: number

  @ApiProperty({
    description: 'Current level',
    example: 15,
  })
  level: number

  @ApiProperty({
    description: 'Current rank',
    enum: UserRank,
    example: 'SENIOR',
  })
  rank: UserRank

  @ApiProperty({
    description: 'XP needed for next level',
    example: 50,
  })
  xpToNextLevel: number

  @ApiProperty({
    description: 'XP needed for next rank',
    example: 3500,
  })
  xpToNextRank: number

  @ApiProperty({
    description: 'XP activities list',
    type: [XpActivityResponseDto],
  })
  activities: XpActivityResponseDto[]
}

/**
 * DTO for leaderboard entry
 */
export class LeaderboardEntryDto {
  @ApiProperty({
    description: 'Leaderboard position',
    example: 1,
  })
  position: number

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://avatars.githubusercontent.com/u/12345678',
  })
  avatar?: string

  @ApiProperty({
    description: 'Total XP',
    example: 5200,
  })
  xp: number

  @ApiProperty({
    description: 'User level',
    example: 52,
  })
  level: number

  @ApiProperty({
    description: 'User rank',
    enum: UserRank,
    example: 'MASTER',
  })
  rank: UserRank
}

/**
 * DTO for leaderboard response
 * Matches frontend LeaderboardResponse interface
 */
export class LeaderboardResponseDto {
  @ApiProperty({
    description: 'Leaderboard user entries',
    type: [LeaderboardEntryDto],
  })
  users: LeaderboardEntryDto[]

  @ApiProperty({
    description: 'Total number of users',
    example: 150,
  })
  total: number

  @ApiPropertyOptional({
    description: 'Current user position on the leaderboard',
    example: 15,
  })
  currentUserPosition?: number

  @ApiProperty({
    description: 'Leaderboard period',
    enum: ['all_time', 'this_month', 'this_week'],
    example: 'all_time',
  })
  period: 'all_time' | 'this_month' | 'this_week'
}

/**
 * DTO for XP grant result
 */
export class XpGrantResultDto {
  @ApiProperty({
    description: 'Indicates success',
    example: true,
  })
  success: boolean

  @ApiProperty({
    description: 'XP activity record',
    type: XpActivityResponseDto,
  })
  activity: XpActivityResponseDto

  @ApiProperty({
    description: 'User new total XP',
    example: 1520,
  })
  newTotalXp: number

  @ApiProperty({
    description: 'User new level',
    example: 16,
  })
  newLevel: number

  @ApiProperty({
    description: 'User new rank',
    enum: UserRank,
    example: 'SENIOR',
  })
  newRank: UserRank

  @ApiProperty({
    description: 'Whether user leveled up',
    example: true,
  })
  leveledUp: boolean

  @ApiProperty({
    description: 'Whether user ranked up',
    example: false,
  })
  rankedUp: boolean
}
