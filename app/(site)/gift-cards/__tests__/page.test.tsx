import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import GiftCardsPage from '../page'

const fetcher = vi.fn()
function fill(id: string, value: string) { fireEvent.change(document.getElementById(id)!, { target: { value } }) }
function purchase() { fireEvent.submit(screen.getByRole('button', { name: 'Purchase Gift Card' }).closest('form')!) }
beforeEach(() => {
  vi.stubGlobal('fetch', fetcher)
  fetcher.mockReset().mockImplementation(async () => Response.json({}))
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

it.each(['0', '9', '1001'])('rejects out-of-range custom amount %s before checkout', async amount => {
  render(<GiftCardsPage />)
  fireEvent.click(screen.getByRole('button', { name: 'Custom Amount' })); fill('custom-amount', amount)
  expect(screen.getByRole('button', { name: 'Purchase Gift Card' })).toBeDisabled()
  purchase()
  expect(await screen.findByRole('alert')).toHaveTextContent('between $10 and $1,000')
  expect(fetcher).not.toHaveBeenCalled()
})

it('sends digital purchaser, recipient and personal-message data only to the local checkout API', async () => {
  render(<GiftCardsPage />)
  fireEvent.click(screen.getByRole('button', { name: /^\$50$/ }))
  fill('purchaser-name', 'Test Buyer'); fill('purchaser-email', 'buyer@example.com')
  fill('recipient-name', 'Test Recipient'); fill('recipient-email', 'recipient@example.com'); fill('personal-message', 'Example message')
  purchase()
  await waitFor(() => expect(fetcher).toHaveBeenCalledOnce())
  expect(fetcher.mock.calls[0][0]).toBe('/api/stripe/create-gift-card-checkout')
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ type: 'digital', amount: 50, purchaserName: 'Test Buyer', purchaserEmail: 'buyer@example.com', recipientName: 'Test Recipient', recipientEmail: 'recipient@example.com', message: 'Example message', deliveryMethod: 'immediate', scheduledDeliveryDate: null, shippingAddress: null })
})

it('validates scheduled dates, serializes future delivery, and can return to immediate delivery', async () => {
  render(<GiftCardsPage />)
  fireEvent.click(screen.getByRole('button', { name: /Schedule Future delivery/ }))
  purchase(); expect(await screen.findByRole('alert')).toHaveTextContent('select a delivery date')
  fill('delivery-date', '2000-01-01'); purchase()
  expect(await screen.findByRole('alert')).toHaveTextContent('must be in the future')
  fill('delivery-date', '2099-01-01'); fill('delivery-time', '15:30'); purchase()
  await waitFor(() => expect(fetcher).toHaveBeenCalledOnce())
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({ deliveryMethod: 'scheduled', scheduledDeliveryDate: new Date('2099-01-01T15:30').toISOString(), recipientName: null, recipientEmail: null, message: null })
  fireEvent.click(screen.getByRole('button', { name: /Send Now Instant delivery/ }))
  expect(screen.queryByLabelText(/Delivery Date/)).not.toBeInTheDocument()
})

it('requires all physical shipping fields and includes shipping in the total, not the card value', async () => {
  render(<GiftCardsPage />)
  fireEvent.click(screen.getByRole('button', { name: /Physical Shipped/ }))
  for (const [id, value] of [['shipping-name', 'Test Buyer'], ['shipping-street1', '123 Example St'], ['shipping-city', 'Example'], ['shipping-state', 'MO'], ['shipping-zipcode', '65000']]) {
    purchase(); expect(await screen.findByRole('alert')).toHaveTextContent('required shipping address')
    fill(id, value)
  }
  fill('shipping-street2', 'Unit 2'); fill('shipping-country', 'United States')
  purchase(); await waitFor(() => expect(fetcher).toHaveBeenCalledOnce())
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({ type: 'physical', amount: 100, deliveryMethod: null, scheduledDeliveryDate: null, shippingAddress: { name: 'Test Buyer', street1: '123 Example St', street2: 'Unit 2', city: 'Example', state: 'MO', zipCode: '65000', country: 'United States' } })
  expect(screen.getByText('$105.00')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /Digital Instant email/ }))
  expect(screen.queryByLabelText(/Shipping Name/)).not.toBeInTheDocument()
})

it.each([['provider', 'Checkout unavailable'], ['missing-message', 'Failed to create checkout session'], ['transport', 'Offline'], ['unknown', 'Something went wrong']])('recovers from %s failures without a stuck checkout button', async (kind, expected) => {
  if (kind === 'provider') fetcher.mockResolvedValueOnce(Response.json({ error: 'Checkout unavailable' }, { status: 503 }))
  if (kind === 'missing-message') fetcher.mockResolvedValueOnce(Response.json({}, { status: 500 }))
  if (kind === 'transport') fetcher.mockRejectedValueOnce(new Error('Offline'))
  if (kind === 'unknown') fetcher.mockRejectedValueOnce('Offline')
  render(<GiftCardsPage />); purchase()
  expect(await screen.findByRole('alert')).toHaveTextContent(expected)
  expect(screen.getByRole('button', { name: 'Purchase Gift Card' })).toBeEnabled()
})

it('calculates promotional thresholds and custom-amount upsell guidance', () => {
  vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('2025-11-28')
  render(<GiftCardsPage />)
  expect(screen.getByText('Holiday Bonus Applied!')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Custom Amount' })); fill('custom-amount', '75')
  expect(screen.getByText(/Spend \$25 more/)).toBeInTheDocument()
  fill('custom-amount', '200')
  expect(screen.getByText('$250.00')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /^\$25$/ }))
  expect(screen.queryByText('Holiday Bonus Applied!')).not.toBeInTheDocument()
})
