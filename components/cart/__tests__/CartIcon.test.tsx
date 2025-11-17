import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import CartIcon from '../CartIcon'
import { useCart } from '@/lib/store/cart'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('CartIcon Component', () => {
  beforeEach(() => {
    useCart.getState().clearCart()
  })

  it('renders cart icon', () => {
    render(<CartIcon />)
    expect(screen.getByLabelText(/shopping cart/i)).toBeInTheDocument()
  })

  it('links to cart page', () => {
    render(<CartIcon />)
    const link = screen.getByLabelText(/shopping cart/i)
    expect(link).toHaveAttribute('href', '/cart')
  })

  it('does not show badge when cart is empty', async () => {
    render(<CartIcon />)

    await waitFor(() => {
      const badge = screen.queryByText(/\d+/)
      expect(badge).not.toBeInTheDocument()
    })
  })

  it('shows badge with item count when cart has items', async () => {
    const { addItem } = useCart.getState()

    addItem({
      productId: 'prod_1',
      productName: 'Test Product',
      productSlug: 'test-product',
      variantId: 'var_1',
      variantName: 'Medium',
      price: 10,
      quantity: 3,
      image: '/test.jpg',
      imageAlt: 'Test',
    })

    render(<CartIcon />)

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('shows "9+" when cart has more than 9 items', async () => {
    const { addItem } = useCart.getState()

    addItem({
      productId: 'prod_1',
      productName: 'Test Product',
      productSlug: 'test-product',
      variantId: 'var_1',
      variantName: 'Medium',
      price: 10,
      quantity: 15,
      image: '/test.jpg',
      imageAlt: 'Test',
    })

    render(<CartIcon />)

    await waitFor(() => {
      expect(screen.getByText('9+')).toBeInTheDocument()
    })
  })

  it('updates count when items are added', async () => {
    render(<CartIcon />)

    const { addItem } = useCart.getState()

    addItem({
      productId: 'prod_1',
      productName: 'Test Product',
      productSlug: 'test-product',
      variantId: 'var_1',
      variantName: 'Medium',
      price: 10,
      quantity: 2,
      image: '/test.jpg',
      imageAlt: 'Test',
    })

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('has correct aria-label with item count', async () => {
    const { addItem } = useCart.getState()

    addItem({
      productId: 'prod_1',
      productName: 'Test Product',
      productSlug: 'test-product',
      variantId: 'var_1',
      variantName: 'Medium',
      price: 10,
      quantity: 5,
      image: '/test.jpg',
      imageAlt: 'Test',
    })

    render(<CartIcon />)

    await waitFor(() => {
      expect(screen.getByLabelText('Shopping cart with 5 items')).toBeInTheDocument()
    })
  })

  it('applies correct CSS classes for badge', async () => {
    const { addItem } = useCart.getState()

    addItem({
      productId: 'prod_1',
      productName: 'Test Product',
      productSlug: 'test-product',
      variantId: 'var_1',
      variantName: 'Medium',
      price: 10,
      quantity: 1,
      image: '/test.jpg',
      imageAlt: 'Test',
    })

    render(<CartIcon />)

    await waitFor(() => {
      const badge = screen.getByText('1')
      expect(badge).toHaveClass('bg-lrp-green')
      expect(badge).toHaveClass('text-white')
      expect(badge).toHaveClass('rounded-full')
    })
  })
})
