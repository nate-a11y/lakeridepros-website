import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/fourthwall/storefront', () => ({
  getFourthwallProducts: vi.fn(),
  getFourthwallProductImage: vi.fn(),
  getFourthwallStartingPrice: vi.fn(),
}))

import ShopPage, { generateMetadata } from '../page'
import { getFourthwallProducts, getFourthwallStartingPrice } from '@/lib/fourthwall/storefront'

const PRODUCT = {
  type: 'PRODUCT' as const, id: 'tee', name: 'Lake Tee', slug: 'lake-tee', description: '',
  state: { type: 'AVAILABLE' as const }, access: { type: 'PUBLIC' },
  images: [], variants: [], createdAt: '', updatedAt: '',
}

describe('Fourthwall shop fail-closed state', () => {
  beforeEach(() => {
    vi.mocked(getFourthwallProducts).mockResolvedValue([])
    vi.mocked(getFourthwallStartingPrice).mockReturnValue(20)
  })

  it('preserves the branded holding page when no public products are available', async () => {
    render(await ShopPage())

    expect(screen.getByRole('heading', { name: 'Gear for the good part of the ride.' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'The collection is in the works.' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Shop the collection' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Lake Ride Pros' })).toHaveAttribute('href', '/')
  })

  it('keeps the empty catalog out of search results', async () => {
    const metadata = await generateMetadata()

    expect(metadata.robots).toEqual({ index: false, follow: true })
    expect(metadata.alternates).toEqual({ canonical: 'https://www.lakeridepros.com/shop' })
  })

  it('marks catalog cards for the block-layout override rather than global inline-flex', async () => {
    vi.mocked(getFourthwallProducts).mockResolvedValue([
      PRODUCT, { ...PRODUCT, id: 'hat', name: 'Lake Hat', slug: 'lake-hat' },
    ])
    render(await ShopPage())
    expect(screen.getByRole('link', { name: /Lake Tee/ })).toHaveAttribute('data-fourthwall-card', 'catalog')
    expect(screen.getByRole('link', { name: /Lake Hat/ })).toHaveAttribute('data-fourthwall-card', 'catalog')
  })

  it('preserves the distinct grid layout for a featured single product', async () => {
    vi.mocked(getFourthwallProducts).mockResolvedValue([PRODUCT])
    render(await ShopPage())
    expect(screen.getByRole('link', { name: /Lake Tee/ })).toHaveAttribute('data-fourthwall-card', 'featured')
  })
})
