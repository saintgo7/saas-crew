import { test as base, Page } from '@playwright/test'

/**
 * Mock user data for testing
 */
export const mockUsers = {
  junior: {
    id: 'test-user-1',
    name: 'Junior Tester',
    email: 'junior@test.com',
    githubId: 'junior-tester',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    level: 5,
    xp: 250,
    tier: 'JUNIOR' as const,
  },
  senior: {
    id: 'test-user-2',
    name: 'Senior Tester',
    email: 'senior@test.com',
    githubId: 'senior-tester',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    level: 20,
    xp: 5000,
    tier: 'SENIOR' as const,
  },
  master: {
    id: 'test-user-3',
    name: 'Master Tester',
    email: 'master@test.com',
    githubId: 'master-tester',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    level: 40,
    xp: 15000,
    tier: 'MASTER' as const,
  },
}

/**
 * Mock NextAuth session for authenticated users
 */
async function mockAuthSession(page: Page, user: typeof mockUsers.junior) {
  // Mock NextAuth session cookie and storage
  const session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.avatar,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }

  // Set session in localStorage for client-side access
  await page.addInitScript((sessionData) => {
    window.localStorage.setItem('next-auth.session-token', JSON.stringify(sessionData))
  }, session)

  // Mock the session cookie
  await page.context().addCookies([
    {
      name: 'next-auth.session-token',
      value: 'mock-session-token',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ])

  // Mock API responses for session endpoints
  await page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(session),
    })
  })

  await page.route('**/api/auth/providers', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        github: {
          id: 'github',
          name: 'GitHub',
          type: 'oauth',
          signinUrl: '/api/auth/signin/github',
          callbackUrl: '/api/auth/callback/github',
        },
      }),
    })
  })
}

/**
 * Extended test fixtures with authentication helpers
 */
type AuthFixtures = {
  authenticatedPage: Page
  juniorUser: Page
  seniorUser: Page
  masterUser: Page
}

export const test = base.extend<AuthFixtures>({
  // Generic authenticated page
  authenticatedPage: async ({ page }, use) => {
    await mockAuthSession(page, mockUsers.junior)
    await use(page)
  },

  // Junior tier user
  juniorUser: async ({ page }, use) => {
    await mockAuthSession(page, mockUsers.junior)
    await use(page)
  },

  // Senior tier user
  seniorUser: async ({ page }, use) => {
    await mockAuthSession(page, mockUsers.senior)
    await use(page)
  },

  // Master tier user
  masterUser: async ({ page }, use) => {
    await mockAuthSession(page, mockUsers.master)
    await use(page)
  },
})

export { expect } from '@playwright/test'
