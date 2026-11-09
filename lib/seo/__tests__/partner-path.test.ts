import { describe, expect, it } from 'vitest'
import { getPartnerPath } from '../partner-path'

describe('canonical partner routing', () => {
  it.each([
    [{}, '/partners/lake-partner'],
    [{ isWeddingPartner: true }, '/wedding-partners/lake-partner'],
    [{ isPremierPartner: true }, '/local-premier-partners/lake-partner'],
    [{ isPremierPartner: true, isWeddingPartner: true }, '/local-premier-partners/lake-partner'],
    [{ category: 'local-premier', isWeddingPartner: true }, '/local-premier-partners/lake-partner'],
    [{ category: 'wedding' }, '/wedding-partners/lake-partner'],
  ])('resolves %j consistently across directories and the sitemap', (partner, path) => {
    expect(getPartnerPath(partner, 'lake-partner')).toBe(path)
  })

  it('supports CMS slug objects and encodes a slug as one path segment', () => {
    expect(getPartnerPath({}, { _type: 'slug', current: 'lake/partner' })).toBe('/partners/lake%2Fpartner')
  })
})
