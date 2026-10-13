import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/api/sanity', () => ({
  getVehicleBySlug: vi.fn().mockResolvedValue({
    _id: 'vehicle', slug: 'lrp2', name: 'LRP Black', type: 'suv', capacity: 6, available: true,
    // Deliberately stale CMS numbers must never override the published pricing guide.
    pricing: { hourlyRate: 999, pointToPointMinimum: 888, dailyRate: 777, notes: 'Obsolete $666 fare' },
    pricingTiers: [{ tier: 'obsolete', price: 555 }],
  }),
  getVehicleRelatedTestimonials: vi.fn().mockResolvedValue([]),
  getMediaUrl: vi.fn(() => ''),
}))
vi.mock('@/components/Gallery', () => ({ default: () => null }))
vi.mock('@/components/FleetBookingCTA', () => ({ default: () => null }))
vi.mock('@/components/fleet-editorial/FleetTestimonials', () => ({ default: () => null }))

import VehiclePage from '../page'

describe('fleet pricing authority', () => {
  it('routes pricing to the canonical guide and never renders stale CMS rates or notes', async () => {
    const { container } = render(await VehiclePage({ params: Promise.resolve({ slug: 'lrp2' }) }))
    expect(screen.getByRole('link', { name: 'View current pricing and minimums' })).toHaveAttribute('href', '/pricing')
    expect(container.textContent).not.toMatch(/999|888|777|666|555|Obsolete/)
    expect(container.textContent).toContain('base minimums are not all-in trip fares')
  })
})
