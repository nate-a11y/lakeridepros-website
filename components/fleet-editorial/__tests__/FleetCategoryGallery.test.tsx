import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Vehicle } from '@/types/sanity'

vi.mock('@/lib/api/sanity', () => ({
  getVehiclesLocal: vi.fn(),
  getVehicleBySlug: vi.fn().mockRejectedValue(new Error('Authenticated no-store fetch must not run during category prerender')),
  getMediaUrl: vi.fn((image: { url?: string }) => image.url || ''),
}))
vi.mock('@/components/Gallery', () => ({
  default: ({ images }: { images: Array<{ src: string; alt: string }> }) => (
    <div data-testid="gallery">{JSON.stringify(images)}</div>
  ),
}))

import FleetCategoryGallery from '../FleetCategoryGallery'
import { getVehiclesLocal, getVehicleBySlug } from '@/lib/api/sanity'

const vehicle = {
  name: 'ELITE', slug: 'elite',
  images: [{ image: { url: '/suv.jpg' }, alt: 'Private SUV' }],
  featuredImage: { url: '/suv.jpg' },
} as unknown as Vehicle

describe('FleetCategoryGallery public cached reads', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the cached available fleet and deduplicates gallery photos', async () => {
    vi.mocked(getVehiclesLocal).mockResolvedValue([vehicle])
    render(await FleetCategoryGallery({ category: 'suburbans' }))
    expect(screen.getByTestId('gallery').textContent).toBe(JSON.stringify([{ src: '/suv.jpg', alt: 'Private SUV' }]))
    expect(getVehiclesLocal).toHaveBeenCalledOnce()
    expect(getVehicleBySlug).not.toHaveBeenCalled()
  })

  it('shows the existing fallback for an unavailable category vehicle', async () => {
    vi.mocked(getVehiclesLocal).mockResolvedValue([])
    render(await FleetCategoryGallery({ category: 'limo-bus' }))
    expect(screen.getByText('Contact us for current vehicle photos and availability.')).toBeInTheDocument()
  })

  it('does not fetch the fleet for an unknown category', async () => {
    render(await FleetCategoryGallery({ category: 'unknown' }))
    expect(getVehiclesLocal).not.toHaveBeenCalled()
    expect(getVehicleBySlug).not.toHaveBeenCalled()
  })
})
