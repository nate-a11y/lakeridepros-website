import { describe, expect, it } from 'vitest'
import { getCaseSensitiveLegacyRedirect } from '../case-sensitive-redirects'

describe('case-sensitive legacy redirects', () => {
  it('redirects an exact legacy uppercase path', () => {
    expect(getCaseSensitiveLegacyRedirect('/fleet/LRP2')).toBe('/fleet/lrp2')
  })

  it('does not redirect the canonical lowercase destination', () => {
    expect(getCaseSensitiveLegacyRedirect('/fleet/lrp2')).toBeNull()
  })

  it('does not redirect unrelated paths', () => {
    expect(getCaseSensitiveLegacyRedirect('/fleet/lrp-limo-bus')).toBeNull()
  })
})
