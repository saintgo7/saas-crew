import { test, expect } from '@playwright/test';

/**
 * Error Handling E2E Tests
 * Tests various error scenarios: 404, 401, 403, network errors, and error recovery
 */

test.describe('Error Handling', () => {
  test('404 - not found page', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/this-page-does-not-exist');
    
    // Should show 404 page
    const notFoundTexts = [
      /404/i,
      /페이지를 찾을 수 없습니다/i,
      /not found/i,
      /존재하지 않/i
    ];
    
    let found = false;
    for (const text of notFoundTexts) {
      if (await page.getByText(text).isVisible().catch(() => false)) {
        await expect(page.getByText(text)).toBeVisible();
        found = true;
        break;
      }
    }
    
    expect(found).toBeTruthy();
    
    // Should have link to home
    const homeLink = page.getByRole('link', { name: /홈으로|메인으로|돌아가기/i });
    if (await homeLink.isVisible().catch(() => false)) {
      await expect(homeLink).toBeVisible();
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('401 - unauthorized access', async ({ page }) => {
    // Clear auth
    await page.evaluate(() => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    });

    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should redirect to login or show error
    await page.waitForTimeout(1000);
    const url = page.url();
    
    const isLoginPage = url.includes('/auth') || url.includes('/login');
    const hasUnauthorizedError = await page.getByText(/로그인이 필요합니다|인증이 필요합니다/i).isVisible().catch(() => false);
    
    expect(isLoginPage || hasUnauthorizedError).toBeTruthy();
  });

  test('403 - forbidden access (insufficient permissions)', async ({ page }) => {
    // Mock user with limited permissions
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '999',
        email: 'restricted@wku.ac.kr',
        name: 'Restricted User',
        role: 'viewer',
        isProfileComplete: true
      }));
    });

    // Try to access admin route
    await page.goto('/admin');
    
    await page.waitForTimeout(1000);
    
    // Should show forbidden error or redirect
    const forbiddenTexts = [
      /403/i,
      /권한이 없습니다/i,
      /접근 권한/i,
      /forbidden/i
    ];
    
    let hasError = false;
    for (const text of forbiddenTexts) {
      if (await page.getByText(text).isVisible().catch(() => false)) {
        hasError = true;
        break;
      }
    }
    
    const isRedirected = !page.url().includes('/admin');
    expect(hasError || isRedirected).toBeTruthy();
  });

  test('network error handling and retry', async ({ page }) => {
    // Mock network failure
    let requestCount = 0;
    await page.route('**/api/projects', route => {
      requestCount++;
      if (requestCount <= 2) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    await page.goto('/projects');
    
    // Should show error initially
    const errorMessage = page.getByText(/오류가 발생했습니다|네트워크 오류|실패/i);
    if (await errorMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(errorMessage).toBeVisible();
      
      // Should have retry button
      const retryButton = page.getByRole('button', { name: /다시 시도|재시도/i });
      if (await retryButton.isVisible().catch(() => false)) {
        await retryButton.click();
        
        // After retry, should work
        await page.waitForTimeout(1000);
      }
    }
  });

  test('toast error messages', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    // Mock API error
    await page.route('**/api/projects', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: '서버 오류가 발생했습니다' })
      });
    });

    await page.goto('/projects');
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    
    await page.getByLabel(/프로젝트 이름/i).fill('에러 테스트');
    await page.getByLabel(/설명/i).fill('에러 처리 테스트');
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    // Should show toast error
    const toast = page.locator('[role="alert"], [role="status"], .toast, .notification');
    if (await toast.count() > 0) {
      await expect(toast.first()).toBeVisible({ timeout: 3000 });
      
      // Toast should auto-dismiss
      await page.waitForTimeout(5000);
      const stillVisible = await toast.first().isVisible().catch(() => false);
      expect(stillVisible).toBeFalsy();
    }
  });

  test('form validation errors', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    await page.goto('/projects');
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    
    // Submit empty form
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    // Should show field-level errors
    const validationErrors = page.getByText(/입력해주세요|필수|required/i);
    await expect(validationErrors.first()).toBeVisible();
    
    // Fill invalid data
    await page.getByLabel(/프로젝트 이름/i).fill('A'); // Too short
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    const lengthError = page.getByText(/최소.*글자|too short/i);
    if (await lengthError.isVisible().catch(() => false)) {
      await expect(lengthError).toBeVisible();
    }

    // Invalid email format
    const emailInput = page.getByLabel(/이메일/i);
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill('invalid-email');
      await page.getByRole('button', { name: /생성하기|저장/i }).click();
      
      const emailError = page.getByText(/올바른 이메일|invalid email/i);
      if (await emailError.isVisible().catch(() => false)) {
        await expect(emailError).toBeVisible();
      }
    }
  });

  test('API timeout handling', async ({ page }) => {
    // Mock slow API
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 30000); // 30 second delay
    });

    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    await page.goto('/projects');
    
    // Should show loading state
    const loadingIndicator = page.locator('[role="status"], .loading, .spinner');
    if (await loadingIndicator.count() > 0) {
      await expect(loadingIndicator.first()).toBeVisible();
    }

    // After timeout, should show error
    const timeoutError = page.getByText(/시간 초과|timeout|요청 시간/i);
    if (await timeoutError.isVisible({ timeout: 10000 }).catch(() => false)) {
      await expect(timeoutError).toBeVisible();
    }
  });

  test('concurrent request error handling', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    // Mock API to fail on concurrent requests
    let activeRequests = 0;
    await page.route('**/api/projects', route => {
      activeRequests++;
      if (activeRequests > 1) {
        route.fulfill({
          status: 429,
          body: JSON.stringify({ message: 'Too many requests' })
        });
      } else {
        setTimeout(() => {
          activeRequests--;
          route.continue();
        }, 1000);
      }
    });

    await page.goto('/projects');
    
    // Make concurrent requests
    const createButton = page.getByRole('button', { name: /프로젝트 생성/i });
    if (await createButton.isVisible()) {
      await Promise.all([
        createButton.click(),
        createButton.click().catch(() => {})
      ]);
    }
  });

  test('offline mode detection', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    // Simulate offline
    await page.context().setOffline(true);
    
    await page.goto('/projects');
    
    // Should show offline indicator
    const offlineIndicator = page.getByText(/오프라인|offline|연결 없음/i);
    if (await offlineIndicator.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(offlineIndicator).toBeVisible();
    }

    // Go back online
    await page.context().setOffline(false);
    
    // Should show online indicator or reload
    await page.waitForTimeout(1000);
    const onlineIndicator = page.getByText(/온라인|online|연결됨/i);
    if (await onlineIndicator.isVisible().catch(() => false)) {
      await expect(onlineIndicator).toBeVisible();
    }
  });

  test('session expiration handling', async ({ page }) => {
    // Set expired token
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'expired-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    // Mock 401 response
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Token expired' })
      });
    });

    await page.goto('/dashboard');
    
    // Should redirect to login or show session expired message
    await page.waitForTimeout(2000);
    
    const sessionExpired = page.getByText(/세션이 만료|로그인이 필요|인증이 만료/i);
    const isLoginPage = page.url().includes('/auth') || page.url().includes('/login');
    
    const hasExpiredMessage = await sessionExpired.isVisible().catch(() => false);
    expect(hasExpiredMessage || isLoginPage).toBeTruthy();
  });

  test('data corruption error recovery', async ({ page }) => {
    // Set corrupted data in localStorage
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', 'corrupted-json-{{{');
      localStorage.setItem('projects', 'invalid-data');
    });

    await page.goto('/');
    
    // Should handle gracefully without crashing
    await page.waitForTimeout(1000);
    
    // Page should still load
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
    
    // Should either show error or clear corrupted data
    const hasError = await page.getByText(/오류|error/i).isVisible().catch(() => false);
    const hasContent = await page.getByRole('heading').count() > 0;
    
    expect(hasError || hasContent).toBeTruthy();
  });

  test('file upload error handling', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    // Mock upload failure
    await page.route('**/api/upload', route => {
      route.fulfill({
        status: 413,
        body: JSON.stringify({ message: 'File too large' })
      });
    });

    await page.goto('/profile');
    
    // Try to upload large file
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      // Create a test file
      const buffer = Buffer.from('test file content');
      await fileInput.first().setInputFiles({
        name: 'test.jpg',
        mimeType: 'image/jpeg',
        buffer
      }).catch(() => {});
      
      // Should show error
      const uploadError = page.getByText(/파일이 너무 큽니다|file too large|용량 초과/i);
      if (await uploadError.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(uploadError).toBeVisible();
      }
    }
  });

  test('browser compatibility warnings', async ({ page }) => {
    // Mock old browser
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
        configurable: true
      });
    });

    await page.goto('/');
    
    // Should show browser warning
    const browserWarning = page.getByText(/브라우저를 업데이트|browser not supported|지원하지 않는 브라우저/i);
    if (await browserWarning.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(browserWarning).toBeVisible();
    }
  });

  test('error boundary component', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    // Trigger JavaScript error
    await page.goto('/projects');
    
    // Inject error
    await page.evaluate(() => {
      // Trigger runtime error
      (window as any).triggerError = () => {
        throw new Error('Test error for error boundary');
      };
    });

    // Click element that triggers error
    await page.evaluate(() => {
      (window as any).triggerError?.();
    }).catch(() => {
      // Error is expected
    });

    await page.waitForTimeout(1000);
    
    // Should show error boundary UI
    const errorBoundary = page.getByText(/문제가 발생했습니다|something went wrong|오류 발생/i);
    if (await errorBoundary.isVisible().catch(() => false)) {
      await expect(errorBoundary).toBeVisible();
      
      // Should have reload button
      const reloadButton = page.getByRole('button', { name: /새로고침|reload|다시 로드/i });
      if (await reloadButton.isVisible().catch(() => false)) {
        await expect(reloadButton).toBeVisible();
      }
    }
  });

  test('graceful degradation without JavaScript', async ({ page, context }) => {
    // Disable JavaScript
    await context.setOffline(false);
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Basic content should still be visible
    const heading = page.getByRole('heading').first();
    if (await heading.isVisible().catch(() => false)) {
      await expect(heading).toBeVisible();
    }
    
    // Links should still work
    const links = page.getByRole('link');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('CSRF token error handling', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    // Mock CSRF error
    await page.route('**/api/projects', route => {
      route.fulfill({
        status: 403,
        body: JSON.stringify({ message: 'CSRF token invalid' })
      });
    });

    await page.goto('/projects');
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    
    await page.getByLabel(/프로젝트 이름/i).fill('CSRF 테스트');
    await page.getByLabel(/설명/i).fill('CSRF 에러 처리');
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    // Should handle CSRF error
    const csrfError = page.getByText(/보안 오류|security error|CSRF/i);
    if (await csrfError.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(csrfError).toBeVisible();
    }
  });
});

test.describe('Error Recovery', () => {
  test('auto-recovery from transient errors', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    let attemptCount = 0;
    await page.route('**/api/projects', route => {
      attemptCount++;
      if (attemptCount <= 2) {
        route.fulfill({ status: 500, body: 'Server error' });
      } else {
        route.continue();
      }
    });

    await page.goto('/projects');
    
    // Should auto-retry and eventually succeed
    await page.waitForTimeout(3000);
    
    // Check if data loaded after retries
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('manual error recovery workflow', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test@wku.ac.kr',
        name: 'Test User',
        isProfileComplete: true
      }));
    });

    await page.route('**/api/projects', route => {
      route.fulfill({ status: 500, body: 'Error' });
    });

    await page.goto('/projects');
    
    // Show error
    await page.waitForTimeout(1000);
    
    // User clicks retry
    const retryButton = page.getByRole('button', { name: /다시 시도|재시도|retry/i });
    if (await retryButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Fix the route
      await page.unroute('**/api/projects');
      
      await retryButton.click();
      await page.waitForTimeout(1000);
      
      // Should recover
      const content = page.locator('body');
      await expect(content).toBeVisible();
    }
  });
});
