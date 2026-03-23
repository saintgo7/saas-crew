import { IsEmail, IsString, MinLength, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for email/password registration
 * Only @wku.ac.kr email domain is allowed
 */
export class RegisterDto {
  @ApiProperty({
    description: 'WKU student email address (must end with @wku.ac.kr)',
    example: 'student@wku.ac.kr',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  @Matches(/@wku\.ac\.kr$/, { message: '@wku.ac.kr 이메일만 사용할 수 있습니다' })
  email: string

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'mypassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다' })
  password: string

  @ApiProperty({
    description: 'Display name (pseudonym allowed)',
    example: '코딩마스터',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다' })
  name: string
}
