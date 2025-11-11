'use client'

import { X, ShoppingCart, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/store/cart'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getSubtotal } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-dark-bg-primary shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-dark-border">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-lrp-green" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-neutral-400 dark:text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Your cart is empty
              </p>
              <button
                onClick={onClose}
                className="text-lrp-green hover:text-lrp-green-dark font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 pb-4 border-b dark:border-dark-border"
                >
                  {/* Image */}
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {item.variantName}
                    </p>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-8 h-8 rounded border border-neutral-300 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-neutral-300 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold text-lrp-green">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors self-start"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t dark:border-dark-border p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-neutral-900 dark:text-white">
                Subtotal:
              </span>
              <span className="font-bold text-lrp-green">
                ${getSubtotal().toFixed(2)}
              </span>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Shipping and taxes calculated at checkout
            </p>

            {/* Buttons */}
            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full bg-lrp-green hover:bg-lrp-green-dark text-white text-center py-3 rounded-lg font-bold transition-all"
              >
                View Cart
              </Link>
              <button
                onClick={onClose}
                className="block w-full border-2 border-neutral-300 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary text-neutral-900 dark:text-white text-center py-3 rounded-lg font-semibold transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
