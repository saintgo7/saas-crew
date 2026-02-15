import { IsInt, Min, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for voting on a question or answer
 */
export class VoteDto {
  @ApiProperty({
    description: 'Vote value: 1 for upvote, -1 for downvote',
    example: 1,
    minimum: -1,
    maximum: 1,
  })
  @IsInt()
  @Min(-1)
  @Max(1)
  value: number
}
