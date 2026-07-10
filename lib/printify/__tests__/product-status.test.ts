import { describe, expect, it } from 'vitest'
import { isPrintifyProductPublished } from '../product-status'

describe('isPrintifyProductPublished', () => {
  it('accepts products visible through a native sales channel', () => {
    expect(isPrintifyProductPublished({ visible: true })).toBe(true)
  })

  it('accepts custom API products with an external storefront handle', () => {
    expect(
      isPrintifyProductPublished({
        visible: false,
        external: { handle: 'https://www.lakeridepros.com/shop/products/hat' },
      })
    ).toBe(true)
  })

  it('rejects products with neither visibility nor an external handle', () => {
    expect(
      isPrintifyProductPublished({ visible: false, external: null })
    ).toBe(false)
  })
})
