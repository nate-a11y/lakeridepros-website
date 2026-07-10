import { describe, expect, it } from 'vitest'
import {
  getShopCategoryHref,
  normalizeShopCategory,
} from '../shop-categories'

describe('shop category URLs', () => {
  it('accepts supported categories', () => {
    expect(normalizeShopCategory('limited')).toBe('limited')
    expect(normalizeShopCategory('seasonal')).toBe('seasonal')
  })

  it('falls back to all products for unsupported categories', () => {
    expect(normalizeShopCategory('unknown')).toBe('all')
    expect(normalizeShopCategory()).toBe('all')
  })

  it('creates direct category links', () => {
    expect(getShopCategoryHref('limited')).toBe('/shop?category=limited')
    expect(getShopCategoryHref('all')).toBe('/shop')
  })
})
