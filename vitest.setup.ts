import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock environment variables
beforeAll(() => {
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL = 'http://localhost:3001'
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  process.env.RESEND_API_KEY = 'test_resend_key'
  process.env.STRIPE_SECRET_KEY = 'sk_test_123'
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Global teardown
afterAll(() => {
  vi.restoreAllMocks()
})
