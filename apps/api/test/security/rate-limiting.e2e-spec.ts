import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../src/app.module'

/**
 * Rate Limiting Security Tests
 * Tests protection against brute force and DoS attacks
 * OWASP Top 10: Identification and Authentication Failures
 *
 * Note: In test environment, rate limits are set very high (1000/sec)
 * to avoid false positives. These tests verify the rate limiting
 * infrastructure is in place, not the actual limits.
 */
describe('Rate Limiting (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api')
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

    it('should include rate limit headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')

      // Throttler should add rate limit headers (with tier suffix: short, medium, long)
      // At least one of the rate limit tiers should be present
      const hasRateLimitHeaders =
        response.headers['x-ratelimit-limit-short'] ||
        response.headers['x-ratelimit-limit-medium'] ||
        response.headers['x-ratelimit-limit-long']
      expect(hasRateLimitHeaders).toBeTruthy()

      const hasRemainingHeaders =
        response.headers['x-ratelimit-remaining-short'] ||
        response.headers['x-ratelimit-remaining-medium'] ||
        response.headers['x-ratelimit-remaining-long']
      expect(hasRemainingHeaders).toBeTruthy()
    })

    it('should decrement remaining count with each request', async () => {
      // Make first request
      const response1 = await request(app.getHttpServer())
        .get('/api/health')

      const remaining1 = parseInt(response1.headers['x-ratelimit-remaining-short'])

      // Make second request
      const response2 = await request(app.getHttpServer())
        .get('/api/health')

      const remaining2 = parseInt(response2.headers['x-ratelimit-remaining-short'])

      // Remaining should be decremented (or equal if reset happened between requests)
      expect(remaining2).toBeLessThanOrEqual(remaining1)
    })

    it('should include reset timer in headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')

      // Should have reset headers for at least one tier
      const hasResetHeader =
        response.headers['x-ratelimit-reset-short'] ||
        response.headers['x-ratelimit-reset-medium'] ||
        response.headers['x-ratelimit-reset-long']
      expect(hasResetHeader).toBeTruthy()
    })
  })

  describe('Rate Limit Configuration', () => {
    it('should have short tier configured (1 second)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')

      const limit = response.headers['x-ratelimit-limit-short']
      expect(limit).toBeDefined()
      // In test environment, limit is 1000
      expect(parseInt(limit)).toBeGreaterThan(0)
    })

    it('should have medium tier configured (10 seconds)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')

      const limit = response.headers['x-ratelimit-limit-medium']
      expect(limit).toBeDefined()
      // In test environment, limit is 5000
      expect(parseInt(limit)).toBeGreaterThan(0)
    })

    it('should have long tier configured (1 minute)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')

      const limit = response.headers['x-ratelimit-limit-long']
      expect(limit).toBeDefined()
      // In test environment, limit is 10000
      expect(parseInt(limit)).toBeGreaterThan(0)
    })
  })

  describe('Rate Limit on Different Endpoints', () => {
    it('should apply rate limiting to public endpoints', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')

      expect(response.headers['x-ratelimit-limit-short']).toBeDefined()
    })

    it('should apply rate limiting to auth endpoints', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/github')
        .redirects(0)

      // Even if redirected, should have rate limit headers
      expect(response.headers['x-ratelimit-limit-short']).toBeDefined()
    })

    it('should apply rate limiting to API endpoints', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/courses')

      expect(response.headers['x-ratelimit-limit-short']).toBeDefined()
    })
  })

  describe('Rate Limit Response Format', () => {
    it('should return consistent header format', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')

      // Headers should be numeric strings
      const limit = response.headers['x-ratelimit-limit-short']
      const remaining = response.headers['x-ratelimit-remaining-short']
      const reset = response.headers['x-ratelimit-reset-short']

      expect(typeof limit).toBe('string')
      expect(typeof remaining).toBe('string')
      expect(typeof reset).toBe('string')

      expect(parseInt(limit)).not.toBeNaN()
      expect(parseInt(remaining)).not.toBeNaN()
      expect(parseInt(reset)).not.toBeNaN()
    })
  })
})
