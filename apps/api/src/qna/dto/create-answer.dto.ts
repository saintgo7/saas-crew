import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for creating an answer to a question
 */
export class CreateAnswerDto {
  @ApiProperty({
    description: 'Answer content in Markdown format',
    example: '# Solution\n\nTo implement JWT authentication in NestJS, you need to...',
  })
  @IsString()
  @IsNotEmpty()
  content: string
}
