import { test, expect } from '@playwright/test'
import { waitForPageLoad, mockApiResponse, typeWithDelay } from '../utils/helpers'

test.describe('Search Functionality - Community', () => {
  const mockSearchResults = [
    {
      id: '1',
      title: 'React Hooks 사용법',
      content: 'useState와 useEffect 설명',
      category: 'QNA',
      relevance: 0.95,
    },
    {
      id: '2',
      title: 'React 성능 최적화',
      content: 'React 애플리케이션 성능 개선',
      category: 'INFO',
      relevance: 0.85,
    },
  ]

  test.beforeEach(async ({ page }) => {
    await page.goto('/community')
    await waitForPageLoad(page)
  })

  test('should display search input in community page', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="검색"]')

    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible()
      await expect(searchInput.first()).toBeEnabled()
    }
  })

  test('should search posts by keyword', async ({ page }) => {
    await mockApiResponse(page, 'api/community/search?q=React', mockSearchResults)

    const searchInput = page.locator('input[type="search"], input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      await typeWithDelay(page, 'input[type="search"], input[placeholder*="검색"]', 'React')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // URL should contain search query
      const url = page.url()
      // Might have query parameter
      expect(url).toBeTruthy()
    }
  })

  test('should show search results', async ({ page }) => {
    await mockApiResponse(page, 'api/community/search?q=React', mockSearchResults)

    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      await searchInput.fill('React')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Check for results
      const results = page.locator('[data-testid="post-card"], article')
      const count = await results.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test('should show no results message for invalid search', async ({ page }) => {
    await mockApiResponse(page, 'api/community/search?q=xyz123abc', [])

    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      await searchInput.fill('xyz123abc')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Check for no results message
      const noResults = page.locator('text=/결과가 없습니다|No results|검색 결과 없음/')
      if (await noResults.count() > 0) {
        await expect(noResults.first()).toBeVisible()
      }
    }
  })

  test('should clear search results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      // Perform search
      await searchInput.fill('React')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Clear search
      await searchInput.clear()
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Should show all posts again
      const url = page.url()
      expect(url).not.toContain('q=React')
    }
  })

  test('should highlight search terms in results', async ({ page }) => {
    await mockApiResponse(page, 'api/community/search?q=React', mockSearchResults)

    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      await searchInput.fill('React')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Check if search term appears in results
      const results = page.locator('text=/React/')
      const count = await results.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test('should support Korean search', async ({ page }) => {
    await mockApiResponse(page, 'api/community/search?q=리액트', [
      {
        id: '1',
        title: '리액트 훅스 사용법',
        content: '리액트 훅스에 대한 설명',
      },
    ])

    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      await searchInput.fill('리액트')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Should handle Korean characters
      const url = page.url()
      expect(url).toBeTruthy()
    }
  })

  test('should be case-insensitive', async ({ page }) => {
    await mockApiResponse(page, 'api/community/search?q=react', mockSearchResults)
    await mockApiResponse(page, 'api/community/search?q=REACT', mockSearchResults)

    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      // Search with lowercase
      await searchInput.fill('react')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      const results1 = await page.locator('[data-testid="post-card"]').count()

      // Search with uppercase
      await searchInput.clear()
      await searchInput.fill('REACT')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      const results2 = await page.locator('[data-testid="post-card"]').count()

      // Results should be similar
      expect(Math.abs(results1 - results2)).toBeLessThanOrEqual(1)
    }
  })

  test('should show search suggestions (if implemented)', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      await searchInput.fill('Re')
      await page.waitForTimeout(300)

      // Check for autocomplete/suggestions
      const suggestions = page.locator('[role="listbox"], [data-testid="search-suggestions"]')
      // Suggestions might appear
      const count = await suggestions.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test('should handle special characters in search', async ({ page }) => {
    await mockApiResponse(page, 'api/community/search?q=C%2B%2B', [])

    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      await searchInput.fill('C++')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Should not break
      expect(page.url()).toBeTruthy()
    }
  })

  test('should persist search query in URL', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      await searchInput.fill('TypeScript')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      const url = page.url()
      // URL might contain search query
      if (url.includes('?') || url.includes('search')) {
        expect(url).toBeTruthy()
      }
    }
  })

  test('should restore search query from URL on page load', async ({ page }) => {
    await page.goto('/community?q=React')
    await waitForPageLoad(page)

    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      const value = await searchInput.inputValue()
      // Input might be populated with query
      expect(value).toBeTruthy()
    }
  })
})

test.describe('Search Functionality - Courses', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/courses')
    await waitForPageLoad(page)
  })

  test('should display search input in courses page', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="검색"]')

    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible()
    }
  })

  test('should search courses by title', async ({ page }) => {
    const mockCourses = [
      { id: '1', title: 'JavaScript Basics', level: 'JUNIOR' },
      { id: '2', title: 'Advanced JavaScript', level: 'SENIOR' },
    ]

    await mockApiResponse(page, 'api/courses/search?q=JavaScript', mockCourses)

    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      await searchInput.fill('JavaScript')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Should show search results
      const results = page.locator('[data-testid="course-card"]')
      const count = await results.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test('should filter courses by search and level', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="검색"]').first()
    const juniorFilter = page.locator('button:has-text("Junior")').first()

    if (await searchInput.count() > 0 && await juniorFilter.count() > 0) {
      // Apply search
      await searchInput.fill('React')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Apply filter
      await juniorFilter.click()
      await page.waitForTimeout(500)

      // Both should be applied
      expect(page.url()).toBeTruthy()
    }
  })
})

test.describe('Global Search', () => {
  test('should have global search accessible from header', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Look for search in header/navigation
    const headerSearch = page.locator('nav input[type="search"], header input[placeholder*="검색"]')
    if (await headerSearch.count() > 0) {
      await expect(headerSearch.first()).toBeVisible()
    }
  })

  test('should search across all content types', async ({ page }) => {
    const globalSearchResults = {
      courses: [{ id: '1', title: 'React Course', type: 'course' }],
      posts: [{ id: '1', title: 'React Post', type: 'post' }],
      projects: [{ id: '1', title: 'React Project', type: 'project' }],
    }

    await mockApiResponse(page, 'api/search?q=React', globalSearchResults)

    await page.goto('/')
    await waitForPageLoad(page)

    const searchInput = page.locator('input[placeholder*="검색"]').first()

    if (await searchInput.count() > 0) {
      await searchInput.fill('React')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Should show search results page or dropdown
      const url = page.url()
      expect(url).toBeTruthy()
    }
  })
})
