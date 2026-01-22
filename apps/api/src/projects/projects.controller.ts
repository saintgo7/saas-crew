import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
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
import { ProjectsService } from './projects.service'
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto, AddMemberDto } from './dto'

/**
 * Projects Controller
 * Handles HTTP requests for project management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * GET /api/projects
   * Get all projects with optional filters
   * Public endpoint - supports filtering by visibility, tags, and search
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all projects',
    description: 'Retrieve projects with optional filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully',
  })
  async getProjects(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAll(query)
  }

  /**
   * POST /api/projects
   * Create a new project
   * Protected endpoint - requires JWT authentication
   * Creator automatically becomes OWNER
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create project',
    description: 'Create a new project. The creator automatically becomes the project owner.',
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async createProject(@Body() dto: CreateProjectDto, @Req() req: any) {
    return this.projectsService.create(dto, req.user.id)
  }

  /**
   * GET /api/projects/:id
   * Get project details by ID
   * Public endpoint - returns detailed project information
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get project by ID',
    description: 'Retrieve detailed project information including members',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '456e7890-e12b-34d5-a678-426614174111',
  })
  @ApiResponse({
    status: 200,
    description: 'Project retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async getProject(@Param('id') id: string) {
    return this.projectsService.findById(id)
  }

  /**
   * PATCH /api/projects/:id
   * Update project information
   * Protected endpoint - requires OWNER or ADMIN role
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update project',
    description: 'Update project information. Requires OWNER or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '456e7890-e12b-34d5-a678-426614174111',
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async updateProject(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @Req() req: any,
  ) {
    return this.projectsService.update(id, dto, req.user.id)
  }

  /**
   * DELETE /api/projects/:id
   * Delete project
   * Protected endpoint - requires OWNER role only
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete project',
    description: 'Delete a project. Only the project owner can delete the project.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '456e7890-e12b-34d5-a678-426614174111',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only owner can delete',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async deleteProject(@Param('id') id: string, @Req() req: any) {
    return this.projectsService.delete(id, req.user.id)
  }

  /**
   * POST /api/projects/:id/members
   * Add member to project
   * Protected endpoint - requires OWNER or ADMIN role
   */
  @Post(':id/members')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Add project member',
    description: 'Add a member to the project. Requires OWNER or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '456e7890-e12b-34d5-a678-426614174111',
  })
  @ApiResponse({
    status: 201,
    description: 'Member added successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Project or user not found',
  })
  async addMember(
    @Param('id') id: string,
    @Body() dto: AddMemberDto,
    @Req() req: any,
  ) {
    return this.projectsService.addMember(id, dto, req.user.id)
  }

  /**
   * DELETE /api/projects/:id/members/:userId
   * Remove member from project
   * Protected endpoint - requires OWNER or ADMIN role
   * Cannot remove OWNER
   */
  @Delete(':id/members/:userId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Remove project member',
    description: 'Remove a member from the project. Cannot remove the owner. Requires OWNER or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '456e7890-e12b-34d5-a678-426614174111',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID to remove',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Member removed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Cannot remove owner or insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Project or member not found',
  })
  async removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req: any,
  ) {
    return this.projectsService.removeMember(id, userId, req.user.id)
  }
}
