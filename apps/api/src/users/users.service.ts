import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        skills: true,
        department: true,
        grade: true,
        rank: true,
        level: true,
        xp: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.')
    }

    return user
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        name: true,
        bio: true,
        skills: true,
        department: true,
        grade: true,
      },
    })
  }

  async findUserProjects(userId: string) {
    return this.prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        status: true,
        courseLevel: true,
        techStack: true,
        thumbnailUrl: true,
        viewCount: true,
        likeCount: true,
        createdAt: true,
        completedAt: true,
      },
    })
  }
}
