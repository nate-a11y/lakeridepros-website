'use client';

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import type { Product } from '@/src/payload-types';

const CART_STORAGE_KEY = 'lakeridepros_cart';

// useSyncExternalStore-based hook for loading initial cart from localStorage
function useInitialCart(): CartItem[] {
  const getSnapshot = () => {
    if (typeof window === 'undefined') return '[]';
    return localStorage.getItem(CART_STORAGE_KEY) || '[]';
  };

  const getServerSnapshot = () => '[]';

  const subscribe = (callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  };

  const cartString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  try {
    return JSON.parse(cartString);
  } catch {
    return [];
  }
}

// Extract ProductVariant type from Product's variants array
type ProductVariant = NonNullable<Product['variants']>[number];

// Cart types - not generated from Payload
interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string | number, variantId?: string) => void;
  updateQuantity: (productId: string | number, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateCartTotals(items: CartItem[]): { subtotal: number; total: number } {
  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return {
    subtotal,
    total: subtotal, // Can add tax/shipping calculations here
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const initialCart = useInitialCart();
  const [items, setItems] = useState<CartItem[]>(initialCart);
  const [isOpen, setIsOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (items.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          (variant ? item.variant?.id === variant.id : !item.variant)
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item
        return [...currentItems, { product, quantity, variant }];
      }
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string | number, variantId?: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            String(item.product.id) === String(productId) &&
            (variantId ? item.variant?.id === variantId : !item.variant)
          )
      )
    );
  };

  const updateQuantity = (productId: string | number, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          String(item.product.id) === String(productId) &&
          (variantId ? item.variant?.id === variantId : !item.variant)
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const { subtotal, total } = calculateCartTotals(items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const cart: Cart = {
    items,
    subtotal,
    total,
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isOpen,
        openCart,
        closeCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
