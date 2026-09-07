import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Lake Ride Pros/i)
  })

  test('displays header navigation', async ({ page }) => {
    await page.goto('/')

    // Check for main navigation elements
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
    await expect(page.getByRole('link', { name: /lake ride pros home/i })).toBeVisible()
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

    // Desktop and mobile controls both stay mounted for responsive navigation;
    // assert the control exposed at the current breakpoint.
    const cartIcon = page.locator('a[aria-label^="Shopping cart"]:visible')
    await expect(cartIcon).toBeVisible()
  })

  test('keeps the editorial dark theme locked', async ({ page }) => {
    await page.goto('/')

    const themeToggle = page.getByRole('button', { name: /theme/i }).or(
      page.locator('[aria-label*="theme"]')
    )
    await expect(themeToggle).toHaveCount(0)
    await expect(page.locator('html')).toHaveClass(/dark/)
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
      await menuButton.first().click()
      await expect(menuButton.first()).toHaveAttribute('aria-expanded', 'true')
      await page.keyboard.press('Escape')
      await expect(menuButton.first()).toHaveAttribute('aria-expanded', 'false')
    }
  })

  test('foregrounds private rides and renders a real vehicle collage', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText(/From a private SUV for one airport pickup/i)).toBeVisible()
    const hero = page.locator('section').first()
    await expect(hero.getByRole('tab', { name: /Private SUVs/i })).toHaveAttribute('aria-selected', 'true')
    await expect(hero.locator('[role="tabpanel"]:not([hidden]) img')).toHaveCount(3)
  })
})
