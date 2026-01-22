import { defineConfig, devices } from '@playwright/test'

/**
 * E2E Test Configuration for WKU Software Crew
 *
 * Features:
 * - Multi-browser testing (Chromium, Firefox, WebKit)
 * - Mobile viewport testing
 * - Screenshot capture on failure
 * - Video recording for debugging
 * - Parallel test execution
 * - Automatic retry on failure
 */
export default defineConfig({
  // Test directory
  testDir: './e2e',

  // Test file pattern
  testMatch: '**/*.spec.ts',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['junit', { outputFile: 'test-results/e2e-results.xml' }],
    ['list']
  ],

  // Global test settings
  use: {
    // Base URL for navigation
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Trace settings - capture trace on first retry
    trace: 'on-first-retry',

    // Screenshot settings - only on failure
    screenshot: 'only-on-failure',

    // Video settings - retain on failure
    video: 'retain-on-failure',

    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Navigation timeout
    navigationTimeout: 15 * 1000,

    // Action timeout
    actionTimeout: 10 * 1000,
  },

  // Test projects for different browsers and devices
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Enable Chrome DevTools Protocol for debugging
        launchOptions: {
          args: ['--disable-web-security'],
        },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        isMobile: true,
        hasTouch: true,
      },
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true,
      },
    },

    // Tablet
    {
      name: 'iPad',
      use: {
        ...devices['iPad Pro'],
        isMobile: true,
        hasTouch: true,
      },
    },
  ],

  // Web server configuration for local development
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  // Output folder for test results
  outputDir: 'test-results',
})
