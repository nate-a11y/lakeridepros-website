import { expect, test } from '@playwright/test'

const profileUrl = 'https://customer.moovs.app/lake-ride-pros/user/profile'

test.beforeEach(async ({ page }) => {
  // Shell QA must not submit forms or send analytics from localhost.
  await page.route('**/*', route => {
    const request = route.request()
    if (!['GET', 'HEAD'].includes(request.method()) ||
      /google-analytics\.com|googletagmanager\.com|vercel-insights|clarity\.ms/.test(request.url())) {
      return route.abort()
    }
    return route.continue()
  })
})

test('desktop profile navigation, keyboard dismissal, and single GTM survive navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/cart')
  await expect(page.locator('#google-tag-manager')).toHaveCount(1)
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Insiders', exact: true })).toBeVisible()

  const explore = page.getByRole('button', { name: 'Explore', exact: true })
  await explore.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('header').getByRole('link', { name: 'Manage your profile' })).toHaveAttribute('href', profileUrl)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Escape')
  await expect(explore).toBeFocused()
  await expect(explore).toHaveAttribute('aria-expanded', 'false')

  await page.keyboard.press('Enter')
  await page.locator('header').getByRole('link', { name: 'Pricing', exact: true }).click()
  await expect(page).toHaveURL(/\/pricing$/)
  await expect(explore).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('#google-tag-manager')).toHaveCount(1)
  await expect(page.locator('script[src*="/gtm.js?id=GTM-KKNTGMB7"]')).toHaveCount(1)
  await expect(page.locator('footer').getByRole('link', { name: 'Manage your profile' })).toHaveAttribute('href', profileUrl)
  await expect(page.locator('header img')).toHaveAttribute('loading', 'eager')
  await expect(page.locator('header img')).toHaveAttribute('fetchpriority', 'high')
  for (const logo of [page.locator('header img'), page.locator('footer img')]) {
    await expect(logo).toHaveAttribute('width', '320')
    await expect(logo).toHaveAttribute('height', '324')
  }
})

test('mobile navigation opens with fleet and booking in view rather than a long service list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/cart')
  await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  const menu = page.locator('#mobile-menu')
  await expect(menu.getByRole('button', { name: 'Services', exact: true })).toHaveAttribute('aria-expanded', 'false')
  await expect(menu.getByRole('link', { name: 'Fleet', exact: true })).toBeInViewport()
  await expect(menu.getByRole('link', { name: 'Insiders', exact: true })).toBeInViewport()
  await expect(menu.getByRole('link', { name: 'Quote or book', exact: true })).toBeInViewport()
  await menu.getByRole('button', { name: 'Explore', exact: true }).click()
  await expect(menu.getByRole('link', { name: 'Manage your profile' })).toHaveAttribute('href', profileUrl)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeFocused()
  await expect(menu).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
