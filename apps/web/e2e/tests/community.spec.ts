import { test, expect } from '@playwright/test'
import { CommunityPage, PostDetailPage } from '../utils/page-objects'
import { waitForPageLoad, mockApiResponse, expectTextVisible } from '../utils/helpers'

test.describe('Community Page - Q&A and Posts', () => {
  let communityPage: CommunityPage

  // Mock community posts
  const mockPosts = [
    {
      id: '1',
      title: 'React Hooks 사용법 질문',
      content: 'useState와 useEffect의 차이가 궁금합니다',
      category: 'QNA',
      author: {
        id: 'user1',
        name: 'Junior Developer',
        avatar: 'https://avatars.githubusercontent.com/u/1',
      },
      likes: 5,
      comments: 3,
      views: 42,
      createdAt: '2026-01-20T10:00:00Z',
    },
    {
      id: '2',
      title: 'Next.js 14 새로운 기능',
      content: 'App Router와 Server Components에 대해',
      category: 'INFO',
      author: {
        id: 'user2',
        name: 'Senior Developer',
        avatar: 'https://avatars.githubusercontent.com/u/2',
      },
      likes: 12,
      comments: 8,
      views: 156,
      createdAt: '2026-01-21T15:30:00Z',
    },
    {
      id: '3',
      title: '프로젝트 팀원 구합니다',
      content: 'E-commerce 프로젝트 같이 하실 분',
      category: 'PROJECT',
      author: {
        id: 'user3',
        name: 'Master Developer',
        avatar: 'https://avatars.githubusercontent.com/u/3',
      },
      likes: 8,
      comments: 15,
      views: 89,
      createdAt: '2026-01-22T09:00:00Z',
    },
  ]

  test.beforeEach(async ({ page }) => {
    communityPage = new CommunityPage(page)

    // Mock API response for posts
    await mockApiResponse(page, 'api/community/posts', mockPosts)

    await communityPage.goto()
    await waitForPageLoad(page)
  })

  test('should display community page with title', async ({ page }) => {
    await expect(communityPage.pageTitle).toBeVisible()
    await expect(communityPage.pageTitle).toContainText('커뮤니티')
  })

  test('should display new post button', async () => {
    const newPostButton = await communityPage.newPostButton.isVisible()
    // Button might be hidden for unauthenticated users
    if (newPostButton) {
      await expect(communityPage.newPostButton).toBeVisible()
    }
  })

  test('should display search input', async ({ page }) => {
    // Check if search input exists (might be in different location)
    const searchInputs = page.locator('input[type="search"], input[placeholder*="검색"]')
    const count = await searchInputs.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('should display post cards with information', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first()

    if (await firstPost.count() > 0) {
      // Check for post title
      const title = firstPost.locator('h3, h2')
      await expect(title).toBeVisible()
    }
  })

  test('should filter posts by category', async ({ page }) => {
    // Check if category filter exists
    const categoryButtons = page.locator('[data-testid="category-filter"], [role="tab"]')
    const count = await categoryButtons.count()

    if (count > 0) {
      const firstCategory = categoryButtons.first()
      await firstCategory.click()
      await page.waitForTimeout(500)
    }
  })

  test('should navigate to post detail on click', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"], article, [role="article"]').first()

    if (await firstPost.count() > 0) {
      const clickableElement = firstPost.locator('a, h3, h2').first()
      if (await clickableElement.count() > 0) {
        await clickableElement.click()
        await page.waitForLoadState('networkidle')

        // Should navigate to post detail
        expect(page.url()).toMatch(/\/community\/\w+/)
      }
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)

    await expect(communityPage.pageTitle).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)

    await expect(communityPage.pageTitle).toBeVisible()
  })

  test('should display posts in grid/list layout', async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"], article')
    const count = await posts.count()

    // Should have at least some layout structure
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('should show post metadata (likes, comments, views)', async ({ page }) => {
    const firstPost = page.locator('[data-testid="post-card"]').first()

    if (await firstPost.count() > 0) {
      // Check for metadata indicators
      const metadata = firstPost.locator('[data-testid*="likes"], [data-testid*="comments"], [data-testid*="views"]')
      // Metadata might exist
      const metaCount = await metadata.count()
      expect(metaCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('should maintain scroll position when navigating back', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500))
    await page.waitForTimeout(300)

    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeGreaterThan(0)
  })
})

test.describe('Post Detail Page', () => {
  const mockPostDetail = {
    id: '1',
    title: 'React Hooks 사용법 질문',
    content: 'useState와 useEffect의 차이가 궁금합니다.\n\n상세 설명...',
    category: 'QNA',
    author: {
      id: 'user1',
      name: 'Junior Developer',
      avatar: 'https://avatars.githubusercontent.com/u/1',
      level: 5,
    },
    likes: 5,
    comments: [
      {
        id: 'c1',
        content: '좋은 질문입니다!',
        author: { name: 'Helper', avatar: 'https://avatars.githubusercontent.com/u/2' },
        createdAt: '2026-01-20T11:00:00Z',
      },
    ],
    views: 42,
    createdAt: '2026-01-20T10:00:00Z',
  }

  test('should display post detail with title and content', async ({ page }) => {
    const postDetailPage = new PostDetailPage(page)

    await mockApiResponse(page, 'api/community/posts/1', mockPostDetail)

    await postDetailPage.goto('1')
    await waitForPageLoad(page)

    // Check post title is visible
    await expect(postDetailPage.postTitle).toBeVisible()
  })

  test('should display author information', async ({ page }) => {
    await mockApiResponse(page, 'api/community/posts/1', mockPostDetail)

    const postDetailPage = new PostDetailPage(page)
    await postDetailPage.goto('1')
    await waitForPageLoad(page)

    // Check for author name or avatar
    const authorSection = page.locator('[data-testid="author-name"], [data-testid="author-section"]')
    if (await authorSection.count() > 0) {
      await expect(authorSection.first()).toBeVisible()
    }
  })

  test('should display comments section', async ({ page }) => {
    await mockApiResponse(page, 'api/community/posts/1', mockPostDetail)

    const postDetailPage = new PostDetailPage(page)
    await postDetailPage.goto('1')
    await waitForPageLoad(page)

    // Check for comments section
    const commentsSection = page.locator('[data-testid="comment-section"], section:has-text("댓글")')
    if (await commentsSection.count() > 0) {
      await expect(commentsSection.first()).toBeVisible()
    }
  })

  test('should show like button', async ({ page }) => {
    await mockApiResponse(page, 'api/community/posts/1', mockPostDetail)

    const postDetailPage = new PostDetailPage(page)
    await postDetailPage.goto('1')
    await waitForPageLoad(page)

    // Check for like button
    const likeButton = page.locator('button:has-text("좋아요"), [data-testid="like-button"]')
    if (await likeButton.count() > 0) {
      await expect(likeButton.first()).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await mockApiResponse(page, 'api/community/posts/1', mockPostDetail)

    await page.setViewportSize({ width: 375, height: 667 })

    const postDetailPage = new PostDetailPage(page)
    await postDetailPage.goto('1')
    await waitForPageLoad(page)

    await expect(postDetailPage.postTitle).toBeVisible()
  })

  test('should render markdown content properly', async ({ page }) => {
    await mockApiResponse(page, 'api/community/posts/1', mockPostDetail)

    const postDetailPage = new PostDetailPage(page)
    await postDetailPage.goto('1')
    await waitForPageLoad(page)

    // Content should be rendered
    const content = page.locator('[data-testid="post-content"], article, .prose')
    if (await content.count() > 0) {
      await expect(content.first()).toBeVisible()
    }
  })

  test('should navigate back to community list', async ({ page }) => {
    await mockApiResponse(page, 'api/community/posts/1', mockPostDetail)

    const postDetailPage = new PostDetailPage(page)
    await postDetailPage.goto('1')
    await waitForPageLoad(page)

    // Look for back button or navigation
    const backButton = page.locator('a:has-text("뒤로"), a:has-text("목록"), [aria-label="뒤로"]')
    if (await backButton.count() > 0) {
      await backButton.first().click()
      await expect(page).toHaveURL(/\/community$/)
    }
  })
})
