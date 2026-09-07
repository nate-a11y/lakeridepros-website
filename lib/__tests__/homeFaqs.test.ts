import { describe, expect, it } from 'vitest'
import { homeFaqs } from '@/lib/homeFaqs'
import { faqSchema, localBusinessSchema, organizationSchema } from '@/lib/schemas'

describe('homepage answer and entity data', () => {
  it('keeps the visible FAQ source identical to FAQPage structured data', () => {
    expect(faqSchema.mainEntity).toEqual(homeFaqs.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })))
  })

  it('describes the Lake home base and Missouri-wide service consistently', () => {
    expect(localBusinessSchema.description).toMatch(/Lake of the Ozarks/i)
    expect(localBusinessSchema.description).toMatch(/throughout Missouri/i)
    expect(localBusinessSchema.areaServed).toContainEqual({ '@type': 'State', name: 'Missouri' })
    expect(organizationSchema.description).toMatch(/throughout Missouri/i)
    expect(organizationSchema.contactPoint.areaServed).toBe('Missouri')
  })
})
