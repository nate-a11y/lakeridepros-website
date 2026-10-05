import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PricingPage from '../page'

interface FaqQuestion {
  name: string
  acceptedAnswer: { text: string }
}

function renderPricing() {
  const { container } = render(<PricingPage />)
  const schema = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!) as {
    mainEntity: FaqQuestion[]
  }
  return { container, questions: schema.mainEntity }
}

function faq(question: string) {
  return screen.getByText(question, { selector: 'summary' }).closest('details')!
}

describe('/pricing discount and fee disclosures', () => {
  it('removes all Reserve cards and advance-booking discount promises, including structured data', () => {
    const { container, questions } = renderPricing()
    const copy = container.textContent!
    expect(copy).not.toMatch(/\breserve\b|SAVE 10%|Book (24|48)\+|10% off Flex/i)
    expect(JSON.stringify(questions)).not.toMatch(/\breserve\b|Book (24|48)\+|10% off Flex/i)
    expect(screen.getAllByRole('heading', { name: 'Flex' })).toHaveLength(2)
    expect(screen.getAllByRole('heading', { name: 'Elite' })).toHaveLength(2)
  })

  it('labels larger-vehicle transfers as point-to-point minimums rather than flat rates', () => {
    renderPricing()
    expect(screen.getByRole('heading', { name: 'Larger Vehicles (Point-to-Point Minimums)' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Larger Vehicles (Flat Rate)' })).not.toBeInTheDocument()
    expect(screen.getByText('First-five-mile packages, then per-mile pricing for sedans and SUVs. Point-to-point minimums for larger vehicles.')).toBeInTheDocument()
  })

  it('routes the savings callout and FAQ to the existing Insiders enrollment page', () => {
    renderPricing()
    const links = screen.getAllByRole('link', { name: /sign up for the insiders program/i })
    expect(links).toHaveLength(2)
    links.forEach(link => expect(link).toHaveAttribute('href', '/insider-membership-benefits'))
    expect(links[0]).toHaveClass('focus-visible:outline-2', 'focus-visible:outline-offset-4')
    expect(faq('How can I get discounted rates?')).toHaveTextContent('eligible rides')
    expect(faq('How can I get discounted rates?')).toHaveTextContent('membership tier and program terms')
  })

  it.each([
    'How do I get an exact quote?',
    'How much does Lake of the Ozarks transportation cost?',
    'How is point-to-point pricing calculated?',
    'Which vehicles have a booking fee?',
    'Are there any hidden fees?',
    'Is there a fuel surcharge?',
    'Is there a credit card processing fee?',
    'How can I get discounted rates?',
  ])('keeps the %s disclosure consistent with FAQ structured data', question => {
    const { questions } = renderPricing()
    const answer = questions.find(entry => entry.name === question)!.acceptedAnswer.text
    expect(faq(question).querySelector('p')!.textContent).toContain(answer)
  })

  it('explains booking fees, gratuity and the 3% credit card fee without implying all payments are surcharged', () => {
    renderPricing()
    const hiddenFees = faq('Are there any hidden fees?')
    expect(hiddenFees).toHaveTextContent('any applicable booking fee')
    expect(hiddenFees).toHaveTextContent('Credit card payments incur a 3% processing fee')
    expect(hiddenFees).toHaveTextContent('Gratuity is not included')
    expect(hiddenFees).not.toHaveTextContent('The only additional charges')
    expect(faq('Is there a credit card processing fee?')).toHaveTextContent('listed transportation rates do not include this fee')
    expect(faq('What forms of payment do you accept?')).toHaveTextContent('3% processing fee')
  })

  it('publishes the updated Black rate in the FAQ and structured data', () => {
    const { container, questions } = renderPricing()
    expect(faq('How much does Lake of the Ozarks transportation cost?')).toHaveTextContent('Black $120/hr (1-hour minimum)')
    expect(questions.find(entry => entry.name === 'How much does Lake of the Ozarks transportation cost?')!.acceptedAnswer.text).toContain('Black $120/hr (1-hour minimum)')
    expect(container.textContent).not.toContain('$140')
  })

  it('uses validated hourly rates and preserves the Black advance-booking requirement', () => {
    renderPricing()
    for (const [name, rate] of [['Flex', '$80'], ['Elite', '$100'], ['LRP Black', '$120']] as const) {
      const cards = screen.getAllByRole('heading', { name })
      const hourlyCard = cards[1].parentElement!
      expect(within(hourlyCard).getByText(rate, { exact: false })).toHaveTextContent(`${rate}/hour`)
      expect(hourlyCard).toHaveTextContent('1-hour minimum')
    }
    expect(screen.getByRole('heading', { name: 'Sedans & SUVs (Hourly Rates)' })).toBeInTheDocument()
    expect(screen.queryByText(/Flat rate all hours/)).not.toBeInTheDocument()
    expect(screen.getByText('24hr advance required')).toBeInTheDocument()
  })

  it.each([
    ['Flex', '$15', '$2.25/mi', '$1.85/mi'],
    ['Elite', '$20', '$2.50/mi', '$2.15/mi'],
    ['LRP Black', '$25', '$2.90/mi', '$2.60/mi'],
  ])('shows the three validated %s transfer tiers without a booking fee', (name, opening, next, remaining) => {
    renderPricing()
    const card = screen.getAllByRole('heading', { name })[0].parentElement!
    expect(card).toHaveTextContent(`${opening} flat`)
    expect(card).toHaveTextContent(`${opening} minimum`)
    expect(card).toHaveTextContent('First 5 miles')
    expect(card).toHaveTextContent(`Miles 6–50${next}`)
    expect(card).toHaveTextContent(`After 50 miles${remaining}`)
    expect(card).toHaveTextContent('Booking feeNone')
    expect(card).not.toHaveTextContent('First 50 miles')
  })

  it.each([
    ['Limo Bus', '$80', '$10', '$90'],
    ['Rescue Squad', '$80', '$10', '$90'],
    ['Luxury Sprinter', '$175', '$10', '$185'],
    ['Pink Patrol', '$250', '$20', '$270'],
    ['Luxury Shuttle', '$400', '$20', '$420'],
  ])('distinguishes %s base minimum, booking fee, and fee-inclusive starting charge', (name, base, fee, total) => {
    renderPricing()
    const card = screen.getAllByRole('heading', { name })[0].parentElement!
    expect(card).toHaveTextContent(`${base} base minimum`)
    expect(card).toHaveTextContent(`${fee} booking fee · from ${total} before other charges`)
  })

  it.each([
    ['Limo Bus', '$130', '$110'],
    ['Rescue Squad', '$130', '$110'],
    ['Luxury Sprinter', '$175', '$155'],
  ])('keeps the %s three-hour tier independent of its four-hour weekend minimum', (name, first, later) => {
    renderPricing()
    const card = screen.getAllByRole('heading', { name })[1].parentElement!
    expect(card).toHaveTextContent('3-hour minimum (4 hours weekends)')
    expect(card).toHaveTextContent(`First 3 hrs: ${first}/hr`)
    expect(card).toHaveTextContent(`After 3 hrs: ${later}/hr`)
    expect(card).not.toHaveTextContent('First 3-4 hrs')
  })

  it('shows both Pink Patrol weekday/weekend tiers and keeps the Shuttle hourly rate separate from its transfer minimum', () => {
    renderPricing()
    const pink = screen.getAllByRole('heading', { name: 'Pink Patrol' })[1].parentElement!
    expect(pink).toHaveTextContent('Weekdays: first 3 hrs $225/hr; then $200/hr')
    expect(pink).toHaveTextContent('Weekends: first 4 hrs $250/hr; then $225/hr')
    const shuttle = screen.getAllByRole('heading', { name: 'Luxury Shuttle' })[1].parentElement!
    expect(shuttle).toHaveTextContent('$275/hour')
    expect(shuttle).toHaveTextContent('2-hour minimum')
  })

  it('explains incremental mileage, minimum floors, and positioning charges without quoting them as all-in fares', () => {
    renderPricing()
    expect(faq('How is point-to-point pricing calculated?')).toHaveTextContent('$32.50')
    expect(faq('How is point-to-point pricing calculated?')).toHaveTextContent('not a surcharge added to every mile')
    expect(faq('How is point-to-point pricing calculated?')).toHaveTextContent('Vehicle positioning')
    expect(faq('Which vehicles have a booking fee?')).toHaveTextContent('Flex, Elite, and LRP Black have no booking fee')
  })


  it('discloses the variable fuel surcharge on every reservation without implying fuel is entirely included', () => {
    const { container } = renderPricing()
    const fuel = faq('Is there a fuel surcharge?')
    expect(fuel).toHaveTextContent('applies to all reservations')
    expect(fuel).toHaveTextContent('currently 5%')
    expect(fuel).toHaveTextContent('may change based on current fuel prices')
    expect(fuel).toHaveTextContent('disclosed in your quote before you book')
    expect(faq('Are there any hidden fees?')).toHaveTextContent('currently 5%')
    expect(faq('What is included in your pricing?')).toHaveTextContent('fuel surcharge')
    expect(container).not.toHaveTextContent('All fuel costs and major route tolls included')
  })


  it('lists Pink Patrol before Luxury Shuttle in the point-to-point minimums', () => {
    renderPricing()
    const heading = screen.getByRole('heading', { name: 'Larger Vehicles (Point-to-Point Minimums)' })
    const cards = heading.nextElementSibling! as HTMLElement
    expect(within(cards).getAllByRole('heading').map(heading => heading.textContent)).toEqual([
      'Limo Bus', 'Rescue Squad', 'Luxury Sprinter', 'Pink Patrol', 'Luxury Shuttle',
    ])
  })


  it('makes website booking the first step for quotes, with a Book Now link in the FAQ', () => {
    const { container, questions } = renderPricing()
    const exactQuote = faq('How do I get an exact quote?')
    expect(exactQuote).toHaveTextContent('Click Book Now on the Lake Ride Pros website to get a quote')
    expect(exactQuote).toHaveTextContent('no obligation to book')
    expect(exactQuote).not.toHaveTextContent('(573)')
    expect(within(exactQuote).getByRole('link', { name: 'Book Now' })).toHaveAttribute('href', '/book')
    expect(container.textContent).not.toMatch(/Call for exact quotes|Call\/Text for Quote|Call us at.*online booking form|Call \(573\) 206-9499 for (instant|custom) quote/)
    expect(JSON.stringify(questions)).not.toContain('Call us at')
    screen.getAllByRole('link', { name: 'Book Now' }).forEach(link => {
      expect(link).toHaveAttribute('href', '/book')
    })
  })


  it('centers the closing quote callout and its actions', () => {
    renderPricing()
    const callout = screen.getByRole('heading', { name: 'Ready to Get Your Free Quote?' }).parentElement!
    expect(callout).toHaveClass('text-center')
    expect(within(callout).getByRole('link', { name: 'Book Now' }).parentElement).toHaveClass('justify-center')
  })

})
