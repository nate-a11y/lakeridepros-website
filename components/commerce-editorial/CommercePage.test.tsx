import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CommercePage from './CommercePage'
import CartPage from '@/app/(site)/cart/page'
import BridalShowRegistrationPage from '@/app/(site)/bridal-show-registration/page'

const cart = vi.hoisted(() => ({
  items: [{ productId: 'qa', variantId: 'qa-size', productSlug: 'qa', productName: 'QA merchandise', variantName: 'Medium', image: '/og-image.jpg', imageAlt: 'QA merchandise', price: 20, quantity: 2 }],
  removeItem: vi.fn(), updateQuantity: vi.fn(), clearCart: vi.fn(), getSubtotal: () => 40,
}))
vi.mock('@/lib/store/cart', () => ({ useCart: () => cart }))
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

describe('Public commerce editorial presentation', () => {
  it('preserves child markup, structured data and attribution without nesting landmarks', () => {
    const { container } = render(<CommercePage variant="shop" data-page="shop"><script type="application/ld+json">{'{"@type":"Product"}'}</script><a href="/shop?category=shirts">Shirts</a></CommercePage>)
    expect(container.querySelector('main')).toBeNull()
    expect(container.querySelector('[data-commerce-page="shop"]')).toHaveAttribute('data-page', 'shop')
    expect(container.querySelector('script')?.textContent).toBe('{"@type":"Product"}')
    expect(screen.getByRole('link', { name: 'Shirts' })).toHaveAttribute('href', '/shop?category=shirts')
  })

  it('retains cart totals, keyboard quantity controls, removal and mocked checkout failure', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: 'Mock checkout unavailable' }) })
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<CartPage />)
    expect(screen.getByText('$49.39')).toBeInTheDocument()
    screen.getByRole('button', { name: 'Increase quantity' }).focus()
    await user.keyboard('{Enter}')
    expect(cart.updateQuantity).toHaveBeenCalledWith('qa-size', 3)
    await user.click(screen.getByRole('button', { name: 'Remove item from cart' }))
    expect(cart.removeItem).toHaveBeenCalledWith('qa-size')
    await user.click(screen.getByRole('button', { name: 'Proceed to Checkout' }))
    expect(await screen.findByText('Mock checkout unavailable')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/stripe/create-checkout', expect.objectContaining({ method: 'POST', body: JSON.stringify({ items: cart.items }) }))
    expect(screen.getByRole('button', { name: 'Proceed to Checkout' })).toBeEnabled()
  })

  it('preserves registration fields, honeypot and successful submission against a mock only', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)
    const clock = vi.spyOn(Date, 'now').mockReturnValue(1000)
    const { container } = render(<BridalShowRegistrationPage />)
    expect(container.querySelector('main')).toBeNull()
    expect(container.querySelector('#website')).toHaveAttribute('tabindex', '-1')
    await user.type(screen.getByLabelText('Name *'), 'QA Test')
    await user.type(screen.getByLabelText('Email Address *'), 'qa@example.test')
    await user.type(screen.getByLabelText('Phone Number *'), '5555550100')
    await user.type(screen.getByLabelText('Transportation Needs *'), 'Private wedding transfer')
    clock.mockReturnValue(4000)
    await user.click(screen.getByRole('button', { name: 'Submit registration' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Thank you for registering!'))
    expect(fetchMock).toHaveBeenCalledWith('/api/bridal-show-registration', expect.objectContaining({ method: 'POST', body: expect.stringContaining('"_honeypot":""') }))
    expect(screen.getByLabelText('Name *')).toHaveValue('')
  })
})
