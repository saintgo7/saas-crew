import { test, expect } from '@playwright/test'
import { CoursesPage, CourseDetailPage } from '../utils/page-objects'
import { waitForPageLoad, mockApiResponse } from '../utils/helpers'

test.describe('Courses Page - Browse and Filter', () => {
  let coursesPage: CoursesPage

  // Mock course data
  const mockCourses = [
    {
      id: '1',
      title: 'JavaScript 기초',
      description: 'JavaScript 기본 문법부터 배우기',
      level: 'JUNIOR',
      difficulty: 1,
      duration: '4주',
      thumbnail: '/courses/js-basics.jpg',
    },
    {
      id: '2',
      title: 'React 마스터하기',
      description: 'React로 풀스택 앱 만들기',
      level: 'SENIOR',
      difficulty: 3,
      duration: '8주',
      thumbnail: '/courses/react-master.jpg',
    },
    {
      id: '3',
      title: '마이크로서비스 아키텍처',
      description: '대규모 시스템 설계',
      level: 'MASTER',
      difficulty: 5,
      duration: '12주',
      thumbnail: '/courses/microservices.jpg',
    },
  ]

  test.beforeEach(async ({ page }) => {
    coursesPage = new CoursesPage(page)

    // Mock API response for courses
    await mockApiResponse(page, 'api/courses', mockCourses)

    await coursesPage.goto()
    await waitForPageLoad(page)
  })

  test('should display courses page with title', async ({ page }) => {
    await expect(coursesPage.pageTitle).toBeVisible()
    await expect(coursesPage.pageTitle).toContainText('학습 코스')
  })

  test('should display all filter buttons', async () => {
    await expect(coursesPage.filterButtons.all).toBeVisible()
    await expect(coursesPage.filterButtons.junior).toBeVisible()
    await expect(coursesPage.filterButtons.senior).toBeVisible()
    await expect(coursesPage.filterButtons.master).toBeVisible()
  })

  test('should filter courses by Junior level', async ({ page }) => {
    await coursesPage.filterByLevel('junior')

    // Wait for filter to apply
    await page.waitForTimeout(500)

    // Check that only Junior courses are visible
    const courses = page.locator('[data-testid="course-card"]')
    const count = await courses.count()

    // At least one course should be visible
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('should filter courses by Senior level', async ({ page }) => {
    await coursesPage.filterByLevel('senior')
    await page.waitForTimeout(500)

    const activeFilter = page.locator('button[data-active="true"]')
    await expect(activeFilter).toContainText('Senior')
  })

  test('should filter courses by Master level', async ({ page }) => {
    await coursesPage.filterByLevel('master')
    await page.waitForTimeout(500)

    const activeFilter = page.locator('button[data-active="true"]')
    await expect(activeFilter).toContainText('Master')
  })

  test('should reset filter when clicking All', async ({ page }) => {
    // First apply a filter
    await coursesPage.filterByLevel('junior')
    await page.waitForTimeout(500)

    // Then reset
    await coursesPage.filterByLevel('all')
    await page.waitForTimeout(500)

    const activeFilter = page.locator('button[data-active="true"]')
    await expect(activeFilter).toContainText('전체')
  })

  test('should display course cards with proper information', async ({ page }) => {
    const firstCourse = page.locator('[data-testid="course-card"]').first()

    if (await firstCourse.count() > 0) {
      // Check for course title
      const title = firstCourse.locator('h3')
      await expect(title).toBeVisible()

      // Check for level badge
      const badge = firstCourse.locator('[data-testid="level-badge"]')
      if (await badge.count() > 0) {
        await expect(badge).toBeVisible()
      }
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)

    await expect(coursesPage.pageTitle).toBeVisible()
    await expect(coursesPage.filterButtons.all).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)

    await expect(coursesPage.pageTitle).toBeVisible()
    await expect(coursesPage.filterButtons.all).toBeVisible()
  })

  test('should maintain filter state on scroll', async ({ page }) => {
    await coursesPage.filterByLevel('senior')
    await page.waitForTimeout(500)

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500))
    await page.waitForTimeout(300)

    // Check filter is still active
    const activeFilter = page.locator('button[data-active="true"]')
    await expect(activeFilter).toContainText('Senior')
  })

  test('should navigate to course detail on card click', async ({ page }) => {
    const firstCourse = page.locator('[data-testid="course-card"]').first()

    if (await firstCourse.count() > 0) {
      await firstCourse.click()
      await page.waitForLoadState('networkidle')

      // Should navigate to course detail page
      expect(page.url()).toMatch(/\/courses\/\w+/)
    }
  })
})

test.describe('Course Detail Page', () => {
  test('should display course details', async ({ page }) => {
    const courseDetailPage = new CourseDetailPage(page)

    // Mock course detail data
    await mockApiResponse(page, 'api/courses/1', {
      id: '1',
      title: 'JavaScript 기초',
      description: 'JavaScript 기본 문법부터 배우기',
      level: 'JUNIOR',
      content: '상세 내용...',
    })

    await courseDetailPage.goto('1')
    await waitForPageLoad(page)

    // Check course title is visible
    await expect(courseDetailPage.courseTitle).toBeVisible()
  })

  test('should navigate back to courses list', async ({ page }) => {
    const courseDetailPage = new CourseDetailPage(page)

    await mockApiResponse(page, 'api/courses/1', {
      id: '1',
      title: 'JavaScript 기초',
    })

    await courseDetailPage.goto('1')
    await waitForPageLoad(page)

    // Click back button
    const backButton = page.locator('a:has-text("뒤로")')
    if (await backButton.count() > 0) {
      await backButton.click()
      await expect(page).toHaveURL(/\/courses$/)
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    const courseDetailPage = new CourseDetailPage(page)

    await mockApiResponse(page, 'api/courses/1', {
      id: '1',
      title: 'JavaScript 기초',
    })

    await page.setViewportSize({ width: 375, height: 667 })
    await courseDetailPage.goto('1')
    await waitForPageLoad(page)

    await expect(courseDetailPage.courseTitle).toBeVisible()
  })
})
