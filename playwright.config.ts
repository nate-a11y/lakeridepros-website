import { defineConfig, devices } from '@playwright/test'

const insiderPreviewEnvironment =
  'INSIDERS_DEMO_MODE=true INSIDERS_INTERNAL_PREVIEW_MODE=true INSIDERS_CHARGEBEE_MANAGEMENT_MODE=live'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: `${insiderPreviewEnvironment} npm run build && ${insiderPreviewEnvironment} npm run start`,
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
    env: {
      INSIDERS_DEMO_MODE: 'true',
      INSIDERS_INTERNAL_PREVIEW_MODE: 'true',
      // Exercise the authenticated controls without invoking their API routes.
      INSIDERS_CHARGEBEE_MANAGEMENT_MODE: 'live',
    },
  },
})
