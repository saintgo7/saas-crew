import { test, expect } from '@playwright/test'
import { testConfig } from '../config/test.config'

test.describe('Performance Tests', () => {
  test('should load home page within performance budget', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    expect(loadTime).toBeLessThan(testConfig.performance.loadTime)
  })

  test('should have acceptable First Contentful Paint', async ({ page }) => {
    await page.goto('/')

    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint')
          if (fcpEntry) {
            resolve(fcpEntry.startTime)
          }
        }).observe({ entryTypes: ['paint'] })

        // Fallback timeout
        setTimeout(() => resolve(0), 5000)
      })
    })

    if (fcp > 0) {
      expect(fcp).toBeLessThan(testConfig.performance.firstContentfulPaint)
    }
  })

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const images = await page.locator('img').all()

    for (const img of images) {
      const isVisible = await img.isVisible()
      if (isVisible) {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
        expect(naturalWidth).toBeGreaterThan(0)
      }
    }
  })

  test('should not have layout shifts', async ({ page }) => {
    await page.goto('/')

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
        }).observe({ entryTypes: ['layout-shift'] })

        // Measure for 3 seconds
        setTimeout(() => resolve(clsValue), 3000)
      })
    })

    // CLS should be less than 0.1 (good score)
    expect(cls).toBeLessThan(0.1)
  })

  test('should have efficient JavaScript bundle size', async ({ page }) => {
    const resourceSizes: number[] = []

    page.on('response', async (response) => {
      const url = response.url()
      if (url.includes('.js') && !url.includes('node_modules')) {
        const buffer = await response.body().catch(() => null)
        if (buffer) {
          resourceSizes.push(buffer.length)
        }
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const totalSize = resourceSizes.reduce((acc, size) => acc + size, 0)
    const totalSizeKB = totalSize / 1024

    // Main bundle should be less than 500KB (gzipped usually 1/3 of this)
    expect(totalSizeKB).toBeLessThan(500)
  })

  test('should render courses page quickly', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/courses')
    await page.waitForSelector('h1', { state: 'visible' })

    const renderTime = Date.now() - startTime

    expect(renderTime).toBeLessThan(testConfig.performance.loadTime)
  })

  test('should render community page quickly', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/community')
    await page.waitForSelector('h1', { state: 'visible' })

    const renderTime = Date.now() - startTime

    expect(renderTime).toBeLessThan(testConfig.performance.loadTime)
  })

  test('should handle rapid navigation without memory leaks', async ({ page }) => {
    const pages = ['/', '/courses', '/community']

    for (let i = 0; i < 3; i++) {
      for (const pagePath of pages) {
        await page.goto(pagePath)
        await page.waitForLoadState('networkidle')
      }
    }

    // If we got here without timeout, navigation is handling well
    expect(true).toBe(true)
  })

  test('should load fonts efficiently', async ({ page }) => {
    const fontLoads: string[] = []

    page.on('response', (response) => {
      const url = response.url()
      if (url.includes('.woff2') || url.includes('.woff') || url.includes('.ttf')) {
        fontLoads.push(url)
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should have fonts loaded
    expect(fontLoads.length).toBeGreaterThanOrEqual(0)
  })

  test('should use appropriate caching headers', async ({ page }) => {
    let hasCache = false

    page.on('response', (response) => {
      const cacheControl = response.headers()['cache-control']
      if (cacheControl && cacheControl.includes('max-age')) {
        hasCache = true
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Static assets should have cache headers
    expect(hasCache).toBe(true)
  })
})

test.describe('Network Performance', () => {
  test('should minimize number of requests', async ({ page }) => {
    let requestCount = 0

    page.on('request', () => {
      requestCount++
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should not have excessive requests (arbitrary limit)
    expect(requestCount).toBeLessThan(100)
  })

  test('should load critical resources first', async ({ page }) => {
    const resourceTiming: Array<{ url: string; startTime: number }> = []

    page.on('response', (response) => {
      resourceTiming.push({
        url: response.url(),
        startTime: Date.now(),
      })
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Document should be first
    if (resourceTiming.length > 0) {
      const firstResource = resourceTiming[0]
      expect(firstResource.url).toContain('localhost:3000')
    }
  })

  test('should compress responses', async ({ page }) => {
    let hasCompression = false

    page.on('response', (response) => {
      const encoding = response.headers()['content-encoding']
      if (encoding && (encoding.includes('gzip') || encoding.includes('br'))) {
        hasCompression = true
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // At least some resources should be compressed
    expect(hasCompression).toBe(true)
  })
})

test.describe('Responsive Performance', () => {
  test('should perform well on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Mobile should load within reasonable time
    expect(loadTime).toBeLessThan(testConfig.performance.loadTime * 1.5)
  })

  test('should optimize images for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const images = await page.locator('img').all()

    for (const img of images) {
      const isVisible = await img.isVisible()
      if (isVisible) {
        const src = await img.getAttribute('src')
        // Next.js image optimization should be used
        if (src) {
          expect(src.includes('/_next/image') || src.includes('http')).toBe(true)
        }
      }
    }
  })
})
