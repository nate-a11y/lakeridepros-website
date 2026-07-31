import { describe, expect, it } from 'vitest'
import { normalizeExternalWebsiteUrl } from '../external-url'

describe('normalizeExternalWebsiteUrl', () => {
  it('adds HTTPS to a bare domain', () => {
    expect(normalizeExternalWebsiteUrl('www.mainstreetmusichall.com')).toBe(
      'https://www.mainstreetmusichall.com/',
    )
  })

  it('preserves absolute HTTP and HTTPS URLs', () => {
    expect(normalizeExternalWebsiteUrl('https://example.com/events')).toBe(
      'https://example.com/events',
    )
    expect(normalizeExternalWebsiteUrl('http://example.com')).toBe('http://example.com/')
  })

  it('rejects empty and malformed values', () => {
    expect(normalizeExternalWebsiteUrl()).toBeNull()
    expect(normalizeExternalWebsiteUrl('')).toBeNull()
    expect(normalizeExternalWebsiteUrl('not a website')).toBeNull()
  })
})
