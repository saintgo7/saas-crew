import {
  Controller,
  Get,
  Post,
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { ProjectsService } from '../projects/projects.service'

/**
 * Users Controller
 * Handles HTTP requests for user profile management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  /**
   * GET /api/users
   * Get all users (admin only)
   * Protected endpoint - requires JWT authentication
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getUsers() {
    return this.usersService.findAll()
  }

  /**
   * GET /api/users/:id
   * Get user profile by ID
   * Public endpoint - anyone can view user profiles
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve user profile information by user ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        name: 'John Doe',
        avatar: 'https://github.com/username.png',
        department: 'Computer Science',
        grade: 3,
        bio: 'Full-stack developer',
        theme: 'dark',
        language: 'ko',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update user profile information. Users can only update their own profile.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (must match authenticated user)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Cannot update other users profiles',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
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
  @ApiOperation({
    summary: 'Get user projects',
    description: 'Retrieve all projects where the user is a member',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User projects retrieved successfully',
    schema: {
      example: [
        {
          id: '456e7890-e12b-34d5-a678-426614174111',
          name: 'E-Commerce Platform',
          slug: 'ecommerce-platform',
          description: 'Full-stack e-commerce solution',
          visibility: 'PUBLIC',
          role: 'OWNER',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserProjects(@Param('id') id: string) {
    return this.usersService.findUserProjects(id)
  }

  // ============================================
  // Invitation Endpoints (for current user)
  // ============================================

  /**
   * GET /api/users/me/invitations
   * Get current user's pending project invitations
   * Protected endpoint - requires JWT authentication
   */
  @Get('me/invitations')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get my invitations',
    description: 'Get all pending project invitations for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Invitations retrieved successfully',
  })
  async getMyInvitations(@Req() req: any) {
    return this.projectsService.getUserInvitations(req.user.id)
  }

  /**
   * POST /api/users/me/invitations/:id/respond
   * Respond to a project invitation (accept or reject)
   * Protected endpoint - requires JWT authentication
   */
  @Post('me/invitations/:id/respond')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Respond to invitation',
    description: 'Accept or reject a project invitation',
  })
  @ApiParam({
    name: 'id',
    description: 'Invitation ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Response recorded successfully',
  })
  async respondToInvitation(
    @Param('id') id: string,
    @Body() body: { accept: boolean },
    @Req() req: any,
  ) {
    return this.projectsService.respondToInvitation(id, req.user.id, body.accept)
  }
}
