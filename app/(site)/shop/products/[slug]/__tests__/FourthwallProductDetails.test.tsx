import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createElement, type ImgHTMLAttributes } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FourthwallImage, FourthwallProduct } from '@/lib/fourthwall/storefront'
import FourthwallProductDetails from '../FourthwallProductDetails'

const { addItem } = vi.hoisted(() => ({ addItem: vi.fn() }))
vi.mock('@/lib/store/cart', () => ({
  useCart: (selector: (state: { addItem: typeof addItem }) => unknown) => selector({ addItem }),
}))
vi.mock('next/image', () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => createElement('img', props),
}))

function image(id: string): FourthwallImage {
  return { id, url: `https://cdn.fourthwall.com/${id}.jpg`, width: 800, height: 800 }
}

const front = image('front')
const back = image('back')
const moss = image('moss')
const PRODUCT: FourthwallProduct = {
  type: 'PRODUCT', id: 'tee', name: 'Lake Tee', slug: 'lake-tee', description: 'A tee',
  access: { type: 'PUBLIC' }, state: { type: 'AVAILABLE' },
  images: [front, back],
  variants: [
    {
      id: 'black-m', name: 'Black / M', sku: 'BLACK-M', unitPrice: { value: 25, currency: 'USD' },
      attributes: { description: 'Black / M', color: { name: 'Black' }, size: { name: 'M' } },
      stock: { type: 'UNLIMITED' }, images: [front, back],
    },
    {
      id: 'moss-l', name: 'Moss / L', sku: 'MOSS-L', unitPrice: { value: 27, currency: 'USD' },
      attributes: { description: 'Moss / L', color: { name: 'Moss' }, size: { name: 'L' } },
      stock: { type: 'UNLIMITED' }, images: [moss],
    },
  ],
  createdAt: '', updatedAt: '',
}

function renderDetails(product = PRODUCT) {
  return render(<FourthwallProductDetails product={product}><h1>{product.name}</h1></FourthwallProductDetails>)
}

describe('Fourthwall product gallery and option selection', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows all unique product and variant pictures with thumbnail navigation', async () => {
    const user = userEvent.setup()
    renderDetails()
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', front.url)
    expect(screen.getByRole('status', { name: 'Product image position' })).toHaveTextContent('Image 1 of 3')
    expect(screen.getByRole('button', { name: 'View product image 1' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'View product image 2' }))
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', back.url)
    expect(screen.getByRole('button', { name: 'View product image 2' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Next product image' }))
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', moss.url)
    await user.click(screen.getByRole('button', { name: 'Next product image' }))
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', front.url)
    await user.click(screen.getByRole('button', { name: 'Previous product image' }))
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', moss.url)
  })

  it('resets the gallery to the chosen option and keeps cart details aligned', async () => {
    const user = userEvent.setup()
    renderDetails()
    await user.click(screen.getByRole('button', { name: 'View product image 2' }))
    await user.selectOptions(screen.getByLabelText('Choose an option'), 'moss-l')
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', moss.url)
    expect(screen.getByRole('status', { name: 'Product image position' })).toHaveTextContent('Image 1 of 3')
    await user.click(screen.getByRole('button', { name: 'Add to cart — $27.00' }))
    expect(addItem).toHaveBeenCalledWith(expect.objectContaining({
      variantId: 'moss-l', image: moss.url, price: 27, color: 'Moss', size: 'L', quantity: 1,
    }))
  })

  it('allows keyboard activation of a thumbnail', async () => {
    const user = userEvent.setup()
    renderDetails()
    screen.getByRole('button', { name: 'View product image 2' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', back.url)
  })

  it('recovers from a broken image when navigating to another picture', async () => {
    const user = userEvent.setup()
    renderDetails()
    fireEvent.error(screen.getByAltText('Lake Tee'))
    expect(screen.getByRole('img', { name: 'Lake Tee product preview coming soon' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Next product image' }))
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', back.url)
    expect(screen.queryByText('Product photography is on the way.')).not.toBeInTheDocument()
  })

  it('keeps a single photo simple and preserves the no-photo fallback', () => {
    const single = { ...PRODUCT, images: [front], variants: [{ ...PRODUCT.variants[0], images: [] }] }
    const { unmount } = renderDetails(single)
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', front.url)
    expect(screen.queryByRole('button', { name: 'Next product image' })).not.toBeInTheDocument()
    unmount()
    renderDetails({ ...single, images: [] })
    expect(screen.getByRole('img', { name: 'Lake Tee product preview coming soon' })).toBeVisible()
  })

  it('falls back to product images when an option has none and skips sold-out options', async () => {
    const user = userEvent.setup()
    renderDetails({ ...PRODUCT, variants: [
      { ...PRODUCT.variants[0], stock: { type: 'LIMITED', inStock: 0 } },
      { ...PRODUCT.variants[1], images: [] },
    ] })
    expect(screen.getByLabelText('Choose an option')).toHaveValue('moss-l')
    expect(screen.queryByRole('option', { name: /Black/ })).not.toBeInTheDocument()
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', front.url)
    await user.click(screen.getByRole('button', { name: 'Next product image' }))
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', back.url)
  })

  it('bounds thumbnail rendering for large catalogs while keeping every photo reachable', async () => {
    const user = userEvent.setup()
    const images = Array.from({ length: 60 }, (_, index) => image(`view-${index}`))
    renderDetails({ ...PRODUCT, images, variants: [] })
    expect(screen.getAllByRole('button', { name: /View product image/ })).toHaveLength(8)
    await user.click(screen.getByRole('button', { name: 'Previous product image' }))
    expect(screen.getByRole('status', { name: 'Product image position' })).toHaveTextContent('Image 60 of 60')
    expect(screen.getByAltText('Lake Tee')).toHaveAttribute('src', images[59].url)
    expect(screen.getAllByRole('button', { name: /View product image/ })).toHaveLength(4)
    await user.click(screen.getByRole('button', { name: 'Next product image' }))
    expect(screen.getByRole('status', { name: 'Product image position' })).toHaveTextContent('Image 1 of 60')
  })
})
