import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsArray,
  IsEnum,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator'
import { Type } from 'class-transformer'
import { QuestionType } from '@prisma/client'

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Question type',
    enum: QuestionType,
    default: QuestionType.MULTIPLE_CHOICE,
  })
  @IsEnum(QuestionType)
  type: QuestionType

  @ApiProperty({
    description: 'Question text',
    example: 'What is TypeScript?',
  })
  @IsString()
  question: string

  @ApiProperty({
    description: 'Answer options',
    example: ['A typed superset of JavaScript', 'A database', 'A framework'],
  })
  @IsArray()
  options: string[]

  @ApiProperty({
    description: 'Correct answer (index or text)',
    example: '0',
  })
  @IsString()
  correctAnswer: string

  @ApiPropertyOptional({
    description: 'Explanation shown after answering',
  })
  @IsOptional()
  @IsString()
  explanation?: string

  @ApiPropertyOptional({
    description: 'Question order',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  order?: number

  @ApiPropertyOptional({
    description: 'Points for this question',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number
}

export class CreateQuizDto {
  @ApiProperty({
    description: 'Quiz title',
    example: 'TypeScript Basics Quiz',
  })
  @IsString()
  title: string

  @ApiPropertyOptional({
    description: 'Quiz description',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Chapter ID this quiz belongs to',
  })
  @IsString()
  chapterId: string

  @ApiPropertyOptional({
    description: 'Passing score percentage (0-100)',
    default: 70,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  passingScore?: number

  @ApiPropertyOptional({
    description: 'Time limit in minutes (null for no limit)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimit?: number

  @ApiPropertyOptional({
    description: 'Maximum attempts allowed',
    default: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number

  @ApiPropertyOptional({
    description: 'Shuffle questions order',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  shuffleQuestions?: boolean

  @ApiPropertyOptional({
    description: 'Quiz questions',
    type: [CreateQuestionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[]
}

export class SubmitQuizDto {
  @ApiProperty({
    description: 'User answers for each question',
    example: { '0': '0', '1': '2', '2': 'true' },
  })
  answers: Record<string, string>

  @ApiPropertyOptional({
    description: 'Time spent in seconds',
  })
  @IsOptional()
  @IsInt()
  timeSpent?: number
}

export class UpdateQuizDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  passingScore?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimit?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  shuffleQuestions?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean
}
