'use client'

import { useState } from 'react'
import { Trash2, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/store/cart'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const subtotal = getSubtotal()
  const shipping = subtotal > 50 ? 0 : 5.99 // Free shipping over $50
  const estimatedTax = subtotal * 0.085 // Estimated, Stripe calculates actual
  const total = subtotal + shipping + estimatedTax

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    setCheckoutError('')

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      setCheckoutError(error.message || 'Something went wrong. Please try again.')
      setCheckoutLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <ShoppingCart className="w-24 h-24 text-neutral-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Add some Lake Ride Pros merchandise to get started!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-lrp-green hover:bg-lrp-green-dark text-white px-8 py-4 rounded-lg font-bold transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-lrp-green hover:text-lrp-green-dark mb-4 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">
            Shopping Cart
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg border dark:border-dark-border overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-6 p-6 border-b dark:border-dark-border last:border-b-0"
                >
                  {/* Image */}
                  <Link href={`/shop/products/${item.productSlug}`}>
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1">
                    <Link
                      href={`/shop/products/${item.productSlug}`}
                      className="font-bold text-xl text-neutral-900 dark:text-white hover:text-lrp-green mb-2 block"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      {item.variantName}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          Quantity:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-10 h-10 rounded border border-neutral-300 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-bg-primary font-bold"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-bold text-lg">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-10 h-10 rounded border border-neutral-300 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-bg-primary font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-lrp-green">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors self-start"
                    aria-label="Remove item from cart"
                  >
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </button>
                </div>
              ))}

              {/* Clear Cart */}
              <div className="p-6 bg-neutral-50 dark:bg-dark-bg-primary">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg border dark:border-dark-border p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Estimated Tax</span>
                  <span className="font-semibold">${estimatedTax.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 50 && (
                <div className="bg-lrp-green/10 border border-lrp-green rounded-lg p-4 mb-6">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Add <strong>${(50 - subtotal).toFixed(2)}</strong> more for free shipping!
                  </p>
                </div>
              )}

              <div className="border-t dark:border-dark-border pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-neutral-900 dark:text-white">Total</span>
                  <span className="text-lrp-green">${total.toFixed(2)}</span>
                </div>
              </div>

              {checkoutError && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4 mb-6">
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    {checkoutError}
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || items.length === 0}
                className="w-full bg-lrp-green hover:bg-lrp-green-dark disabled:bg-neutral-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-all mb-4 flex items-center justify-center gap-2"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
