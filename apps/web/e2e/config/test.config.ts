/**
 * Test Configuration
 * Environment-specific settings for E2E tests
 */

export const testConfig = {
  // Base URL for testing
  baseURL: process.env.BASE_URL || 'http://localhost:3000',

  // API endpoints
  api: {
    baseURL: process.env.API_URL || 'http://localhost:3001',
    endpoints: {
      courses: '/api/courses',
      community: '/api/community/posts',
      user: '/api/user',
      auth: '/api/auth',
    },
  },

  // Test timeouts
  timeouts: {
    navigation: 15000,
    action: 10000,
    assertion: 5000,
    apiResponse: 5000,
  },

  // Retry configuration
  retries: {
    ci: 2,
    local: 0,
  },

  // Screenshot configuration
  screenshots: {
    onFailure: true,
    fullPage: true,
    path: 'test-results/screenshots',
  },

  // Video configuration
  video: {
    onFailure: true,
    path: 'test-results/videos',
  },

  // Test data
  testData: {
    users: {
      junior: {
        email: 'junior@test.com',
        name: 'Junior Tester',
        level: 5,
        tier: 'JUNIOR',
      },
      senior: {
        email: 'senior@test.com',
        name: 'Senior Tester',
        level: 20,
        tier: 'SENIOR',
      },
      master: {
        email: 'master@test.com',
        name: 'Master Tester',
        level: 40,
        tier: 'MASTER',
      },
    },
  },

  // Feature flags
  features: {
    authentication: true,
    search: true,
    comments: true,
    courses: true,
    community: true,
  },

  // Browser configurations
  browsers: {
    chromium: {
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
    },
    firefox: {
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
    },
    webkit: {
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
    },
  },

  // Mobile configurations
  mobile: {
    'Mobile Chrome': {
      viewport: { width: 360, height: 640 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
    'Mobile Safari': {
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
    iPad: {
      viewport: { width: 768, height: 1024 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
  },

  // Performance thresholds
  performance: {
    loadTime: 3000, // Max page load time (ms)
    apiResponseTime: 1000, // Max API response time (ms)
    firstContentfulPaint: 1500, // Max FCP (ms)
    largestContentfulPaint: 2500, // Max LCP (ms)
  },

  // Accessibility configuration
  accessibility: {
    standards: ['wcag2a', 'wcag2aa'],
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'],
    },
  },
}

export type TestConfig = typeof testConfig
