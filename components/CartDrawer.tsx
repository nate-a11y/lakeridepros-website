'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { getMediaUrl } from '@/lib/api/payload';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-neutral-900">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
            aria-label="Close cart"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-neutral-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="mt-4 text-neutral-600">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-4 inline-block text-primary hover:text-primary-dark font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => {
                const imageUrl = item.product.featuredImage
                  ? getMediaUrl(item.product.featuredImage.url)
                  : item.product.images?.[0]
                  ? getMediaUrl(item.product.images[0].url)
                  : '/placeholder-product.jpg';

                const price = item.variant?.price || item.product.price;

                return (
                  <div
                    key={`${item.product.id}-${item.variant?.id || 'default'}`}
                    className="flex gap-4 border-b pb-4"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
                      <Image
                        src={imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-neutral-900 truncate">
                        {item.product.name}
                      </h3>
                      {item.variant && (
                        <p className="text-xs text-neutral-500 mt-1">
                          {item.variant.name}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-primary mt-1">
                        {formatPrice(price)}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.variant?.id
                            )
                          }
                          className="h-6 w-6 rounded-full border border-neutral-300 flex items-center justify-center hover:border-primary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <span className="text-sm">−</span>
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.variant?.id
                            )
                          }
                          className="h-6 w-6 rounded-full border border-neutral-300 flex items-center justify-center hover:border-primary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <span className="text-sm">+</span>
                        </button>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.variant?.id)
                          }
                          className="ml-auto text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <p className="text-sm text-neutral-500">
              Shipping and taxes calculated at checkout
            </p>
            <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Checkout
            </button>
            <Link
              href="/shop"
              onClick={closeCart}
              className="block text-center text-primary hover:text-primary-dark font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
