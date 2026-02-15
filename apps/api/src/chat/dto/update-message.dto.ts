import { IsString, IsNotEmpty, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for updating a message
 * Only content can be updated
 */
export class UpdateMessageDto {
  @ApiProperty({
    description: 'Updated message content',
    example: 'Hello everyone! (edited)',
    maxLength: 10000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string
}
