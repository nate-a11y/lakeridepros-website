'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { ShoppingCart, Check, Package, Truck, Shield } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { getMediaUrl, cn } from '@/lib/utils'
import { VariantSelector } from '@/components/shop'
import type { Product } from '@/types/sanity'

interface ProductActionsProps {
  product: Product
}

type ProductVariant = NonNullable<Product['variants']>[number]

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  )
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [personalizationText, setPersonalizationText] = useState('')

  const { addItem } = useCart()

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant) return

    const finalPrice = selectedVariant.price || product.price
    const featuredImage = typeof product.featuredImage === 'object' ? product.featuredImage : null

    addItem({
      productId: String(product.id),
      productName: product.name,
      productSlug: product.slug,
      variantId: selectedVariant.sku,
      variantName: selectedVariant.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: finalPrice,
      quantity,
      image: featuredImage?.url ? getMediaUrl(featuredImage.url) : '',
      imageAlt: featuredImage?.alt || product.name,
      personalization: personalizationText || undefined,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }, [selectedVariant, product, quantity, personalizationText, addItem])

  const handleVariantChange = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant)
  }, [])

  // Get all images including featured - robust handling for multiple data structures
  const allImages: Array<{ image: { url?: string | null; alt?: string | null } | null }> = []

  // Add featured image if it exists
  if (product.featuredImage && typeof product.featuredImage === 'object') {
    const featuredImg = product.featuredImage as { url?: string | null; alt?: string | null }
    if (featuredImg.url) {
      allImages.push({ image: featuredImg })
    }
  }

  // Add gallery images with robust handling for different structures
  if (product.images && Array.isArray(product.images)) {
    for (const imgItem of product.images) {
      if (!imgItem) continue

      // Handle nested structure: images[].image
      if ('image' in imgItem && imgItem.image && typeof imgItem.image === 'object') {
        const nestedImg = imgItem.image as { url?: string | null; alt?: string | null }
        if (nestedImg.url) {
          allImages.push({ image: nestedImg })
        }
      }
      // Handle flat structure: images[] might be the Media object directly
      else if (typeof imgItem === 'object' && 'url' in imgItem) {
        const flatImg = imgItem as unknown as { url?: string | null; alt?: string | null }
        if (flatImg.url) {
          allImages.push({ image: flatImg })
        }
      }
    }
  }

  const currentPrice = selectedVariant?.price || product.price

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="lg:w-1/2 w-full space-y-4">
        {/* Main Image */}
        <div className="aspect-square bg-neutral-100 dark:bg-dark-bg-secondary rounded-2xl overflow-hidden relative group">
          {(() => {
            const imageItem = allImages[selectedImage]
            const imageObj = imageItem && typeof imageItem.image === 'object' ? imageItem.image : null
            return imageObj?.url ? (
              <Image
                src={getMediaUrl(imageObj.url)}
                alt={imageObj.alt || product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-32 h-32 text-neutral-300 dark:text-neutral-600" />
              </div>
            )
          })()}
        </div>

        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {allImages.map((img, index) => {
              const imageObj = img.image
              return imageObj?.url ? (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View image ${index + 1} of ${allImages.length}`}
                  aria-pressed={selectedImage === index}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-start',
                    selectedImage === index
                      ? 'border-lrp-green ring-2 ring-lrp-green/20'
                      : 'border-neutral-200 dark:border-dark-border hover:border-lrp-green/50'
                  )}
                >
                  <Image
                    src={getMediaUrl(imageObj.url)}
                    alt={imageObj.alt || `${product.name} thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ) : null
            })}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="lg:w-1/2 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
            {product.name}
          </h1>

          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {product.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-lrp-green/10 text-lrp-green-dark dark:text-lrp-green-light"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl lg:text-4xl font-bold text-lrp-green-dark dark:text-lrp-green-light">
            ${currentPrice.toFixed(2)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > currentPrice && (
            <>
              <span className="text-xl text-neutral-400 dark:text-neutral-500 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
              <span className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                Save ${(product.compareAtPrice - currentPrice).toFixed(2)}
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <div
          className="text-neutral-600 dark:text-neutral-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: typeof product.description === 'string'
              ? product.description
              : product.description?.root?.children?.[0]?.children?.[0]?.text
                ? product.description.root.children[0].children[0].text
                : product.shortDescription || ''
          }}
        />

        {/* Variant Selection */}
        {product.variants && product.variants.length > 0 && (
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onVariantChange={handleVariantChange}
            basePrice={product.price}
          />
        )}

        {/* Personalization */}
        {product.personalization?.enabled && (
          <div className="space-y-2">
            <label
              htmlFor="product-personalization"
              className="block text-sm font-semibold text-neutral-900 dark:text-white"
            >
              {product.personalization.instructions || 'Add Personalization'}
            </label>
            <input
              id="product-personalization"
              type="text"
              value={personalizationText}
              onChange={(e) => setPersonalizationText(e.target.value)}
              maxLength={product.personalization.maxLength || 100}
              placeholder="Enter your text here..."
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-lrp-green transition-all"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {personalizationText.length}/{product.personalization.maxLength || 100} characters
            </p>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white">
            Quantity
          </label>
          <div className="flex items-center gap-1" role="group" aria-label="Quantity selector">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              className="w-12 h-12 rounded-xl border-2 border-neutral-200 dark:border-dark-border hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary font-bold text-xl text-neutral-900 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              aria-label="Quantity"
              className="w-16 h-12 text-center text-xl font-bold border-2 border-neutral-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white focus:outline-none focus:border-lrp-green transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
              className="w-12 h-12 rounded-xl border-2 border-neutral-200 dark:border-dark-border hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary font-bold text-xl text-neutral-900 dark:text-white transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || !selectedVariant.inStock || addedToCart}
          className={cn(
            'w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3',
            addedToCart
              ? 'bg-green-500 text-white'
              : selectedVariant?.inStock
                ? 'bg-lrp-green hover:bg-lrp-green-dark text-white shadow-lg shadow-lrp-green/25 hover:shadow-xl hover:shadow-lrp-green/30 hover:-translate-y-0.5'
                : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
          )}
        >
          {addedToCart ? (
            <>
              <Check className="w-6 h-6" />
              Added to Cart!
            </>
          ) : selectedVariant?.inStock ? (
            <>
              <ShoppingCart className="w-6 h-6" />
              Add to Cart
            </>
          ) : (
            'Out of Stock'
          )}
        </button>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t dark:border-dark-border">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-lrp-green/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-lrp-green" />
            </div>
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Free Shipping $50+
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-lrp-green/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-lrp-green" />
            </div>
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Ships in 7-14 Days
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-lrp-green/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-lrp-green" />
            </div>
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Quality Guaranteed
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
