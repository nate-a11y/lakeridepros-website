import { describe, expect, it } from 'vitest'
import {
  createInsiderWelcomeToken,
  readInsiderWelcomeToken,
} from '../welcome-link'

const MEMBER_ID = '00000000-0000-4000-8000-000000000123'
const ENV = {
  INSIDERS_WELCOME_LINK_SECRET:
    'test-only-insider-welcome-secret-that-is-long-enough',
}
const NOW = new Date('2026-08-04T12:00:00.000Z')

describe('Insider welcome links', () => {
  it('creates a signed link that resolves before expiration', () => {
    const token = createInsiderWelcomeToken(MEMBER_ID, {
      now: NOW,
      expiresAt: new Date('2026-08-11T12:00:00.000Z'),
      env: ENV,
    })

    expect(
      readInsiderWelcomeToken(token, {
        now: new Date('2026-08-05T12:00:00.000Z'),
        env: ENV,
      }),
    ).toMatchObject({ memberId: MEMBER_ID, v: 1 })
  })

  it('rejects tampered and expired links', () => {
    const token = createInsiderWelcomeToken(MEMBER_ID, {
      now: NOW,
      expiresAt: new Date('2026-08-05T12:00:00.000Z'),
      env: ENV,
    })

    expect(
      readInsiderWelcomeToken(`${token}x`, { now: NOW, env: ENV }),
    ).toBeNull()
    expect(
      readInsiderWelcomeToken(token, {
        now: new Date('2026-08-05T12:00:01.000Z'),
        env: ENV,
      }),
    ).toBeNull()
  })

  it('limits welcome links to 45 days', () => {
    expect(() =>
      createInsiderWelcomeToken(MEMBER_ID, {
        now: NOW,
        expiresAt: new Date('2026-10-04T12:00:00.000Z'),
        env: ENV,
      }),
    ).toThrow('expire within 45 days')
  })
})
