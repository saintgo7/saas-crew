import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryDto,
  AddMemberDto,
  CreateInvitationDto,
  UpdateMemberRoleDto,
} from './dto'
import {
  ProjectRole,
  Visibility,
  InvitationStatus,
  ProjectActivityType,
} from '@prisma/client'

/**
 * Projects Service
 * Business logic layer for project management
 * Handles CRUD operations, member management, and authorization
 */
@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * Find all projects with optional filters
   * Repository Layer: Complex query with pagination and filtering
   */
  async findAll(query: ProjectQueryDto) {
    const { visibility, tags, search, page = 1, limit = 20 } = query
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (visibility) {
      where.visibility = visibility
    }

    if (tags) {
      const tagArray = tags.split(',').map((tag) => tag.trim())
      where.tags = {
        hasSome: tagArray,
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Execute query with pagination
    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          visibility: true,
          githubRepo: true,
          deployUrl: true,
          tags: true,
          coverImage: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              members: true,
            },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ])

    return {
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Create a new project
   * Business Logic: Creates project with creator as OWNER
   */
  async create(dto: CreateProjectDto, userId: string) {
    // Check if slug already exists
    const existingProject = await this.prisma.project.findUnique({
      where: { slug: dto.slug },
    })

    if (existingProject) {
      throw new ConflictException(`Project with slug '${dto.slug}' already exists`)
    }

    // Create project with creator as owner
    const project = await this.prisma.project.create({
      data: {
        ...dto,
        members: {
          create: {
            userId,
            role: ProjectRole.OWNER,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    return project
  }

  /**
   * Find project by ID
   * Repository Layer: Get detailed project information
   */
  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                department: true,
                grade: true,
              },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
      },
    })

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`)
    }

    return project
  }

  /**
   * Update project information
   * Business Logic: Validates ownership and updates data
   */
  async update(id: string, dto: UpdateProjectDto, userId: string) {
    // Check if user has OWNER or ADMIN role
    const member = await this.findProjectMember(id, userId)

    if (!member || (member.role !== ProjectRole.OWNER && member.role !== ProjectRole.ADMIN)) {
      throw new ForbiddenException('Only OWNER or ADMIN can update project details')
    }

    // Update project
    return this.prisma.project.update({
      where: { id },
      data: dto,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Delete project
   * Business Logic: Only OWNER can delete projects
   */
  async delete(id: string, userId: string) {
    // Check if user is OWNER
    const member = await this.findProjectMember(id, userId)

    if (!member || member.role !== ProjectRole.OWNER) {
      throw new ForbiddenException('Only project OWNER can delete the project')
    }

    // Delete project (cascade deletes members)
    await this.prisma.project.delete({
      where: { id },
    })

    return { message: 'Project deleted successfully' }
  }

  /**
   * Add member to project
   * Business Logic: Only OWNER or ADMIN can add members
   */
  async addMember(projectId: string, dto: AddMemberDto, requesterId: string) {
    // Check if requester has OWNER or ADMIN role
    const requester = await this.findProjectMember(projectId, requesterId)

    if (!requester || (requester.role !== ProjectRole.OWNER && requester.role !== ProjectRole.ADMIN)) {
      throw new ForbiddenException('Only OWNER or ADMIN can add members')
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`)
    }

    // Check if user is already a member
    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: dto.userId,
        },
      },
    })

    if (existingMember) {
      throw new ConflictException('User is already a member of this project')
    }

    // ADMIN cannot add OWNER
    if (requester.role === ProjectRole.ADMIN && dto.role === ProjectRole.OWNER) {
      throw new ForbiddenException('ADMIN cannot add OWNER role')
    }

    // Add member
    const member = await this.prisma.projectMember.create({
      data: {
        projectId,
        userId: dto.userId,
        role: dto.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    return member
  }

  /**
   * Remove member from project
   * Business Logic: Only OWNER or ADMIN can remove members
   */
  async removeMember(projectId: string, userId: string, requesterId: string) {
    // Check if requester has OWNER or ADMIN role
    const requester = await this.findProjectMember(projectId, requesterId)

    if (!requester || (requester.role !== ProjectRole.OWNER && requester.role !== ProjectRole.ADMIN)) {
      throw new ForbiddenException('Only OWNER or ADMIN can remove members')
    }

    // Check if target member exists
    const targetMember = await this.findProjectMember(projectId, userId)

    if (!targetMember) {
      throw new NotFoundException('Member not found in this project')
    }

    // Cannot remove OWNER
    if (targetMember.role === ProjectRole.OWNER) {
      throw new ForbiddenException('Cannot remove project OWNER')
    }

    // ADMIN cannot remove other ADMIN
    if (requester.role === ProjectRole.ADMIN && targetMember.role === ProjectRole.ADMIN) {
      throw new ForbiddenException('ADMIN cannot remove other ADMIN')
    }

    // Remove member
    await this.prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    })

    return { message: 'Member removed successfully' }
  }

  /**
   * Helper: Find project member
   * Private method for authorization checks
   */
  private async findProjectMember(projectId: string, userId: string) {
    return this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    })
  }

  /**
   * Check if user has access to project
   * Business Logic: Authorization helper
   */
  async checkAccess(projectId: string, userId: string | null): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        visibility: true,
      },
    })

    if (!project) {
      return false
    }

    // PUBLIC projects are accessible to everyone
    if (project.visibility === Visibility.PUBLIC) {
      return true
    }

    // PRIVATE and TEAM projects require membership
    if (!userId) {
      return false
    }

    const member = await this.findProjectMember(projectId, userId)
    return !!member
  }

  // ============================================
  // Team Invitation System
  // ============================================

  /**
   * Create an invitation to join a project
   * Business Logic: Only OWNER or ADMIN can invite
   */
  async createInvitation(
    projectId: string,
    dto: CreateInvitationDto,
    inviterId: string,
  ) {
    // Validate at least one of email or userId is provided
    if (!dto.email && !dto.userId) {
      throw new BadRequestException('Either email or userId must be provided')
    }

    // Check if inviter has OWNER or ADMIN role
    const inviter = await this.findProjectMember(projectId, inviterId)
    if (!inviter || (inviter.role !== ProjectRole.OWNER && inviter.role !== ProjectRole.ADMIN)) {
      throw new ForbiddenException('Only OWNER or ADMIN can invite members')
    }

    // ADMIN cannot invite with OWNER role
    if (inviter.role === ProjectRole.ADMIN && dto.role === ProjectRole.OWNER) {
      throw new ForbiddenException('ADMIN cannot invite with OWNER role')
    }

    // Check if user is already a member
    if (dto.userId) {
      const existingMember = await this.prisma.projectMember.findUnique({
        where: {
          projectId_userId: { projectId, userId: dto.userId },
        },
      })
      if (existingMember) {
        throw new ConflictException('User is already a member of this project')
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await this.prisma.projectInvitation.findFirst({
      where: {
        projectId,
        status: InvitationStatus.PENDING,
        OR: [
          { email: dto.email },
          { userId: dto.userId },
        ].filter((o) => o.email || o.userId),
      },
    })

    if (existingInvitation) {
      throw new ConflictException('An invitation is already pending for this user')
    }

    // Create invitation with 7-day expiration
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const invitation = await this.prisma.projectInvitation.create({
      data: {
        projectId,
        email: dto.email,
        userId: dto.userId,
        inviterId,
        role: dto.role || ProjectRole.MEMBER,
        expiresAt,
      },
      include: {
        project: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    // Log activity
    await this.logActivity(projectId, inviterId, ProjectActivityType.INVITATION_SENT, {
      description: `Invitation sent to ${dto.email || dto.userId}`,
      referenceType: 'invitation',
      referenceId: invitation.id,
      metadata: { role: dto.role || ProjectRole.MEMBER },
    })

    this.logger.log(`Invitation created for project ${projectId}`)

    return invitation
  }

  /**
   * Get project invitations
   * Business Logic: Only OWNER or ADMIN can view invitations
   */
  async getInvitations(projectId: string, requesterId: string) {
    const requester = await this.findProjectMember(projectId, requesterId)
    if (!requester || (requester.role !== ProjectRole.OWNER && requester.role !== ProjectRole.ADMIN)) {
      throw new ForbiddenException('Only OWNER or ADMIN can view invitations')
    }

    return this.prisma.projectInvitation.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Get user's pending invitations
   */
  async getUserInvitations(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.prisma.projectInvitation.findMany({
      where: {
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
        OR: [
          { userId },
          { email: user.email },
        ],
      },
      include: {
        project: {
          select: { id: true, name: true, slug: true, coverImage: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Respond to an invitation (accept or reject)
   */
  async respondToInvitation(invitationId: string, userId: string, accept: boolean) {
    const invitation = await this.prisma.projectInvitation.findUnique({
      where: { id: invitationId },
      include: {
        project: true,
      },
    })

    if (!invitation) {
      throw new NotFoundException('Invitation not found')
    }

    // Verify user is the invitee
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const isInvitee = invitation.userId === userId || invitation.email === user.email
    if (!isInvitee) {
      throw new ForbiddenException('You are not the invitee')
    }

    // Check invitation status
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException(`Invitation is already ${invitation.status.toLowerCase()}`)
    }

    // Check expiration
    if (invitation.expiresAt < new Date()) {
      await this.prisma.projectInvitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.EXPIRED },
      })
      throw new BadRequestException('Invitation has expired')
    }

    if (accept) {
      // Accept invitation - add user as member
      await this.prisma.$transaction([
        this.prisma.projectMember.create({
          data: {
            projectId: invitation.projectId,
            userId,
            role: invitation.role,
          },
        }),
        this.prisma.projectInvitation.update({
          where: { id: invitationId },
          data: {
            status: InvitationStatus.ACCEPTED,
            acceptedAt: new Date(),
          },
        }),
      ])

      // Log activity
      await this.logActivity(
        invitation.projectId,
        userId,
        ProjectActivityType.MEMBER_JOINED,
        {
          description: `Member joined via invitation`,
          referenceType: 'member',
          referenceId: userId,
          metadata: { role: invitation.role },
        },
      )

      return { message: 'Invitation accepted successfully' }
    } else {
      // Reject invitation
      await this.prisma.projectInvitation.update({
        where: { id: invitationId },
        data: {
          status: InvitationStatus.REJECTED,
          rejectedAt: new Date(),
        },
      })

      // Log activity
      await this.logActivity(
        invitation.projectId,
        userId,
        ProjectActivityType.INVITATION_REJECTED,
        {
          description: `Invitation rejected`,
          referenceType: 'invitation',
          referenceId: invitationId,
        },
      )

      return { message: 'Invitation rejected' }
    }
  }

  /**
   * Cancel an invitation
   * Business Logic: Only OWNER or ADMIN can cancel
   */
  async cancelInvitation(invitationId: string, requesterId: string) {
    const invitation = await this.prisma.projectInvitation.findUnique({
      where: { id: invitationId },
    })

    if (!invitation) {
      throw new NotFoundException('Invitation not found')
    }

    // Check if requester has permission
    const requester = await this.findProjectMember(invitation.projectId, requesterId)
    if (!requester || (requester.role !== ProjectRole.OWNER && requester.role !== ProjectRole.ADMIN)) {
      throw new ForbiddenException('Only OWNER or ADMIN can cancel invitations')
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException(`Cannot cancel ${invitation.status.toLowerCase()} invitation`)
    }

    await this.prisma.projectInvitation.delete({
      where: { id: invitationId },
    })

    // Log activity
    await this.logActivity(
      invitation.projectId,
      requesterId,
      ProjectActivityType.INVITATION_CANCELLED,
      {
        description: `Invitation cancelled`,
        referenceType: 'invitation',
        referenceId: invitationId,
      },
    )

    return { message: 'Invitation cancelled successfully' }
  }

  // ============================================
  // Member Role Management
  // ============================================

  /**
   * Update member role
   * Business Logic: Only OWNER can change roles
   */
  async updateMemberRole(
    projectId: string,
    targetUserId: string,
    dto: UpdateMemberRoleDto,
    requesterId: string,
  ) {
    // Only OWNER can change roles
    const requester = await this.findProjectMember(projectId, requesterId)
    if (!requester || requester.role !== ProjectRole.OWNER) {
      throw new ForbiddenException('Only project OWNER can change member roles')
    }

    // Cannot change own role
    if (targetUserId === requesterId) {
      throw new BadRequestException('Cannot change your own role')
    }

    // Check target member exists
    const targetMember = await this.findProjectMember(projectId, targetUserId)
    if (!targetMember) {
      throw new NotFoundException('Member not found in this project')
    }

    // Update role
    const oldRole = targetMember.role
    const member = await this.prisma.projectMember.update({
      where: {
        projectId_userId: { projectId, userId: targetUserId },
      },
      data: { role: dto.role },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    })

    // Log activity
    await this.logActivity(projectId, requesterId, ProjectActivityType.MEMBER_ROLE_CHANGED, {
      description: `Member role changed from ${oldRole} to ${dto.role}`,
      referenceType: 'member',
      referenceId: targetUserId,
      metadata: { oldRole, newRole: dto.role },
    })

    return member
  }

  // ============================================
  // Activity Logging
  // ============================================

  /**
   * Log project activity
   * Private helper method
   */
  private async logActivity(
    projectId: string,
    actorId: string,
    type: ProjectActivityType,
    options: {
      description: string
      referenceType?: string
      referenceId?: string
      metadata?: any
    },
  ) {
    try {
      await this.prisma.projectActivity.create({
        data: {
          projectId,
          actorId,
          type,
          description: options.description,
          referenceType: options.referenceType,
          referenceId: options.referenceId,
          metadata: options.metadata,
        },
      })
    } catch (error) {
      // Log but don't fail the main operation
      this.logger.error(`Failed to log activity: ${error.message}`)
    }
  }

  /**
   * Get project activity log
   * Business Logic: Only members can view activities
   */
  async getActivityLog(projectId: string, userId: string, limit = 50) {
    // Check if user is a member
    const member = await this.findProjectMember(projectId, userId)
    if (!member) {
      throw new ForbiddenException('Only project members can view activities')
    }

    return this.prisma.projectActivity.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  // ============================================
  // GitHub Integration
  // ============================================

  /**
   * Sync project with GitHub repository
   * Updates repository stats and metadata
   */
  async syncGitHub(projectId: string, requesterId: string) {
    // Check if requester has OWNER or ADMIN role
    const requester = await this.findProjectMember(projectId, requesterId)
    if (!requester || (requester.role !== ProjectRole.OWNER && requester.role !== ProjectRole.ADMIN)) {
      throw new ForbiddenException('Only OWNER or ADMIN can sync GitHub')
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { githubRepo: true },
    })

    if (!project?.githubRepo) {
      throw new BadRequestException('No GitHub repository linked to this project')
    }

    // Parse GitHub URL to get owner/repo
    const repoMatch = project.githubRepo.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!repoMatch) {
      throw new BadRequestException('Invalid GitHub repository URL')
    }

    const [, owner, repo] = repoMatch
    const repoName = repo.replace(/\.git$/, '')

    try {
      // Fetch repository info from GitHub API
      const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'WKU-Software-Crew',
        },
      })

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`)
      }

      const repoData = await response.json()

      // Update project with GitHub data
      const updatedProject = await this.prisma.project.update({
        where: { id: projectId },
        data: {
          githubOwner: owner,
          githubDefaultBranch: repoData.default_branch,
          githubStars: repoData.stargazers_count,
          githubForks: repoData.forks_count,
          lastSyncAt: new Date(),
        },
      })

      // Log activity
      await this.logActivity(projectId, requesterId, ProjectActivityType.GITHUB_SYNCED, {
        description: `GitHub repository synced`,
        metadata: {
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
        },
      })

      return updatedProject
    } catch (error) {
      this.logger.error(`Failed to sync GitHub: ${error.message}`)
      throw new BadRequestException(`Failed to sync with GitHub: ${error.message}`)
    }
  }
}
