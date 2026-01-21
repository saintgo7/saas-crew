import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'

/**
 * Users Controller
 * Handles HTTP requests for user profile management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/users/:id
   * Get user profile by ID
   * Public endpoint - anyone can view user profiles
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  /**
   * PATCH /api/users/:id
   * Update user profile
   * Protected endpoint - requires JWT authentication
   * Users can only update their own profile
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    // Authorization: Check if user is updating their own profile
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile')
    }

    return this.usersService.update(id, dto)
  }

  /**
   * GET /api/users/:id/projects
   * Get all projects where user is a member
   * Public endpoint - shows user's project portfolio
   */
  @Get(':id/projects')
  @HttpCode(HttpStatus.OK)
  async getUserProjects(@Param('id') id: string) {
    return this.usersService.findUserProjects(id)
  }
}
