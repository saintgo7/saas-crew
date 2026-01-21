import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ProjectQueryDto } from './dto/project-query.dto'

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findMany(query: ProjectQueryDto) {
    const { level, status, page = 1, limit = 12 } = query
    const skip = (page - 1) * limit

    const where: any = {
      visibility: 'PUBLIC',
    }

    if (level) where.courseLevel = level
    if (status) where.status = status

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatar: true,
              rank: true,
            },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ])

    return {
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { likes: true },
        },
      },
    })

    if (!project) {
      throw new NotFoundException('프로젝트를 찾을 수 없습니다.')
    }

    // 조회수 증가
    await this.prisma.project.update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } },
    })

    return project
  }

  async create(dto: CreateProjectDto, userId: string) {
    // slug 생성 (title -> slug)
    const slug = this.generateSlug(dto.title)

    return this.prisma.project.create({
      data: {
        ...dto,
        slug,
        ownerId: userId,
      },
    })
  }

  async update(id: string, dto: UpdateProjectDto, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } })

    if (!project) {
      throw new NotFoundException('프로젝트를 찾을 수 없습니다.')
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.')
    }

    // 상태가 COMPLETED로 변경되면 completedAt 설정
    const data: any = { ...dto }
    if (dto.status === 'COMPLETED' && !project.completedAt) {
      data.completedAt = new Date()
    }

    return this.prisma.project.update({
      where: { id },
      data,
    })
  }

  async delete(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } })

    if (!project) {
      throw new NotFoundException('프로젝트를 찾을 수 없습니다.')
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.')
    }

    await this.prisma.project.delete({ where: { id } })

    return { success: true }
  }

  async toggleLike(projectId: string, userId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
    })

    if (existingLike) {
      // 좋아요 취소
      await this.prisma.like.delete({ where: { id: existingLike.id } })
      await this.prisma.project.update({
        where: { id: projectId },
        data: { likeCount: { decrement: 1 } },
      })
      return { liked: false }
    } else {
      // 좋아요
      await this.prisma.like.create({
        data: { userId, projectId },
      })
      await this.prisma.project.update({
        where: { id: projectId },
        data: { likeCount: { increment: 1 } },
      })
      return { liked: true }
    }
  }

  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const random = Math.random().toString(36).substring(2, 8)
    return `${base}-${random}`
  }
}
