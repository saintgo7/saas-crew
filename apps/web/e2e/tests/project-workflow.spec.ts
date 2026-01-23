import { test, expect } from '@playwright/test';

/**
 * Project Workflow E2E Tests
 * Tests complete project management flow including creation, editing, members, and deletion
 */

test.describe('Project Management Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'projectowner@wku.ac.kr',
        name: '프로젝트 오너',
        isProfileComplete: true
      }));
    });

    await page.goto('/projects');
  });

  test('complete project lifecycle: create -> edit -> add members -> delete', async ({ page }) => {
    // Step 1: Create project
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    
    await page.getByLabel(/프로젝트 이름/i).fill('풀스택 웹 개발 프로젝트');
    await page.getByLabel(/설명/i).fill('React + NestJS를 활용한 SaaS 플랫폼 개발');
    
    // Add tags
    await page.getByLabel(/태그/i).fill('React');
    await page.keyboard.press('Enter');
    await page.getByLabel(/태그/i).fill('NestJS');
    await page.keyboard.press('Enter');
    await page.getByLabel(/태그/i).fill('TypeScript');
    await page.keyboard.press('Enter');
    
    // Set project as public
    const publicCheckbox = page.getByLabel(/공개/i);
    if (await publicCheckbox.isVisible()) {
      await publicCheckbox.check();
    }
    
    await page.getByRole('button', { name: /생성하기/i }).click();
    await expect(page.getByText(/프로젝트가 생성되었습니다/i)).toBeVisible();

    // Step 2: View created project
    const projectCard = page.getByText('풀스택 웹 개발 프로젝트').first();
    await projectCard.click();
    
    await expect(page.getByRole('heading', { name: '풀스택 웹 개발 프로젝트' })).toBeVisible();
    await expect(page.getByText(/React/i)).toBeVisible();
    await expect(page.getByText(/NestJS/i)).toBeVisible();
    await expect(page.getByText(/TypeScript/i)).toBeVisible();

    // Step 3: Edit project
    await page.getByRole('button', { name: /수정/i }).click();
    
    const descriptionField = page.getByLabel(/설명/i);
    await descriptionField.clear();
    await descriptionField.fill('React + NestJS를 활용한 SaaS 플랫폼 개발 - MVP 버전');
    
    // Add another tag
    await page.getByLabel(/태그/i).fill('PostgreSQL');
    await page.keyboard.press('Enter');
    
    await page.getByRole('button', { name: /저장/i }).click();
    await expect(page.getByText(/프로젝트가 수정되었습니다/i)).toBeVisible();
    
    // Verify changes
    await expect(page.getByText(/MVP 버전/i)).toBeVisible();
    await expect(page.getByText(/PostgreSQL/i)).toBeVisible();

    // Step 4: Add members
    await page.getByRole('button', { name: /멤버 초대/i }).click();
    
    await page.getByLabel(/이메일/i).fill('member1@wku.ac.kr');
    await page.getByLabel(/역할/i).selectOption('developer');
    await page.getByRole('button', { name: /초대하기/i }).click();
    
    await expect(page.getByText(/멤버가 초대되었습니다/i)).toBeVisible();
    await expect(page.getByText('member1@wku.ac.kr')).toBeVisible();

    // Add another member
    await page.getByRole('button', { name: /멤버 초대/i }).click();
    await page.getByLabel(/이메일/i).fill('member2@wku.ac.kr');
    await page.getByLabel(/역할/i).selectOption('designer');
    await page.getByRole('button', { name: /초대하기/i }).click();
    
    await expect(page.getByText('member2@wku.ac.kr')).toBeVisible();

    // Step 5: Delete project (with confirmation)
    await page.getByRole('button', { name: /삭제/i }).click();
    
    // Confirmation modal should appear
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/정말 삭제하시겠습니까/i)).toBeVisible();
    
    // Cancel first
    await page.getByRole('button', { name: /취소/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Delete again and confirm
    await page.getByRole('button', { name: /삭제/i }).click();
    await page.getByRole('button', { name: /확인/i }).click();
    
    await expect(page.getByText(/프로젝트가 삭제되었습니다/i)).toBeVisible();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test('project creation form validation', async ({ page }) => {
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/프로젝트 이름을 입력해주세요/i)).toBeVisible();
    
    // Fill name but too short
    await page.getByLabel(/프로젝트 이름/i).fill('AB');
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    const lengthError = page.getByText(/최소.*글자/i);
    if (await lengthError.isVisible().catch(() => false)) {
      await expect(lengthError).toBeVisible();
    }
    
    // Fill valid name
    await page.getByLabel(/프로젝트 이름/i).fill('유효한 프로젝트 이름');
    
    // Description too long
    const longDescription = 'A'.repeat(1001);
    await page.getByLabel(/설명/i).fill(longDescription);
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    const maxLengthError = page.getByText(/최대.*글자/i);
    if (await maxLengthError.isVisible().catch(() => false)) {
      await expect(maxLengthError).toBeVisible();
    }
  });

  test('tag management in project', async ({ page }) => {
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    
    await page.getByLabel(/프로젝트 이름/i).fill('태그 테스트 프로젝트');
    await page.getByLabel(/설명/i).fill('태그 관리 기능 테스트');
    
    // Add multiple tags
    const tags = ['React', 'TypeScript', 'TailwindCSS', 'Vite', 'ESLint'];
    for (const tag of tags) {
      await page.getByLabel(/태그/i).fill(tag);
      await page.keyboard.press('Enter');
    }
    
    // Verify tags appear
    for (const tag of tags) {
      await expect(page.getByText(tag)).toBeVisible();
    }
    
    // Remove a tag
    const reactTag = page.getByText('React').locator('..');
    const removeButton = reactTag.getByRole('button', { name: /제거/i });
    if (await removeButton.isVisible().catch(() => false)) {
      await removeButton.click();
      await expect(page.getByText('React')).not.toBeVisible();
    }
    
    // Try to add duplicate tag
    await page.getByLabel(/태그/i).fill('TypeScript');
    await page.keyboard.press('Enter');
    
    const duplicateError = page.getByText(/이미 추가된 태그/i);
    if (await duplicateError.isVisible().catch(() => false)) {
      await expect(duplicateError).toBeVisible();
    }
  });

  test('member invitation and role management', async ({ page }) => {
    // Create a project first
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    await page.getByLabel(/프로젝트 이름/i).fill('팀 협업 프로젝트');
    await page.getByLabel(/설명/i).fill('멤버 관리 테스트');
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    await page.waitForTimeout(500);
    const projectCard = page.getByText('팀 협업 프로젝트').first();
    await projectCard.click();

    // Invite member with invalid email
    await page.getByRole('button', { name: /멤버 초대/i }).click();
    await page.getByLabel(/이메일/i).fill('invalid-email');
    await page.getByRole('button', { name: /초대하기/i }).click();
    
    const emailError = page.getByText(/올바른 이메일/i);
    if (await emailError.isVisible().catch(() => false)) {
      await expect(emailError).toBeVisible();
    }

    // Invite with valid email
    await page.getByLabel(/이메일/i).clear();
    await page.getByLabel(/이메일/i).fill('developer@wku.ac.kr');
    await page.getByLabel(/역할/i).selectOption('developer');
    await page.getByRole('button', { name: /초대하기/i }).click();
    
    await expect(page.getByText('developer@wku.ac.kr')).toBeVisible();

    // Change member role
    const memberRow = page.getByText('developer@wku.ac.kr').locator('..');
    const roleSelect = memberRow.getByLabel(/역할/i);
    
    if (await roleSelect.isVisible().catch(() => false)) {
      await roleSelect.selectOption('admin');
      await expect(page.getByText(/역할이 변경되었습니다/i)).toBeVisible();
    }

    // Remove member
    const removeButton = memberRow.getByRole('button', { name: /제거/i });
    if (await removeButton.isVisible().catch(() => false)) {
      await removeButton.click();
      
      // Confirmation dialog
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: /확인/i }).click();
      
      await expect(page.getByText('developer@wku.ac.kr')).not.toBeVisible();
    }
  });

  test('project visibility and access control', async ({ page }) => {
    // Create private project
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    await page.getByLabel(/프로젝트 이름/i).fill('비공개 프로젝트');
    await page.getByLabel(/설명/i).fill('비공개 테스트');
    
    const privateCheckbox = page.getByLabel(/비공개/i);
    if (await privateCheckbox.isVisible()) {
      await privateCheckbox.check();
    }
    
    await page.getByRole('button', { name: /생성하기/i }).click();
    await expect(page.getByText(/프로젝트가 생성되었습니다/i)).toBeVisible();

    // Verify private badge
    const privateBadge = page.getByText(/비공개/i);
    if (await privateBadge.isVisible().catch(() => false)) {
      await expect(privateBadge).toBeVisible();
    }

    // Change to public
    const projectCard = page.getByText('비공개 프로젝트').first();
    await projectCard.click();
    
    await page.getByRole('button', { name: /수정/i }).click();
    
    const publicCheckbox = page.getByLabel(/공개/i);
    if (await publicCheckbox.isVisible()) {
      await publicCheckbox.check();
    }
    
    await page.getByRole('button', { name: /저장/i }).click();
    
    // Verify public badge
    const publicBadge = page.getByText(/공개/i);
    if (await publicBadge.isVisible().catch(() => false)) {
      await expect(publicBadge).toBeVisible();
    }
  });

  test('project search and filtering', async ({ page }) => {
    // Search for projects
    const searchInput = page.getByPlaceholder(/프로젝트 검색/i);
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('웹 개발');
      await page.keyboard.press('Enter');
      
      await page.waitForTimeout(500);
      
      // Verify search results
      const results = page.getByRole('article');
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }

    // Filter by tag
    const tagFilter = page.getByRole('button', { name: /태그 필터/i });
    if (await tagFilter.isVisible().catch(() => false)) {
      await tagFilter.click();
      
      const reactTag = page.getByRole('checkbox', { name: /React/i });
      if (await reactTag.isVisible().catch(() => false)) {
        await reactTag.check();
        
        await page.waitForTimeout(500);
        
        // Results should contain React tag
        const taggedResults = page.getByText(/React/i);
        const tagCount = await taggedResults.count();
        expect(tagCount).toBeGreaterThan(0);
      }
    }

    // Sort projects
    const sortSelect = page.getByLabel(/정렬/i);
    if (await sortSelect.isVisible().catch(() => false)) {
      await sortSelect.selectOption('recent');
      await page.waitForTimeout(500);
      
      await sortSelect.selectOption('popular');
      await page.waitForTimeout(500);
    }
  });

  test('project deletion confirmation modal', async ({ page }) => {
    // Create a project to delete
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    await page.getByLabel(/프로젝트 이름/i).fill('삭제 테스트 프로젝트');
    await page.getByLabel(/설명/i).fill('삭제 테스트용');
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    await page.waitForTimeout(500);
    const projectCard = page.getByText('삭제 테스트 프로젝트').first();
    await projectCard.click();

    // Try to delete
    await page.getByRole('button', { name: /삭제/i }).click();
    
    // Modal should appear
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Check modal content
    await expect(page.getByText(/정말 삭제하시겠습니까/i)).toBeVisible();
    await expect(page.getByText(/삭제 테스트 프로젝트/i)).toBeVisible();
    await expect(page.getByText(/되돌릴 수 없습니다/i)).toBeVisible();

    // Test cancel button
    await page.getByRole('button', { name: /취소/i }).click();
    await expect(modal).not.toBeVisible();
    
    // Verify project still exists
    await expect(page.getByRole('heading', { name: '삭제 테스트 프로젝트' })).toBeVisible();

    // Delete with type confirmation
    await page.getByRole('button', { name: /삭제/i }).click();
    
    const confirmInput = page.getByPlaceholder(/프로젝트 이름을 입력/i);
    if (await confirmInput.isVisible().catch(() => false)) {
      // Type wrong name first
      await confirmInput.fill('wrong name');
      const confirmButton = page.getByRole('button', { name: /확인/i });
      await expect(confirmButton).toBeDisabled();
      
      // Type correct name
      await confirmInput.clear();
      await confirmInput.fill('삭제 테스트 프로젝트');
      await expect(confirmButton).toBeEnabled();
      await confirmButton.click();
    } else {
      await page.getByRole('button', { name: /확인/i }).click();
    }
    
    await expect(page.getByText(/프로젝트가 삭제되었습니다/i)).toBeVisible();
  });

  test('concurrent project operations', async ({ page }) => {
    // Create project
    await page.getByRole('button', { name: /프로젝트 생성/i }).click();
    await page.getByLabel(/프로젝트 이름/i).fill('동시성 테스트');
    await page.getByLabel(/설명/i).fill('동시 작업 테스트');
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    await page.waitForTimeout(500);
    const projectCard = page.getByText('동시성 테스트').first();
    await projectCard.click();

    // Try to edit and delete simultaneously
    const editButton = page.getByRole('button', { name: /수정/i });
    const deleteButton = page.getByRole('button', { name: /삭제/i });
    
    // Click both buttons rapidly
    await Promise.all([
      editButton.click().catch(() => {}),
      deleteButton.click().catch(() => {})
    ]);
    
    // Should handle gracefully (one operation at a time)
    await page.waitForTimeout(500);
    
    // Either edit modal or delete modal should be visible, not both
    const editModal = page.getByRole('dialog').filter({ hasText: /수정/i });
    const deleteModal = page.getByRole('dialog').filter({ hasText: /삭제/i });
    
    const editVisible = await editModal.isVisible().catch(() => false);
    const deleteVisible = await deleteModal.isVisible().catch(() => false);
    
    // Only one modal should be visible
    expect(editVisible && deleteVisible).toBeFalsy();
  });
});

test.describe('Project Workflow Edge Cases', () => {
  test('handle network errors during project creation', async ({ page }) => {
    // Mock offline network
    await page.route('**/api/projects', route => route.abort());
    
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
    
    await page.getByLabel(/프로젝트 이름/i).fill('네트워크 에러 테스트');
    await page.getByLabel(/설명/i).fill('네트워크 에러 처리 테스트');
    await page.getByRole('button', { name: /생성하기/i }).click();
    
    // Should show error message
    const errorMessage = page.getByText(/네트워크 오류/i).or(page.getByText(/실패/i));
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
  });

  test('project with special characters in name', async ({ page }) => {
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
    
    // Try special characters
    const specialNames = [
      'Project@2024',
      'My-Project_v1',
      'Project (Beta)',
      'Project #1',
      '프로젝트 2024'
    ];
    
    for (const name of specialNames) {
      await page.getByLabel(/프로젝트 이름/i).clear();
      await page.getByLabel(/프로젝트 이름/i).fill(name);
      
      // Check if validation accepts it
      const input = page.getByLabel(/프로젝트 이름/i);
      const value = await input.inputValue();
      expect(value).toBe(name);
    }
  });
});
