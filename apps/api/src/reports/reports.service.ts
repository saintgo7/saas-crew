import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateReportDto, UpdateReportDto, ReportQueryDto } from './dto'
import { ReportStatus } from '@prisma/client'

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ReportQueryDto) {
    const { status, search, page = 1, limit = 20 } = query
    const skip = (page - 1) * limit

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' }
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      }),
      this.prisma.report.count({ where }),
    ])

    return {
      reports,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findById(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    })

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`)
    }

    return report
  }

  async create(dto: CreateReportDto, authorId: string) {
    return this.prisma.report.create({
      data: {
        title: dto.title,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        summary: dto.summary,
        sections: dto.sections,
        status: (dto.status as ReportStatus) || ReportStatus.DRAFT,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    })
  }

  async update(id: string, dto: UpdateReportDto, userId: string) {
    const report = await this.prisma.report.findUnique({ where: { id } })

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`)
    }

    if (report.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own reports')
    }

    const data: any = {}
    if (dto.title !== undefined) data.title = dto.title
    if (dto.periodStart !== undefined) data.periodStart = new Date(dto.periodStart)
    if (dto.periodEnd !== undefined) data.periodEnd = new Date(dto.periodEnd)
    if (dto.summary !== undefined) data.summary = dto.summary
    if (dto.sections !== undefined) data.sections = dto.sections
    if (dto.status !== undefined) data.status = dto.status as ReportStatus

    return this.prisma.report.update({
      where: { id },
      data,
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    })
  }

  async delete(id: string, userId: string) {
    const report = await this.prisma.report.findUnique({ where: { id } })

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`)
    }

    if (report.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own reports')
    }

    await this.prisma.report.delete({ where: { id } })

    return { message: 'Report deleted successfully' }
  }

  async getLearningStats(periodStart: string, periodEnd: string) {
    const start = new Date(periodStart)
    const end = new Date(periodEnd)

    const [
      totalEnrollments,
      completedEnrollments,
      courseStats,
    ] = await Promise.all([
      this.prisma.enrollment.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      }),
      this.prisma.enrollment.count({
        where: {
          completedAt: { gte: start, lte: end },
        },
      }),
      this.prisma.course.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              enrollments: true,
              chapters: true,
            },
          },
          enrollments: {
            where: {
              createdAt: { gte: start, lte: end },
            },
            select: {
              progress: true,
              completedAt: true,
            },
          },
        },
      }),
    ])

    const courses = courseStats.map((course) => {
      const periodEnrollments = course.enrollments.length
      const completed = course.enrollments.filter((e) => e.completedAt).length
      const avgProgress =
        periodEnrollments > 0
          ? Math.round(
              course.enrollments.reduce((sum, e) => sum + e.progress, 0) /
                periodEnrollments
            )
          : 0

      return {
        id: course.id,
        title: course.title,
        totalChapters: course._count.chapters,
        totalEnrollments: course._count.enrollments,
        periodEnrollments,
        periodCompleted: completed,
        avgProgress,
      }
    })

    return {
      period: { start, end },
      totalEnrollments,
      completedEnrollments,
      completionRate:
        totalEnrollments > 0
          ? Math.round((completedEnrollments / totalEnrollments) * 100)
          : 0,
      courses,
    }
  }
}
