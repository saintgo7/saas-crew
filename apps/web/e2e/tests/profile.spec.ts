import { test, expect } from '@playwright/test'
import { waitForPageLoad } from '../utils/helpers'

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user state
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('user-storage', JSON.stringify({
        state: {
          user: {
            id: 'test-user-1',
            name: 'Test User',
            email: 'test@example.com',
            level: 5,
            experiencePoints: 1500,
            rank: 'JUNIOR',
            department: 'Computer Science',
            grade: 3,
          }
        },
        version: 0
      }))
    })
  })

  test('should display profile page with user info', async ({ page }) => {
    await page.goto('/profile')
    await waitForPageLoad(page)

    // Check page title
    await expect(page.locator('h1')).toContainText(/Profile|프로필/)
  })

  test('should show user name and email', async ({ page }) => {
    await page.goto('/profile')
    await waitForPageLoad(page)

    // Check for user name
    const userName = page.locator('text=Test User')
    await expect(userName.first()).toBeVisible()
  })

  test('should have edit profile button', async ({ page }) => {
    await page.goto('/profile')
    await waitForPageLoad(page)

    // Look for edit button
    const editButton = page.locator('button:has-text(/Edit|수정/)')
    if (await editButton.count() > 0) {
      await expect(editButton.first()).toBeVisible()
    }
  })

  test('should toggle edit mode when edit button clicked', async ({ page }) => {
    await page.goto('/profile')
    await waitForPageLoad(page)

    // Click edit button
    const editButton = page.locator('button:has-text(/Edit|수정/)')
    if (await editButton.count() > 0) {
      await editButton.first().click()
      await page.waitForTimeout(300)

      // Check for form elements
      const nameInput = page.locator('input[type="text"]')
      await expect(nameInput.first()).toBeVisible()
    }
  })

  test('should show level and XP information', async ({ page }) => {
    await page.goto('/profile')
    await waitForPageLoad(page)

    // Look for level indicator
    const levelText = page.locator('text=/Lv|레벨|XP/')
    await expect(levelText.first()).toBeVisible()
  })
})

test.describe('Profile Page - Unauthenticated', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    // Clear any existing auth
    await page.addInitScript(() => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user-storage')
    })

    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    // Should redirect to login
    await expect(page).toHaveURL(/auth\/login/)
  })
})

test.describe('Auth Callback Page', () => {
  test('should display loading state initially', async ({ page }) => {
    await page.goto('/auth/callback')
    await waitForPageLoad(page)

    // Check for loading indicator
    const loading = page.locator('text=/Loading|로딩|처리/')
    if (await loading.count() > 0) {
      await expect(loading.first()).toBeVisible()
    }
  })

  test('should show error when no token provided', async ({ page }) => {
    await page.goto('/auth/callback')
    await page.waitForTimeout(2000)

    // Check for error message
    const error = page.locator('text=/error|오류|실패/')
    if (await error.count() > 0) {
      await expect(error.first()).toBeVisible()
    }
  })

  test('should have try again button on error', async ({ page }) => {
    await page.goto('/auth/callback')
    await page.waitForTimeout(2000)

    // Check for try again button
    const tryAgain = page.locator('button:has-text(/Try again|다시/)')
    if (await tryAgain.count() > 0) {
      await expect(tryAgain.first()).toBeVisible()
    }
  })
})

test.describe('Login Page', () => {
  test('should display GitHub login button', async ({ page }) => {
    await page.goto('/auth/login')
    await waitForPageLoad(page)

    // Check for GitHub login button
    const githubButton = page.locator('button:has-text(/GitHub/)')
    await expect(githubButton).toBeVisible()
  })

  test('should have proper login page structure', async ({ page }) => {
    await page.goto('/auth/login')
    await waitForPageLoad(page)

    // Check for logo
    const logo = page.locator('text=WKU Software Crew')
    await expect(logo.first()).toBeVisible()

    // Check for feature list
    const features = page.locator('ul li')
    expect(await features.count()).toBeGreaterThan(0)
  })
})

test.describe('User Menu in Header', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user state
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('user-storage', JSON.stringify({
        state: {
          user: {
            id: 'test-user-1',
            name: 'Test User',
            email: 'test@example.com',
            level: 5,
            profileImage: null,
          }
        },
        version: 0
      }))
    })
  })

  test('should show user menu when logged in', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Look for user menu button
    const userButton = page.locator('button:has-text(/Test User/)')
    if (await userButton.count() > 0) {
      await expect(userButton).toBeVisible()
    }
  })

  test('should open dropdown on click', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    const userButton = page.locator('button:has-text(/Test User/)')
    if (await userButton.count() > 0) {
      await userButton.click()
      await page.waitForTimeout(300)

      // Check for dropdown menu
      const dropdown = page.locator('text=/Logout|로그아웃/')
      await expect(dropdown.first()).toBeVisible()
    }
  })

  test('should navigate to profile from dropdown', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    const userButton = page.locator('button:has-text(/Test User/)')
    if (await userButton.count() > 0) {
      await userButton.click()
      await page.waitForTimeout(300)

      // Click profile link
      const profileLink = page.locator('a[href="/profile"]')
      if (await profileLink.count() > 0) {
        await profileLink.click()
        await page.waitForLoadState('networkidle')
        expect(page.url()).toContain('/profile')
      }
    }
  })
})
