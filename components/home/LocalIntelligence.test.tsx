import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { BlogPost } from '@/types/sanity'
import LocalIntelligence from './LocalIntelligence'

vi.mock('@/lib/api/sanity', () => ({
  getMediaUrl: (image: { asset?: { url?: string } } | undefined) => image?.asset?.url || '',
}))

describe('homepage featured article', () => {
  it('shows the entire campaign artwork without cropping and keeps its article link', () => {
    const post = {
      _id: 'halloween', slug: 'halloween-2026', title: 'Halloween plans', published: true,
      featuredImage: { alt: 'Halloween campaign: the ride should not be the scary part', asset: { url: 'https://cdn.sanity.io/halloween.png' } },
    } as BlogPost

    render(<LocalIntelligence posts={[post]} />)

    const image = screen.getByRole('img', { name: post.featuredImage!.alt })
    expect(image).toHaveClass('object-contain')
    expect(image).not.toHaveClass('object-cover')
    expect(screen.getByRole('heading', { name: post.title }).closest('a')).toHaveAttribute('href', '/blog/halloween-2026')
  })
})
