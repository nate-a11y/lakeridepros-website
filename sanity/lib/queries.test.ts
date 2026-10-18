import { describe, expect, it } from 'vitest'
import { blogPostBySlugQuery } from './queries'

describe('public blog detail query', () => {
  it('requires a matching slug, published status, and a publication date that has arrived', () => {
    expect(blogPostBySlugQuery).toContain('slug.current == $slug')
    expect(blogPostBySlugQuery).toContain('published == true')
    expect(blogPostBySlugQuery).toContain('publishedDate <= now()')
  })
})
