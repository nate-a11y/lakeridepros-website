import { describe, it, expect } from 'vitest'
import { convertStarRating } from '../google-reviews'

describe('Google Reviews Utility Functions', () => {
  describe('convertStarRating', () => {
    it('converts ONE to 1', () => {
      expect(convertStarRating('ONE')).toBe(1)
    })

    it('converts TWO to 2', () => {
      expect(convertStarRating('TWO')).toBe(2)
    })

    it('converts THREE to 3', () => {
      expect(convertStarRating('THREE')).toBe(3)
    })

    it('converts FOUR to 4', () => {
      expect(convertStarRating('FOUR')).toBe(4)
    })

    it('converts FIVE to 5', () => {
      expect(convertStarRating('FIVE')).toBe(5)
    })

    it('defaults to 5 for invalid ratings', () => {
      expect(convertStarRating('INVALID')).toBe(5)
      expect(convertStarRating('')).toBe(5)
      expect(convertStarRating('SIX')).toBe(5)
    })

    it('handles lowercase input gracefully', () => {
      // Function is case-sensitive, so lowercase should default to 5
      expect(convertStarRating('one')).toBe(5)
      expect(convertStarRating('five')).toBe(5)
    })
  })
})
