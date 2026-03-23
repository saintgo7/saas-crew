import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for email/password login
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email address',
    example: 'student@wku.ac.kr',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  email: string

  @ApiProperty({
    description: 'Password',
    example: 'mypassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다' })
  password: string
}
