/**
 * Projects API E2E Tests
 * Tests for project management endpoints including CRUD operations and authorization
 */

import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { TestHelpers, TestUser } from './test-helpers'

describe('Projects API (e2e)', () => {
  let app: INestApplication
  let owner: TestUser
  let admin: TestUser
  let member: TestUser
  let outsider: TestUser

  beforeAll(async () => {
    app = await TestHelpers.initApp()
  })

  beforeEach(async () => {
    await TestHelpers.cleanDatabase()
    const users = await TestHelpers.createTestUsers(4)
    owner = users[0]
    admin = users[1]
    member = users[2]
    outsider = users[3]
  })

  afterAll(async () => {
    await TestHelpers.cleanDatabase()
    await TestHelpers.closeApp()
  })

  describe('GET /api/projects', () => {
    it('should return all public projects', async () => {
      await TestHelpers.createTestProject(owner.id, {
        name: 'Public Project',
        visibility: 'PUBLIC',
      })
      await TestHelpers.createTestProject(admin.id, {
        name: 'Private Project',
        visibility: 'PRIVATE',
      })

      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      // Public endpoint should return at least the public project
      const publicProjects = response.body.filter(
        (p: any) => p.visibility === 'PUBLIC',
      )
      expect(publicProjects.length).toBeGreaterThanOrEqual(1)
    })

    it('should filter projects by tags', async () => {
      await TestHelpers.createTestProject(owner.id, {
        name: 'React Project',
        tags: ['react', 'typescript'],
        visibility: 'PUBLIC',
      })
      await TestHelpers.createTestProject(admin.id, {
        name: 'Vue Project',
        tags: ['vue', 'javascript'],
        visibility: 'PUBLIC',
      })

      const response = await request(app.getHttpServer())
        .get('/api/projects?tags=react')
        .expect(200)

      expect(response.body.length).toBeGreaterThanOrEqual(1)
      const reactProject = response.body.find((p: any) => p.name === 'React Project')
      expect(reactProject).toBeDefined()
    })

    it('should support search query', async () => {
      await TestHelpers.createTestProject(owner.id, {
        name: 'Unique Search Term Project',
        visibility: 'PUBLIC',
      })

      const response = await request(app.getHttpServer())
        .get('/api/projects?search=Unique')
        .expect(200)

      const foundProject = response.body.find(
        (p: any) => p.name === 'Unique Search Term Project',
      )
      expect(foundProject).toBeDefined()
    })
  })

  describe('POST /api/projects', () => {
    it('should create project when authenticated', async () => {
      const projectData = {
        name: 'New Test Project',
        description: 'A new test project',
        visibility: 'PUBLIC',
        tags: ['test', 'new'],
      }

      const response = await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${owner.token}`)
        .send(projectData)
        .expect(201)

      expect(response.body).toMatchObject({
        name: projectData.name,
        description: projectData.description,
        visibility: projectData.visibility,
      })
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('slug')
      expect(response.body.members).toBeDefined()
      expect(response.body.members[0].role).toBe('OWNER')
    })

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/api/projects')
        .send({ name: 'Unauthorized Project' })
        .expect(401)
    })

    it('should validate required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${owner.token}`)
        .send({}) // Missing required fields
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should auto-generate slug from name', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${owner.token}`)
        .send({
          name: 'Auto Slug Project',
          description: 'Test slug generation',
        })
        .expect(201)

      expect(response.body.slug).toBeDefined()
      expect(typeof response.body.slug).toBe('string')
    })
  })

  describe('GET /api/projects/:id', () => {
    it('should return project details', async () => {
      const project = await TestHelpers.createTestProject(owner.id, {
        name: 'Detail Test Project',
      })

      const response = await request(app.getHttpServer())
        .get(`/api/projects/${project.id}`)
        .expect(200)

      expect(response.body).toMatchObject({
        id: project.id,
        name: project.name,
      })
      expect(response.body.members).toBeDefined()
    })

    it('should return 404 for non-existent project', async () => {
      await request(app.getHttpServer())
        .get('/api/projects/non-existent-id')
        .expect(404)
    })
  })

  describe('PATCH /api/projects/:id', () => {
    it('should allow owner to update project', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      const updateData = {
        name: 'Updated Project Name',
        description: 'Updated description',
      }

      const response = await request(app.getHttpServer())
        .patch(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toMatchObject(updateData)
    })

    it('should return 401 when not authenticated', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      await request(app.getHttpServer())
        .patch(`/api/projects/${project.id}`)
        .send({ name: 'Unauthorized Update' })
        .expect(401)
    })

    it('should return 403 when non-member tries to update', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      await request(app.getHttpServer())
        .patch(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${outsider.token}`)
        .send({ name: 'Forbidden Update' })
        .expect(403)
    })

    it('should return 404 for non-existent project', async () => {
      await request(app.getHttpServer())
        .patch('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ name: 'Update' })
        .expect(404)
    })
  })

  describe('DELETE /api/projects/:id', () => {
    it('should allow owner to delete project', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      await request(app.getHttpServer())
        .delete(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200)

      // Verify project is deleted
      await request(app.getHttpServer())
        .get(`/api/projects/${project.id}`)
        .expect(404)
    })

    it('should return 401 when not authenticated', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      await request(app.getHttpServer())
        .delete(`/api/projects/${project.id}`)
        .expect(401)
    })

    it('should return 403 when non-owner tries to delete', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      await request(app.getHttpServer())
        .delete(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(403)
    })

    it('should cascade delete project members', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      // Add member to project
      await TestHelpers.prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: member.id,
          role: 'MEMBER',
        },
      })

      await request(app.getHttpServer())
        .delete(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200)

      // Verify members are deleted
      const members = await TestHelpers.prisma.projectMember.findMany({
        where: { projectId: project.id },
      })
      expect(members.length).toBe(0)
    })
  })

  describe('POST /api/projects/:id/members', () => {
    it('should allow owner to add members', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      const response = await request(app.getHttpServer())
        .post(`/api/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({
          userId: member.id,
          role: 'MEMBER',
        })
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.userId).toBe(member.id)
      expect(response.body.role).toBe('MEMBER')
    })

    it('should return 401 when not authenticated', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      await request(app.getHttpServer())
        .post(`/api/projects/${project.id}/members`)
        .send({ userId: member.id, role: 'MEMBER' })
        .expect(401)
    })

    it('should return 403 when non-owner/admin tries to add members', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      await request(app.getHttpServer())
        .post(`/api/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${outsider.token}`)
        .send({ userId: member.id, role: 'MEMBER' })
        .expect(403)
    })

    it('should prevent duplicate memberships', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      // First add succeeds
      await request(app.getHttpServer())
        .post(`/api/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ userId: member.id, role: 'MEMBER' })
        .expect(201)

      // Second add should fail
      await request(app.getHttpServer())
        .post(`/api/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ userId: member.id, role: 'MEMBER' })
        .expect(400)
    })
  })

  describe('DELETE /api/projects/:id/members/:userId', () => {
    it('should allow owner to remove members', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      // Add member first
      await TestHelpers.prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: member.id,
          role: 'MEMBER',
        },
      })

      await request(app.getHttpServer())
        .delete(`/api/projects/${project.id}/members/${member.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200)

      // Verify member is removed
      const membership = await TestHelpers.prisma.projectMember.findFirst({
        where: {
          projectId: project.id,
          userId: member.id,
        },
      })
      expect(membership).toBeNull()
    })

    it('should return 401 when not authenticated', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      await request(app.getHttpServer())
        .delete(`/api/projects/${project.id}/members/${member.id}`)
        .expect(401)
    })

    it('should return 403 when non-owner/admin tries to remove members', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      await request(app.getHttpServer())
        .delete(`/api/projects/${project.id}/members/${member.id}`)
        .set('Authorization', `Bearer ${outsider.token}`)
        .expect(403)
    })

    it('should prevent owner from being removed', async () => {
      const project = await TestHelpers.createTestProject(owner.id)

      await request(app.getHttpServer())
        .delete(`/api/projects/${project.id}/members/${owner.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(400)
    })
  })
})
