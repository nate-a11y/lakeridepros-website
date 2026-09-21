'use client'

import { useMemo, useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/store/cart'
import {
  getFourthwallProductImage,
  isFourthwallVariantAvailable,
  type FourthwallProduct,
} from '@/lib/fourthwall/storefront'

interface FourthwallProductActionsProps {
  product: FourthwallProduct
}

export default function FourthwallProductActions({ product }: FourthwallProductActionsProps) {
  const variants = useMemo(
    () => product.variants.filter(isFourthwallVariantAvailable),
    [product.variants]
  )
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || '')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCart(state => state.addItem)
  const selectedVariant = variants.find(variant => variant.id === selectedVariantId)

  function handleAddToCart() {
    if (!selectedVariant) return

    const image = selectedVariant.images[0]?.transformedUrl
      || selectedVariant.images[0]?.url
      || getFourthwallProductImage(product)

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: selectedVariant.id,
      variantName: selectedVariant.attributes.description || selectedVariant.name,
      size: selectedVariant.attributes.size?.name,
      color: selectedVariant.attributes.color?.name,
      price: selectedVariant.unitPrice.value,
      quantity,
      image,
      imageAlt: product.name,
    })

    setAdded(true)
    window.setTimeout(() => setAdded(false), 2500)
  }

  if (variants.length === 0) {
    return (
      <p role="status" className="border border-neutral-300 bg-neutral-100 p-4 font-bold text-neutral-700 dark:border-white/20 dark:bg-white/10 dark:text-neutral-200">
        This product is currently unavailable.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="fourthwall-variant" className="mb-2 block text-sm font-black text-lrp-black dark:text-white">
          Choose an option
        </label>
        <select
          id="fourthwall-variant"
          value={selectedVariantId}
          onChange={event => setSelectedVariantId(event.target.value)}
          className="min-h-12 w-full border-2 border-neutral-300 bg-white px-4 py-3 text-lrp-black focus-visible:border-primary focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary dark:border-white/25 dark:bg-lrp-black dark:text-white"
        >
          {variants.map(variant => (
            <option key={variant.id} value={variant.id}>
              {variant.attributes.description || variant.name} — ${variant.unitPrice.value.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="fourthwall-quantity" className="mb-2 block text-sm font-black text-lrp-black dark:text-white">
          Quantity
        </label>
        <input
          id="fourthwall-quantity"
          type="number"
          min="1"
          max="20"
          inputMode="numeric"
          value={quantity}
          onChange={event => {
            const nextQuantity = Number.parseInt(event.target.value, 10)
            setQuantity(Number.isFinite(nextQuantity) ? Math.min(20, Math.max(1, nextQuantity)) : 1)
          }}
          className="min-h-12 w-28 border-2 border-neutral-300 bg-white px-4 py-3 text-lrp-black focus-visible:border-primary focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary dark:border-white/25 dark:bg-lrp-black dark:text-white"
        />
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedVariant}
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 bg-primary px-7 py-4 text-lg font-black text-lrp-black hover:bg-primary-light focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-neutral-400"
      >
        {added ? <Check className="size-5" aria-hidden="true" /> : <ShoppingCart className="size-5" aria-hidden="true" />}
        {added ? 'Added to cart' : `Add to cart — $${selectedVariant?.unitPrice.value.toFixed(2)}`}
      </button>

      {added && (
        <p role="status" className="text-center text-sm font-bold text-neutral-700 dark:text-neutral-200">
          Added to your cart.{' '}
          <Link
            href="/cart"
            className="underline decoration-primary decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Review cart
          </Link>
        </p>
      )}
    </div>
  )
}
