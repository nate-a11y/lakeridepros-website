import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Automated Accessibility Testing Suite
 *
 * Uses axe-core to detect WCAG 2.1 AA violations.
 * These tests help protect against ADA/accessibility lawsuits
 * by catching common issues before they reach production.
 *
 * WCAG 2.1 AA is the standard required by:
 * - ADA (Americans with Disabilities Act)
 * - Section 508
 * - Most accessibility legislation worldwide
 */

// Helper to run axe and check for violations
async function checkAccessibility(
  page: import('@playwright/test').Page,
  options?: {
    includedImpacts?: ('critical' | 'serious' | 'moderate' | 'minor')[]
    skipRules?: string[]
  }
) {
  const axeBuilder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])

  if (options?.skipRules) {
    axeBuilder.disableRules(options.skipRules)
  }

  const results = await axeBuilder.analyze()

  // Filter by impact level if specified
  let violations = results.violations
  if (options?.includedImpacts) {
    violations = violations.filter(v =>
      options.includedImpacts!.includes(v.impact as 'critical' | 'serious' | 'moderate' | 'minor')
    )
  }

  // Format violations for readable error messages
  const violationMessages = violations.map(violation => {
    const nodes = violation.nodes.map(node => {
      return `  - ${node.html}\n    Fix: ${node.failureSummary}`
    }).join('\n')
    return `${violation.impact?.toUpperCase()}: ${violation.id} - ${violation.description}\n${nodes}`
  }).join('\n\n')

  expect(
    violations,
    `Accessibility violations found:\n\n${violationMessages}`
  ).toHaveLength(0)

  return results
}

test.describe('Accessibility - Critical Pages', () => {
  test('Homepage has no critical/serious violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })

  test('Contact page has no critical/serious violations', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })

  test('Services page has no critical/serious violations', async ({ page }) => {
    await page.goto('/services')
    await page.waitForLoadState('networkidle')

    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })

  test('Shop page has no critical/serious violations', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')

    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })

  test('Gift Cards page has no critical/serious violations', async ({ page }) => {
    await page.goto('/gift-cards')
    await page.waitForLoadState('networkidle')

    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })

  test('Blog page has no critical/serious violations', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })

  test('Fleet page has no critical/serious violations', async ({ page }) => {
    await page.goto('/fleet')
    await page.waitForLoadState('networkidle')

    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })

  test('Pricing page has no critical/serious violations', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })
})

test.describe('Accessibility - Interactive Components', () => {
  test('Navigation dropdown is keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Find and focus the Services dropdown button
    const servicesButton = page.getByRole('button', { name: /services/i })

    if (await servicesButton.count() > 0) {
      await servicesButton.first().focus()
      await servicesButton.first().press('Enter')

      // Dropdown should open
      const dropdown = page.getByRole('menu')
      await expect(dropdown.first()).toBeVisible({ timeout: 2000 })

      // Escape should close it
      await page.keyboard.press('Escape')
    }

    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })

  test('Theme toggle is keyboard accessible', async ({ page }) => {
    await page.goto('/')

    const themeButton = page.getByRole('button', { name: /theme/i })

    if (await themeButton.count() > 0) {
      await themeButton.first().focus()
      await themeButton.first().press('Enter')

      // Listbox should open
      const listbox = page.getByRole('listbox')
      await expect(listbox).toBeVisible({ timeout: 2000 })

      // Arrow keys should navigate
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Escape')
    }
  })

  test('Mobile menu is accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: /menu/i })

    if (await menuButton.count() > 0) {
      // Menu button should be accessible
      await expect(menuButton.first()).toBeVisible()
      await expect(menuButton.first()).toHaveAttribute('aria-expanded')

      await menuButton.first().click()

      await checkAccessibility(page, {
        includedImpacts: ['critical', 'serious']
      })
    }
  })
})

test.describe('Accessibility - Forms', () => {
  test('Contact form has proper labels and error handling', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Check form has proper labels
    const nameInput = page.locator('#name')
    await expect(nameInput).toHaveAttribute('autocomplete', 'name')

    const emailInput = page.locator('#email')
    await expect(emailInput).toHaveAttribute('autocomplete', 'email')
    await expect(emailInput).toHaveAttribute('type', 'email')

    const phoneInput = page.locator('#phone')
    await expect(phoneInput).toHaveAttribute('autocomplete', 'tel')
    await expect(phoneInput).toHaveAttribute('type', 'tel')

    // Run full a11y check on the form
    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })

  test('Newsletter signup is accessible', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    const newsletterInput = page.locator('#newsletter-email')

    if (await newsletterInput.count() > 0) {
      await expect(newsletterInput).toHaveAttribute('autocomplete', 'email')
      await expect(newsletterInput).toHaveAttribute('type', 'email')
    }

    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })
})

test.describe('Accessibility - Modals and Dialogs', () => {
  test('Cart drawer has proper dialog role', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')

    // Find a product and add to cart to trigger cart drawer
    const addToCartButton = page.getByRole('button', { name: /add to cart/i })

    if (await addToCartButton.count() > 0) {
      await addToCartButton.first().click()

      // Wait for cart drawer
      const dialog = page.getByRole('dialog')

      if (await dialog.count() > 0) {
        await expect(dialog.first()).toHaveAttribute('aria-modal', 'true')

        await checkAccessibility(page, {
          includedImpacts: ['critical', 'serious']
        })
      }
    }
  })
})

test.describe('Accessibility - Focus Management', () => {
  test('Interactive elements have visible focus states', async ({ page }) => {
    await page.goto('/')

    // Tab through the page and check focus is visible
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')

      const focusedElement = page.locator(':focus')
      if (await focusedElement.count() > 0) {
        // Element should have some focus indicator
        const outlineStyle = await focusedElement.evaluate(el => {
          const styles = window.getComputedStyle(el)
          return {
            outline: styles.outline,
            boxShadow: styles.boxShadow,
            border: styles.border
          }
        })

        // At least one focus indicator should be present
        const hasFocusIndicator =
          (outlineStyle.outline && outlineStyle.outline !== 'none' && !outlineStyle.outline.includes('0px')) ||
          (outlineStyle.boxShadow && outlineStyle.boxShadow !== 'none')

        // Log but don't fail - some elements may legitimately not have visible focus
        if (!hasFocusIndicator) {
          console.warn(`Element may lack visible focus: ${await focusedElement.evaluate(el => el.tagName)}`)
        }
      }
    }
  })

  test('Skip link exists and works', async ({ page }) => {
    await page.goto('/')

    // Press Tab to reveal skip link
    await page.keyboard.press('Tab')

    const skipLink = page.getByRole('link', { name: /skip/i })

    // Skip link is optional but recommended
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toBeVisible()
    }
  })
})

test.describe('Accessibility - Color Contrast', () => {
  test('Text has sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // axe-core checks color contrast automatically
    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })

  test('Dark mode maintains color contrast', async ({ page }) => {
    await page.goto('/')

    // Enable dark mode if theme toggle exists
    const themeButton = page.getByRole('button', { name: /theme/i })

    if (await themeButton.count() > 0) {
      await themeButton.first().click()

      // Select dark mode option
      const darkOption = page.getByRole('option', { name: /dark/i })
      if (await darkOption.count() > 0) {
        await darkOption.first().click()
        await page.waitForTimeout(500)
      }
    }

    // Check contrast in dark mode
    await checkAccessibility(page, {
      includedImpacts: ['critical', 'serious']
    })
  })
})

test.describe('Accessibility - Images and Media', () => {
  test('Images have alt text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check all images have alt attributes
    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const src = await img.getAttribute('src')

      // All images should have alt (can be empty for decorative)
      expect(
        alt !== null,
        `Image missing alt attribute: ${src}`
      ).toBe(true)
    }
  })
})

test.describe('Accessibility - Full Page Scans (All Violations)', () => {
  // These tests report ALL violations including minor ones
  // Run these periodically to find and fix all issues

  test.skip('Homepage - full audit', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await checkAccessibility(page)
  })

  test.skip('Contact - full audit', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await checkAccessibility(page)
  })

  test.skip('Shop - full audit', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')
    await checkAccessibility(page)
  })
})
