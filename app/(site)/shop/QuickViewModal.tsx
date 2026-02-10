'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import FocusTrap from 'focus-trap-react'
import { X, ShoppingCart, Check, ExternalLink, Package } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { getMediaUrl, cn } from '@/lib/utils'
import { VariantSelector } from '@/components/shop'
import Gallery from '@/components/Gallery'
import type { GalleryImage } from '@/components/Gallery'
import type { Product } from '@/types/sanity'

interface QuickViewModalProps {
  product: Product
  onClose: () => void
}

type ProductVariant = NonNullable<Product['variants']>[number]

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const { addItem } = useCart()

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant) return

    const finalPrice = selectedVariant.price || product.price

    addItem({
      productId: product._id,
      productName: product.name,
      productSlug: typeof product.slug === 'string' ? product.slug : product.slug.current,
      variantId: selectedVariant.sku,
      variantName: selectedVariant.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: finalPrice,
      quantity,
      image: typeof product.featuredImage === 'object' && product.featuredImage
        ? getMediaUrl(product.featuredImage)
        : '',
      imageAlt: (typeof product.featuredImage === 'object' ? product.featuredImage?.alt : undefined) || product.name,
    })

    setAddedToCart(true)
    setTimeout(() => {
      setAddedToCart(false)
      onClose()
    }, 1500)
  }, [selectedVariant, product, quantity, addItem, onClose])

  const handleVariantChange = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant)
  }, [])

  // Build GalleryImage[] from featuredImage + images[] with robust handling
  const galleryImages: GalleryImage[] = []

  if (product.featuredImage && typeof product.featuredImage === 'object') {
    const url = getMediaUrl(product.featuredImage)
    if (url) {
      galleryImages.push({
        src: url,
        alt: (product.featuredImage as Record<string, any>).alt || product.name,
      })
    }
  }

  if (product.images && Array.isArray(product.images)) {
    for (const imgItem of product.images) {
      if (!imgItem) continue

      let imgObj: Record<string, any> | null = null
      if ('image' in imgItem && imgItem.image && typeof imgItem.image === 'object') {
        imgObj = imgItem.image as Record<string, any>
      } else if (typeof imgItem === 'object' && ('_type' in imgItem || 'asset' in imgItem)) {
        imgObj = imgItem as unknown as Record<string, any>
      }

      if (imgObj) {
        const url = getMediaUrl(imgObj)
        if (url) {
          galleryImages.push({ src: url, alt: imgObj.alt || product.name })
        }
      }
    }
  }

  const currentPrice = selectedVariant?.price || product.price

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
            escapeDeactivates: false,
          }}
        >
          <div
            className="relative bg-white dark:bg-dark-bg-primary rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quickview-modal-title"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-neutral-100 dark:bg-dark-bg-secondary hover:bg-neutral-200 dark:hover:bg-dark-bg-tertiary flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 p-6 lg:p-8">
              {/* Image Gallery */}
              <div className="relative">
                {galleryImages.length > 0 ? (
                  <>
                    <Gallery
                      images={galleryImages}
                      title={product.name}
                      mode="carousel"
                      aspectRatio="1/1"
                      showLightbox={false}
                    />
                    {/* Badges overlaid on gallery */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
                      {product.featured && (
                        <span className="bg-lrp-green text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          Featured
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          Sale
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="aspect-square bg-neutral-100 dark:bg-dark-bg-secondary rounded-xl flex items-center justify-center">
                    <Package className="w-24 h-24 text-neutral-300 dark:text-neutral-600" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                {/* Title & Category */}
                <div className="mb-4">
                  <h2
                    id="quickview-modal-title"
                    className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white leading-tight"
                  >
                    {product.name}
                  </h2>
                  {product.categories && product.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-lrp-green/10 text-lrp-green-dark dark:text-lrp-green-light"
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-lrp-green-dark dark:text-lrp-green-light">
                    ${currentPrice.toFixed(2)}
                  </span>
                  {hasDiscount && product.compareAtPrice && (
                    <>
                      <span className="text-lg text-neutral-400 line-through">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        Save ${(product.compareAtPrice - currentPrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Short Description */}
                {product.shortDescription && (
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-4 line-clamp-2">
                    {product.shortDescription}
                  </p>
                )}

                {/* Variant Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-4">
                    <VariantSelector
                      variants={product.variants}
                      selectedVariant={selectedVariant}
                      onVariantChange={(v) => handleVariantChange(v as ProductVariant)}
                      basePrice={product.price}
                    />
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <span className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                    Quantity
                  </span>
                  <div className="flex items-center gap-1" role="group" aria-label="Quantity selector">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border-2 border-neutral-200 dark:border-dark-border hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary flex items-center justify-center font-bold transition-colors text-neutral-900 dark:text-white disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="text-lg font-bold w-12 text-center text-neutral-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-10 h-10 rounded-lg border-2 border-neutral-200 dark:border-dark-border hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary flex items-center justify-center font-bold transition-colors text-neutral-900 dark:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart || !selectedVariant || !selectedVariant.inStock}
                    className={cn(
                      'w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2',
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : selectedVariant?.inStock
                          ? 'bg-lrp-green hover:bg-lrp-green-dark text-white shadow-lg shadow-lrp-green/25 hover:shadow-xl'
                          : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed'
                    )}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart!
                      </>
                    ) : selectedVariant?.inStock ? (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    ) : (
                      'Out of Stock'
                    )}
                  </button>

                  <Link
                    href={`/shop/products/${product.slug}`}
                    className="w-full border-2 border-neutral-200 dark:border-dark-border hover:border-lrp-green text-neutral-900 dark:text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    onClick={onClose}
                  >
                    View Full Details
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FocusTrap>
      </div>
    </>
  )
}
