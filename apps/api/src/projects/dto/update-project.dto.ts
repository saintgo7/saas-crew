import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator'
import { Visibility } from '@prisma/client'

/**
 * DTO for updating project information
 * All fields are optional for partial updates
 */
export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility

  @IsOptional()
  @IsUrl()
  githubRepo?: string

  @IsOptional()
  @IsUrl()
  deployUrl?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @IsOptional()
  @IsUrl()
  coverImage?: string
}
