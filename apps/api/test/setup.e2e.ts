/**
 * E2E Test Setup
 * Global configuration for integration tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://wku_user:wku_pass123@localhost:5433/wku_crew?schema=public'
process.env.JWT_SECRET = 'test-jwt-secret-key-for-e2e-testing'
process.env.JWT_EXPIRES_IN = '1d'
process.env.GITHUB_CLIENT_ID = 'test-github-client-id'
process.env.GITHUB_CLIENT_SECRET = 'test-github-client-secret'
process.env.GITHUB_CALLBACK_URL = 'http://localhost:3001/api/auth/github/callback'
process.env.FRONTEND_URL = 'http://localhost:3000'

// Increase timeout for database operations
jest.setTimeout(30000)
