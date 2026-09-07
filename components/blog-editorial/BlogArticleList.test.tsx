import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { BlogPost } from '@/types/sanity'
import BlogArticleList, { getCategoryLabel } from './BlogArticleList'

const post = {
  _id: 'article-1', slug: { current: 'airport-guide' }, title: 'A complete airport transportation guide',
  excerpt: 'The full CMS excerpt stays readable, including this final sentence.',
  publishedDate: '2026-06-27T12:00:00Z', categories: ['guides'],
} as BlogPost

describe('editorial blog archive', () => {
  it('preserves full article text and crawlable normalized slug links', () => {
    render(<BlogArticleList posts={[post]} currentPage={1} totalPages={1} />)
    expect(screen.getByRole('link', { name: `Read article: ${post.title}` })).toHaveAttribute('href', '/blog/airport-guide')
    expect(screen.getByText(post.excerpt)).toBeVisible()
    expect(screen.getByText('Tips & Guides')).toBeVisible()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('retains canonical page-one navigation and current-page semantics', () => {
    render(<BlogArticleList posts={[post]} currentPage={2} totalPages={3} />)
    expect(screen.getByRole('link', { name: 'Previous' })).toHaveAttribute('href', '/blog')
    expect(screen.getByRole('link', { name: 'Blog page 2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute('href', '/blog?page=3')
  })

  it('preserves the empty state and unknown CMS category names', () => {
    render(<BlogArticleList posts={[]} currentPage={1} totalPages={1} />)
    expect(screen.getByText('Blog posts will be available soon. Check back later for updates!')).toBeVisible()
    expect(getCategoryLabel('Lake news')).toBe('Lake news')
  })
})
