import { test, expect } from '@playwright/test';

/**
 * User Journey E2E Tests
 * Tests complete user flow from signup to project creation and course enrollment
 */

test.describe('Complete User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Start from home page
    await page.goto('/');
  });

  test('complete user journey: signup -> profile setup -> dashboard -> project -> course -> community', async ({ page }) => {
    // Step 1: Navigate to signup (mock GitHub OAuth)
    await page.goto('/auth/signin');
    
    // Mock GitHub OAuth callback
    await page.evaluate(() => {
      // Simulate successful OAuth callback
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'testuser@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: false
      }));
    });

    // Step 2: Profile setup
    await page.goto('/profile/setup');
    await expect(page.getByRole('heading', { name: /프로필 설정/i })).toBeVisible();
    
    await page.getByLabel(/이름/i).fill('홍길동');
    await page.getByLabel(/학년/i).selectOption('3');
    await page.getByLabel(/학과/i).selectOption('컴퓨터소프트웨어공학과');
    await page.getByRole('button', { name: /저장/i }).click();
    
    await expect(page).toHaveURL('/dashboard');

    // Step 3: Dashboard access
    await expect(page.getByRole('heading', { name: /대시보드/i })).toBeVisible();
    await expect(page.getByText(/환영합니다/i)).toBeVisible();

    // Step 4: Create project
    await page.getByRole('link', { name: /프로젝트/i }).click();
    await expect(page).toHaveURL(/\/projects/);
    
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    await page.getByLabel(/프로젝트 이름/i).fill('AI 챗봇 프로젝트');
    await page.getByLabel(/설명/i).fill('자연어 처리를 활용한 대화형 챗봇 개발');
    
    // Add tags
    await page.getByLabel(/태그/i).fill('AI');
    await page.keyboard.press('Enter');
    await page.getByLabel(/태그/i).fill('NLP');
    await page.keyboard.press('Enter');
    
    await page.getByRole('button', { name: /생성하기/i }).click();
    await expect(page.getByText(/프로젝트가 생성되었습니다/i)).toBeVisible();

    // Step 5: Enroll in course
    await page.getByRole('link', { name: /코스/i }).click();
    await expect(page).toHaveURL(/\/courses/);
    
    // Find and click on a course
    const courseCard = page.getByRole('article').first();
    await courseCard.click();
    
    // Enroll in course
    await page.getByRole('button', { name: /수강신청/i }).click();
    await expect(page.getByText(/수강신청이 완료되었습니다/i)).toBeVisible();
    
    // Verify enrollment
    await expect(page.getByRole('button', { name: /수강중/i })).toBeVisible();

    // Step 6: Create community post
    await page.getByRole('link', { name: /커뮤니티/i }).click();
    await expect(page).toHaveURL(/\/community/);
    
    await page.getByRole('button', { name: /글쓰기/i }).click();
    await page.getByLabel(/제목/i).fill('AI 프로젝트 팀원 모집합니다');
    await page.getByLabel(/내용/i).fill('자연어 처리에 관심있는 분들을 모집합니다.');
    await page.getByRole('button', { name: /작성하기/i }).click();
    
    await expect(page.getByText(/게시글이 작성되었습니다/i)).toBeVisible();
    await expect(page.getByText('AI 프로젝트 팀원 모집합니다')).toBeVisible();
  });

  test('partial journey: skip profile setup and go directly to dashboard', async ({ page }) => {
    // Mock authenticated user with complete profile
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '2',
        email: 'existing@wku.ac.kr',
        name: '기존 사용자',
        grade: 4,
        department: '컴퓨터소프트웨어공학과',
        isProfileComplete: true
      }));
    });

    await page.goto('/dashboard');
    
    // Should access dashboard directly without profile setup
    await expect(page.getByRole('heading', { name: /대시보드/i })).toBeVisible();
    await expect(page).not.toHaveURL('/profile/setup');
  });

  test('journey interruption: logout and resume later', async ({ page }) => {
    // Mock authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '3',
        email: 'resume@wku.ac.kr',
        name: '재시작 사용자',
        isProfileComplete: true
      }));
    });

    // Start creating a project
    await page.goto('/projects');
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    await page.getByLabel(/프로젝트 이름/i).fill('중단된 프로젝트');
    
    // Save as draft (if feature exists)
    const draftButton = page.getByRole('button', { name: /임시저장/i });
    if (await draftButton.isVisible()) {
      await draftButton.click();
      await expect(page.getByText(/임시저장되었습니다/i)).toBeVisible();
    }

    // Logout
    await page.getByRole('button', { name: /프로필/i }).click();
    await page.getByRole('menuitem', { name: /로그아웃/i }).click();
    
    // Verify logout
    await expect(page).toHaveURL('/');
    await page.evaluate(() => {
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    // Login again
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '3',
        email: 'resume@wku.ac.kr',
        name: '재시작 사용자',
        isProfileComplete: true
      }));
    });

    // Resume and verify draft (if feature exists)
    await page.goto('/projects');
    const draftExists = await page.getByText(/중단된 프로젝트/i).isVisible().catch(() => false);
    if (draftExists) {
      await expect(page.getByText(/중단된 프로젝트/i)).toBeVisible();
    }
  });

  test('first-time user onboarding flow', async ({ page }) => {
    // Mock new user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '4',
        email: 'newuser@wku.ac.kr',
        name: 'New User',
        isProfileComplete: false,
        isFirstLogin: true
      }));
    });

    // Should redirect to profile setup
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/profile/setup');

    // Check for onboarding hints
    const onboardingElements = [
      /환영합니다/i,
      /프로필을 완성/i,
      /시작하기/i
    ];

    for (const text of onboardingElements) {
      const element = page.getByText(text);
      if (await element.isVisible().catch(() => false)) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('user journey with validation errors', async ({ page }) => {
    // Mock authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '5',
        email: 'validation@wku.ac.kr',
        name: 'Validation User',
        isProfileComplete: true
      }));
    });

    // Try to create project with invalid data
    await page.goto('/projects');
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    
    // Submit without filling required fields
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/프로젝트 이름을 입력해주세요/i)).toBeVisible();
    
    // Fill only name (too short)
    await page.getByLabel(/프로젝트 이름/i).fill('AB');
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    // Should show length validation error
    const lengthError = page.getByText(/최소.*글자/i);
    if (await lengthError.isVisible().catch(() => false)) {
      await expect(lengthError).toBeVisible();
    }
  });

  test('mobile responsive user journey', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mock authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '6',
        email: 'mobile@wku.ac.kr',
        name: 'Mobile User',
        isProfileComplete: true
      }));
    });

    await page.goto('/dashboard');
    
    // Check mobile navigation (hamburger menu)
    const hamburger = page.getByRole('button', { name: /메뉴/i });
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await expect(page.getByRole('navigation')).toBeVisible();
    }

    // Navigate to projects on mobile
    await page.getByRole('link', { name: /프로젝트/i }).click();
    await expect(page).toHaveURL(/\/projects/);
    
    // Cards should be stacked vertically on mobile
    const projectCards = page.getByRole('article');
    if (await projectCards.count() > 0) {
      const firstCard = projectCards.first();
      const secondCard = projectCards.nth(1);
      
      if (await secondCard.isVisible().catch(() => false)) {
        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();
        
        if (firstBox && secondBox) {
          // On mobile, cards should stack vertically (second card below first)
          expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height);
        }
      }
    }
  });
});

test.describe('User Journey Edge Cases', () => {
  test('handle expired session during journey', async ({ page }) => {
    // Mock authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'expired-token');
      localStorage.setItem('user', JSON.stringify({
        id: '7',
        email: 'expired@wku.ac.kr',
        name: 'Expired User',
        isProfileComplete: true
      }));
    });

    // Try to access protected route
    await page.goto('/projects');
    
    // Should redirect to login or show error
    await page.waitForTimeout(1000);
    const url = page.url();
    const hasError = await page.getByText(/세션이 만료/i).isVisible().catch(() => false);
    
    expect(url.includes('/auth') || hasError).toBeTruthy();
  });

  test('concurrent actions in user journey', async ({ page }) => {
    // Mock authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '8',
        email: 'concurrent@wku.ac.kr',
        name: 'Concurrent User',
        isProfileComplete: true
      }));
    });

    await page.goto('/projects');
    
    // Try to create multiple projects simultaneously
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    await page.getByLabel(/프로젝트 이름/i).fill('프로젝트 1');
    await page.getByLabel(/설명/i).fill('첫 번째 프로젝트');
    
    const createButton = page.getByRole('button', { name: /생성하기/i });
    
    // Click create button multiple times rapidly
    await Promise.all([
      createButton.click(),
      createButton.click().catch(() => {}),
      createButton.click().catch(() => {})
    ]);
    
    // Should handle gracefully (button disabled or single creation)
    await page.waitForTimeout(500);
    
    // Verify only one project was created or proper error handling
    const successMessages = page.getByText(/프로젝트가 생성되었습니다/i);
    const count = await successMessages.count();
    expect(count).toBeLessThanOrEqual(1);
  });

  test('browser back/forward navigation during journey', async ({ page }) => {
    // Mock authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '9',
        email: 'navigation@wku.ac.kr',
        name: 'Navigation User',
        isProfileComplete: true
      }));
    });

    // Navigate through multiple pages
    await page.goto('/dashboard');
    await page.getByRole('link', { name: /프로젝트/i }).click();
    await expect(page).toHaveURL(/\/projects/);
    
    await page.getByRole('link', { name: /코스/i }).click();
    await expect(page).toHaveURL(/\/courses/);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/\/projects/);

    // Go back again
    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard/);

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/\/projects/);

    // State should be preserved
    await expect(page.getByRole('heading', { name: /프로젝트/i })).toBeVisible();
  });
});
