import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Testimonial } from '@/types/sanity'
import FleetTestimonials from './FleetTestimonials'

describe('fleet editorial reviews', () => {
  it('preserves the supplied review, attribution, rating and three-review limit without adding schema', () => {
    const testimonials = Array.from({ length: 4 }, (_, i) => ({
      _id: `review-${i}`, name: `Reviewer ${i}`, title: 'Wedding guest', company: 'Lake event',
      content: `Complete review ${i}, including the final words.`, rating: 5,
    } as Testimonial))
    const { container } = render(<FleetTestimonials testimonials={testimonials} title="What Our Clients Say" subtitle="A real trip" />)
    expect(screen.getByText('Reviewer 0')).toBeVisible()
    expect(screen.getAllByText('Wedding guest')).toHaveLength(3)
    expect(screen.getAllByText('Lake event')).toHaveLength(3)
    expect(screen.getAllByText('5/5')).toHaveLength(3)
    expect(screen.getByText(/Complete review 0, including the final words/)).toBeVisible()
    expect(screen.queryByText('Reviewer 3')).not.toBeInTheDocument()
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull()
  })
})
