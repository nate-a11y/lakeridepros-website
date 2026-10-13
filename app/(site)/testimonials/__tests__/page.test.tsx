import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/api/sanity', () => ({
  getTestimonialsLocal: vi.fn(),
  getGoogleReviewSummary: vi.fn(),
  getMediaUrl: vi.fn(() => ''),
}))
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_NOT_FOUND') } }))

import TestimonialsPage, { generateMetadata } from '../page'
import { getTestimonialsLocal, getGoogleReviewSummary } from '@/lib/api/sanity'

describe('testimonials totals and crawlable pagination', () => {
  beforeEach(() => {
    vi.mocked(getTestimonialsLocal).mockResolvedValue(Array.from({ length: 30 }, (_, index) => ({
      _type: 'testimonial' as const, _rev: 'test', featured: false, order: index, source: 'google' as const, _createdAt: '2026-10-01T00:00:00Z', _updatedAt: '2026-10-01T00:00:00Z', _id: `review-${index}`, name: `Customer ${index}`, content: `Review ${index}`, rating: 5,
    })))
    vi.mocked(getGoogleReviewSummary).mockResolvedValue({ reviewCount: 342, ratingValue: 4.96 })
  })

  it('uses the full Google total instead of counting the curated subset', async () => {
    const { container } = render(await TestimonialsPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByText('from 342 Google reviews')).toBeInTheDocument()
    expect(container.querySelectorAll('article')).toHaveLength(24)
    expect(screen.getByRole('link', { name: 'Next reviews' })).toHaveAttribute('href', '/testimonials?page=2')
    const schema = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!)
    expect(schema).not.toHaveProperty('aggregateRating')
  })

  it('renders the next page with its own canonical and previous link', async () => {
    const { container } = render(await TestimonialsPage({ searchParams: Promise.resolve({ page: '2' }) }))
    expect(container.querySelectorAll('article')).toHaveLength(6)
    expect(screen.getByRole('link', { name: 'Previous reviews' })).toHaveAttribute('href', '/testimonials')
    expect(screen.queryByRole('link', { name: 'Next reviews' })).not.toBeInTheDocument()
    expect((await generateMetadata({ searchParams: Promise.resolve({ page: '2' }) })).alternates?.canonical).toBe('https://www.lakeridepros.com/testimonials?page=2')
  })

  it('rejects invalid and out-of-range pages, rather than rendering duplicate empty pages', async () => {
    for (const page of ['0', '900', 'invalid']) {
      await expect(TestimonialsPage({ searchParams: Promise.resolve({ page }) })).rejects.toThrow('NEXT_NOT_FOUND')
    }
  })

  it('does not invent a review total when the summary is unavailable', async () => {
    vi.mocked(getGoogleReviewSummary).mockResolvedValue({ reviewCount: 0, ratingValue: null })
    render(await TestimonialsPage({ searchParams: Promise.resolve({}) }))
    expect(screen.queryByText(/from \d+ Google reviews/)).not.toBeInTheDocument()
  })
})
