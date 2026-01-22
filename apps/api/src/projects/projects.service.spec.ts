import { Test, TestingModule } from '@nestjs/testing'
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto, AddMemberDto } from './dto'
import { ProjectRole, Visibility } from '@prisma/client'

describe('ProjectsService', () => {
  let service: ProjectsService
  let prisma: PrismaService

  const mockPrismaService = {
    project: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    projectMember: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  }

  const mockProject = {
    id: 'project-1',
    name: 'Test Project',
    slug: 'test-project',
    description: 'A test project',
    visibility: Visibility.PUBLIC,
    githubRepo: 'https://github.com/test/project',
    deployUrl: 'https://test-project.com',
    tags: ['javascript', 'react'],
    coverImage: 'https://example.com/cover.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    _count: { members: 3 },
  }

  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<ProjectsService>(ProjectsService)
    prisma = module.get<PrismaService>(PrismaService)

    jest.clearAllMocks()
  })

  describe('findAll', () => {
    const mockProjects = [mockProject, { ...mockProject, id: 'project-2', slug: 'project-2' }]

    it('should return paginated projects without filters', async () => {
      const query: ProjectQueryDto = { page: 1, limit: 20 }

      mockPrismaService.project.findMany.mockResolvedValue(mockProjects)
      mockPrismaService.project.count.mockResolvedValue(2)

      const result = await service.findAll(query)

      expect(result.data).toEqual(mockProjects)
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      })
    })

    it('should filter by visibility', async () => {
      const query: ProjectQueryDto = { visibility: Visibility.PRIVATE, page: 1, limit: 20 }

      mockPrismaService.project.findMany.mockResolvedValue([mockProject])
      mockPrismaService.project.count.mockResolvedValue(1)

      await service.findAll(query)

      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { visibility: Visibility.PRIVATE },
        }),
      )
    })

    it('should filter by tags', async () => {
      const query: ProjectQueryDto = { tags: 'javascript,react', page: 1, limit: 20 }

      mockPrismaService.project.findMany.mockResolvedValue([mockProject])
      mockPrismaService.project.count.mockResolvedValue(1)

      await service.findAll(query)

      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tags: {
              hasSome: ['javascript', 'react'],
            },
          },
        }),
      )
    })

    it('should filter by search term', async () => {
      const query: ProjectQueryDto = { search: 'test', page: 1, limit: 20 }

      mockPrismaService.project.findMany.mockResolvedValue([mockProject])
      mockPrismaService.project.count.mockResolvedValue(1)

      await service.findAll(query)

      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'test', mode: 'insensitive' } },
              { description: { contains: 'test', mode: 'insensitive' } },
            ],
          },
        }),
      )
    })

    it('should handle pagination correctly', async () => {
      const query: ProjectQueryDto = { page: 2, limit: 10 }

      mockPrismaService.project.findMany.mockResolvedValue([])
      mockPrismaService.project.count.mockResolvedValue(25)

      const result = await service.findAll(query)

      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      )
      expect(result.meta.totalPages).toBe(3)
    })
  })

  describe('create', () => {
    const createDto: CreateProjectDto = {
      name: 'New Project',
      slug: 'new-project',
      description: 'A new project',
      visibility: Visibility.PUBLIC,
      tags: ['typescript'],
    }

    const createdProject = {
      ...createDto,
      id: 'project-new',
      githubRepo: null,
      deployUrl: null,
      coverImage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [
        {
          userId: 'user-1',
          role: ProjectRole.OWNER,
          user: mockUser,
        },
      ],
    }

    it('should create project with creator as OWNER', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null)
      mockPrismaService.project.create.mockResolvedValue(createdProject)

      const result = await service.create(createDto, 'user-1')

      expect(result).toEqual(createdProject)
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          members: {
            create: {
              userId: 'user-1',
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
    })

    it('should throw ConflictException if slug already exists', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(mockProject)

      await expect(service.create(createDto, 'user-1')).rejects.toThrow(
        ConflictException,
      )
      await expect(service.create(createDto, 'user-1')).rejects.toThrow(
        "Project with slug 'new-project' already exists",
      )
      expect(prisma.project.create).not.toHaveBeenCalled()
    })
  })

  describe('findById', () => {
    const projectWithMembers = {
      ...mockProject,
      members: [
        {
          userId: 'user-1',
          role: ProjectRole.OWNER,
          user: { ...mockUser, department: 'CS', grade: 3 },
          joinedAt: new Date(),
        },
      ],
    }

    it('should return project with members', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(projectWithMembers)

      const result = await service.findById('project-1')

      expect(result).toEqual(projectWithMembers)
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: 'project-1' },
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
    })

    it('should throw NotFoundException when project does not exist', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null)

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.findById('non-existent-id')).rejects.toThrow(
        'Project with ID non-existent-id not found',
      )
    })
  })

  describe('update', () => {
    const updateDto: UpdateProjectDto = {
      name: 'Updated Project',
      description: 'Updated description',
    }

    it('should update project when user is OWNER', async () => {
      const updatedProject = { ...mockProject, ...updateDto }

      mockPrismaService.projectMember.findUnique.mockResolvedValue({
        role: ProjectRole.OWNER,
      })
      mockPrismaService.project.update.mockResolvedValue(updatedProject)

      const result = await service.update('project-1', updateDto, 'user-1')

      expect(result.name).toBe('Updated Project')
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'project-1' },
        data: updateDto,
        include: expect.any(Object),
      })
    })

    it('should update project when user is ADMIN', async () => {
      const updatedProject = { ...mockProject, ...updateDto }

      mockPrismaService.projectMember.findUnique.mockResolvedValue({
        role: ProjectRole.ADMIN,
      })
      mockPrismaService.project.update.mockResolvedValue(updatedProject)

      const result = await service.update('project-1', updateDto, 'user-1')

      expect(result).toEqual(updatedProject)
    })

    it('should throw ForbiddenException when user is MEMBER', async () => {
      mockPrismaService.projectMember.findUnique.mockResolvedValue({
        role: ProjectRole.MEMBER,
      })

      await expect(service.update('project-1', updateDto, 'user-1')).rejects.toThrow(
        ForbiddenException,
      )
      expect(prisma.project.update).not.toHaveBeenCalled()
    })

    it('should throw ForbiddenException when user is not a member', async () => {
      mockPrismaService.projectMember.findUnique.mockResolvedValue(null)

      await expect(service.update('project-1', updateDto, 'user-1')).rejects.toThrow(
        ForbiddenException,
      )
    })
  })

  describe('delete', () => {
    it('should delete project when user is OWNER', async () => {
      mockPrismaService.projectMember.findUnique.mockResolvedValue({
        role: ProjectRole.OWNER,
      })
      mockPrismaService.project.delete.mockResolvedValue(mockProject)

      const result = await service.delete('project-1', 'user-1')

      expect(result).toEqual({ message: 'Project deleted successfully' })
      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: 'project-1' },
      })
    })

    it('should throw ForbiddenException when user is not OWNER', async () => {
      mockPrismaService.projectMember.findUnique.mockResolvedValue({
        role: ProjectRole.ADMIN,
      })

      await expect(service.delete('project-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      )
      await expect(service.delete('project-1', 'user-1')).rejects.toThrow(
        'Only project OWNER can delete the project',
      )
      expect(prisma.project.delete).not.toHaveBeenCalled()
    })
  })

  describe('addMember', () => {
    const addMemberDto: AddMemberDto = {
      userId: 'user-2',
      role: ProjectRole.MEMBER,
    }

    const newMember = {
      projectId: 'project-1',
      userId: 'user-2',
      role: ProjectRole.MEMBER,
      joinedAt: new Date(),
      user: mockUser,
    }

    it('should add member when requester is OWNER', async () => {
      mockPrismaService.projectMember.findUnique
        .mockResolvedValueOnce({ role: ProjectRole.OWNER })
        .mockResolvedValueOnce(null)
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.projectMember.create.mockResolvedValue(newMember)

      const result = await service.addMember('project-1', addMemberDto, 'user-1')

      expect(result).toEqual(newMember)
      expect(prisma.projectMember.create).toHaveBeenCalledWith({
        data: {
          projectId: 'project-1',
          userId: 'user-2',
          role: ProjectRole.MEMBER,
        },
        include: expect.any(Object),
      })
    })

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.projectMember.findUnique.mockResolvedValue({
        role: ProjectRole.OWNER,
      })
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(
        service.addMember('project-1', addMemberDto, 'user-1'),
      ).rejects.toThrow(NotFoundException)
    })

    it('should throw ConflictException when user is already a member', async () => {
      mockPrismaService.projectMember.findUnique
        .mockResolvedValueOnce({ role: ProjectRole.OWNER })
        .mockResolvedValueOnce({ userId: 'user-2', role: ProjectRole.MEMBER })
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

      await expect(
        service.addMember('project-1', addMemberDto, 'user-1'),
      ).rejects.toThrow(ConflictException)
    })

    it('should throw ForbiddenException when ADMIN tries to add OWNER', async () => {
      mockPrismaService.projectMember.findUnique
        .mockResolvedValueOnce({ role: ProjectRole.ADMIN })
        .mockResolvedValueOnce(null)
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

      await expect(
        service.addMember(
          'project-1',
          { ...addMemberDto, role: ProjectRole.OWNER },
          'user-1',
        ),
      ).rejects.toThrow(ForbiddenException)
    })
  })

  describe('removeMember', () => {
    it('should remove member when requester is OWNER', async () => {
      mockPrismaService.projectMember.findUnique
        .mockResolvedValueOnce({ role: ProjectRole.OWNER })
        .mockResolvedValueOnce({ role: ProjectRole.MEMBER })
      mockPrismaService.projectMember.delete.mockResolvedValue({})

      const result = await service.removeMember('project-1', 'user-2', 'user-1')

      expect(result).toEqual({ message: 'Member removed successfully' })
      expect(prisma.projectMember.delete).toHaveBeenCalledWith({
        where: {
          projectId_userId: {
            projectId: 'project-1',
            userId: 'user-2',
          },
        },
      })
    })

    it('should throw ForbiddenException when trying to remove OWNER', async () => {
      mockPrismaService.projectMember.findUnique
        .mockResolvedValueOnce({ role: ProjectRole.OWNER })
        .mockResolvedValueOnce({ role: ProjectRole.OWNER })

      await expect(
        service.removeMember('project-1', 'user-2', 'user-1'),
      ).rejects.toThrow(ForbiddenException)
    })

    it('should throw ForbiddenException when ADMIN tries to remove ADMIN', async () => {
      mockPrismaService.projectMember.findUnique
        .mockResolvedValueOnce({ role: ProjectRole.ADMIN })
        .mockResolvedValueOnce({ role: ProjectRole.ADMIN })

      await expect(
        service.removeMember('project-1', 'user-2', 'user-1'),
      ).rejects.toThrow(ForbiddenException)
    })

    it('should throw NotFoundException when target member not found', async () => {
      mockPrismaService.projectMember.findUnique
        .mockResolvedValueOnce({ role: ProjectRole.OWNER })
        .mockResolvedValueOnce(null)

      await expect(
        service.removeMember('project-1', 'user-2', 'user-1'),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('checkAccess', () => {
    it('should return true for PUBLIC projects without userId', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue({
        visibility: Visibility.PUBLIC,
      })

      const result = await service.checkAccess('project-1', null)

      expect(result).toBe(true)
    })

    it('should return false for PRIVATE projects without userId', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue({
        visibility: Visibility.PRIVATE,
      })

      const result = await service.checkAccess('project-1', null)

      expect(result).toBe(false)
    })

    it('should return true for PRIVATE projects when user is member', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue({
        visibility: Visibility.PRIVATE,
      })
      mockPrismaService.projectMember.findUnique.mockResolvedValue({
        role: ProjectRole.MEMBER,
      })

      const result = await service.checkAccess('project-1', 'user-1')

      expect(result).toBe(true)
    })

    it('should return false for PRIVATE projects when user is not member', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue({
        visibility: Visibility.PRIVATE,
      })
      mockPrismaService.projectMember.findUnique.mockResolvedValue(null)

      const result = await service.checkAccess('project-1', 'user-1')

      expect(result).toBe(false)
    })

    it('should return false when project does not exist', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null)

      const result = await service.checkAccess('non-existent-id', 'user-1')

      expect(result).toBe(false)
    })
  })
})
