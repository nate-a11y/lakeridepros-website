import { expect, test } from "@playwright/test"

test.describe("Camden County portal", () => {
  test("login is private, accessible, and does not expose account existence", async ({ page }) => {
    await page.goto("/camden-county/login")
    await expect(page).toHaveTitle(/Sign in.*Camden County/i)
    await expect(page.getByRole("heading", { name: "Sign in to your portal" })).toBeVisible()
    await expect(page.getByLabel("Mobile phone number")).toBeVisible()
    await expect(page.getByText(/Need help signing in\?/i)).toBeVisible()
    await expect(page.getByText(/phone number (?:is|is not) registered/i)).toHaveCount(0)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i)
  })
})
