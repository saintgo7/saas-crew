import { PartialType } from '@nestjs/swagger'
import { CreateChannelDto } from './create-channel.dto'

/**
 * DTO for updating a channel
 * All fields are optional
 */
export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
