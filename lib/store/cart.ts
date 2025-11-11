import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  productName: string
  productSlug: string
  variantId: string
  variantName: string
  size?: string
  color?: string
  price: number
  quantity: number
  image: string
  imageAlt: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(
            (item) => item.variantId === newItem.variantId
          )

          if (existingItemIndex > -1) {
            // Item exists, update quantity
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += newItem.quantity
            return { items: updatedItems }
          } else {
            // New item, add to cart
            return { items: [...state.items, newItem] }
          }
        })
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }))
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'lrp-cart-storage', // localStorage key
      skipHydration: true, // Prevent automatic hydration on SSR
    }
  )
)
