import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LocationEditorialList from '@/components/location/LocationEditorialList'
import LocationFAQs, { buildLocationFAQSchema } from '@/components/location/LocationFAQs'
import LocationSection from '@/components/location/LocationSection'
import LocationHero from '@/components/location/LocationHero'
import LocationCTA from '@/components/location/LocationCTA'

const faq = [
  { question: 'Can you pick up at Old Kinderhook?', answer: 'Yes. Confirm your itinerary and group size.' },
]

describe('Location editorial content', () => {
  it('preserves the internal booking journey and phone-options action in the hero', () => {
    render(
      <LocationHero
        title="Transportation in Camdenton, Missouri"
        introduction={<p>Serving Old Kinderhook and downtown Camdenton.</p>}
        image={{ src: '/placeholder-vehicle.jpg', alt: 'Lake Ride Pros shuttle' }}
        bookingLabel="Book Your Camdenton Ride"
        bookingLocation="camdenton-hero"
        bookingHref="/book"
      />,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Camdenton, Missouri')
    expect(screen.getByRole('link', { name: 'Book Your Camdenton Ride' })).toHaveAttribute('href', '/book')
    expect(
      screen.getByRole('button', { name: 'Call Lake Ride Pros - Opens phone options' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Lake Ride Pros shuttle' })).toHaveClass('object-contain')
  })

  it('retains closing conversion labels and route-specific introduction markup', () => {
    render(
      <LocationCTA
        title="Book Your Columbia Shuttle"
        description={<p>Direct service from Columbia to the Lake.</p>}
        bookingLabel="Book Your Shuttle"
        bookingLocation="columbia-close"
        bookingHref="/book"
        phoneLabel="(573) 206-9499"
      />,
    )
    expect(screen.getByRole('link', { name: 'Book Your Shuttle' })).toHaveAttribute('href', '/book')
    expect(screen.getByText('Direct service from Columbia to the Lake.')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent('(573) 206-9499')
  })

  it('preserves local descriptions and nested route links without nesting anchors', () => {
    const { container } = render(
      <LocationEditorialList
        items={[
          {
            title: 'Old Kinderhook',
            href: '/services/wedding-transportation',
            description: (
              <p>
                Wedding pickup in Camdenton. Also see{' '}
                <a href="/transportation-osage-beach">Osage Beach transfers</a>.
              </p>
            ),
          },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Old Kinderhook')
    expect(screen.getByRole('link', { name: /Old Kinderhook/ })).toHaveAttribute(
      'href',
      '/services/wedding-transportation',
    )
    expect(screen.getByRole('link', { name: 'Osage Beach transfers' })).toHaveAttribute(
      'href',
      '/transportation-osage-beach',
    )
    expect(container.querySelector('a a')).toBeNull()
  })

  it('keeps sections named and preserves arbitrary route-specific content', () => {
    render(
      <LocationSection id="routes" title="Common Columbia Routes">
        <ul>
          <li>University of Missouri to Tan-Tar-A Resort</li>
        </ul>
      </LocationSection>,
    )
    expect(screen.getByRole('region', { name: 'Common Columbia Routes' })).toBeInTheDocument()
    expect(screen.getByText('University of Missouri to Tan-Tar-A Resort')).toBeInTheDocument()
  })

  it('renders native server-readable FAQs without duplicating existing schema', () => {
    const { container } = render(<LocationFAQs title="Camdenton FAQs" items={faq} />)
    expect(container.querySelector('details > summary')).toHaveTextContent(faq[0].question)
    expect(screen.getByText(faq[0].answer)).toBeInTheDocument()
    expect(container.querySelector('script')).toBeNull()
  })

  it('derives optional schema from the same answers and escapes script terminators', () => {
    const items = [{ question: 'Special pickup?', answer: '</script><script>alert(1)</script>' }]
    const { container } = render(<LocationFAQs title="FAQs" items={items} includeSchema />)
    const scripts = container.querySelectorAll('script')
    expect(scripts).toHaveLength(1)
    expect(scripts[0].textContent).not.toContain('</script>')
    expect(JSON.parse(scripts[0].textContent ?? '{}')).toEqual(buildLocationFAQSchema(items))
  })

  it('retains optional linked answer markup', () => {
    render(
      <LocationFAQs
        title="FAQs"
        items={[
          {
            ...faq[0],
            displayAnswer: (
              <p>
                Yes. <a href="/book">Confirm your itinerary and group size.</a>
              </p>
            ),
          },
        ]}
      />,
    )
    expect(screen.getByRole('link', { name: 'Confirm your itinerary and group size.' })).toHaveAttribute(
      'href',
      '/book',
    )
  })

  it('omits empty FAQ sections and schema', () => {
    const { container } = render(<LocationFAQs title="FAQs" items={[]} includeSchema />)
    expect(container).toBeEmptyDOMElement()
  })
})
