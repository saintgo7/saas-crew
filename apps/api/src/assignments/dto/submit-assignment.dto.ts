import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsUrl } from 'class-validator'

export class SubmitAssignmentDto {
  @ApiProperty({
    description: 'Submission content',
    example: 'Here is my solution for the assignment...',
  })
  @IsString()
  content: string

  @ApiPropertyOptional({
    description: 'GitHub repository URL',
    example: 'https://github.com/user/repo',
  })
  @IsOptional()
  @IsString()
  githubUrl?: string
}

export class UpdateSubmissionDto {
  @ApiPropertyOptional({
    description: 'Updated submission content',
  })
  @IsOptional()
  @IsString()
  content?: string

  @ApiPropertyOptional({
    description: 'Updated GitHub repository URL',
  })
  @IsOptional()
  @IsString()
  githubUrl?: string
}
