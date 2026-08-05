import { describe, expect, it } from 'vitest'
import { buildInsiderWelcomeEmail } from '../welcome'

describe('Insider welcome email', () => {
  it('personalizes the member, plan, tier, and secure CTA', () => {
    const email = buildInsiderWelcomeEmail(
      {
        memberId: '00000000-0000-4000-8000-000000000123',
        name: 'Sherry Grabow',
        email: 'sherry@example.com',
        membershipType: 'individual',
        tier: 'bronze',
        joinedAt: '2026-08-03T15:00:00.000Z',
        approvedRiders: [],
      },
      'https://www.lakeridepros.com/insiders/welcome/signed-token',
    )

    expect(email.subject).toBe('Welcome to Insider Rewards, Sherry!')
    expect(email.text).toContain('Individual Membership')
    expect(email.text).toContain('Bronze status')
    expect(email.text).toContain('5% savings')
    expect(email.html).toContain('Sherry Grabow')
    expect(email.html).toContain(
      'https://www.lakeridepros.com/insiders/welcome/signed-token',
    )
  })

  it('escapes member-controlled content in HTML', () => {
    const email = buildInsiderWelcomeEmail(
      {
        memberId: '00000000-0000-4000-8000-000000000123',
        name: '<script>alert(1)</script>',
        email: 'member@example.com',
        membershipType: 'business',
        tier: 'gold',
        joinedAt: null,
        approvedRiders: [],
      },
      'https://www.lakeridepros.com/insiders/welcome/test?x=<bad>',
    )

    expect(email.html).not.toContain('<script>alert(1)</script>')
    expect(email.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(email.html).toContain('x=&lt;bad&gt;')
  })
})
