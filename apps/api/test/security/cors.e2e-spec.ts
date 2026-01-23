import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../src/app.module'

/**
 * CORS Security Tests
 * Tests Cross-Origin Resource Sharing policy
 * OWASP Top 10: Security Misconfiguration
 */
describe('CORS Policy (e2e)', () => {
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

  describe('Allowed Origins', () => {
    it('should allow requests from localhost:3000', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .set('Origin', 'http://localhost:3000')

      expect(response.status).toBe(200)
      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })

    it('should allow requests from localhost:3001', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .set('Origin', 'http://localhost:3001')

      expect(response.status).toBe(200)
      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })

    it('should reject requests from unauthorized origins', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .set('Origin', 'http://malicious.com')

      // Should either not include CORS headers or reject
      // Note: Some implementations allow the request but don't send CORS headers
      if (response.headers['access-control-allow-origin']) {
        expect(response.headers['access-control-allow-origin']).not.toBe('http://malicious.com')
      }
    })
  })

  describe('Preflight Requests', () => {
    it('should handle OPTIONS preflight request', async () => {
      const response = await request(app.getHttpServer())
        .options('/api/users')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type,Authorization')

      expect([200, 204]).toContain(response.status)
      expect(response.headers['access-control-allow-methods']).toBeDefined()
      expect(response.headers['access-control-allow-headers']).toBeDefined()
    })

    it('should specify allowed HTTP methods', async () => {
      const response = await request(app.getHttpServer())
        .options('/api/users')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')

      if (response.headers['access-control-allow-methods']) {
        const allowedMethods = response.headers['access-control-allow-methods']
        expect(allowedMethods).toMatch(/GET/)
        expect(allowedMethods).toMatch(/POST/)
        expect(allowedMethods).toMatch(/PUT/)
        expect(allowedMethods).toMatch(/PATCH/)
        expect(allowedMethods).toMatch(/DELETE/)
      }
    })

    it('should specify allowed headers', async () => {
      const response = await request(app.getHttpServer())
        .options('/api/users')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Headers', 'Authorization')

      if (response.headers['access-control-allow-headers']) {
        const allowedHeaders = response.headers['access-control-allow-headers']
        expect(allowedHeaders).toMatch(/Authorization/i)
        expect(allowedHeaders).toMatch(/Content-Type/i)
      }
    })
  })

  describe('Credentials Support', () => {
    it('should allow credentials (cookies)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .set('Origin', 'http://localhost:3000')

      expect(response.headers['access-control-allow-credentials']).toBe('true')
    })
  })

  describe('Exposed Headers', () => {
    it('should expose pagination headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .set('Origin', 'http://localhost:3000')

      if (response.headers['access-control-expose-headers']) {
        const exposedHeaders = response.headers['access-control-expose-headers']
        // Check if pagination headers are exposed
        expect(exposedHeaders).toMatch(/X-Total-Count|X-Page-Count/i)
      }
    })
  })

  describe('Preflight Cache', () => {
    it('should include max-age for preflight cache', async () => {
      const response = await request(app.getHttpServer())
        .options('/api/users')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')

      if (response.headers['access-control-max-age']) {
        const maxAge = parseInt(response.headers['access-control-max-age'])
        expect(maxAge).toBeGreaterThan(0)
        expect(maxAge).toBeLessThanOrEqual(3600) // Should be 1 hour or less
      }
    })
  })

  describe('No Origin Header', () => {
    it('should allow requests without Origin header', async () => {
      // Requests from mobile apps, Postman, etc. may not have Origin header
      const response = await request(app.getHttpServer())
        .get('/api/health')

      expect(response.status).toBe(200)
    })
  })
})
