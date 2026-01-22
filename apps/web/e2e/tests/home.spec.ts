import { test, expect } from '@playwright/test'
import { HomePage } from '../utils/page-objects'
import { waitForPageLoad, expectTextsVisible } from '../utils/helpers'

test.describe('Home Page - Unauthenticated User', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.goto()
    await waitForPageLoad(page)
  })

  test('should display hero section with main title and description', async ({ page }) => {
    // Check hero title is visible
    await expect(homePage.heroTitle).toBeVisible()
    await expect(homePage.heroTitle).toContainText('함께 성장하는')

    // Check CTA buttons are visible
    await expect(homePage.startButton).toBeVisible()
    await expect(homePage.browseProjectsButton).toBeVisible()

    // Verify button text
    await expect(homePage.startButton).toContainText('GitHub로 시작하기')
    await expect(homePage.browseProjectsButton).toContainText('프로젝트 둘러보기')
  })

  test('should display level system cards (Junior, Senior, Master)', async ({ page }) => {
    // Scroll to level system section
    await page.locator('text=성장하는 레벨 시스템').scrollIntoViewIfNeeded()

    // Check all level cards are visible
    await expect(homePage.juniorCard).toBeVisible()
    await expect(homePage.seniorCard).toBeVisible()
    await expect(homePage.masterCard).toBeVisible()

    // Verify level card content
    await expectTextsVisible(page, [
      'Junior',
      'Senior',
      'Master',
      'Lv. 1-10',
      'Lv. 11-30',
      'Lv. 31-50',
    ])
  })

  test('should display how it works section', async ({ page }) => {
    // Scroll to how it works section
    await page.locator('text=어떻게 진행되나요?').scrollIntoViewIfNeeded()

    // Check all steps are visible
    await expectTextsVisible(page, [
      '가입하기',
      'GitHub 계정으로 간단 가입',
      '프로젝트 시작',
      '완성하고 공유',
      '레벨업!',
    ])
  })

  test('should navigate to login when clicking start button', async ({ page }) => {
    await homePage.clickStartButton()
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should navigate to projects when clicking browse button', async ({ page }) => {
    await homePage.clickBrowseProjects()
    await expect(page).toHaveURL(/\/projects/)
  })

  test('should display footer with links', async ({ page }) => {
    // Scroll to footer
    await homePage.footer.scrollIntoViewIfNeeded()

    await expect(homePage.footer).toBeVisible()
    await expect(homePage.footer).toContainText('© 2026 WKU Software Crew')

    // Check footer links
    const aboutLink = page.locator('footer >> text=소개')
    const projectsLink = page.locator('footer >> text=프로젝트')
    const githubLink = page.locator('footer >> text=GitHub')

    await expect(aboutLink).toBeVisible()
    await expect(projectsLink).toBeVisible()
    await expect(githubLink).toBeVisible()
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)

    // Check that hero section is still visible
    await expect(homePage.heroTitle).toBeVisible()
    await expect(homePage.startButton).toBeVisible()

    // Verify level cards stack vertically
    const juniorBox = await homePage.juniorCard.boundingBox()
    const seniorBox = await homePage.seniorCard.boundingBox()

    if (juniorBox && seniorBox) {
      // On mobile, cards should be stacked (senior card Y position > junior card Y position)
      expect(seniorBox.y).toBeGreaterThan(juniorBox.y)
    }
  })

  test('should be responsive on tablet viewport', async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)

    await expect(homePage.heroTitle).toBeVisible()
    await expect(homePage.startButton).toBeVisible()
    await expect(homePage.juniorCard).toBeVisible()
  })

  test('should have proper SEO meta tags', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/WKU Software Crew/)

    // Check meta description (if exists)
    const metaDescription = page.locator('meta[name="description"]')
    if (await metaDescription.count() > 0) {
      const content = await metaDescription.getAttribute('content')
      expect(content).toBeTruthy()
    }
  })

  test('should load all images without errors', async ({ page }) => {
    // Wait for all images to load
    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      // Check if image is loaded
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
      expect(naturalWidth).toBeGreaterThan(0)
    }
  })

  test('should have accessible navigation', async ({ page }) => {
    // Check for keyboard navigation
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()
  })

  test('should scroll smoothly to sections', async ({ page }) => {
    const initialScrollY = await page.evaluate(() => window.scrollY)

    // Scroll to level system
    await page.locator('text=성장하는 레벨 시스템').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    const scrolledY = await page.evaluate(() => window.scrollY)
    expect(scrolledY).toBeGreaterThan(initialScrollY)
  })
})
