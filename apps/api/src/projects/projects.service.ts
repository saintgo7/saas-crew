import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto, AddMemberDto } from './dto'
import { ProjectRole, Visibility } from '@prisma/client'

/**
 * Projects Service
 * Business logic layer for project management
 * Handles CRUD operations, member management, and authorization
 */
@Injectable()
export class ProjectsService {
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
}
