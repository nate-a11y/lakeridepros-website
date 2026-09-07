import { createElement, type ImgHTMLAttributes } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import type { Partner } from '@/types/sanity'
import PartnerDirectory from '../PartnerDirectory'
import PartnerDetail from '../PartnerDetail'
import PartnerDirectoryShell from '../PartnerDirectoryShell'

vi.mock('next/image', () => ({ default: (props: ImgHTMLAttributes<HTMLImageElement>) => createElement('img', props) }))
vi.mock('@/lib/api/sanity', () => ({ getMediaUrl: () => 'https://cdn.sanity.io/partner-logo.png' }))
vi.mock('@/components/Gallery', () => ({ default: ({ images }: { images: Array<{ src: string; alt: string }> }) => createElement('div', {}, images.map(image => createElement('img', { ...image, key: image.src }))) }))

function partner(overrides: Partial<Partner> = {}): Partner {
  return {
    _id: 'partner-one', _type: 'partner', _createdAt: '', _updatedAt: '', _rev: '',
    name: 'Lake Venue', slug: 'lake-venue', active: true, featured: true, order: 0,
    blurb: 'A local celebration destination.', description: 'The full partner description.',
    website: 'https://example.com', phone: '573-555-0123',
    ...overrides,
  } as Partner
}

describe('PartnerDirectory', () => {
  it('preserves discoverable partner, website and phone links', () => {
    render(<PartnerDirectory kind="premier" partners={[partner()]} />)
    expect(screen.getByRole('link', { name: 'Learn More About Lake Venue' })).toHaveAttribute('href', '/local-premier-partners/lake-venue')
    expect(screen.getByRole('link', { name: /Visit Lake Venue website/ })).toHaveAttribute('href', 'https://example.com')
    expect(screen.getByRole('link', { name: '573-555-0123' })).toHaveAttribute('href', 'tel:573-555-0123')
  })

  it('keeps legacy premier category precedence for referral discovery', () => {
    render(<PartnerDirectory kind="referral" partners={[partner({ category: 'local-premier', isWeddingPartner: true })]} />)
    expect(screen.getByRole('link', { name: 'Learn More About Lake Venue' })).toHaveAttribute('href', '/local-premier-partners/lake-venue')
  })

  it('uses dedicated wedding URLs and wedding copy', () => {
    render(<PartnerDirectory kind="wedding" partners={[partner({ weddingBlurb: 'Wedding-specific introduction.', weddingDescription: 'Wedding-only description.', weddingCategory: 'venues-destinations' })]} />)
    expect(screen.getByText('Wedding-specific introduction.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Learn More About Lake Venue' })).toHaveAttribute('href', '/wedding-partners/lake-venue')
    expect(screen.getByRole('heading', { name: 'Venues & Destinations' })).toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Wedding-only' } })
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('searches descriptions and restores the directory after clearing', () => {
    render(<PartnerDirectory kind="premier" partners={[partner()]} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'not a partner' } })
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getByText('No premier partners found matching your search.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1 partner')
  })

  it('filters by category without losing uncategorized wedding partners', () => {
    render(<PartnerDirectory kind="wedding" partners={[partner(), partner({ _id: 'two', name: 'Lake Florist', slug: 'lake-florist', weddingCategory: 'floral-decor' })]} />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'floral-decor' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Lake Florist' })).toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'all' } })
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('keeps referral URLs and category labels for general referrals', () => {
    render(<PartnerDirectory kind="referral" subcategoryLabels={{ shopping: 'Shopping' }} partners={[partner({ subcategory: 'shopping' })]} />)
    expect(screen.getByRole('heading', { name: 'Shopping' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Learn More About Lake Venue' })).toHaveAttribute('href', '/partners/lake-venue')
  })

  it('does not crop, grayscale or replace partner logos', () => {
    render(<PartnerDirectory kind="premier" partners={[partner({ logo: { _type: 'image', alt: 'Original partner logo', asset: { _ref: 'logo', _type: 'reference' } } })]} />)
    const logo = screen.getByRole('img', { name: 'Original partner logo' })
    expect(logo).toHaveAttribute('src', 'https://cdn.sanity.io/partner-logo.png')
    expect(logo.className).toContain('object-contain')
    expect(logo.className).not.toContain('grayscale')
  })
})

describe('PartnerDetail', () => {
  it('preserves full descriptions, normalized contact links and gallery alt text', () => {
    render(<PartnerDetail partner={partner({ website: 'example.com', email: 'hello@example.com', address: 'Lake of the Ozarks', images: [{ _type: 'image', asset: { _type: 'reference', _ref: 'image-one' } }] })} backLink="/wedding-partners" categoryLabel="Wedding Partners" displayCategory="Venues & Destinations" blurb="Wedding introduction." description="Unabridged wedding description." />)
    expect(screen.getByText('Unabridged wedding description.')).toBeInTheDocument()
    expect(screen.getByText('Wedding introduction.')).toBeInTheDocument()
    expect(screen.getByText('Venues & Destinations')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Visit Lake Venue website/ })).toHaveAttribute('href', 'https://example.com/')
    expect(screen.getByRole('link', { name: 'hello@example.com' })).toHaveAttribute('href', 'mailto:hello@example.com')
    expect(screen.getByRole('img', { name: 'Lake Venue - Image 1' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Wedding Partners' })).toHaveAttribute('href', '/wedding-partners')
  })
})


describe('PartnerDirectoryShell', () => {
  it('retains the directory title, navigation and original contact CTA', () => {
    render(<PartnerDirectoryShell title="Wedding Partners" description="Trusted local wedding professionals." currentPath="/wedding-partners" ctaTitle="Planning a Wedding at the Lake?" ctaDescription="Let us handle your transportation needs." ctaLabel="Request a Quote"><p>Directory content</p></PartnerDirectoryShell>)
    expect(screen.getByRole('heading', { level: 1, name: 'Wedding Partners' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Wedding Partners' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Request a Quote' })).toHaveAttribute('href', '/contact')
    expect(screen.getByText('Directory content')).toBeInTheDocument()
  })
})
