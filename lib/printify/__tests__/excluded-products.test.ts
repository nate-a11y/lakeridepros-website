import { describe, expect, it } from 'vitest'
import { isExcludedPrintifyProduct } from '../excluded-products'

describe('Printify product exclusions', () => {
  it('excludes the orphaned generic blanket', () => {
    expect(isExcludedPrintifyProduct('67879ed58ab6dd644b07f5cf')).toBe(true)
  })

  it('does not exclude other Printify products', () => {
    expect(isExcludedPrintifyProduct('6a50960bdaa790ba0009c9de')).toBe(false)
  })
})
