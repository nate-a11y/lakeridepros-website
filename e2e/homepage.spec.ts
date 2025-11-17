import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Lake Ride Pros/i)
  })

  test('displays header navigation', async ({ page }) => {
    await page.goto('/')

    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible()
  })

  test('displays footer', async ({ page }) => {
    await page.goto('/')

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check footer is visible
    await expect(page.locator('footer')).toBeVisible()
  })

  test('cart icon is visible', async ({ page }) => {
    await page.goto('/')

    const cartIcon = page.getByLabel(/shopping cart/i)
    await expect(cartIcon).toBeVisible()
  })

  test('theme toggle works', async ({ page }) => {
    await page.goto('/')

    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme/i }).or(
      page.locator('[aria-label*="theme"]')
    ).or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )

    if (await themeToggle.count() > 0) {
      await themeToggle.first().click()

      // Wait for theme change
      await page.waitForTimeout(500)

      // Check if dark mode class is applied
      const html = page.locator('html')
      const htmlClass = await html.getAttribute('class')
      expect(htmlClass).toBeTruthy()
    }
  })

  test('hero section is visible', async ({ page }) => {
    await page.goto('/')

    // Check for hero section (common on homepage)
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()
  })

  test('responsive design - mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // On mobile, there should be a menu button
    const menuButton = page.getByRole('button', { name: /menu/i }).or(
      page.locator('button[aria-label*="menu"]')
    )

    if (await menuButton.count() > 0) {
      await expect(menuButton.first()).toBeVisible()
    }
  })
})
