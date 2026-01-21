import { IsString, IsNotEmpty, IsArray, IsOptional, MaxLength } from 'class-validator'

/**
 * DTO for creating a new post
 * Validates post creation input
 */
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[]
}
