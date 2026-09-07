import { writeFileSync } from 'node:fs'
import styles from './SupportEditorial.module.css'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const { getPageBySlug } = vi.hoisted(() => ({ getPageBySlug: vi.fn() }))
vi.mock('@/lib/api/sanity', () => ({ getPageBySlug, getMediaUrl: () => '/og-image.jpg' }))
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NOT_FOUND') } }))
import DynamicPage, { generateMetadata } from '@/app/(site)/[slug]/page'

const fixture = {
  title: 'Lake Ride Pros information',
  meta: { title: 'CMS title', description: 'CMS description' },
  content: [{ _type: 'block', _key: 'intro', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 'text', text: 'Original CMS information.', marks: [] }] }],
}

describe('CMS editorial page', () => {
  it.each([false, true])('preserves a single title and CMS body, featured image: %s', async (withImage) => {
    getPageBySlug.mockResolvedValue({ ...fixture, ...(withImage ? { featuredImage: { asset: { _ref: 'fixture' }, alt: 'Original image description' } } : {}) })
    const { container } = render(await DynamicPage({ params: Promise.resolve({ slug: 'fixture' }) }))
    if (process.env.LRP_QA_FIXTURES) {
      writeFileSync(`${process.env.LRP_QA_FIXTURES}/cms-${withImage ? 'image' : 'text'}.json`, JSON.stringify({ html: container.innerHTML, styles: Object.fromEntries(['page', 'reading', 'cmsHero', 'cmsHeroImage'].map(name => [name, styles[name]])) }))
    }
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByText('Original CMS information.')).toBeInTheDocument()
    expect(container.querySelector('main')).toBeNull()
    if (withImage) expect(screen.getByRole('img')).toHaveAttribute('alt', 'Original image description')
    else expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(await generateMetadata({ params: Promise.resolve({ slug: 'fixture' }) })).toEqual({
      title: 'CMS title', description: 'CMS description', openGraph: { title: 'CMS title', description: 'CMS description', type: 'website' },
    })
  })
  it('preserves not-found handling', async () => {
    getPageBySlug.mockResolvedValue(null)
    await expect(DynamicPage({ params: Promise.resolve({ slug: 'missing' }) })).rejects.toThrow('NOT_FOUND')
    expect(await generateMetadata({ params: Promise.resolve({ slug: 'missing' }) })).toEqual({ title: 'Page Not Found' })
  })
})
