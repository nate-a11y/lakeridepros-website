import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isInsiderDemoMode } from '@/lib/insiders/demo'

describe('Insider demo-mode safety gate', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('VERCEL_ENV', '')
    vi.stubEnv('INSIDERS_DEMO_MODE', '')
    vi.stubEnv('INSIDERS_INTERNAL_PREVIEW_MODE', '')
  })

  afterEach(() => vi.unstubAllEnvs())

  it('is disabled unless explicitly requested', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(isInsiderDemoMode()).toBe(false)
  })

  it('allows explicit demo mode during local development', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('INSIDERS_DEMO_MODE', 'true')

    expect(isInsiderDemoMode()).toBe(true)
  })

  it('requires the internal-preview flag for a production build', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('INSIDERS_DEMO_MODE', 'true')

    expect(isInsiderDemoMode()).toBe(false)

    vi.stubEnv('INSIDERS_INTERNAL_PREVIEW_MODE', 'true')
    expect(isInsiderDemoMode()).toBe(true)
  })

  it('allows an explicitly configured Vercel preview', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('VERCEL_ENV', 'preview')
    vi.stubEnv('INSIDERS_DEMO_MODE', 'true')
    vi.stubEnv('INSIDERS_INTERNAL_PREVIEW_MODE', 'true')

    expect(isInsiderDemoMode()).toBe(true)
  })

  it('always denies demo mode on a Vercel production deployment', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('VERCEL_ENV', 'production')
    vi.stubEnv('INSIDERS_DEMO_MODE', 'true')
    vi.stubEnv('INSIDERS_INTERNAL_PREVIEW_MODE', 'true')

    expect(isInsiderDemoMode()).toBe(false)
  })
})
