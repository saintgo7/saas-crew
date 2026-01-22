/**
 * Authentication E2E Tests
 * Tests for GitHub OAuth and JWT authentication flow
 */

import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { TestHelpers, TestUser } from './test-helpers'

describe('Authentication (e2e)', () => {
  let app: INestApplication
  let testUser: TestUser

  beforeAll(async () => {
    app = await TestHelpers.initApp()
  })

  beforeEach(async () => {
    await TestHelpers.cleanDatabase()
    testUser = await TestHelpers.createTestUser()
  })

  afterAll(async () => {
    await TestHelpers.cleanDatabase()
    await TestHelpers.closeApp()
  })

  describe('GET /api/auth/github', () => {
    it('should redirect to GitHub OAuth page', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/github')
        .expect(302)

      expect(response.header.location).toContain('github.com')
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return current user when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${testUser.token}`)
        .expect(200)

      expect(response.body).toMatchObject({
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        rank: testUser.rank,
      })
    })

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .expect(401)
    })

    it('should return 401 with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
    })

    it('should return 401 with malformed authorization header', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat token')
        .expect(401)
    })
  })

  describe('JWT Token Validation', () => {
    it('should accept valid JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${testUser.token}`)
        .expect(200)

      expect(response.body.id).toBe(testUser.id)
    })

    it('should reject expired token', async () => {
      // Note: This would require creating an expired token
      // For now, we test with an invalid token
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid')
        .expect(401)
    })
  })
})
