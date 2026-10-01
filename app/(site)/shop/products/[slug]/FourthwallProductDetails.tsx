'use client'

import { useState, type ReactNode } from 'react'
import {
  getFourthwallProductImages,
  isFourthwallVariantAvailable,
  type FourthwallProduct,
} from '@/lib/fourthwall/storefront'
import FourthwallProductActions from './FourthwallProductActions'
import FourthwallProductGallery from './FourthwallProductGallery'

export default function FourthwallProductDetails({ product, children }: {
  product: FourthwallProduct
  children: ReactNode
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => product.variants.find(isFourthwallVariantAvailable)?.id || '',
  )
  const images = getFourthwallProductImages(product, selectedVariantId)

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
      <FourthwallProductGallery key={selectedVariantId} images={images} productName={product.name} />
      <div className="self-start">
        {children}
        <div className="mt-8">
          <FourthwallProductActions
            product={product}
            selectedVariantId={selectedVariantId}
            onVariantChange={setSelectedVariantId}
          />
        </div>
        <p className="mt-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Secure checkout, shipping, taxes, and order support are handled by Fourthwall.
        </p>
      </div>
    </div>
  )
}
