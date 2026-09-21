'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, LoaderCircle, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

interface CheckoutResponse {
  url?: string
  error?: string
}

const focus = 'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary'

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function CartPage() {
  const items = useCart(state => state.items)
  const updateQuantity = useCart(state => state.updateQuantity)
  const removeItem = useCart(state => state.removeItem)
  const getSubtotal = useCart(state => state.getSubtotal)
  const [hydrated, setHydrated] = useState(false)
  const [checkoutPending, setCheckoutPending] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  useEffect(() => {
    const rehydrate = useCart.persist?.rehydrate
    if (!rehydrate) {
      setHydrated(true)
      return
    }

    void Promise.resolve(rehydrate()).finally(() => setHydrated(true))
  }, [])

  async function handleCheckout() {
    setCheckoutPending(true)
    setCheckoutError('')

    try {
      const response = await fetch('/api/fourthwall/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      })
      const data = await response.json().catch(() => null) as CheckoutResponse | null

      if (!response.ok) {
        throw new Error(data?.error || 'Checkout is temporarily unavailable. Please try again.')
      }

      if (!data?.url) {
        throw new Error('Checkout did not return a destination. Please try again.')
      }

      const checkoutUrl = new URL(data.url)
      if (checkoutUrl.protocol !== 'https:') {
        throw new Error('Checkout returned an invalid destination. Please try again.')
      }

      window.location.assign(checkoutUrl.toString())
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Checkout is temporarily unavailable. Please try again.')
      setCheckoutPending(false)
    }
  }

  if (!hydrated) {
    return (
      <section aria-labelledby="cart-heading" className="min-h-[70vh] bg-neutral-50 px-4 py-16 dark:bg-lrp-black">
        <div className="mx-auto max-w-6xl">
          <h1 id="cart-heading" className="font-boardson text-5xl font-bold text-lrp-black dark:text-white sm:text-6xl">
            Your cart
          </h1>
          <p role="status" className="mt-6 flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
            <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Loading your cart…
          </p>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section aria-labelledby="cart-heading" className="flex min-h-[70vh] items-center bg-neutral-50 px-4 py-16 dark:bg-lrp-black">
        <div className="mx-auto w-full max-w-2xl border border-black/10 bg-white p-8 text-center shadow-lg dark:border-white/15 dark:bg-dark-bg-secondary sm:p-12">
          <ShoppingBag className="mx-auto size-14 text-primary-dark dark:text-primary-light" aria-hidden="true" />
          <h1 id="cart-heading" className="mt-5 font-boardson text-5xl font-bold text-lrp-black dark:text-white">
            Your cart is empty.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-neutral-700 dark:text-neutral-300">
            Visit the shop to find the latest Lake Ride Pros gear.
          </p>
          <Link
            href="/shop"
            className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-7 py-3 font-black text-lrp-black hover:bg-primary-light ${focus}`}
          >
            Browse the shop <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    )
  }

  const subtotal = getSubtotal()

  return (
    <section aria-labelledby="cart-heading" className="min-h-[70vh] bg-neutral-50 px-4 py-12 dark:bg-lrp-black sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-dark dark:text-primary-light">
              Lake Ride Pros Merch
            </p>
            <h1 id="cart-heading" className="mt-2 font-boardson text-5xl font-bold text-lrp-black dark:text-white sm:text-6xl">
              Your cart
            </h1>
          </div>
          <Link href="/shop" className={`min-h-11 py-2 font-bold text-primary-dark underline decoration-2 underline-offset-4 dark:text-primary-light ${focus}`}>
            Continue shopping
          </Link>
        </div>

        <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <ul aria-label="Cart items" className="space-y-4">
            {items.map((item, index) => (
              <li key={item.variantId} className="grid gap-5 border border-black/10 bg-white p-4 shadow-sm dark:border-white/15 dark:bg-dark-bg-secondary sm:grid-cols-[7rem_minmax(0,1fr)] sm:p-5">
                <Link href={`/shop/products/${item.productSlug}`} className={`relative aspect-square overflow-hidden bg-neutral-100 dark:bg-black/30 ${focus}`}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="112px"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : undefined}
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center p-2 text-center text-xs font-bold text-neutral-500">Image coming soon</span>
                  )}
                </Link>

                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link href={`/shop/products/${item.productSlug}`} className={`text-lg font-black text-lrp-black hover:text-primary-dark dark:text-white dark:hover:text-primary-light ${focus}`}>
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{item.variantName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      className={`inline-flex size-11 shrink-0 items-center justify-center text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40 ${focus}`}
                      aria-label={`Remove ${item.productName} from cart`}
                    >
                      <Trash2 className="size-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <label htmlFor={`quantity-${item.variantId}`} className="block text-xs font-black uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
                        Quantity
                      </label>
                      <select
                        id={`quantity-${item.variantId}`}
                        value={item.quantity}
                        onChange={event => updateQuantity(item.variantId, Number(event.target.value))}
                        className={`mt-1 min-h-11 border-2 border-neutral-300 bg-white px-3 text-lrp-black dark:border-white/25 dark:bg-lrp-black dark:text-white ${focus}`}
                      >
                        {Array.from({ length: 20 }, (_, index) => index + 1).map(quantity => (
                          <option key={quantity} value={quantity}>{quantity}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-right font-black text-lrp-black dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside aria-labelledby="order-summary-heading" className="border border-black/10 bg-white p-6 shadow-lg dark:border-white/15 dark:bg-dark-bg-secondary lg:sticky lg:top-28">
            <h2 id="order-summary-heading" className="text-2xl font-black text-lrp-black dark:text-white">Order summary</h2>
            <div className="mt-5 flex justify-between gap-5 border-t border-black/10 pt-5 text-lg dark:border-white/15">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">Subtotal</span>
              <span className="font-black text-lrp-black dark:text-white">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Shipping and taxes are calculated securely by Fourthwall at checkout.
            </p>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutPending}
              className={`mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-lg font-black text-lrp-black hover:bg-primary-light disabled:cursor-wait disabled:opacity-70 ${focus}`}
            >
              {checkoutPending ? (
                <><LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Preparing checkout…</>
              ) : (
                <>Checkout with Fourthwall <ArrowRight className="size-5" aria-hidden="true" /></>
              )}
            </button>
            {checkoutError && (
              <p role="alert" className="mt-4 border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-900 dark:border-red-700 dark:bg-red-950/40 dark:text-red-100">
                {checkoutError}
              </p>
            )}
            <p className="mt-4 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              You will finish payment on Fourthwall, Lake Ride Pros&apos; merchandise partner.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
