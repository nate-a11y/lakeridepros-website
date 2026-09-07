import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const width of [375, 390, 768, 1440]) {
  test(`public commerce editorial surfaces at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(180_000)
    await page.setViewportSize({ width, height: 900 })
    // Never send checkout, entry or analytics writes during visual verification.
    await page.route('**/*', async (route) => {
      if (!['GET', 'HEAD'].includes(route.request().method())) {
        await route.fulfill({ status: 200, json: {} })
        return
      }
      await route.continue()
    })
    await page.route('**/api/giveaways/editorial-qa', (route) => route.fulfill({ json: {
      status: 'open', giveaway: { title: 'Lake Ride Pros Giveaway', description: 'QA fixture', start_date: '2026-09-01T12:00:00Z', end_date: '2026-10-01T12:00:00Z' },
    } }))
    await page.goto('/shop', { waitUntil: 'networkidle' })
    const product = await page.locator('a[href^="/shop/products/"]').first().getAttribute('href')
    expect(product).toBeTruthy()
    for (const route of ['/shop', product!, '/cart', '/checkout/cancel', '/checkout/success', '/gift-cards/success', '/insider-membership-benefits', '/giveaways/editorial-qa', '/bridal-show-registration']) {
      if (new URL(page.url()).pathname !== route) {
        await page.goto(route, { waitUntil: 'networkidle' })
      }
      await expect(page.locator('main')).toHaveCount(1)
      await expect(page.locator('main h1')).toBeVisible()
      await page.evaluate(async () => { await document.fonts.ready })
      // Trigger off-screen image loading too: a full-page screenshot must not
      // mistake unrequested lazy images for successfully verified imagery.
      await page.locator('main img').evaluateAll(async images => {
        await Promise.all(images.map(image => {
          const img = image as HTMLImageElement
          if (img.complete) return Promise.resolve()
          img.loading = 'eager'
          return new Promise<void>(resolve => {
            img.addEventListener('load', () => resolve(), { once: true })
            img.addEventListener('error', () => resolve(), { once: true })
            setTimeout(resolve, 15_000)
          })
        }))
      })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true)
      expect(await page.locator('main img').evaluateAll(images => images.filter(image => {
        const img = image as HTMLImageElement
        return !img.complete || img.naturalWidth === 0
      }).map(img => img.getAttribute('src'))), route).toEqual([])
      const audit = await new AxeBuilder({ page }).include('#main-content').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(audit.violations, route).toEqual([])
      await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll('/', '_')}-${width}.png`), fullPage: true })
    }
  })
}
