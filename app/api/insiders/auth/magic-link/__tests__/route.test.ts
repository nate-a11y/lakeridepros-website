import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createClient, memberLookup, signInWithOtp } = vi.hoisted(() => ({
  createClient: vi.fn(),
  memberLookup: vi.fn(),
  signInWithOtp: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({ createClient }))
vi.mock('@/lib/chargebee/site-origin', () => ({
  getTrustedSiteOrigin: () => 'https://www.lakeridepros.com',
}))
vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: () => ({ success: true }),
}))

import { POST } from '../route'

function request(body: Record<string, unknown>) {
  return new NextRequest('https://www.lakeridepros.com/api/insiders/auth/magic-link', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  })
}

describe('Insider magic-link CAPTCHA', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'test-turnstile-site')
    memberLookup.mockResolvedValue({ data: { id: 'member-1' }, error: null })
    signInWithOtp.mockResolvedValue({ error: null })
    createClient.mockImplementation((_url: string, key: string) =>
      key === 'test-service-role'
        ? {
            from: () => ({
              select: () => ({
                eq: () => ({
                  ilike: () => ({
                    limit: () => ({ maybeSingle: memberLookup }),
                  }),
                }),
              }),
            }),
          }
        : { auth: { signInWithOtp } },
    )
  })

  it('requires a challenge when the widget is configured', async () => {
    const response = await POST(request({ email: 'driver@example.com' }))

    expect(response.status).toBe(400)
    expect(memberLookup).not.toHaveBeenCalled()
    expect(signInWithOtp).not.toHaveBeenCalled()
  })

  it('passes the Turnstile token to Supabase Auth without exposing membership', async () => {
    const response = await POST(request({
      email: 'Driver@Example.com',
      captchaToken: 'turnstile-token',
    }))

    expect(response.status).toBe(200)
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: 'driver@example.com',
      options: expect.objectContaining({
        captchaToken: 'turnstile-token',
        shouldCreateUser: true,
      }),
    })
    expect(await response.json()).toEqual({
      message: expect.stringContaining('active Insider membership'),
    })
  })
})
