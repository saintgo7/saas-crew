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
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryDto,
  AddMemberDto,
  CreateInvitationDto,
  RespondInvitationDto,
  UpdateMemberRoleDto,
} from './dto'

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

  /**
   * PATCH /api/projects/:id/members/:userId/role
   * Update member role
   * Protected endpoint - requires OWNER role
   */
  @Patch(':id/members/:userId/role')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update member role',
    description: 'Update a member role. Only the project owner can change roles.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only owner can change roles',
  })
  async updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateMemberRoleDto,
    @Req() req: any,
  ) {
    return this.projectsService.updateMemberRole(id, userId, dto, req.user.id)
  }

  // ============================================
  // Invitation Endpoints
  // ============================================

  /**
   * POST /api/projects/:id/invitations
   * Create an invitation to join the project
   * Protected endpoint - requires OWNER or ADMIN role
   */
  @Post(':id/invitations')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create invitation',
    description: 'Create an invitation to join the project. Requires OWNER or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
  })
  @ApiResponse({
    status: 201,
    description: 'Invitation created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async createInvitation(
    @Param('id') id: string,
    @Body() dto: CreateInvitationDto,
    @Req() req: any,
  ) {
    return this.projectsService.createInvitation(id, dto, req.user.id)
  }

  /**
   * GET /api/projects/:id/invitations
   * Get project invitations
   * Protected endpoint - requires OWNER or ADMIN role
   */
  @Get(':id/invitations')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get project invitations',
    description: 'Get all invitations for the project. Requires OWNER or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
  })
  async getInvitations(@Param('id') id: string, @Req() req: any) {
    return this.projectsService.getInvitations(id, req.user.id)
  }

  /**
   * DELETE /api/projects/:id/invitations/:invitationId
   * Cancel an invitation
   * Protected endpoint - requires OWNER or ADMIN role
   */
  @Delete(':id/invitations/:invitationId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Cancel invitation',
    description: 'Cancel a pending invitation. Requires OWNER or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
  })
  @ApiParam({
    name: 'invitationId',
    description: 'Invitation ID',
  })
  async cancelInvitation(
    @Param('id') id: string,
    @Param('invitationId') invitationId: string,
    @Req() req: any,
  ) {
    return this.projectsService.cancelInvitation(invitationId, req.user.id)
  }

  /**
   * GET /api/projects/:id/activities
   * Get project activity log
   * Protected endpoint - requires project membership
   */
  @Get(':id/activities')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get activity log',
    description: 'Get project activity history. Requires project membership.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
  })
  async getActivities(
    @Param('id') id: string,
    @Query('limit') limit: number,
    @Req() req: any,
  ) {
    return this.projectsService.getActivityLog(id, req.user.id, limit)
  }

  /**
   * POST /api/projects/:id/sync-github
   * Sync project with GitHub repository
   * Protected endpoint - requires OWNER or ADMIN role
   */
  @Post(':id/sync-github')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Sync GitHub repository',
    description: 'Sync project with linked GitHub repository. Updates stars, forks, and branch info.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
  })
  async syncGitHub(@Param('id') id: string, @Req() req: any) {
    return this.projectsService.syncGitHub(id, req.user.id)
  }
}
