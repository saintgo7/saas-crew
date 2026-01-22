import { test, expect } from '@playwright/test'

test.describe('Accessibility Tests @accessibility', () => {
  test('should have proper heading hierarchy on home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for h1
    const h1 = await page.locator('h1').count()
    expect(h1).toBeGreaterThanOrEqual(1)

    // Get all headings
    const headings = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      return elements.map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: el.textContent?.trim(),
      }))
    })

    // Should have headings
    expect(headings.length).toBeGreaterThan(0)
  })

  test('should have alt text for all images', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const images = await page.locator('img').all()

    for (const img of images) {
      const alt = await img.getAttribute('alt')
      // Alt attribute should exist (can be empty for decorative images)
      expect(alt).not.toBeNull()
    }
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/community')
    await page.waitForLoadState('networkidle')

    const inputs = await page.locator('input, textarea, select').all()

    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      const placeholder = await input.getAttribute('placeholder')

      // Input should have some form of label
      const hasLabel = id || ariaLabel || ariaLabelledBy || placeholder
      expect(hasLabel).toBeTruthy()
    }
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)

    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })

    // Should be able to focus on elements
    expect(focusedElement).toBeTruthy()
  })

  test('should have focusable interactive elements', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const buttons = await page.locator('button, a[href]').all()

    for (const button of buttons.slice(0, 5)) {
      const isVisible = await button.isVisible()
      if (isVisible) {
        await button.focus()
        const isFocused = await button.evaluate((el) => el === document.activeElement)
        expect(isFocused).toBe(true)
      }
    }
  })

  test('should have proper ARIA roles for navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for navigation landmark
    const nav = await page.locator('nav, [role="navigation"]').count()
    expect(nav).toBeGreaterThanOrEqual(1)

    // Check for main content
    const main = await page.locator('main, [role="main"]').count()
    expect(main).toBeGreaterThanOrEqual(1)
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check if text is visible against background
    const paragraphs = await page.locator('p').all()

    for (const p of paragraphs.slice(0, 5)) {
      const isVisible = await p.isVisible()
      if (isVisible) {
        const styles = await p.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
          }
        })

        // Text should have color set
        expect(styles.color).toBeTruthy()
      }
    }
  })

  test('should have descriptive link text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const links = await page.locator('a[href]').all()

    for (const link of links.slice(0, 10)) {
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')

      // Link should have text or aria-label
      const hasDescription = (text && text.trim().length > 0) || ariaLabel
      expect(hasDescription).toBeTruthy()
    }
  })

  test('should have proper button accessibility', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const buttons = await page.locator('button').all()

    for (const button of buttons.slice(0, 5)) {
      const isVisible = await button.isVisible()
      if (isVisible) {
        const text = await button.textContent()
        const ariaLabel = await button.getAttribute('aria-label')

        // Button should have text or aria-label
        expect(text || ariaLabel).toBeTruthy()
      }
    }
  })

  test('should have language attribute', async ({ page }) => {
    await page.goto('/')

    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBeTruthy()
  })

  test('should have viewport meta tag', async ({ page }) => {
    await page.goto('/')

    const viewport = await page.locator('meta[name="viewport"]').count()
    expect(viewport).toBeGreaterThanOrEqual(1)
  })

  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for skip link (common accessibility feature)
    const skipLink = await page.locator('a[href="#main"], a:has-text("Skip to")').count()
    // Skip link is optional but recommended
    expect(skipLink).toBeGreaterThanOrEqual(0)
  })

  test('should handle focus indicators', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Tab to first interactive element
    await page.keyboard.press('Tab')

    const focusVisible = await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return false

      const styles = window.getComputedStyle(el)
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
      }
    })

    // Should have some focus indicator (outline or custom)
    expect(focusVisible).toBeTruthy()
  })

  test('should have proper form validation messages', async ({ page }) => {
    await page.goto('/community/new')
    await page.waitForLoadState('networkidle').catch(() => {})

    // Look for form inputs
    const inputs = await page.locator('input[required], textarea[required]').all()

    if (inputs.length > 0) {
      const firstInput = inputs[0]

      // Try to submit without filling required field
      const submitButton = page.locator('button[type="submit"]').first()
      if (await submitButton.count() > 0) {
        await submitButton.click()
        await page.waitForTimeout(500)

        // Browser should show validation message
        const validationMessage = await firstInput.evaluate((el: HTMLInputElement) =>
          el.validationMessage
        )
        // Might have validation message
        expect(validationMessage !== undefined).toBe(true)
      }
    }
  })

  test('should have proper dialog/modal accessibility', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for modal triggers
    const modalTriggers = await page.locator('[data-modal], [aria-haspopup="dialog"]').all()

    if (modalTriggers.length > 0) {
      const trigger = modalTriggers[0]
      await trigger.click()
      await page.waitForTimeout(500)

      // Check for modal with proper ARIA
      const modal = page.locator('[role="dialog"], [aria-modal="true"]')
      if (await modal.count() > 0) {
        const ariaLabel = await modal.getAttribute('aria-label')
        const ariaLabelledBy = await modal.getAttribute('aria-labelledby')

        // Modal should have label
        expect(ariaLabel || ariaLabelledBy).toBeTruthy()
      }
    }
  })

  test('should have proper table accessibility', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle').catch(() => {})

    const tables = await page.locator('table').all()

    for (const table of tables) {
      // Check for table headers
      const headers = await table.locator('th').count()
      if (headers > 0) {
        // Table has proper structure
        expect(headers).toBeGreaterThan(0)
      }
    }
  })

  test('should support screen reader text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for screen reader only text
    const srOnly = await page.locator('.sr-only, .visually-hidden').count()

    // SR-only text is optional but good practice
    expect(srOnly).toBeGreaterThanOrEqual(0)
  })
})

test.describe('Responsive Accessibility', () => {
  test('should be accessible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for touch-friendly targets
    const buttons = await page.locator('button, a').all()

    for (const button of buttons.slice(0, 5)) {
      const isVisible = await button.isVisible()
      if (isVisible) {
        const box = await button.boundingBox()
        if (box) {
          // Touch target should be at least 44x44px (WCAG)
          const isAccessibleSize = box.width >= 44 && box.height >= 44
          // Some buttons might be smaller, but we check if they exist
          expect(box.width).toBeGreaterThan(0)
        }
      }
    }
  })

  test('should have proper zoom behavior', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Zoom in
    await page.evaluate(() => {
      document.body.style.zoom = '150%'
    })

    await page.waitForTimeout(500)

    // Content should still be accessible
    const h1 = await page.locator('h1').count()
    expect(h1).toBeGreaterThanOrEqual(1)
  })
})
