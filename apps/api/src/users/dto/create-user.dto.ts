import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * DTO for creating a new user
 * Used primarily during GitHub OAuth user creation
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  name: string

  @ApiPropertyOptional({
    description: 'User password (optional for OAuth users)',
    example: 'securepassword123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string

  @ApiPropertyOptional({
    description: 'GitHub user ID from OAuth',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  githubId?: string

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://avatars.githubusercontent.com/u/12345678',
  })
  @IsOptional()
  @IsString()
  avatar?: string
}
