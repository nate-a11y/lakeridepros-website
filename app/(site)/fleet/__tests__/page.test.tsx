import { createElement, type ImgHTMLAttributes } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SanityImage, Vehicle } from '@/types/sanity'

vi.mock('next/image', () => ({
  default: ({ fill: _fill, fetchPriority: _fetchPriority, quality: _quality, ...props }: ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    fetchPriority?: string
    quality?: number
  }) => createElement('img', props),
}))

vi.mock('@/lib/api/sanity', () => ({
  getVehicles: vi.fn(),
  getMediaUrl: vi.fn((image: { url?: string }) => image?.url || ''),
}))

import FleetPage from '../page'
import { getVehicles } from '@/lib/api/sanity'

function sanityImage(url: string, alt?: string): SanityImage {
  return {
    _type: 'image',
    asset: { _ref: url, _type: 'reference', url },
    url,
    alt,
  }
}

function vehicle(overrides: Partial<Vehicle>): Vehicle {
  return {
    _id: String(overrides.slug),
    _type: 'vehicle',
    name: 'Vehicle',
    slug: 'vehicle',
    type: 'vehicle',
    description: 'Description',
    capacity: 4,
    available: true,
    featured: true,
    order: 0,
    ...overrides,
  } as Vehicle
}

describe('/fleet category artwork', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses Flex and Elite category artwork without changing other fleet image rules', async () => {
    vi.mocked(getVehicles).mockResolvedValue({
      docs: [
        vehicle({
          name: 'FLEX',
          slug: 'flex',
          featuredImage: sanityImage('/flex-logo.png', 'Flex category logo'),
          images: [{ image: sanityImage('/flex-car.jpg'), alt: 'LRP11', _key: 'flex-car' }],
        }),
        vehicle({
          name: 'ELITE',
          slug: 'elite',
          capacity: 7,
          featuredImage: sanityImage('/elite-logo.png', 'Elite category logo'),
          images: [{ image: sanityImage('/elite-suv.jpg'), alt: 'Elite SUV', _key: 'elite-suv' }],
        }),
        vehicle({
          name: 'Pink Patrol',
          slug: 'pink-patrol',
          capacity: 23,
          featuredImage: sanityImage('/pink-featured.jpg', 'Pink Patrol artwork'),
          images: [{ image: sanityImage('/pink-bus.jpg'), alt: 'Pink Patrol bus', _key: 'pink-bus' }],
        }),
      ],
    })

    render(await FleetPage())

    expect(screen.getByRole('img', { name: 'Flex category logo' })).toHaveAttribute('src', '/flex-logo.png')
    expect(screen.getByRole('img', { name: 'Elite category logo' })).toHaveAttribute('src', '/elite-logo.png')
    expect(screen.getByRole('img', { name: 'Pink Patrol bus' })).toHaveAttribute('src', '/pink-bus.jpg')
    expect(screen.queryByRole('img', { name: 'LRP11' })).not.toBeInTheDocument()
  })
})
