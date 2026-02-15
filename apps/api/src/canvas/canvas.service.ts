import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { CreateCanvasDto, UpdateCanvasDto, SaveCanvasDto } from './dto'

@Injectable()
export class CanvasService {
  private readonly logger = new Logger(CanvasService.name)
  private readonly CACHE_TTL = 1800 // 30 minutes

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(userId: string, dto: CreateCanvasDto) {
    const canvas = await this.prisma.canvas.create({
      data: {
        name: dto.name,
        description: dto.description,
        projectId: dto.projectId,
        ownerId: userId,
        isPublic: dto.isPublic ?? false,
        data: { elements: [], appState: {} },
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        _count: { select: { members: true } },
      },
    })

    return canvas
  }

  async findAllByUser(userId: string) {
    return this.prisma.canvas.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
          { isPublic: true },
        ],
      },
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        _count: { select: { members: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async findByProject(projectId: string) {
    return this.prisma.canvas.findMany({
      where: { projectId },
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        _count: { select: { members: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async findOne(id: string, userId?: string) {
    // Try cache first
    const cacheKey = `canvas:${id}`
    const cached = await this.redis.getJson<any>(cacheKey)
    if (cached) {
      return cached
    }

    const canvas = await this.prisma.canvas.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        _count: { select: { members: true } },
      },
    })

    if (!canvas) {
      throw new NotFoundException('Canvas not found')
    }

    // Check access
    if (!canvas.isPublic && userId) {
      const isMember = canvas.members.some((m) => m.userId === userId)
      if (!isMember && canvas.ownerId !== userId) {
        throw new ForbiddenException('You do not have access to this canvas')
      }
    }

    // Cache the result
    await this.redis.setJson(cacheKey, canvas, this.CACHE_TTL)

    return canvas
  }

  async update(id: string, userId: string, dto: UpdateCanvasDto) {
    const canvas = await this.findOne(id, userId)
    this.ensureOwnerOrEditor(canvas, userId)

    const updated = await this.prisma.canvas.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        isPublic: dto.isPublic,
      },
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        _count: { select: { members: true } },
      },
    })

    // Invalidate cache
    await this.redis.del(`canvas:${id}`)

    return updated
  }

  async remove(id: string, userId: string) {
    const canvas = await this.findOne(id, userId)

    if (canvas.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can delete this canvas')
    }

    await this.prisma.canvas.delete({ where: { id } })
    await this.redis.del(`canvas:${id}`)

    return { deleted: true }
  }

  async saveData(id: string, userId: string, dto: SaveCanvasDto) {
    const canvas = await this.findOne(id, userId)
    this.ensureOwnerOrEditor(canvas, userId)

    const updated = await this.prisma.canvas.update({
      where: { id },
      data: {
        data: dto.data as any,
        thumbnail: dto.thumbnail,
      },
      select: { id: true, updatedAt: true },
    })

    // Update cache
    await this.redis.del(`canvas:${id}`)

    this.logger.debug(`Canvas ${id} data saved by user ${userId}`)

    return updated
  }

  async getCanvasData(id: string) {
    const canvas = await this.prisma.canvas.findUnique({
      where: { id },
      select: { id: true, data: true },
    })

    if (!canvas) {
      throw new NotFoundException('Canvas not found')
    }

    return canvas.data
  }

  private ensureOwnerOrEditor(canvas: any, userId: string) {
    if (canvas.ownerId === userId) return

    const member = canvas.members?.find((m: any) => m.userId === userId)
    if (!member || member.role === 'VIEWER') {
      throw new ForbiddenException('You do not have edit access to this canvas')
    }
  }
}
