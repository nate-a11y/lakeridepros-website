import { afterEach, describe, expect, it, vi } from 'vitest'
import { isChargebeeManagementEnabled } from '@/lib/chargebee/management-mode'

describe('Chargebee subscription management mode', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it.each([undefined, '', 'off', 'dry-run', 'enabled'])(
    'fails closed for %s',
    (mode) => {
      vi.stubEnv('INSIDERS_CHARGEBEE_MANAGEMENT_MODE', mode)

      expect(isChargebeeManagementEnabled()).toBe(false)
    },
  )

  it.each(['live', ' LIVE '])('enables management only for %s', (mode) => {
    vi.stubEnv('INSIDERS_CHARGEBEE_MANAGEMENT_MODE', mode)

    expect(isChargebeeManagementEnabled()).toBe(true)
  })
})
