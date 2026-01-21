import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find user by ID with profile information
   * Repository Layer: Data access through Prisma
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        department: true,
        grade: true,
        rank: true,
        level: true,
        xp: true,
        theme: true,
        language: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            posts: true,
            comments: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  /**
   * Update user profile
   * Business Logic: Validates and updates user data
   */
  async update(id: string, dto: UpdateUserDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    // Update user
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        department: true,
        grade: true,
        theme: true,
        language: true,
        updatedAt: true,
      },
    })
  }

  /**
   * Find all projects where user is a member
   * Complex Query: Uses ProjectMember relationship
   */
  async findUserProjects(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    // Find projects through ProjectMember relationship
    const projectMembers = await this.prisma.projectMember.findMany({
      where: { userId },
      orderBy: { joinedAt: 'desc' },
      include: {
        project: {
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
        },
      },
    })

    // Transform to include role information
    return projectMembers.map((pm) => ({
      ...pm.project,
      role: pm.role,
      joinedAt: pm.joinedAt,
    }))
  }

  /**
   * Find user by email (for authentication)
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  /**
   * Find user by GitHub ID (for OAuth)
   */
  async findByGithubId(githubId: string) {
    return this.prisma.user.findUnique({
      where: { githubId },
    })
  }

  /**
   * Create new user
   */
  async create(data: {
    email: string
    name: string
    password?: string
    githubId?: string
    avatar?: string
  }) {
    return this.prisma.user.create({
      data,
    })
  }
}
