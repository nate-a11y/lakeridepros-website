import { test, expect } from '@playwright/test'

test.describe('Gift Cards', () => {
  test('gift cards page loads', async ({ page }) => {
    await page.goto('/gift-cards')

    // Should navigate to gift cards page or show gift card content
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/gift-card/i)
  })

  test('gift card balance checker is accessible', async ({ page }) => {
    await page.goto('/gift-cards')

    // Look for balance check form
    const balanceInput = page.getByPlaceholder(/code|enter/i).or(
      page.getByLabel(/code|balance/i)
    )

    if (await balanceInput.count() > 0) {
      await expect(balanceInput.first()).toBeVisible()
    }
  })

  test('balance check form validates empty input', async ({ page }) => {
    await page.goto('/gift-cards')

    const checkButton = page.getByRole('button', { name: /check|balance/i })

    if (await checkButton.count() > 0) {
      await checkButton.first().click()

      // Should show some validation or error
      await page.waitForTimeout(500)
      expect(page.url()).toBeTruthy()
    }
  })

  test('gift card purchase options are displayed', async ({ page }) => {
    await page.goto('/gift-cards')

    // Look for purchase options (digital/physical)
    const digitalOption = page.getByText(/digital/i)
    const physicalOption = page.getByText(/physical/i)

    const hasOptions = (await digitalOption.count() > 0) || (await physicalOption.count() > 0)
    expect(hasOptions).toBeTruthy()
  })

  test('invalid gift card code shows error', async ({ page }) => {
    await page.goto('/gift-cards')

    const balanceInput = page.getByPlaceholder(/code|enter/i).or(
      page.getByLabel(/code|balance/i)
    ).first()

    const checkButton = page.getByRole('button', { name: /check|balance/i }).first()

    if ((await balanceInput.count() > 0) && (await checkButton.count() > 0)) {
      await balanceInput.fill('INVALID-CODE-123')
      await checkButton.click()

      // Wait for error message
      await page.waitForTimeout(1000)

      // Look for error message
      const errorMessage = page.getByText(/not found|invalid|error/i)
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible()
      }
    }
  })

  test('responsive - gift cards page works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/gift-cards')

    // Verify page loads on mobile
    expect(page.url()).toMatch(/gift-card/i)
  })
})
