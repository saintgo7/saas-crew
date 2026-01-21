import { IsString, IsOptional, IsArray, MaxLength } from 'class-validator'

/**
 * DTO for updating a post
 * All fields are optional for partial updates
 */
export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string

  @IsString()
  @IsOptional()
  @MaxLength(100)
  slug?: string

  @IsString()
  @IsOptional()
  content?: string

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[]
}
