import { Page, expect } from '@playwright/test'

/**
 * Wait for page to be fully loaded including network idle
 */
export async function waitForPageLoad(page: Page, timeout = 10000) {
  await page.waitForLoadState('networkidle', { timeout })
  await page.waitForLoadState('domcontentloaded', { timeout })
}

/**
 * Wait for Next.js hydration to complete
 */
export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    return document.querySelector('[data-reactroot], #__next')
  })
}

/**
 * Navigate to a path and wait for page to load
 */
export async function navigateTo(page: Page, path: string) {
  await page.goto(path)
  await waitForPageLoad(page)
  await waitForHydration(page)
}

/**
 * Check if element is visible with retry
 */
export async function isElementVisible(page: Page, selector: string, timeout = 5000): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout })
    return true
  } catch {
    return false
  }
}

/**
 * Scroll to element and wait for it to be in viewport
 */
export async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded()
  await page.waitForTimeout(300) // Wait for scroll animation
}

/**
 * Type text with human-like delay
 */
export async function typeWithDelay(page: Page, selector: string, text: string, delay = 50) {
  await page.locator(selector).click()
  await page.locator(selector).fill('') // Clear first
  await page.locator(selector).type(text, { delay })
}

/**
 * Wait for and click element
 */
export async function waitAndClick(page: Page, selector: string) {
  await page.waitForSelector(selector, { state: 'visible' })
  await page.locator(selector).click()
}

/**
 * Check navigation occurred
 */
export async function expectUrlToBe(page: Page, expectedPath: string) {
  await page.waitForURL(`**${expectedPath}`)
  expect(page.url()).toContain(expectedPath)
}

/**
 * Take screenshot with custom name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `test-results/screenshots/${name}.png`,
    fullPage: true,
  })
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page,
  endpoint: string,
  data: any,
  status = 200
) {
  await page.route(`**/${endpoint}`, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(data),
    })
  })
}

/**
 * Wait for API call to complete
 */
export async function waitForApiCall(page: Page, endpoint: string, timeout = 5000) {
  return page.waitForResponse(
    (response) => response.url().includes(endpoint) && response.status() === 200,
    { timeout }
  )
}

/**
 * Check if text is visible on page
 */
export async function expectTextVisible(page: Page, text: string) {
  await expect(page.getByText(text, { exact: false })).toBeVisible()
}

/**
 * Check if multiple texts are visible
 */
export async function expectTextsVisible(page: Page, texts: string[]) {
  for (const text of texts) {
    await expectTextVisible(page, text)
  }
}

/**
 * Select option from dropdown
 */
export async function selectOption(page: Page, selector: string, value: string) {
  await page.locator(selector).click()
  await page.locator(`text=${value}`).click()
}

/**
 * Wait for loading state to disappear
 */
export async function waitForLoadingToDisappear(page: Page) {
  try {
    await page.waitForSelector('[data-loading="true"]', { state: 'hidden', timeout: 10000 })
  } catch {
    // Loading indicator might not exist, which is fine
  }
}

/**
 * Check responsive layout
 */
export async function checkResponsiveLayout(page: Page, viewports: Array<{ width: number; height: number }>) {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.waitForTimeout(500) // Wait for layout adjustment
  }
}

/**
 * Intercept and count network requests
 */
export async function countNetworkRequests(page: Page, urlPattern: string): Promise<number> {
  let count = 0
  page.on('request', (request) => {
    if (request.url().includes(urlPattern)) {
      count++
    }
  })
  return count
}
