import { describe, expect, it } from 'vitest'
import {
  createProductExcerpt,
  parseProductDescription,
} from '../product-description'

const description = [
  {
    _type: 'block',
    children: [
      {
        text: 'This cropped sweatshirt brings together casual ease and a touch of attitude. The soft fabric moves effortlessly.<br/><br/>Product features<br/>- Soft cotton blend<br/>- Relaxed fit<br/><br/>Care instructions<br/>- Machine wash: cold<br/>- Do not dryclean<br/>',
      },
    ],
  },
]

describe('product descriptions', () => {
  it('preserves the complete description and structures headings and lists', () => {
    expect(parseProductDescription(description)).toEqual([
      {
        type: 'paragraph',
        text: 'This cropped sweatshirt brings together casual ease and a touch of attitude. The soft fabric moves effortlessly.',
      },
      { type: 'heading', text: 'Product features' },
      { type: 'list', items: ['Soft cotton blend', 'Relaxed fit'] },
      { type: 'heading', text: 'Care instructions' },
      { type: 'list', items: ['Machine wash: cold', 'Do not dryclean'] },
    ])
  })

  it('creates a word-safe excerpt instead of cutting through a word', () => {
    const excerpt = createProductExcerpt(description, 90)
    expect(excerpt.endsWith('…')).toBe(true)
    expect(excerpt.endsWith(' att…')).toBe(false)
    expect(excerpt.length).toBeLessThanOrEqual(91)
  })
})
