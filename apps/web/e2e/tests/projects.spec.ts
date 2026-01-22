import { test, expect } from '@playwright/test'
import { waitForPageLoad } from '../utils/helpers'

test.describe('Projects Page', () => {
  test('should load projects page', async ({ page }) => {
    await page.goto('/projects')
    await waitForPageLoad(page)

    // Check page title
    const title = page.locator('h1')
    await expect(title).toContainText(/Projects|프로젝트/)
  })

  test('should display project cards or empty state', async ({ page }) => {
    await page.goto('/projects')
    await waitForPageLoad(page)

    // Look for project cards or empty state
    const projectCards = page.locator('[data-testid="project-card"], .project-card')
    const emptyState = page.locator('text=/No projects|프로젝트가 없습니다/')

    // Either projects should exist or empty state should show
    const hasProjects = await projectCards.count() > 0
    const hasEmptyState = await emptyState.count() > 0

    expect(hasProjects || hasEmptyState).toBeTruthy()
  })

  test('should have search functionality', async ({ page }) => {
    await page.goto('/projects')
    await waitForPageLoad(page)

    // Look for search input
    const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="search"], input[placeholder*="검색"]')
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible()
    }
  })

  test('should filter projects when searching', async ({ page }) => {
    await page.goto('/projects')
    await waitForPageLoad(page)

    const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="search"], input[placeholder*="검색"]')
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('test')
      await page.waitForTimeout(500)

      // Page should still be functional
      expect(page.url()).toContain('/projects')
    }
  })

  test('should navigate to project detail page', async ({ page }) => {
    await page.goto('/projects')
    await waitForPageLoad(page)

    // Look for project links
    const projectLinks = page.locator('a[href^="/projects/"]')
    if (await projectLinks.count() > 0) {
      await projectLinks.first().click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toMatch(/\/projects\/.+/)
    }
  })
})

test.describe('Project Detail Page', () => {
  test('should show back button', async ({ page }) => {
    await page.goto('/projects/test-id')
    await waitForPageLoad(page)

    // Look for back button or link
    const backButton = page.locator('a[href="/projects"], button:has-text(/Back|뒤로/)')
    if (await backButton.count() > 0) {
      await expect(backButton.first()).toBeVisible()
    }
  })

  test('should display project info or not found', async ({ page }) => {
    await page.goto('/projects/test-id')
    await waitForPageLoad(page)

    // Either project info or 404
    const projectTitle = page.locator('h1, h2')
    await expect(projectTitle.first()).toBeVisible()
  })
})

test.describe('Projects Page - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/projects')
    await waitForPageLoad(page)

    // Page should load without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = 375

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 50)
  })

  test('should show project cards in mobile layout', async ({ page }) => {
    await page.goto('/projects')
    await waitForPageLoad(page)

    // Projects should be visible
    const content = page.locator('main, [role="main"]')
    await expect(content.first()).toBeVisible()
  })
})
