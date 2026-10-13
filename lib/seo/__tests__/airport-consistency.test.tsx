import { render, screen, cleanup } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AirportPage from '@/app/(site)/lake-ozarks-airport-transportation/page'
import KansasCityPage from '@/app/(site)/kansas-city-to-lake-ozarks/page'
import PricingPage from '@/app/(site)/pricing/page'
import { commercialAirports, commercialAirportOrderAnswer, nearestAirportAnswer, servedAirportsAnswer } from '@/lib/airport-copy'
import { homeFaqs } from '@/lib/homeFaqs'
import { getFAQsForService } from '@/lib/serviceFAQs'

vi.mock('@/lib/api/sanity', () => ({ getRandomTestimonialsLocal: vi.fn().mockResolvedValue([]) }))

function faqSchema(container: HTMLElement) {
  return [...container.querySelectorAll('script[type="application/ld+json"]')]
    .map(script => JSON.parse(script.textContent!))
    .find(schema => schema['@type'] === 'FAQPage') as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[]
    }
}

describe('airport geography consistency', () => {
  it('lists commercial airports COU, SGF, STL, MCI in both coverage and pricing', async () => {
    expect(commercialAirports.map(airport => airport.code)).toEqual(['COU', 'SGF', 'STL', 'MCI'])
    for (const page of [await AirportPage(), <PricingPage key="pricing" />]) {
      const { container } = render(page)
      const headings = [...container.querySelectorAll('h3')].map(heading => heading.textContent!)
      expect(headings.filter(heading => /\((COU|SGF|STL|MCI)\)$/.test(heading))).toEqual(
        commercialAirports.map(airport => `${airport.city} (${airport.code})`),
      )
      expect(container.textContent).toContain(commercialAirportOrderAnswer)
      cleanup()
    }
  })

  it('does not claim MCI is closest or conflate local private airports', async () => {
    const { container } = render(await AirportPage())
    expect(container.textContent).toContain(nearestAirportAnswer)
    expect(screen.getByRole('heading', { name: 'Lee C. Fine Memorial (AIZ)' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Grand Glaize (K15)' })).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/also known as Grand Glaize|Lee C\. Fine Memorial Airport \(KOZS\)/)
  })

  it('keeps the corrected airport answers identical in visible FAQs and schema', async () => {
    for (const page of [await AirportPage(), await KansasCityPage()]) {
      const { container } = render(page)
      for (const question of faqSchema(container).mainEntity) {
        const details = screen.getByText(question.name, { selector: 'summary' }).closest('details')!
        expect(details.querySelector('p')!.textContent).toBe(question.acceptedAnswer.text)
      }
      expect(container.textContent).not.toMatch(/MCI is the closest|MCI Airport\) is slightly closer|Shortest Route/)
      expect(container.textContent).toContain('route, and traffic')
      cleanup()
    }
  })

  it('uses the same ordered airport coverage answer on the homepage and service', () => {
    expect(homeFaqs.find(faq => faq.question === 'Which airports do you serve?')?.answer).toBe(servedAirportsAnswer)
    expect(getFAQsForService('airport-transfers').find(faq => faq.question === 'Which airports do you service from Lake of the Ozarks?')?.answer).toBe(servedAirportsAnswer)
  })
})
