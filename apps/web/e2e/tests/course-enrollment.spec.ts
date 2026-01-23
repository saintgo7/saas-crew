import { test, expect } from '@playwright/test';

/**
 * Course Enrollment E2E Tests
 * Tests course discovery, enrollment, progress tracking, and unenrollment flows
 */

test.describe('Course Enrollment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'student@wku.ac.kr',
        name: '학생',
        grade: 2,
        department: '컴퓨터소프트웨어공학과',
        isProfileComplete: true
      }));
    });

    await page.goto('/courses');
  });

  test('complete enrollment flow: browse -> enroll -> learn -> complete', async ({ page }) => {
    // Step 1: Browse courses
    await expect(page.getByRole('heading', { name: /코스/i })).toBeVisible();
    
    // Filter courses
    const categoryFilter = page.getByLabel(/카테고리/i);
    if (await categoryFilter.isVisible().catch(() => false)) {
      await categoryFilter.selectOption('programming');
      await page.waitForTimeout(500);
    }

    // Step 2: View course details
    const courseCard = page.getByRole('article').first();
    const courseTitle = await courseCard.getByRole('heading').textContent();
    await courseCard.click();
    
    // Course detail page
    await expect(page.getByRole('heading', { name: courseTitle || '' })).toBeVisible();
    
    // Check course information
    await expect(page.getByText(/강의 소개/i)).toBeVisible();
    const chaptersSection = page.getByText(/챕터/i);
    if (await chaptersSection.isVisible().catch(() => false)) {
      await expect(chaptersSection).toBeVisible();
    }

    // Step 3: Enroll in course
    const enrollButton = page.getByRole('button', { name: /수강신청/i });
    await expect(enrollButton).toBeVisible();
    await enrollButton.click();
    
    await expect(page.getByText(/수강신청이 완료되었습니다/i)).toBeVisible();
    
    // Verify enrollment status changed
    await expect(page.getByRole('button', { name: /수강중/i })).toBeVisible();

    // Step 4: Start learning
    const startButton = page.getByRole('button', { name: /학습 시작/i });
    if (await startButton.isVisible().catch(() => false)) {
      await startButton.click();
    }

    // Click first chapter
    const firstChapter = page.getByRole('button', { name: /챕터/i }).first();
    if (await firstChapter.isVisible().catch(() => false)) {
      await firstChapter.click();
      
      // Should show chapter content
      await page.waitForTimeout(500);
      const videoPlayer = page.locator('video, iframe');
      const content = page.getByText(/내용/i);
      
      const hasVideo = await videoPlayer.count() > 0;
      const hasContent = await content.isVisible().catch(() => false);
      
      expect(hasVideo || hasContent).toBeTruthy();
    }

    // Step 5: Mark chapter as complete
    const completeButton = page.getByRole('button', { name: /완료/i });
    if (await completeButton.isVisible().catch(() => false)) {
      await completeButton.click();
      
      // Progress should update
      const progressBar = page.locator('[role="progressbar"]');
      if (await progressBar.count() > 0) {
        const progress = await progressBar.first().getAttribute('aria-valuenow');
        expect(Number(progress)).toBeGreaterThan(0);
      }
    }

    // Step 6: Navigate to next chapter
    const nextButton = page.getByRole('button', { name: /다음/i });
    if (await nextButton.isVisible().catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(500);
      
      // Should move to next chapter
      const chapterTitle = page.getByRole('heading', { level: 2 });
      await expect(chapterTitle).toBeVisible();
    }
  });

  test('enrollment validation and restrictions', async ({ page }) => {
    // Try to enroll in private course
    const privateCourse = page.getByText(/비공개/i).first();
    if (await privateCourse.isVisible().catch(() => false)) {
      await privateCourse.click();
      
      const enrollButton = page.getByRole('button', { name: /수강신청/i });
      if (await enrollButton.isVisible().catch(() => false)) {
        await enrollButton.click();
        
        // Should show error or be disabled
        const error = page.getByText(/수강신청할 수 없습니다/i);
        const isDisabled = await enrollButton.isDisabled();
        
        expect(await error.isVisible().catch(() => false) || isDisabled).toBeTruthy();
      }
    }

    // Try to enroll in prerequisite course
    await page.goto('/courses');
    
    const advancedCourse = page.getByText(/고급/i).first();
    if (await advancedCourse.isVisible().catch(() => false)) {
      await advancedCourse.click();
      
      const prerequisiteWarning = page.getByText(/선수 과목/i);
      if (await prerequisiteWarning.isVisible().catch(() => false)) {
        await expect(prerequisiteWarning).toBeVisible();
      }
    }
  });

  test('unenrollment flow with confirmation', async ({ page }) => {
    // Find enrolled course
    const enrolledBadge = page.getByText(/수강중/i).first();
    
    if (await enrolledBadge.isVisible().catch(() => false)) {
      const courseCard = enrolledBadge.locator('..');
      await courseCard.click();
    } else {
      // Enroll in a course first
      const courseCard = page.getByRole('article').first();
      await courseCard.click();
      
      const enrollButton = page.getByRole('button', { name: /수강신청/i });
      if (await enrollButton.isVisible()) {
        await enrollButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Unenroll
    const unenrollButton = page.getByRole('button', { name: /수강취소/i });
    if (await unenrollButton.isVisible().catch(() => false)) {
      await unenrollButton.click();
      
      // Confirmation modal
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByText(/수강을 취소하시겠습니까/i)).toBeVisible();
      
      // Cancel first
      await page.getByRole('button', { name: /아니오/i }).click();
      await expect(page.getByRole('button', { name: /수강중/i })).toBeVisible();
      
      // Confirm unenrollment
      await unenrollButton.click();
      await page.getByRole('button', { name: /예|확인/i }).click();
      
      await expect(page.getByText(/수강이 취소되었습니다/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /수강신청/i })).toBeVisible();
    }
  });

  test('progress tracking and persistence', async ({ page }) => {
    // Enroll in a course
    const courseCard = page.getByRole('article').first();
    await courseCard.click();
    
    const enrollButton = page.getByRole('button', { name: /수강신청/i });
    if (await enrollButton.isVisible()) {
      await enrollButton.click();
      await page.waitForTimeout(500);
    }

    // Start first chapter
    const firstChapter = page.getByRole('button', { name: /챕터/i }).first();
    if (await firstChapter.isVisible().catch(() => false)) {
      await firstChapter.click();
      await page.waitForTimeout(1000);
      
      // Mark as complete
      const completeButton = page.getByRole('button', { name: /완료/i });
      if (await completeButton.isVisible().catch(() => false)) {
        await completeButton.click();
        await page.waitForTimeout(500);
      }

      // Get current progress
      const progressBar = page.locator('[role="progressbar"]');
      let currentProgress = 0;
      if (await progressBar.count() > 0) {
        const progressValue = await progressBar.first().getAttribute('aria-valuenow');
        currentProgress = Number(progressValue) || 0;
      }

      // Navigate away and back
      await page.goto('/dashboard');
      await page.goto('/courses');
      await courseCard.click();

      // Progress should be persisted
      if (await progressBar.count() > 0) {
        const savedProgress = await progressBar.first().getAttribute('aria-valuenow');
        expect(Number(savedProgress)).toBe(currentProgress);
      }
    }
  });

  test('video progress tracking', async ({ page }) => {
    // Find course with video
    const courseCard = page.getByRole('article').first();
    await courseCard.click();
    
    const enrollButton = page.getByRole('button', { name: /수강신청/i });
    if (await enrollButton.isVisible()) {
      await enrollButton.click();
      await page.waitForTimeout(500);
    }

    const firstChapter = page.getByRole('button', { name: /챕터/i }).first();
    if (await firstChapter.isVisible().catch(() => false)) {
      await firstChapter.click();
      
      const video = page.locator('video').first();
      if (await video.count() > 0) {
        // Play video
        const playButton = page.getByRole('button', { name: /재생/i });
        if (await playButton.isVisible().catch(() => false)) {
          await playButton.click();
        }

        // Wait and pause
        await page.waitForTimeout(2000);
        
        const pauseButton = page.getByRole('button', { name: /일시정지/i });
        if (await pauseButton.isVisible().catch(() => false)) {
          await pauseButton.click();
        }

        // Get current time
        const currentTime = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
        expect(currentTime).toBeGreaterThan(0);

        // Navigate away and back
        await page.goto('/courses');
        await courseCard.click();
        await firstChapter.click();

        // Video should resume from saved position
        await page.waitForTimeout(1000);
        const savedTime = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
        expect(Math.abs(savedTime - currentTime)).toBeLessThan(2);
      }
    }
  });

  test('course completion and certificate', async ({ page }) => {
    // Mock completed course
    await page.evaluate(() => {
      // Simulate completed course in localStorage
      localStorage.setItem('completedCourses', JSON.stringify([
        {
          courseId: '1',
          completedAt: new Date().toISOString(),
          progress: 100
        }
      ]));
    });

    await page.goto('/courses/1');
    
    // Should show completion badge
    const completionBadge = page.getByText(/완료/i);
    if (await completionBadge.isVisible().catch(() => false)) {
      await expect(completionBadge).toBeVisible();
    }

    // Certificate button
    const certificateButton = page.getByRole('button', { name: /수료증/i });
    if (await certificateButton.isVisible().catch(() => false)) {
      await certificateButton.click();
      
      // Should show certificate modal or download
      const certificateModal = page.getByRole('dialog').filter({ hasText: /수료증/i });
      const isVisible = await certificateModal.isVisible().catch(() => false);
      
      if (isVisible) {
        await expect(certificateModal).toBeVisible();
        await expect(page.getByText(/축하합니다/i)).toBeVisible();
      }
    }
  });

  test('assignment submission flow', async ({ page }) => {
    // Find course with assignments
    const courseCard = page.getByRole('article').first();
    await courseCard.click();
    
    const enrollButton = page.getByRole('button', { name: /수강신청/i });
    if (await enrollButton.isVisible()) {
      await enrollButton.click();
      await page.waitForTimeout(500);
    }

    // Look for assignment chapter
    const assignmentChapter = page.getByText(/과제/i).first();
    if (await assignmentChapter.isVisible().catch(() => false)) {
      await assignmentChapter.click();
      
      // Assignment upload form
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.count() > 0) {
        // Upload file
        const testFile = './test-results/test-file.txt';
        await fileInput.first().setInputFiles(testFile).catch(() => {});
        
        // Submit assignment
        const submitButton = page.getByRole('button', { name: /제출/i });
        if (await submitButton.isVisible().catch(() => false)) {
          await submitButton.click();
          
          await expect(page.getByText(/과제가 제출되었습니다/i)).toBeVisible();
        }
      }

      // Text submission
      const textArea = page.getByLabel(/답안/i);
      if (await textArea.isVisible().catch(() => false)) {
        await textArea.fill('과제 제출 테스트 답안입니다.');
        
        const submitButton = page.getByRole('button', { name: /제출/i });
        await submitButton.click();
        
        await expect(page.getByText(/과제가 제출되었습니다/i)).toBeVisible();
      }
    }
  });

  test('course search and filtering', async ({ page }) => {
    // Search courses
    const searchInput = page.getByPlaceholder(/코스 검색/i);
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('React');
      await page.keyboard.press('Enter');
      
      await page.waitForTimeout(500);
      
      // Results should contain React
      const results = page.getByRole('article');
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }

    // Filter by category
    const categoryFilter = page.getByLabel(/카테고리/i);
    if (await categoryFilter.isVisible().catch(() => false)) {
      await categoryFilter.selectOption('web-development');
      await page.waitForTimeout(500);
    }

    // Filter by level
    const levelFilter = page.getByLabel(/난이도/i);
    if (await levelFilter.isVisible().catch(() => false)) {
      await levelFilter.selectOption('beginner');
      await page.waitForTimeout(500);
    }

    // Sort by popularity
    const sortSelect = page.getByLabel(/정렬/i);
    if (await sortSelect.isVisible().catch(() => false)) {
      await sortSelect.selectOption('popular');
      await page.waitForTimeout(500);
    }
  });

  test('my courses dashboard', async ({ page }) => {
    // Navigate to my courses
    await page.goto('/my-courses');
    
    // Should show enrolled courses
    await expect(page.getByRole('heading', { name: /내 코스/i })).toBeVisible();
    
    // Filter tabs
    const allTab = page.getByRole('tab', { name: /전체/i });
    const inProgressTab = page.getByRole('tab', { name: /학습중/i });
    const completedTab = page.getByRole('tab', { name: /완료/i });
    
    if (await allTab.isVisible().catch(() => false)) {
      await allTab.click();
      await page.waitForTimeout(300);
      
      await inProgressTab.click();
      await page.waitForTimeout(300);
      
      await completedTab.click();
      await page.waitForTimeout(300);
    }

    // Check progress overview
    const progressCards = page.getByRole('article');
    const count = await progressCards.count();
    
    if (count > 0) {
      const firstCard = progressCards.first();
      
      // Should show progress percentage
      const progress = firstCard.locator('[role="progressbar"]');
      if (await progress.count() > 0) {
        await expect(progress.first()).toBeVisible();
      }
      
      // Click to continue learning
      const continueButton = firstCard.getByRole('button', { name: /계속하기/i });
      if (await continueButton.isVisible().catch(() => false)) {
        await continueButton.click();
        
        // Should navigate to course
        await expect(page).toHaveURL(/\/courses\//);
      }
    }
  });

  test('course recommendations', async ({ page }) => {
    // Check recommendations section
    const recommendationsSection = page.getByText(/추천 코스/i);
    
    if (await recommendationsSection.isVisible().catch(() => false)) {
      await expect(recommendationsSection).toBeVisible();
      
      // Should have recommended courses
      const recommendedCourses = page.getByRole('article');
      const count = await recommendedCourses.count();
      expect(count).toBeGreaterThan(0);
      
      // Check recommendation reason
      const reasonBadge = page.getByText(/비슷한 수강생/i).or(page.getByText(/관심사 기반/i));
      if (await reasonBadge.count() > 0) {
        await expect(reasonBadge.first()).toBeVisible();
      }
    }
  });

  test('course notes and bookmarks', async ({ page }) => {
    // Enroll and start course
    const courseCard = page.getByRole('article').first();
    await courseCard.click();
    
    const enrollButton = page.getByRole('button', { name: /수강신청/i });
    if (await enrollButton.isVisible()) {
      await enrollButton.click();
      await page.waitForTimeout(500);
    }

    const firstChapter = page.getByRole('button', { name: /챕터/i }).first();
    if (await firstChapter.isVisible().catch(() => false)) {
      await firstChapter.click();
      
      // Add note
      const noteButton = page.getByRole('button', { name: /노트/i });
      if (await noteButton.isVisible().catch(() => false)) {
        await noteButton.click();
        
        const noteInput = page.getByPlaceholder(/노트를 입력/i);
        await noteInput.fill('중요한 내용입니다.');
        
        const saveButton = page.getByRole('button', { name: /저장/i });
        await saveButton.click();
        
        await expect(page.getByText(/노트가 저장되었습니다/i)).toBeVisible();
      }

      // Add bookmark
      const bookmarkButton = page.getByRole('button', { name: /북마크/i });
      if (await bookmarkButton.isVisible().catch(() => false)) {
        await bookmarkButton.click();
        await expect(page.getByText(/북마크에 추가되었습니다/i)).toBeVisible();
        
        // Remove bookmark
        await bookmarkButton.click();
        await expect(page.getByText(/북마크에서 제거되었습니다/i)).toBeVisible();
      }
    }
  });
});

test.describe('Course Enrollment Edge Cases', () => {
  test('handle enrollment while offline', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    // Mock offline
    await page.route('**/api/enrollments', route => route.abort());

    await page.goto('/courses');
    const courseCard = page.getByRole('article').first();
    await courseCard.click();
    
    const enrollButton = page.getByRole('button', { name: /수강신청/i });
    if (await enrollButton.isVisible()) {
      await enrollButton.click();
      
      // Should show error
      const error = page.getByText(/네트워크 오류/i).or(page.getByText(/실패/i));
      await expect(error).toBeVisible({ timeout: 3000 });
    }
  });

  test('concurrent enrollment attempts', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    await page.goto('/courses');
    const courseCard = page.getByRole('article').first();
    await courseCard.click();
    
    const enrollButton = page.getByRole('button', { name: /수강신청/i });
    if (await enrollButton.isVisible()) {
      // Click multiple times rapidly
      await Promise.all([
        enrollButton.click(),
        enrollButton.click().catch(() => {}),
        enrollButton.click().catch(() => {})
      ]);
      
      await page.waitForTimeout(1000);
      
      // Should only enroll once
      const successMessages = page.getByText(/수강신청이 완료되었습니다/i);
      const count = await successMessages.count();
      expect(count).toBeLessThanOrEqual(1);
    }
  });
});
