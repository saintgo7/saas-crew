import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

/**
 * Question status enum for filtering
 */
export enum QuestionStatusFilter {
  ALL = 'ALL',
  OPEN = 'OPEN',
  ANSWERED = 'ANSWERED',
  CLOSED = 'CLOSED',
}

/**
 * Sort options for questions
 */
export enum QuestionSortBy {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_VOTES = 'most_votes',
  MOST_ANSWERS = 'most_answers',
  MOST_VIEWS = 'most_views',
  BOUNTY = 'bounty',
}

/**
 * DTO for question query parameters
 * Supports filtering, searching, sorting and pagination
 */
export class QuestionQueryDto {
  @ApiProperty({
    description: 'Filter by tags (comma-separated)',
    example: 'NestJS,TypeScript',
    required: false,
  })
  @IsOptional()
  @IsString()
  tags?: string

  @ApiProperty({
    description: 'Filter by question status',
    enum: QuestionStatusFilter,
    example: QuestionStatusFilter.OPEN,
    required: false,
  })
  @IsOptional()
  @IsEnum(QuestionStatusFilter)
  status?: QuestionStatusFilter

  @ApiProperty({
    description: 'Search in title and content',
    example: 'jwt authentication',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({
    description: 'Filter by author ID',
    example: 'clp123abc456',
    required: false,
  })
  @IsOptional()
  @IsString()
  authorId?: string

  @ApiProperty({
    description: 'Sort by',
    enum: QuestionSortBy,
    example: QuestionSortBy.NEWEST,
    default: QuestionSortBy.NEWEST,
    required: false,
  })
  @IsOptional()
  @IsEnum(QuestionSortBy)
  sortBy?: QuestionSortBy = QuestionSortBy.NEWEST

  @ApiProperty({
    description: 'Filter questions with bounty only',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  hasBounty?: boolean

  @ApiProperty({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1

  @ApiProperty({
    description: 'Items per page',
    example: 20,
    minimum: 1,
    default: 20,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20
}
