import { describe, it, expect, beforeEach } from 'vitest'
import { useCart, CartItem } from '../cart'

// Helper to get fresh cart state
const getCartState = () => useCart.getState()

describe('Cart Store', () => {
  beforeEach(() => {
    // Clear cart before each test
    useCart.getState().clearCart()
  })

  const mockItem: CartItem = {
    productId: 'prod_123',
    productName: 'Test Product',
    productSlug: 'test-product',
    variantId: 'var_123',
    variantName: 'Medium / Blue',
    size: 'Medium',
    color: 'Blue',
    price: 29.99,
    quantity: 1,
    image: '/test-image.jpg',
    imageAlt: 'Test Product Image',
  }

  const mockItem2: CartItem = {
    productId: 'prod_456',
    productName: 'Another Product',
    productSlug: 'another-product',
    variantId: 'var_456',
    variantName: 'Large / Red',
    size: 'Large',
    color: 'Red',
    price: 39.99,
    quantity: 2,
    image: '/test-image-2.jpg',
    imageAlt: 'Another Product Image',
  }

  describe('addItem', () => {
    it('adds a new item to the cart', () => {
      const { addItem } = getCartState()
      addItem(mockItem)

      const { items } = getCartState()
      expect(items).toHaveLength(1)
      expect(items[0]).toEqual(mockItem)
    })

    it('increases quantity when adding existing item', () => {
      const { addItem } = getCartState()

      addItem(mockItem)
      addItem({ ...mockItem, quantity: 2 })

      const { items } = getCartState()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(3) // 1 + 2
    })

    it('adds multiple different items', () => {
      const { addItem } = getCartState()

      addItem(mockItem)
      addItem(mockItem2)

      const { items } = getCartState()
      expect(items).toHaveLength(2)
    })

    it('treats different variants as separate items', () => {
      const { addItem } = getCartState()

      const variant1 = { ...mockItem, variantId: 'var_1' }
      const variant2 = { ...mockItem, variantId: 'var_2' }

      addItem(variant1)
      addItem(variant2)

      const { items } = getCartState()
      expect(items).toHaveLength(2)
    })
  })

  describe('removeItem', () => {
    it('removes item from cart', () => {
      const { addItem, removeItem } = getCartState()

      addItem(mockItem)
      addItem(mockItem2)

      removeItem(mockItem.variantId)

      const { items } = getCartState()
      expect(items).toHaveLength(1)
      expect(items[0].variantId).toBe(mockItem2.variantId)
    })

    it('does nothing if item does not exist', () => {
      const { addItem, removeItem } = getCartState()

      addItem(mockItem)
      removeItem('nonexistent_id')

      const { items } = getCartState()
      expect(items).toHaveLength(1)
    })

    it('can remove all items one by one', () => {
      const { addItem, removeItem } = getCartState()

      addItem(mockItem)
      addItem(mockItem2)

      removeItem(mockItem.variantId)
      removeItem(mockItem2.variantId)

      const { items } = getCartState()
      expect(items).toHaveLength(0)
    })
  })

  describe('updateQuantity', () => {
    it('updates item quantity', () => {
      const { addItem, updateQuantity } = getCartState()

      addItem(mockItem)
      updateQuantity(mockItem.variantId, 5)

      const { items } = getCartState()
      expect(items[0].quantity).toBe(5)
    })

    it('removes item when quantity is set to 0', () => {
      const { addItem, updateQuantity } = getCartState()

      addItem(mockItem)
      updateQuantity(mockItem.variantId, 0)

      const { items } = getCartState()
      expect(items).toHaveLength(0)
    })

    it('removes item when quantity is negative', () => {
      const { addItem, updateQuantity } = getCartState()

      addItem(mockItem)
      updateQuantity(mockItem.variantId, -1)

      const { items } = getCartState()
      expect(items).toHaveLength(0)
    })

    it('does not affect other items', () => {
      const { addItem, updateQuantity } = getCartState()

      addItem(mockItem)
      addItem(mockItem2)

      updateQuantity(mockItem.variantId, 10)

      const { items } = getCartState()
      expect(items[0].quantity).toBe(10)
      expect(items[1].quantity).toBe(2) // unchanged
    })
  })

  describe('clearCart', () => {
    it('removes all items from cart', () => {
      const { addItem, clearCart } = getCartState()

      addItem(mockItem)
      addItem(mockItem2)

      clearCart()

      const { items } = getCartState()
      expect(items).toHaveLength(0)
    })

    it('works on empty cart', () => {
      const { clearCart } = getCartState()

      clearCart()

      const { items } = getCartState()
      expect(items).toHaveLength(0)
    })
  })

  describe('getItemCount', () => {
    it('returns 0 for empty cart', () => {
      useCart.getState().clearCart()
      const { getItemCount } = getCartState()
      expect(getItemCount()).toBe(0)
    })

    it('returns total quantity of all items', () => {
      useCart.getState().clearCart()
      const { addItem, getItemCount } = getCartState()

      addItem({ ...mockItem, quantity: 2 })
      addItem({ ...mockItem2, quantity: 3 })

      expect(getItemCount()).toBe(5)
    })

    it('updates after adding items', () => {
      useCart.getState().clearCart()
      const { addItem, getItemCount } = getCartState()

      addItem({ ...mockItem, quantity: 1 })
      expect(getItemCount()).toBe(1)

      addItem({ ...mockItem, quantity: 2 })
      expect(getItemCount()).toBe(3)
    })

    it('updates after removing items', () => {
      const { addItem, removeItem, getItemCount } = getCartState()

      addItem({ ...mockItem, quantity: 5 })
      addItem({ ...mockItem2, quantity: 3 })

      removeItem(mockItem.variantId)
      expect(getItemCount()).toBe(3)
    })
  })

  describe('getSubtotal', () => {
    it('returns 0 for empty cart', () => {
      const { getSubtotal } = getCartState()
      expect(getSubtotal()).toBe(0)
    })

    it('calculates subtotal for single item', () => {
      const { addItem, getSubtotal } = getCartState()

      addItem({ ...mockItem, price: 10, quantity: 3 })

      expect(getSubtotal()).toBe(30)
    })

    it('calculates subtotal for multiple items', () => {
      const { addItem, getSubtotal } = getCartState()

      addItem({ ...mockItem, price: 29.99, quantity: 2 })
      addItem({ ...mockItem2, price: 39.99, quantity: 1 })

      expect(getSubtotal()).toBe(99.97) // (29.99 * 2) + (39.99 * 1)
    })

    it('updates after quantity change', () => {
      const { addItem, updateQuantity, getSubtotal } = getCartState()

      addItem({ ...mockItem, price: 10, quantity: 1 })
      expect(getSubtotal()).toBe(10)

      updateQuantity(mockItem.variantId, 5)
      expect(getSubtotal()).toBe(50)
    })

    it('handles decimal prices correctly', () => {
      const { addItem, getSubtotal } = getCartState()

      addItem({ ...mockItem, price: 12.99, quantity: 3 })

      expect(getSubtotal()).toBeCloseTo(38.97, 2)
    })

    it('updates after removing item', () => {
      const { addItem, removeItem, getSubtotal } = getCartState()

      addItem({ ...mockItem, price: 20, quantity: 1 })
      addItem({ ...mockItem2, price: 30, quantity: 1 })

      expect(getSubtotal()).toBe(50)

      removeItem(mockItem.variantId)
      expect(getSubtotal()).toBe(30)
    })
  })

  describe('Edge Cases', () => {
    it('handles very large quantities', () => {
      const { addItem, getItemCount, getSubtotal } = getCartState()

      addItem({ ...mockItem, price: 10, quantity: 1000 })

      expect(getItemCount()).toBe(1000)
      expect(getSubtotal()).toBe(10000)
    })

    it('handles very small prices', () => {
      const { addItem, getSubtotal } = getCartState()

      addItem({ ...mockItem, price: 0.01, quantity: 1 })

      expect(getSubtotal()).toBe(0.01)
    })

    it('maintains data integrity across operations', () => {
      const { addItem, updateQuantity, removeItem } = getCartState()

      addItem(mockItem)
      addItem(mockItem2)
      updateQuantity(mockItem.variantId, 10)
      removeItem(mockItem2.variantId)
      addItem(mockItem2)

      const { items } = getCartState()
      expect(items).toHaveLength(2)
      expect(items.find(i => i.variantId === mockItem.variantId)?.quantity).toBe(10)
      expect(items.find(i => i.variantId === mockItem2.variantId)?.quantity).toBe(2)
    })
  })
})
