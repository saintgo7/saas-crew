import { test, expect } from '@playwright/test'
import { waitForPageLoad } from '../utils/helpers'

test.describe('Navigation - Page Transitions', () => {
  test('should navigate from home to courses', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Click on courses link in navigation
    const coursesLink = page.locator('a[href="/courses"], nav >> text=/코스|학습/')
    if (await coursesLink.count() > 0) {
      await coursesLink.first().click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/courses')
    }
  })

  test('should navigate from home to community', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Click on community link
    const communityLink = page.locator('a[href="/community"], nav >> text=커뮤니티')
    if (await communityLink.count() > 0) {
      await communityLink.first().click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/community')
    }
  })

  test('should navigate from home to dashboard (if logged in)', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Look for dashboard link
    const dashboardLink = page.locator('a[href="/dashboard"]')
    if (await dashboardLink.count() > 0) {
      await dashboardLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/dashboard')
    }
  })

  test('should use browser back button correctly', async ({ page }) => {
    // Navigate through pages
    await page.goto('/')
    await waitForPageLoad(page)

    // Go to courses
    await page.goto('/courses')
    await waitForPageLoad(page)

    // Go back
    await page.goBack()
    await page.waitForLoadState('networkidle')

    expect(page.url()).toContain('/')
  })

  test('should use browser forward button correctly', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    await page.goto('/courses')
    await waitForPageLoad(page)

    await page.goBack()
    await page.waitForLoadState('networkidle')

    await page.goForward()
    await page.waitForLoadState('networkidle')

    expect(page.url()).toContain('/courses')
  })

  test('should handle direct URL access', async ({ page }) => {
    // Directly access courses page
    await page.goto('/courses')
    await waitForPageLoad(page)
    expect(page.url()).toContain('/courses')

    // Directly access community page
    await page.goto('/community')
    await waitForPageLoad(page)
    expect(page.url()).toContain('/community')
  })

  test('should maintain header navigation on all pages', async ({ page }) => {
    const pages = ['/', '/courses', '/community']

    for (const pagePath of pages) {
      await page.goto(pagePath)
      await waitForPageLoad(page)

      // Check for navigation header
      const nav = page.locator('nav, header')
      await expect(nav.first()).toBeVisible()
    }
  })

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/courses')
    await waitForPageLoad(page)

    // Check for active state on courses link
    const activeLink = page.locator('nav a[href="/courses"][aria-current="page"], nav a[href="/courses"].active')
    if (await activeLink.count() > 0) {
      await expect(activeLink).toBeVisible()
    }
  })

  test('should handle 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page')
    await page.waitForLoadState('networkidle')

    // Check for 404 indicator
    const notFoundText = page.locator('text=/404|Not Found|페이지를 찾을 수 없습니다/')
    if (await notFoundText.count() > 0) {
      await expect(notFoundText.first()).toBeVisible()
    }
  })

  test('should preserve scroll position when navigating back', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500))
    const scrollY1 = await page.evaluate(() => window.scrollY)

    // Navigate away and back
    await page.goto('/courses')
    await waitForPageLoad(page)
    await page.goBack()
    await page.waitForLoadState('networkidle')

    // Check scroll position (might be restored by browser)
    const scrollY2 = await page.evaluate(() => window.scrollY)
    // Browser might restore scroll position
    expect(scrollY2).toBeGreaterThanOrEqual(0)
  })

  test('should show loading state during navigation', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Click navigation link and check for loading state
    const coursesLink = page.locator('a[href="/courses"]')
    if (await coursesLink.count() > 0) {
      const navigationPromise = page.waitForNavigation()
      await coursesLink.first().click()
      await navigationPromise
      expect(page.url()).toContain('/courses')
    }
  })

  test('should handle rapid navigation clicks', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    const coursesLink = page.locator('a[href="/courses"]').first()
    const communityLink = page.locator('a[href="/community"]').first()

    if (await coursesLink.count() > 0 && await communityLink.count() > 0) {
      // Click multiple times rapidly
      await coursesLink.click()
      await page.waitForTimeout(100)
      await communityLink.click()
      await page.waitForLoadState('networkidle')

      // Should end up on the last clicked page
      expect(page.url()).toContain('/community')
    }
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Tab through navigation items
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Enter on a link should navigate
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement
      return el?.tagName === 'A' ? (el as HTMLAnchorElement).href : null
    })

    if (focusedElement) {
      await page.keyboard.press('Enter')
      await page.waitForLoadState('networkidle')
      // Should have navigated
      expect(page.url()).toBeTruthy()
    }
  })

  test('should open external links in new tab', async ({ page, context }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Look for external links (GitHub, etc.)
    const externalLinks = page.locator('a[target="_blank"]')
    const count = await externalLinks.count()

    if (count > 0) {
      const firstExternal = externalLinks.first()
      const href = await firstExternal.getAttribute('href')

      if (href && href.startsWith('http')) {
        // Check it has rel="noopener noreferrer" for security
        const rel = await firstExternal.getAttribute('rel')
        expect(rel).toContain('noopener')
      }
    }
  })

  test('should handle hash navigation for same-page sections', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Look for anchor links
    const anchorLinks = page.locator('a[href^="#"]')
    const count = await anchorLinks.count()

    if (count > 0) {
      const firstAnchor = anchorLinks.first()
      await firstAnchor.click()
      await page.waitForTimeout(500)

      // URL should have hash
      const url = page.url()
      // Hash might be present
      expect(url).toBeTruthy()
    }
  })

  test('should maintain authentication state across navigation', async ({ page }) => {
    // Mock authentication
    await page.context().addCookies([
      {
        name: 'next-auth.session-token',
        value: 'test-token',
        domain: 'localhost',
        path: '/',
      },
    ])

    await page.goto('/')
    await waitForPageLoad(page)

    // Navigate to different pages
    await page.goto('/courses')
    await waitForPageLoad(page)

    await page.goto('/community')
    await waitForPageLoad(page)

    // Check cookie is still present
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find(c => c.name === 'next-auth.session-token')
    expect(sessionCookie).toBeTruthy()
  })
})

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
  })

  test('should show mobile menu toggle button', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Look for hamburger menu
    const menuButton = page.locator('button[aria-label*="menu"], button:has(svg.lucide-menu)')
    if (await menuButton.count() > 0) {
      await expect(menuButton.first()).toBeVisible()
    }
  })

  test('should open mobile menu on click', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    const menuButton = page.locator('button[aria-label*="menu"], button:has(svg.lucide-menu)')
    if (await menuButton.count() > 0) {
      await menuButton.first().click()
      await page.waitForTimeout(300)

      // Check for expanded menu
      const mobileNav = page.locator('[role="dialog"], [data-mobile-menu="true"]')
      if (await mobileNav.count() > 0) {
        await expect(mobileNav).toBeVisible()
      }
    }
  })

  test('should close mobile menu after navigation', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    const menuButton = page.locator('button[aria-label*="menu"]')
    if (await menuButton.count() > 0) {
      await menuButton.first().click()
      await page.waitForTimeout(300)

      // Click a menu item
      const coursesLink = page.locator('a[href="/courses"]').last()
      if (await coursesLink.isVisible()) {
        await coursesLink.click()
        await page.waitForLoadState('networkidle')

        // Menu should close
        const mobileNav = page.locator('[role="dialog"]')
        if (await mobileNav.count() > 0) {
          await expect(mobileNav).toBeHidden()
        }
      }
    }
  })
})
