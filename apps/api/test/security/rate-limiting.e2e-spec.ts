import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../src/app.module'

/**
 * Rate Limiting Security Tests
 * Tests protection against brute force and DoS attacks
 * OWASP Top 10: Identification and Authentication Failures
 */
describe('Rate Limiting (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Global Rate Limiting', () => {
    it('should allow requests within limit', async () => {
      // First request should succeed
      const response = await request(app.getHttpServer())
        .get('/api/health')

      expect(response.status).toBe(200)
    })

    it('should reject requests exceeding rate limit', async () => {
      // Make 101 requests rapidly (limit is 100/minute)
      const requests = []
      for (let i = 0; i < 101; i++) {
        requests.push(
          request(app.getHttpServer())
            .get('/api/health')
        )
      }

      const responses = await Promise.all(requests)
      
      // At least one request should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    }, 15000) // Increase timeout for this test

    it('should include rate limit headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')

      // Throttler should add rate limit headers
      expect(response.headers).toHaveProperty('x-ratelimit-limit')
      expect(response.headers).toHaveProperty('x-ratelimit-remaining')
    })
  })

  describe('Auth Endpoint Rate Limiting', () => {
    it('should enforce stricter limits on login endpoint', async () => {
      // GitHub OAuth should have limit of 5 requests per minute
      const requests = []
      for (let i = 0; i < 10; i++) {
        requests.push(
          request(app.getHttpServer())
            .get('/api/auth/github')
            .redirects(0) // Don't follow redirects
        )
      }

      const responses = await Promise.all(requests)
      
      // Should have rate limited responses
      const rateLimitedCount = responses.filter(r => r.status === 429).length
      expect(rateLimitedCount).toBeGreaterThan(0)
    }, 10000)
  })

  describe('Rate Limit Reset', () => {
    it('should reset rate limit after TTL expires', async () => {
      // Make requests until rate limited
      let rateLimited = false
      for (let i = 0; i < 15; i++) {
        const response = await request(app.getHttpServer())
          .get('/api/health')
        
        if (response.status === 429) {
          rateLimited = true
          break
        }
      }

      if (rateLimited) {
        // Wait for rate limit to reset (1 second for short tier)
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Should be able to make requests again
        const response = await request(app.getHttpServer())
          .get('/api/health')

        expect(response.status).toBe(200)
      }
    }, 10000)
  })

  describe('Per-IP Rate Limiting', () => {
    it('should track limits per IP address', async () => {
      // All requests from same IP should share rate limit
      const requests = []
      for (let i = 0; i < 15; i++) {
        requests.push(
          request(app.getHttpServer())
            .get('/api/health')
            .set('X-Forwarded-For', '192.168.1.1')
        )
      }

      const responses = await Promise.all(requests)
      
      // Should rate limit based on IP
      const rateLimitedCount = responses.filter(r => r.status === 429).length
      expect(rateLimitedCount).toBeGreaterThan(0)
    })
  })

  describe('Rate Limit Error Response', () => {
    it('should return proper error message on rate limit', async () => {
      // Trigger rate limit
      const requests = []
      for (let i = 0; i < 20; i++) {
        requests.push(
          request(app.getHttpServer())
            .get('/api/health')
        )
      }

      const responses = await Promise.all(requests)
      const rateLimited = responses.find(r => r.status === 429)

      if (rateLimited) {
        expect(rateLimited.body).toHaveProperty('message')
        expect(rateLimited.body.message).toMatch(/rate limit/i)
      }
    })
  })
})
