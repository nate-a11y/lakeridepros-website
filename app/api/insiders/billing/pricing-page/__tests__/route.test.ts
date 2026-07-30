import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createSession, getClaims, rpc } = vi.hoisted(() => ({
  createSession: vi.fn(),
  getClaims: vi.fn(),
  rpc: vi.fn(),
}))

vi.mock('@/lib/supabase/auth-server', () => ({
  createInsiderServerClient: vi.fn().mockResolvedValue({
    auth: { getClaims },
    rpc,
  }),
}))

vi.mock('@/lib/chargebee/pricing-page', () => ({
  createExistingSubscriptionPricingPageSession: createSession,
}))

import { POST } from '../route'

function dashboard(
  accessRole = 'owner',
  subscriptionId: string | null = 'sub-1',
) {
  return {
    member: { accessRole },
    subscription: subscriptionId
      ? { chargebee_subscription_id: subscriptionId }
      : null,
  }
}

describe('Insider existing-subscription pricing page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('INSIDERS_DEMO_MODE', '')
    vi.stubEnv('INSIDERS_CHARGEBEE_MANAGEMENT_MODE', 'live')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.lakeridepros.com')
    vi.stubEnv('VERCEL_ENV', '')
    getClaims.mockResolvedValue({
      data: { claims: { sub: 'user-1' } },
      error: null,
    })
    rpc.mockResolvedValue({ data: dashboard(), error: null })
    createSession.mockResolvedValue({
      id: 'session-1',
      url: 'https://hosted.atomicpricing.com/session/session-1',
      expiresAt: null,
    })
  })

  it('fails closed before authentication or Chargebee session work when management is off', async () => {
    vi.stubEnv('INSIDERS_CHARGEBEE_MANAGEMENT_MODE', 'off')

    const response = await POST(
      new Request(
        'https://www.lakeridepros.com/api/insiders/billing/pricing-page',
        { method: 'POST' },
      ),
    )

    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe(
      'https://www.lakeridepros.com/insiders/account?billing=unavailable',
    )
    expect(getClaims).not.toHaveBeenCalled()
    expect(rpc).not.toHaveBeenCalled()
    expect(createSession).not.toHaveBeenCalled()
  })

  it('creates a session for the account owner and redirects to Chargebee', async () => {
    const response = await POST(
      new Request(
        'https://www.lakeridepros.com/api/insiders/billing/pricing-page',
        { method: 'POST' },
      ),
    )

    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe(
      'https://hosted.atomicpricing.com/session/session-1',
    )
    expect(createSession).toHaveBeenCalledWith({
      subscriptionId: 'sub-1',
      redirectUrl:
        'https://www.lakeridepros.com/insiders/account?billing=updated',
    })
  })

  it('does not expose billing changes to an approved rider', async () => {
    rpc.mockResolvedValue({
      data: dashboard('rider'),
      error: null,
    })

    const response = await POST(
      new Request(
        'https://www.lakeridepros.com/api/insiders/billing/pricing-page',
        { method: 'POST' },
      ),
    )

    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toContain(
      '/insiders/account?billing=owner_required',
    )
    expect(createSession).not.toHaveBeenCalled()
  })

  it('fails safely while the Chargebee subscription is still syncing', async () => {
    rpc.mockResolvedValue({
      data: dashboard('owner', null),
      error: null,
    })

    const response = await POST(
      new Request(
        'https://www.lakeridepros.com/api/insiders/billing/pricing-page',
        { method: 'POST' },
      ),
    )

    expect(response.headers.get('location')).toContain(
      '/insiders/account?billing=syncing',
    )
    expect(createSession).not.toHaveBeenCalled()
  })

  it('uses the configured site URL instead of the request host', async () => {
    const response = await POST(
      new Request(
        'https://attacker.example/api/insiders/billing/pricing-page',
        { method: 'POST' },
      ),
    )

    expect(response.headers.get('location')).toBe(
      'https://hosted.atomicpricing.com/session/session-1',
    )
    expect(createSession).toHaveBeenCalledWith({
      subscriptionId: 'sub-1',
      redirectUrl:
        'https://www.lakeridepros.com/insiders/account?billing=updated',
    })
  })

  it('keeps local preview redirects on the local dev server', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/insiders/billing/pricing-page', {
        method: 'POST',
      }),
    )

    expect(response.headers.get('location')).toBe(
      'https://hosted.atomicpricing.com/session/session-1',
    )
    expect(createSession).toHaveBeenCalledWith({
      subscriptionId: 'sub-1',
      redirectUrl: 'http://localhost:3000/insiders/account?billing=updated',
    })
  })

  it('uses the trusted Vercel hostname for preview redirects', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview')
    vi.stubEnv('VERCEL_URL', 'lrp-insiders-preview.vercel.app')

    await POST(
      new Request(
        'https://attacker.example/api/insiders/billing/pricing-page',
        { method: 'POST' },
      ),
    )

    expect(createSession).toHaveBeenCalledWith({
      subscriptionId: 'sub-1',
      redirectUrl:
        'https://lrp-insiders-preview.vercel.app/insiders/account?billing=updated',
    })
  })
})
