import { IsString, IsOptional, IsInt, Min, Max, IsIn } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    description: 'User biography or introduction',
    example: 'Full-stack developer passionate about open source',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string

  @ApiProperty({
    description: 'Profile picture URL',
    example: 'https://github.com/username.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiProperty({
    description: 'University department',
    example: 'Computer Science',
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string

  @ApiProperty({
    description: 'Academic grade (1-6)',
    example: 3,
    minimum: 1,
    maximum: 6,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  grade?: number

  @ApiProperty({
    description: 'UI theme preference',
    example: 'dark',
    enum: ['light', 'dark'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['light', 'dark'])
  theme?: string

  @ApiProperty({
    description: 'Preferred language',
    example: 'ko',
    enum: ['ko', 'en'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['ko', 'en'])
  language?: string
}
