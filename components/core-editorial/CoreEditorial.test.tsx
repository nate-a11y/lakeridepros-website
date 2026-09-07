import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import CorePage from './CorePage'
import CoreHero from './CoreHero'
import GiftCardsPage from '@/app/(site)/gift-cards/page'

describe('Core public editorial surfaces', () => {
  it('preserves page attribution, schema and links without adding a second main landmark', () => {
    const { container } = render(
      <CorePage data-page="booking">
        <script type="application/ld+json">{'{"@type":"Service"}'}</script>
        <a href="/book">Book Your Ride</a>
      </CorePage>,
    )
    expect(container.querySelector('[data-page="booking"]')).toBeInTheDocument()
    expect(container.querySelector('main')).toBeNull()
    expect(container.querySelector('script')?.textContent).toBe('{"@type":"Service"}')
    expect(screen.getByRole('link')).toHaveAttribute('href', '/book')
  })

  it.each([
    ['sprinter', 'Lake Ride Pros Executive Sprinter beside a private aircraft'],
    ['pinkPatrol', 'The Pink Patrol, Lake Ride Pros specialty celebration shuttle'],
    ['music', 'Lake Ride Pros Hi! My Name Is album cover'],
  ] as const)('renders real %s imagery without cropping or replacing route copy', (image, alt) => {
    render(
      <CoreHero image={image} compact>
        <h1 id="page-title">Your original page title</h1>
        <p>Your original introduction.</p>
      </CoreHero>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your original page title')
    expect(screen.getByRole('img', { name: alt })).toHaveClass('object-contain')
    expect(screen.getByText('Your original introduction.')).toBeInTheDocument()
  })

  it('announces gift selections and preserves conditional shipping and delivery fields', async () => {
    const user = userEvent.setup()
    render(<GiftCardsPage />)
    const physical = screen.getByRole('button', { name: /Physical/ })
    await user.click(physical)
    expect(physical).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByLabelText(/Full Name/)).toBeRequired()
    await user.click(screen.getByRole('button', { name: /Digital/ }))
    expect(screen.queryByLabelText(/Full Name/)).not.toBeInTheDocument()
    const schedule = screen.getByRole('button', { name: /Schedule/ })
    await user.click(schedule)
    expect(schedule).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByLabelText(/Delivery Date/)).toBeRequired()
  })
})
