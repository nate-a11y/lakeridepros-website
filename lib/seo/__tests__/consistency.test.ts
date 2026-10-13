import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import PricingPage from '@/app/(site)/pricing/page'
import { describe, expect, it } from 'vitest'
import { serviceFAQs, getFAQsForService, generateFAQSchema } from '@/lib/serviceFAQs'
import { cancellationPolicyAnswer } from '@/lib/homeFaqs'
import { pricingFeesAnswer } from '@/lib/pricing-copy'
import { localBusinessSchema, organizationSchema } from '@/lib/schemas'
import { externalWebsiteUrl } from '@/lib/seo/external-website-url'
import { getPageNumber } from '@/lib/seo/pagination'
import robots from '@/app/robots'

describe('public SEO consistency', () => {
  it('ties service fee answers to the actual pricing page text and JSON-LD', () => {
    const { container } = render(createElement(PricingPage))
    const question = screen.getByText('Are there any hidden fees?', { selector: 'summary' }).closest('details')!
    const visibleAnswer = question.querySelector('p')!.textContent!
    const schema = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!)
    const schemaAnswer = schema.mainEntity.find((entry: { name: string }) => entry.name === 'Are there any hidden fees?').acceptedAnswer.text
    const serviceAnswer = serviceFAQs.default.find(faq => faq.question === 'What is included in the service price?')!.answer
    expect(visibleAnswer).toContain(serviceAnswer)
    expect(schemaAnswer).toBe(serviceAnswer)
  })

  it('uses the published cancellation terms for every specific and default FAQ', () => {
    for (const faqs of Object.values(serviceFAQs)) {
      for (const faq of faqs.filter(faq => /cancellation policy/i.test(faq.question))) {
        expect(faq.answer).toBe(cancellationPolicyAnswer)
        expect(faq.answer).toContain('50% refund')
      }
    }
    expect(serviceFAQs.default.find(faq => faq.question === 'What is included in the service price?')?.answer).toBe(pricingFeesAnswer)
  })

  it('resolves actual public service slugs and keeps the rendered/schema FAQs identical', () => {
    expect(getFAQsForService('airport-transfers')).toEqual(serviceFAQs['airport-shuttle'])
    expect(getFAQsForService('party-bus-nightlife')).toEqual(serviceFAQs['party-bus'])
    for (const slug of ['airport-transfers', 'wedding-transportation', 'taxi-service']) {
      expect(generateFAQSchema(slug, slug).mainEntity.map(question => question.acceptedAnswer.text)).toEqual(getFAQsForService(slug).map(faq => faq.answer))
    }
  })

  it('does not publish a competing party-bus rate or deferred payment promise', () => {
    const faqs = getFAQsForService('party-bus-nightlife')
    expect(faqs.find(faq => /minimum rental time/.test(faq.question))?.answer).toContain('current pricing guide')
    expect(faqs.find(faq => /deposit required/.test(faq.question))?.answer).toContain('Payment is required at booking')
    expect(JSON.stringify(faqs)).not.toContain('24-48 hours before your event')
  })

  it('uses one business identity and an existing public logo without a filtered aggregate', () => {
    expect(localBusinessSchema['@id']).toBe(organizationSchema['@id'])
    expect(localBusinessSchema.logo).toBe(organizationSchema.logo)
    expect(localBusinessSchema.logo).not.toContain('/logo.png')
    expect(localBusinessSchema).not.toHaveProperty('aggregateRating')
  })

  it('applies the same private-path exclusions to generic and named crawlers', () => {
    const rules = robots().rules
    expect(rules).not.toBeInstanceOf(Array)
    expect(rules).toMatchObject({ disallow: expect.arrayContaining(['/checkout/', '/giveaways-admin', '/bridal-show-admin', '/studio']) })
  })

  it.each([[undefined, 1], ['2', 2], ['0', null], ['-1', null], ['1.5', null], ['1e2', null], ['9007199254740992', null]])('validates pagination %s', (input, expected) => {
    expect(getPageNumber(input as string | undefined)).toBe(expected)
  })

  it.each([
    ['livemu.sc', 'https://livemu.sc/'],
    ['https://example.com/tickets', 'https://example.com/tickets'],
    ['//example.com', 'https://example.com/'],
    ['javascript:alert(1)', undefined],
    ['data:text/html,hello', undefined],
    ['not a website', undefined],
  ])('normalizes external website links safely: %s', (input, expected) => {
    expect(externalWebsiteUrl(input)).toBe(expected)
  })
})
