/**
 * Users API E2E Tests
 * Tests for user profile management endpoints
 */

import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { TestHelpers, TestUser } from './test-helpers'

describe('Users API (e2e)', () => {
  let app: INestApplication
  let user1: TestUser
  let user2: TestUser

  beforeAll(async () => {
    app = await TestHelpers.initApp()
  })

  beforeEach(async () => {
    await TestHelpers.cleanDatabase()
    const users = await TestHelpers.createTestUsers(2)
    user1 = users[0]
    user2 = users[1]
  })

  afterAll(async () => {
    await TestHelpers.cleanDatabase()
    await TestHelpers.closeApp()
  })

  describe('GET /api/users/:id', () => {
    it('should return user profile', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/${user1.id}`)
        .expect(200)

      expect(response.body).toMatchObject({
        id: user1.id,
        email: user1.email,
        name: user1.name,
        rank: user1.rank,
      })
      expect(response.body).toHaveProperty('level')
      expect(response.body).toHaveProperty('xp')
      expect(response.body).toHaveProperty('createdAt')
    })

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/api/users/non-existent-id')
        .expect(404)
    })

    it('should not require authentication for viewing profiles', async () => {
      // Public endpoint - no auth required
      const response = await request(app.getHttpServer())
        .get(`/api/users/${user1.id}`)
        .expect(200)

      expect(response.body.id).toBe(user1.id)
    })
  })

  describe('PATCH /api/users/:id', () => {
    it('should update own profile when authenticated', async () => {
      const updateData = {
        name: 'Updated Name',
        bio: 'Updated bio',
        department: 'Computer Science',
        grade: 3,
      }

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${user1.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toMatchObject({
        id: user1.id,
        name: updateData.name,
        bio: updateData.bio,
        department: updateData.department,
        grade: updateData.grade,
      })
    })

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .patch(`/api/users/${user1.id}`)
        .send({ name: 'New Name' })
        .expect(401)
    })

    it('should return 403 when trying to update another user profile', async () => {
      await request(app.getHttpServer())
        .patch(`/api/users/${user2.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ name: 'Hacked Name' })
        .expect(403)
    })

    it('should validate input data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/users/${user1.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ grade: 10 }) // Invalid grade (should be 1-4)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should handle partial updates', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/users/${user1.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ bio: 'Only updating bio' })
        .expect(200)

      expect(response.body.bio).toBe('Only updating bio')
      expect(response.body.name).toBe(user1.name) // Original name unchanged
    })
  })

  describe('GET /api/users/:id/projects', () => {
    it('should return user projects', async () => {
      // Create test project for user1
      await TestHelpers.createTestProject(user1.id, {
        name: 'User1 Project',
        visibility: 'PUBLIC',
      })

      const response = await request(app.getHttpServer())
        .get(`/api/users/${user1.id}/projects`)
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBe(1)
      expect(response.body[0]).toHaveProperty('name', 'User1 Project')
    })

    it('should return empty array for user with no projects', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/${user2.id}/projects`)
        .expect(200)

      expect(response.body).toEqual([])
    })

    it('should not require authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/${user1.id}/projects`)
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })
  })
})
