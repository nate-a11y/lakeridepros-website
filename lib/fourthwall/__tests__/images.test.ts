import { describe, expect, it } from 'vitest'
import { getFourthwallProductImages, type FourthwallImage, type FourthwallProduct } from '../storefront'

const front: FourthwallImage = { id: 'front', url: 'https://cdn.fourthwall.com/front.jpg', width: 800, height: 800 }
const back: FourthwallImage = { ...front, id: 'back', url: 'https://cdn.fourthwall.com/back.jpg' }
const variantImage: FourthwallImage = { ...front, id: 'moss', url: 'https://cdn.fourthwall.com/moss.jpg' }
const product: FourthwallProduct = {
  type: 'PRODUCT', id: 'tee', name: 'Tee', slug: 'tee', description: '',
  access: { type: 'PUBLIC' }, state: { type: 'AVAILABLE' },
  images: [front, back], variants: [{
    id: 'moss', name: 'Moss', sku: '', unitPrice: { value: 25, currency: 'USD' },
    attributes: { description: 'Moss' }, stock: { type: 'UNLIMITED' }, images: [variantImage, front],
  }], createdAt: '', updatedAt: '',
}

describe('Fourthwall gallery image selection', () => {
  it('deduplicates repeated product/variant mockups without dropping other views', () => {
    expect(getFourthwallProductImages(product)).toEqual([front, back, variantImage])
  })
  it('puts the chosen variant first without removing any other photos', () => {
    expect(getFourthwallProductImages(product, 'moss')).toEqual([variantImage, front, back])
  })
  it('uses the normal order for an unknown or imageless variant', () => {
    expect(getFourthwallProductImages(product, 'unknown')).toEqual([front, back, variantImage])
    expect(getFourthwallProductImages({ ...product, variants: [{ ...product.variants[0], images: [] }] }, 'moss'))
      .toEqual([front, back])
  })
  it('deduplicates transformed URLs and skips empty sources', () => {
    expect(getFourthwallProductImages({ ...product, variants: [], images: [
      { ...front, transformedUrl: 'https://imgproxy.fourthwall.dev/front.webp' },
      { ...back, transformedUrl: 'https://imgproxy.fourthwall.dev/front.webp' },
      { ...front, id: 'empty', url: '' },
      { ...back, url: '', transformedUrl: 'https://imgproxy.fourthwall.dev/back.webp' },
    ] })).toHaveLength(2)
  })
  it('handles products without any photos', () => {
    expect(getFourthwallProductImages({ ...product, images: [], variants: [] })).toEqual([])
  })
})
