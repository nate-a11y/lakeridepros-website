import { describe, it, expect, beforeEach, vi } from 'vitest'
import { formatPrice, formatDate, truncateText, slugify, getMediaUrl, cn } from '../utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
      expect(cn('foo', false && 'bar')).toBe('foo')
    })

    it('handles conditional classes', () => {
      const isActive = true
      expect(cn('base', isActive && 'active')).toBe('base active')
    })
  })

  describe('formatPrice', () => {
    it('formats price as USD currency with cents', () => {
      expect(formatPrice(10.99)).toBe('$10.99')
      expect(formatPrice(100)).toBe('$100.00')
      expect(formatPrice(0.5)).toBe('$0.50')
    })

    it('formats large prices with comma separators', () => {
      expect(formatPrice(1000)).toBe('$1,000.00')
      expect(formatPrice(1234.56)).toBe('$1,234.56')
      expect(formatPrice(1000000)).toBe('$1,000,000.00')
    })

    it('handles zero correctly', () => {
      expect(formatPrice(0)).toBe('$0.00')
    })

    it('handles negative prices', () => {
      expect(formatPrice(-10.99)).toBe('-$10.99')
    })
  })

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const result = formatDate('2024-01-15')
      expect(result).toBe('January 15, 2024')
    })

    it('formats Date object correctly', () => {
      const date = new Date('2024-12-25T00:00:00Z')
      const result = formatDate(date)
      expect(result).toContain('December')
      expect(result).toContain('2024')
    })

    it('handles ISO date strings', () => {
      const result = formatDate('2024-06-30T12:00:00Z')
      expect(result).toContain('June')
      expect(result).toContain('2024')
    })
  })

  describe('truncateText', () => {
    it('truncates text longer than maxLength', () => {
      const text = 'This is a very long text that needs to be truncated'
      const result = truncateText(text, 20)
      expect(result).toBe('This is a very long ...')
      expect(result.length).toBe(23) // 20 chars + '...'
    })

    it('returns original text if shorter than maxLength', () => {
      const text = 'Short text'
      expect(truncateText(text, 20)).toBe('Short text')
    })

    it('returns original text if exactly maxLength', () => {
      const text = 'Exact length'
      expect(truncateText(text, 12)).toBe('Exact length')
    })

    it('trims whitespace before adding ellipsis', () => {
      const text = 'Text with space at cutoff '
      const result = truncateText(text, 15)
      expect(result).toBe('Text with space...')
    })

    it('handles empty string', () => {
      expect(truncateText('', 10)).toBe('')
    })
  })

  describe('slugify', () => {
    it('converts text to lowercase slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('UPPERCASE TEXT')).toBe('uppercase-text')
    })

    it('removes special characters', () => {
      expect(slugify('Test & Demo!')).toBe('test-demo')
      expect(slugify('Price: $99.99')).toBe('price-9999')
      expect(slugify('Email@example.com')).toBe('emailexamplecom')
    })

    it('replaces spaces with hyphens', () => {
      expect(slugify('Multiple Word Title')).toBe('multiple-word-title')
      expect(slugify('Lots   of   spaces')).toBe('lots-of-spaces')
    })

    it('removes multiple consecutive hyphens', () => {
      expect(slugify('Test---Multiple---Hyphens')).toBe('test-multiple-hyphens')
    })

    it('trims leading and trailing spaces', () => {
      expect(slugify('  spaces around  ')).toBe('spaces-around')
    })

    it('handles already slugified text', () => {
      expect(slugify('already-slugified')).toBe('already-slugified')
    })

    it('handles numbers', () => {
      expect(slugify('Product 123')).toBe('product-123')
    })

    it('handles empty string', () => {
      expect(slugify('')).toBe('')
    })
  })

  describe('getMediaUrl', () => {
    beforeEach(() => {
      // Reset environment variables
      delete process.env.NEXT_PUBLIC_PAYLOAD_API_URL
      delete process.env.NEXT_PUBLIC_SERVER_URL
    })

    it('returns empty string for empty input', () => {
      expect(getMediaUrl('')).toBe('')
    })

    it('returns original URL if it starts with http', () => {
      expect(getMediaUrl('http://example.com/image.jpg')).toBe('http://example.com/image.jpg')
      expect(getMediaUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
    })

    it('prepends NEXT_PUBLIC_PAYLOAD_API_URL for relative URLs', () => {
      process.env.NEXT_PUBLIC_PAYLOAD_API_URL = 'http://api.example.com'
      expect(getMediaUrl('/media/image.jpg')).toBe('http://api.example.com/media/image.jpg')
    })

    it('falls back to NEXT_PUBLIC_SERVER_URL if PAYLOAD_API_URL not set', () => {
      process.env.NEXT_PUBLIC_SERVER_URL = 'http://server.example.com'
      expect(getMediaUrl('/media/image.jpg')).toBe('http://server.example.com/media/image.jpg')
    })

    it('falls back to localhost if no env vars set', () => {
      expect(getMediaUrl('/media/image.jpg')).toBe('http://localhost:3001/media/image.jpg')
    })

    it('handles URLs without leading slash', () => {
      process.env.NEXT_PUBLIC_PAYLOAD_API_URL = 'http://api.example.com'
      expect(getMediaUrl('media/image.jpg')).toBe('http://api.example.com/media/image.jpg')
    })
  })
})
