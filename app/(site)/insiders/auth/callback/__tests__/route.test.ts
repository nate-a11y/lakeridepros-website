import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { exchangeCodeForSession, rpc, signOut } = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  rpc: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('@/lib/supabase/auth-server', () => ({
  createInsiderServerClient: vi.fn().mockResolvedValue({
    auth: {
      exchangeCodeForSession,
      signOut,
    },
    rpc,
  }),
}))

import { GET } from '../route'

describe('Insider magic-link callback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    exchangeCodeForSession.mockResolvedValue({ error: null })
    signOut.mockResolvedValue({ error: null })
    rpc.mockImplementation((functionName: string) => {
      if (functionName === 'link_my_insider_membership') {
        return Promise.resolve({
          data: { memberId: 'member-1', accessRole: 'rider' },
          error: null,
        })
      }
      if (functionName === 'get_my_insider_dashboard') {
        return Promise.resolve({
          data: { member: { accessRole: 'rider' } },
          error: null,
        })
      }
      throw new Error(`Unexpected RPC: ${functionName}`)
    })
  })

  it('links a first-time approved rider before loading the portal', async () => {
    const response = await GET(
      new NextRequest(
        'https://www.lakeridepros.com/insiders/auth/callback?code=valid-code',
      ),
    )

    expect(response.headers.get('location')).toBe(
      'https://www.lakeridepros.com/insiders',
    )
    expect(exchangeCodeForSession).toHaveBeenCalledWith('valid-code')
    expect(rpc.mock.calls.map(([name]) => name)).toEqual([
      'link_my_insider_membership',
      'get_my_insider_dashboard',
    ])
    expect(signOut).not.toHaveBeenCalled()
  })

  it('fails closed when the authenticated email cannot be uniquely linked', async () => {
    rpc.mockResolvedValueOnce({ data: null, error: null })

    const response = await GET(
      new NextRequest(
        'https://www.lakeridepros.com/insiders/auth/callback?code=valid-code',
      ),
    )

    expect(response.headers.get('location')).toBe(
      'https://www.lakeridepros.com/insiders/login?error=membership_not_linked',
    )
    expect(signOut).toHaveBeenCalledOnce()
    expect(rpc).toHaveBeenCalledTimes(1)
  })

  it('rejects an expired link before attempting membership access', async () => {
    exchangeCodeForSession.mockResolvedValue({
      error: new Error('expired'),
    })

    const response = await GET(
      new NextRequest(
        'https://www.lakeridepros.com/insiders/auth/callback?code=expired-code',
      ),
    )

    expect(response.headers.get('location')).toBe(
      'https://www.lakeridepros.com/insiders/login?error=expired_link',
    )
    expect(rpc).not.toHaveBeenCalled()
  })
})
