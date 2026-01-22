import { Page, Locator } from '@playwright/test'

/**
 * Base Page Object with common functionality
 */
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path)
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle')
  }
}

/**
 * Home Page Object
 */
export class HomePage extends BasePage {
  readonly heroTitle: Locator
  readonly startButton: Locator
  readonly browseProjectsButton: Locator
  readonly juniorCard: Locator
  readonly seniorCard: Locator
  readonly masterCard: Locator
  readonly footer: Locator

  constructor(page: Page) {
    super(page)
    this.heroTitle = page.getByRole('heading', { name: /함께 성장하는/ })
    this.startButton = page.getByRole('link', { name: /GitHub로 시작하기/ })
    this.browseProjectsButton = page.getByRole('link', { name: /프로젝트 둘러보기/ })
    this.juniorCard = page.locator('text=Junior').locator('..')
    this.seniorCard = page.locator('text=Senior').locator('..')
    this.masterCard = page.locator('text=Master').locator('..')
    this.footer = page.locator('footer')
  }

  async goto() {
    await super.goto('/')
  }

  async clickStartButton() {
    await this.startButton.click()
  }

  async clickBrowseProjects() {
    await this.browseProjectsButton.click()
  }

  async isLevelCardVisible(level: 'junior' | 'senior' | 'master'): Promise<boolean> {
    const card = level === 'junior' ? this.juniorCard : level === 'senior' ? this.seniorCard : this.masterCard
    return await card.isVisible()
  }
}

/**
 * Courses Page Object
 */
export class CoursesPage extends BasePage {
  readonly pageTitle: Locator
  readonly filterButtons: {
    all: Locator
    junior: Locator
    senior: Locator
    master: Locator
  }
  readonly courseCards: Locator
  readonly searchInput: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.getByRole('heading', { name: /학습 코스/ })
    this.filterButtons = {
      all: page.getByRole('button', { name: /전체/ }),
      junior: page.getByRole('button', { name: /Junior/ }),
      senior: page.getByRole('button', { name: /Senior/ }),
      master: page.getByRole('button', { name: /Master/ }),
    }
    this.courseCards = page.locator('[data-testid="course-card"]')
    this.searchInput = page.getByPlaceholder(/검색/)
  }

  async goto() {
    await super.goto('/courses')
  }

  async filterByLevel(level: 'all' | 'junior' | 'senior' | 'master') {
    await this.filterButtons[level].click()
    await this.page.waitForTimeout(500) // Wait for filter animation
  }

  async searchCourses(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForTimeout(500) // Wait for search results
  }

  async getCourseCount(): Promise<number> {
    return await this.courseCards.count()
  }

  async clickCourse(index: number) {
    await this.courseCards.nth(index).click()
  }

  async getCourseTitles(): Promise<string[]> {
    const titles: string[] = []
    const count = await this.courseCards.count()
    for (let i = 0; i < count; i++) {
      const title = await this.courseCards.nth(i).locator('h3').textContent()
      if (title) titles.push(title)
    }
    return titles
  }
}

/**
 * Course Detail Page Object
 */
export class CourseDetailPage extends BasePage {
  readonly courseTitle: Locator
  readonly courseDescription: Locator
  readonly levelBadge: Locator
  readonly enrollButton: Locator
  readonly backButton: Locator

  constructor(page: Page) {
    super(page)
    this.courseTitle = page.locator('h1')
    this.courseDescription = page.locator('[data-testid="course-description"]')
    this.levelBadge = page.locator('[data-testid="level-badge"]')
    this.enrollButton = page.getByRole('button', { name: /수강신청/ })
    this.backButton = page.getByRole('link', { name: /뒤로/ })
  }

  async goto(courseId: string) {
    await super.goto(`/courses/${courseId}`)
  }

  async enrollInCourse() {
    await this.enrollButton.click()
  }

  async goBack() {
    await this.backButton.click()
  }
}

/**
 * Community Page Object
 */
export class CommunityPage extends BasePage {
  readonly pageTitle: Locator
  readonly newPostButton: Locator
  readonly searchInput: Locator
  readonly categoryFilter: Locator
  readonly postCards: Locator
  readonly sortDropdown: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.getByRole('heading', { name: /커뮤니티/ })
    this.newPostButton = page.getByRole('link', { name: /새 글 작성/ })
    this.searchInput = page.getByPlaceholder(/검색/)
    this.categoryFilter = page.locator('[data-testid="category-filter"]')
    this.postCards = page.locator('[data-testid="post-card"]')
    this.sortDropdown = page.locator('[data-testid="sort-dropdown"]')
  }

  async goto() {
    await super.goto('/community')
  }

  async searchPosts(query: string) {
    await this.searchInput.fill(query)
    await this.page.keyboard.press('Enter')
    await this.page.waitForTimeout(500)
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.click()
    await this.page.getByRole('option', { name: category }).click()
  }

  async sortBy(option: 'latest' | 'popular' | 'views') {
    await this.sortDropdown.click()
    await this.page.getByRole('option', { name: option }).click()
  }

  async getPostCount(): Promise<number> {
    return await this.postCards.count()
  }

  async clickPost(index: number) {
    await this.postCards.nth(index).click()
  }

  async createNewPost() {
    await this.newPostButton.click()
  }

  async getPostTitles(): Promise<string[]> {
    const titles: string[] = []
    const count = await this.postCards.count()
    for (let i = 0; i < count; i++) {
      const title = await this.postCards.nth(i).locator('h3').textContent()
      if (title) titles.push(title)
    }
    return titles
  }
}

/**
 * Post Detail Page Object
 */
export class PostDetailPage extends BasePage {
  readonly postTitle: Locator
  readonly postContent: Locator
  readonly authorName: Locator
  readonly likeButton: Locator
  readonly commentSection: Locator
  readonly commentInput: Locator
  readonly submitCommentButton: Locator

  constructor(page: Page) {
    super(page)
    this.postTitle = page.locator('h1')
    this.postContent = page.locator('[data-testid="post-content"]')
    this.authorName = page.locator('[data-testid="author-name"]')
    this.likeButton = page.getByRole('button', { name: /좋아요/ })
    this.commentSection = page.locator('[data-testid="comment-section"]')
    this.commentInput = page.getByPlaceholder(/댓글을 입력/)
    this.submitCommentButton = page.getByRole('button', { name: /댓글 작성/ })
  }

  async goto(postId: string) {
    await super.goto(`/community/${postId}`)
  }

  async likePost() {
    await this.likeButton.click()
  }

  async addComment(text: string) {
    await this.commentInput.fill(text)
    await this.submitCommentButton.click()
  }
}

/**
 * Dashboard Page Object
 */
export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator
  readonly levelProgress: Locator
  readonly xpDisplay: Locator
  readonly myProjects: Locator
  readonly activityFeed: Locator

  constructor(page: Page) {
    super(page)
    this.welcomeMessage = page.getByRole('heading', { name: /대시보드/ })
    this.levelProgress = page.locator('[data-testid="level-progress"]')
    this.xpDisplay = page.locator('[data-testid="xp-display"]')
    this.myProjects = page.locator('[data-testid="my-projects"]')
    this.activityFeed = page.locator('[data-testid="activity-feed"]')
  }

  async goto() {
    await super.goto('/dashboard')
  }

  async getLevel(): Promise<string> {
    return (await this.levelProgress.textContent()) || ''
  }

  async getXP(): Promise<string> {
    return (await this.xpDisplay.textContent()) || ''
  }
}
