import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * Request Mentor DTO
 * Data Transfer Object for mentorship request
 */
export class RequestMentorDto {
  @ApiProperty({
    description: 'ID of the user to request as mentor',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  mentorId: string
}
