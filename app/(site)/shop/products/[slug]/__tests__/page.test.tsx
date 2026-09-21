import { render, screen } from '@testing-library/react'
import { createElement, type ImgHTMLAttributes } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(() => {
    throw new Error('NEXT_REDIRECT')
  }),
}))

vi.mock('next/navigation', () => ({ redirect: redirectMock }))
vi.mock('next/image', () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => createElement('img', props),
}))
vi.mock('../FourthwallProductActions', () => ({
  default: () => <button type="button">Add to cart</button>,
}))
vi.mock('@/lib/fourthwall/storefront', () => ({
  getFourthwallProduct: vi.fn(),
  getFourthwallProductImage: vi.fn(),
  getFourthwallStartingPrice: vi.fn(),
  plainFourthwallDescription: vi.fn(),
}))

import ProductPage, { generateMetadata } from '../page'
import {
  getFourthwallProduct,
  getFourthwallProductImage,
  getFourthwallStartingPrice,
  plainFourthwallDescription,
} from '@/lib/fourthwall/storefront'

const PRODUCT = {
  type: 'PRODUCT' as const,
  id: 'product-1',
  name: 'Lake Ride Pros Test Tee',
  slug: 'test-tee',
  description: 'A test product',
  state: { type: 'AVAILABLE' as const },
  access: { type: 'PUBLIC' },
  images: [],
  variants: [],
  createdAt: '2026-09-20T00:00:00Z',
  updatedAt: '2026-09-20T00:00:00Z',
}

describe('Fourthwall product route fail-closed behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getFourthwallProduct).mockResolvedValue(null)
  })

  it('redirects hidden, unknown, or unavailable product slugs to the shop', async () => {
    await expect(ProductPage({ params: Promise.resolve({ slug: 'hidden-test-product' }) }))
      .rejects.toThrow('NEXT_REDIRECT')

    expect(redirectMock).toHaveBeenCalledWith('/shop')
  })

  it('prevents missing product slugs from being indexed', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'hidden-test-product' }),
    })

    expect(metadata.robots).toEqual({ index: false, follow: true })
    expect(metadata.alternates).toBeUndefined()
  })

  it('uses the branded artwork fallback when a live product has no image', async () => {
    vi.mocked(getFourthwallProduct).mockResolvedValue(PRODUCT)
    vi.mocked(getFourthwallProductImage).mockReturnValue('')
    vi.mocked(getFourthwallStartingPrice).mockReturnValue(1)
    vi.mocked(plainFourthwallDescription).mockReturnValue(PRODUCT.description)

    render(await ProductPage({ params: Promise.resolve({ slug: PRODUCT.slug }) }))

    expect(screen.getByRole('img', {
      name: `${PRODUCT.name} product preview coming soon`,
    })).toBeVisible()
    expect(screen.getByText('Product photography is on the way.')).toBeVisible()
    expect(screen.queryByText('Image coming soon')).not.toBeInTheDocument()
  })
})
