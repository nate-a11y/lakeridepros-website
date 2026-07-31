import { describe, expect, it } from 'vitest'

import { metaDescription } from '../metadata'

describe('metaDescription', () => {
  it('supplements useful descriptions that are too short', () => {
    const description = metaDescription(
      'Plan reliable airport transportation at Lake of the Ozarks.',
      'Compare pickup options, group capacity, timing, and local travel tips from Lake Ride Pros.',
    )

    expect(description).toContain('Plan reliable airport transportation')
    expect(description.length).toBeGreaterThanOrEqual(120)
    expect(description.length).toBeLessThanOrEqual(155)
  })

  it('does not append fallback copy to an already complete description', () => {
    const input = 'A'.repeat(120)

    expect(metaDescription(input, 'Fallback copy should not be included.')).toBe(input)
  })

  it('uses fallback copy when the primary description is empty', () => {
    expect(metaDescription('', 'Fallback description.', 155, 0)).toBe('Fallback description.')
  })
})
