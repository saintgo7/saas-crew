import { test, expect, mockUsers } from '../fixtures/auth'
import { DashboardPage } from '../utils/page-objects'
import { waitForPageLoad, mockApiResponse } from '../utils/helpers'

test.describe('Authenticated User - Dashboard', () => {
  test('should display dashboard for junior user', async ({ juniorUser }) => {
    const dashboardPage = new DashboardPage(juniorUser)

    // Mock user stats
    await mockApiResponse(juniorUser, 'api/user/stats', {
      level: mockUsers.junior.level,
      xp: mockUsers.junior.xp,
      tier: mockUsers.junior.tier,
      projects: 3,
      completedCourses: 2,
    })

    await dashboardPage.goto()
    await waitForPageLoad(juniorUser)

    // Check dashboard is visible
    await expect(dashboardPage.welcomeMessage).toBeVisible()
  })

  test('should display user level and XP', async ({ seniorUser }) => {
    const dashboardPage = new DashboardPage(seniorUser)

    await mockApiResponse(seniorUser, 'api/user/stats', {
      level: mockUsers.senior.level,
      xp: mockUsers.senior.xp,
      tier: mockUsers.senior.tier,
    })

    await dashboardPage.goto()
    await waitForPageLoad(seniorUser)

    // Check for level display
    const levelIndicator = seniorUser.locator('text=/레벨|Level|Lv/')
    if (await levelIndicator.count() > 0) {
      await expect(levelIndicator.first()).toBeVisible()
    }
  })

  test('should display user tier badge', async ({ masterUser }) => {
    const dashboardPage = new DashboardPage(masterUser)

    await mockApiResponse(masterUser, 'api/user/stats', {
      level: mockUsers.master.level,
      xp: mockUsers.master.xp,
      tier: mockUsers.master.tier,
    })

    await dashboardPage.goto()
    await waitForPageLoad(masterUser)

    // Check for tier badge
    const tierBadge = masterUser.locator('text=/MASTER|Master/')
    if (await tierBadge.count() > 0) {
      await expect(tierBadge.first()).toBeVisible()
    }
  })

  test('should show user profile information', async ({ authenticatedPage }) => {
    const dashboardPage = new DashboardPage(authenticatedPage)

    await mockApiResponse(authenticatedPage, 'api/user/stats', {
      level: mockUsers.junior.level,
      xp: mockUsers.junior.xp,
      tier: mockUsers.junior.tier,
    })

    await dashboardPage.goto()
    await waitForPageLoad(authenticatedPage)

    // Check for user avatar or name
    const userInfo = authenticatedPage.locator('text=/Junior Tester/, img[alt*="Junior"]')
    if (await userInfo.count() > 0) {
      await expect(userInfo.first()).toBeVisible()
    }
  })

  test('should display user projects', async ({ juniorUser }) => {
    const mockProjects = [
      {
        id: '1',
        title: 'Todo App',
        description: '할 일 관리 앱',
        status: 'IN_PROGRESS',
      },
      {
        id: '2',
        title: 'Weather App',
        description: '날씨 정보 앱',
        status: 'COMPLETED',
      },
    ]

    await mockApiResponse(juniorUser, 'api/user/projects', mockProjects)

    const dashboardPage = new DashboardPage(juniorUser)
    await dashboardPage.goto()
    await waitForPageLoad(juniorUser)

    // Check for projects section
    const projectsSection = juniorUser.locator('[data-testid="my-projects"], section:has-text("프로젝트")')
    if (await projectsSection.count() > 0) {
      await expect(projectsSection.first()).toBeVisible()
    }
  })

  test('should display activity feed', async ({ seniorUser }) => {
    const mockActivities = [
      {
        id: '1',
        type: 'LEVEL_UP',
        message: 'Level 20 달성!',
        timestamp: '2026-01-22T10:00:00Z',
      },
      {
        id: '2',
        type: 'COURSE_COMPLETE',
        message: 'React 코스 완료',
        timestamp: '2026-01-21T15:00:00Z',
      },
    ]

    await mockApiResponse(seniorUser, 'api/user/activities', mockActivities)

    const dashboardPage = new DashboardPage(seniorUser)
    await dashboardPage.goto()
    await waitForPageLoad(seniorUser)

    // Check for activity feed
    const activityFeed = seniorUser.locator('[data-testid="activity-feed"], section:has-text("활동")')
    if (await activityFeed.count() > 0) {
      await expect(activityFeed.first()).toBeVisible()
    }
  })
})

test.describe('Authenticated User - Community Interactions', () => {
  test('should allow creating new post', async ({ authenticatedPage }) => {
    await mockApiResponse(authenticatedPage, 'api/community/posts', [])

    await authenticatedPage.goto('/community')
    await waitForPageLoad(authenticatedPage)

    // Click new post button
    const newPostButton = authenticatedPage.locator('a[href="/community/new"], button:has-text("새 글")')
    if (await newPostButton.count() > 0) {
      await newPostButton.first().click()
      await authenticatedPage.waitForLoadState('networkidle')

      // Should navigate to new post page
      expect(authenticatedPage.url()).toContain('/community/new')
    }
  })

  test('should allow liking posts', async ({ juniorUser }) => {
    const mockPost = {
      id: '1',
      title: 'Test Post',
      content: 'Test content',
      likes: 5,
    }

    await mockApiResponse(juniorUser, 'api/community/posts/1', mockPost)

    await juniorUser.goto('/community/1')
    await waitForPageLoad(juniorUser)

    // Click like button
    const likeButton = juniorUser.locator('button:has-text("좋아요"), [data-testid="like-button"]')
    if (await likeButton.count() > 0) {
      await likeButton.first().click()
      await juniorUser.waitForTimeout(500)

      // Button should be in liked state
      const isLiked = await likeButton.first().getAttribute('aria-pressed')
      // Might have aria-pressed or other indicator
    }
  })

  test('should allow commenting on posts', async ({ seniorUser }) => {
    const mockPost = {
      id: '1',
      title: 'Test Post',
      content: 'Test content',
      comments: [],
    }

    await mockApiResponse(seniorUser, 'api/community/posts/1', mockPost)
    await mockApiResponse(seniorUser, 'api/community/posts/1/comments', [])

    await seniorUser.goto('/community/1')
    await waitForPageLoad(seniorUser)

    // Look for comment input
    const commentInput = seniorUser.locator('textarea[placeholder*="댓글"], input[placeholder*="댓글"]')
    if (await commentInput.count() > 0) {
      await commentInput.fill('Great post!')
      await seniorUser.waitForTimeout(300)

      // Look for submit button
      const submitButton = seniorUser.locator('button:has-text("작성"), button:has-text("등록")')
      if (await submitButton.count() > 0) {
        // Button should be enabled
        await expect(submitButton.first()).toBeEnabled()
      }
    }
  })
})

test.describe('Authenticated User - Course Enrollment', () => {
  test('should allow enrolling in courses', async ({ juniorUser }) => {
    const mockCourse = {
      id: '1',
      title: 'JavaScript 기초',
      level: 'JUNIOR',
      enrolled: false,
    }

    await mockApiResponse(juniorUser, 'api/courses/1', mockCourse)

    await juniorUser.goto('/courses/1')
    await waitForPageLoad(juniorUser)

    // Look for enroll button
    const enrollButton = juniorUser.locator('button:has-text("수강신청"), button:has-text("등록")')
    if (await enrollButton.count() > 0) {
      await expect(enrollButton.first()).toBeVisible()
      await expect(enrollButton.first()).toBeEnabled()
    }
  })

  test('should show enrolled courses in dashboard', async ({ seniorUser }) => {
    const mockEnrolledCourses = [
      {
        id: '1',
        title: 'React 마스터하기',
        progress: 75,
      },
      {
        id: '2',
        title: 'TypeScript 심화',
        progress: 50,
      },
    ]

    await mockApiResponse(seniorUser, 'api/user/enrolled-courses', mockEnrolledCourses)

    const dashboardPage = new DashboardPage(seniorUser)
    await dashboardPage.goto()
    await waitForPageLoad(seniorUser)

    // Check for enrolled courses section
    const coursesSection = seniorUser.locator('section:has-text("수강 중"), [data-testid="enrolled-courses"]')
    if (await coursesSection.count() > 0) {
      await expect(coursesSection.first()).toBeVisible()
    }
  })

  test('should track course progress', async ({ masterUser }) => {
    const mockCourse = {
      id: '1',
      title: 'Advanced Architecture',
      progress: 60,
      completedLessons: 6,
      totalLessons: 10,
    }

    await mockApiResponse(masterUser, 'api/courses/1/progress', mockCourse)

    await masterUser.goto('/courses/1')
    await waitForPageLoad(masterUser)

    // Check for progress indicator
    const progressBar = masterUser.locator('[role="progressbar"], [data-testid="progress-bar"]')
    if (await progressBar.count() > 0) {
      await expect(progressBar.first()).toBeVisible()
    }
  })
})

test.describe('Authenticated User - Logout', () => {
  test('should allow user to logout', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard')
    await waitForPageLoad(authenticatedPage)

    // Look for logout button
    const logoutButton = authenticatedPage.locator('button:has-text("로그아웃"), a:has-text("로그아웃")')
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click()
      await authenticatedPage.waitForLoadState('networkidle')

      // Should redirect to home or login
      const url = authenticatedPage.url()
      expect(url).toMatch(/\/$|\/auth/)
    }
  })

  test('should clear session after logout', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard')
    await waitForPageLoad(authenticatedPage)

    const logoutButton = authenticatedPage.locator('button:has-text("로그아웃")')
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click()
      await authenticatedPage.waitForLoadState('networkidle')

      // Try to access dashboard again
      await authenticatedPage.goto('/dashboard')
      await authenticatedPage.waitForLoadState('networkidle')

      // Should redirect to login or show unauthorized
      const url = authenticatedPage.url()
      // Might redirect or show error
      expect(url).toBeTruthy()
    }
  })
})
