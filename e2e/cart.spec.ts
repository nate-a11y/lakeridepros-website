import { test, expect, type Page } from '@playwright/test'

const CART_STORAGE_KEY = 'lrp-fourthwall-cart-v1'
function seededCart(quantity = 2) {
  return {
    state: {
      items: [
        {
          productId: '11111111-1111-4111-8111-111111111111',
          productName: 'QA Lake Tee',
          productSlug: 'qa-lake-tee',
          variantId: '22222222-2222-4222-8222-222222222222',
          variantName: 'Medium / Green',
          price: 24,
          quantity,
          image: '/og-image.jpg',
          imageAlt: 'QA Lake Tee',
        },
      ],
    },
    version: 0,
  }
}

async function seedCart(page: Page, quantity = 2) {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: CART_STORAGE_KEY, value: JSON.stringify(seededCart(quantity)) },
  )
}

test.describe('Fourthwall shopping cart', () => {
  test('shows a deterministic empty-cart state and keeps the header cart hidden', async ({ page }) => {
    await page.goto('/cart')

    await expect(page).toHaveURL(/\/cart$/)
    await expect(page.getByRole('heading', { name: 'Your cart is empty.' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Browse the shop' })).toHaveAttribute('href', '/shop')
    await expect(page.getByRole('link', { name: /Shopping cart/i })).toHaveCount(0)
  })

  test('hydrates a seeded multi-item cart and updates its quantity', async ({ page }) => {
    await seedCart(page)
    await page.goto('/cart')

    await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible()
    await expect(page.getByText('QA Lake Tee')).toBeVisible()
    await expect(page.getByLabel('Order summary').getByText('$48.00')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Shopping cart, 2 items' })).toBeVisible()

    await page.getByLabel('Quantity').selectOption('3')
    await expect(page.getByLabel('Order summary').getByText('$72.00')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Shopping cart, 3 items' })).toBeVisible()
  })

  test('posts only variant IDs and quantities and preserves the cart on checkout failure', async ({ page }) => {
    await seedCart(page)
    let checkoutBody: unknown
    await page.route('**/api/fourthwall/checkout', async route => {
      checkoutBody = route.request().postDataJSON()
      await route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Mock Fourthwall checkout unavailable' }),
      })
    })
    await page.goto('/cart')

    await page.getByRole('button', { name: 'Checkout with Fourthwall' }).click()

    await expect(page.getByText('Mock Fourthwall checkout unavailable', { exact: true })).toBeVisible()
    expect(checkoutBody).toEqual({
      items: [{ variantId: '22222222-2222-4222-8222-222222222222', quantity: 2 }],
    })
    await expect(page.getByText('QA Lake Tee')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Checkout with Fourthwall' })).toBeEnabled()
  })

  test('fails closed while checkout is disabled and preserves a valid 20-item cart', async ({ page }) => {
    await seedCart(page, 20)
    let checkoutBody: unknown
    await page.route('**/api/fourthwall/checkout', async route => {
      checkoutBody = route.request().postDataJSON()
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Fourthwall checkout is not currently available' }),
      })
    })
    await page.goto('/cart')

    await expect(page.getByRole('link', { name: 'Shopping cart, 20 items' })).toBeVisible()
    await expect(page.getByLabel('Quantity')).toHaveValue('20')
    await page.getByRole('button', { name: 'Checkout with Fourthwall' }).click()

    await expect(page.getByText('Fourthwall checkout is not currently available', { exact: true })).toBeVisible()
    expect(checkoutBody).toEqual({
      items: [{ variantId: '22222222-2222-4222-8222-222222222222', quantity: 20 }],
    })
    await expect(page.getByLabel('Quantity')).toHaveValue('20')
    await expect(page.getByRole('link', { name: 'Shopping cart, 20 items' })).toBeVisible()
    const persistedQuantity = await page.evaluate((key) => {
      const stored = window.localStorage.getItem(key)
      if (!stored) return null
      return JSON.parse(stored).state.items[0]?.quantity
    }, CART_STORAGE_KEY)
    expect(persistedQuantity).toBe(20)
  })

  test('keeps the seeded cart usable at a mobile viewport', async ({ page }) => {
    await seedCart(page)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/cart')

    await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible()
    await expect(page.getByText('QA Lake Tee')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Checkout with Fourthwall' })).toBeVisible()
  })
})
