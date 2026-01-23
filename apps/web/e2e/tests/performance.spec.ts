import { test, expect } from '@playwright/test';

/**
 * Performance E2E Tests
 * Tests Core Web Vitals and page load performance
 */

test.describe('Performance Tests', () => {
  test('home page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check if main content is visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('measures First Contentful Paint (FCP)', async ({ page }) => {
    await page.goto('/');
    
    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (entry.name === 'first-contentful-paint') {
              resolve(entry.startTime);
            }
          }
        }).observe({ entryTypes: ['paint'] });
      });
    });
    
    // FCP should be less than 2 seconds
    expect(fcp).toBeLessThan(2000);
  });

  test('measures Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');
    
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Resolve after 5 seconds if no LCP detected
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    // LCP should be less than 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });

  test('checks network requests count', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', (request) => {
      requests.push(request.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should not make excessive requests (< 50)
    expect(requests.length).toBeLessThan(50);
    
    console.log('Total requests: ' + requests.length);
  });

  test('measures total page size', async ({ page }) => {
    let totalSize = 0;
    
    page.on('response', async (response) => {
      const headers = response.headers();
      const contentLength = headers['content-length'];
      if (contentLength) {
        totalSize += parseInt(contentLength);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const sizeInKB = totalSize / 1024;
    
    // Total page size should be less than 2MB
    expect(sizeInKB).toBeLessThan(2048);
    
    console.log('Total page size: ' + sizeInKB.toFixed(2) + ' KB');
  });

  test('checks JavaScript bundle size', async ({ page }) => {
    let jsSize = 0;
    
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('.js') || url.includes('/_next/')) {
        const headers = response.headers();
        const contentLength = headers['content-length'];
        if (contentLength) {
          jsSize += parseInt(contentLength);
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const sizeInKB = jsSize / 1024;
    
    // JavaScript bundle should be less than 300KB
    expect(sizeInKB).toBeLessThan(300);
    
    console.log('JavaScript bundle size: ' + sizeInKB.toFixed(2) + ' KB');
  });

  test('measures Time to Interactive (TTI)', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for page to be fully interactive
    await page.waitForLoadState('networkidle');
    
    const tti = Date.now() - startTime;
    
    // TTI should be less than 3.5 seconds
    expect(tti).toBeLessThan(3500);
    
    console.log('Time to Interactive: ' + tti + 'ms');
  });

  test('checks Cumulative Layout Shift (CLS)', async ({ page }) => {
    await page.goto('/');
    
    // Wait for layout to stabilize
    await page.waitForTimeout(2000);
    
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => resolve(clsValue), 1000);
      });
    });
    
    // CLS should be less than 0.1
    expect(cls).toBeLessThan(0.1);
    
    console.log('Cumulative Layout Shift: ' + cls.toFixed(3));
  });

  test('projects page performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Projects page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    console.log('Projects page load time: ' + loadTime + 'ms');
  });

  test('courses page performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Courses page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    console.log('Courses page load time: ' + loadTime + 'ms');
  });
});
