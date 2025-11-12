'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

interface ProductActionsProps {
  product: any
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  )
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  const { addItem } = useCart()

  // Debug: Log variants data to console
  if (typeof window !== 'undefined' && product.variants) {
    console.log('Product:', product.name)
    console.log('Total variants:', product.variants.length)
    console.log('Variants data:', product.variants)
    console.log('First variant:', product.variants[0])
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return

    const finalPrice = product.price + (selectedVariant.priceModifier || 0)

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: selectedVariant.sku,
      variantName: selectedVariant.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: finalPrice,
      quantity,
      image: product.images[0]?.image?.url || '',
      imageAlt: product.images[0]?.alt || product.name,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  // Group variants by size and color (filter out empty values)
  const sizes = Array.from(new Set<string>((product.variants || []).map((v: any) => v.size as string).filter((s: string) => s)))
  const colors = Array.from(new Set<string>((product.variants || []).map((v: any) => v.color as string).filter((c: string) => c)))

  // Debug: Log processed sizes/colors
  if (typeof window !== 'undefined') {
    console.log('Sizes found:', sizes)
    console.log('Colors found:', colors)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Image Gallery (Client-side for interactivity) */}
      <div className="lg:w-1/2">
        {/* Main Image */}
        <div className="aspect-square bg-neutral-100 dark:bg-dark-bg-secondary rounded-lg overflow-hidden mb-4">
          {product.images && product.images[selectedImage] ? (
            <Image
              src={product.images[selectedImage].image.url}
              alt={product.images[selectedImage].alt || product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="w-32 h-32 text-neutral-300 dark:text-neutral-500" />
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {product.images && product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? 'border-lrp-green'
                    : 'border-neutral-300 dark:border-dark-border hover:border-lrp-green'
                }`}
              >
                <Image
                  src={img.image.url}
                  alt={img.alt || product.name}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="lg:w-1/2">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          {typeof product.name === 'string' ? product.name : 'Product'}
        </h1>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-4xl font-bold text-lrp-green dark:text-lrp-green-light">
            ${(product.price + (selectedVariant?.priceModifier || 0)).toFixed(2)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <>
              <span className="text-2xl text-neutral-500 dark:text-neutral-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Save ${(product.compareAtPrice - product.price).toFixed(2)}
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <div
          className="text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: typeof product.description === 'string'
              ? product.description
              : product.description?.root?.children?.[0]?.children?.[0]?.text
                ? product.description.root.children[0].children[0].text
                : product.shortDescription || 'High-quality Lake Ride Pros merchandise'
          }}
        />

        {/* Variant Selection - Show size selector OR general variant selector */}
        {sizes.length > 0 ? (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Select Size:
            </label>
            <div className="grid grid-cols-4 gap-3">
              {sizes.map((size: string) => {
                const variant = product.variants.find((v: any) => v.size === size)
                const isSelected = selectedVariant?.size === size
                const inStock = variant?.inStock

                return (
                  <button
                    key={size}
                    onClick={() => inStock && setSelectedVariant(variant)}
                    disabled={!inStock}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                      isSelected
                        ? 'border-lrp-green bg-lrp-green text-white'
                        : inStock
                        ? 'border-neutral-300 dark:border-dark-border hover:border-lrp-green dark:text-white'
                        : 'border-neutral-200 dark:border-dark-border opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {size.toUpperCase()}
                    {!inStock && <span className="block text-xs">Out</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ) : product.variants && product.variants.length > 1 ? (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Select Option:
            </label>
            <div className="flex flex-col gap-2">
              {product.variants.map((variant: any, index: number) => {
                const isSelected = selectedVariant?.sku === variant.sku
                const inStock = variant.inStock

                return (
                  <button
                    key={variant.sku || index}
                    onClick={() => inStock && setSelectedVariant(variant)}
                    disabled={!inStock}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all text-left ${
                      isSelected
                        ? 'border-lrp-green bg-lrp-green text-white'
                        : inStock
                        ? 'border-neutral-300 dark:border-dark-border hover:border-lrp-green dark:text-white'
                        : 'border-neutral-200 dark:border-dark-border opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{variant.name}</span>
                      {variant.price && variant.price !== product.price && (
                        <span className="text-sm">${variant.price.toFixed(2)}</span>
                      )}
                    </div>
                    {!inStock && <span className="block text-xs mt-1">Out of Stock</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        {/* Color Selection */}
        {colors.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Select Color:
            </label>
            <div className="flex gap-3">
              {colors.map((color: string) => {
                const variant = product.variants.find((v: any) => v.color === color)
                const isSelected = selectedVariant?.color === color

                return (
                  <button
                    key={color}
                    onClick={() => setSelectedVariant(variant)}
                    className={`py-2 px-6 rounded-lg border-2 font-semibold transition-all ${
                      isSelected
                        ? 'border-lrp-green bg-lrp-green text-white'
                        : 'border-neutral-300 dark:border-dark-border hover:border-lrp-green dark:text-white'
                    }`}
                  >
                    {color}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">
            Quantity:
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-lg border-2 border-neutral-300 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary font-bold text-xl dark:text-white"
            >
              −
            </button>
            <span className="text-2xl font-bold w-16 text-center dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 rounded-lg border-2 border-neutral-300 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary font-bold text-xl dark:text-white"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || !selectedVariant.inStock || addedToCart}
          className="w-full bg-lrp-green hover:bg-lrp-green-dark disabled:bg-neutral-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3 mb-4"
        >
          {addedToCart ? (
            <>
              <Check className="w-6 h-6" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="w-6 h-6" />
              Add to Cart
            </>
          )}
        </button>

        {/* Product Details */}
        <div className="border-t dark:border-dark-border pt-6 space-y-4">
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
            Product Details:
          </h3>
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            <li>• High-quality materials</li>
            <li>• Comfortable fit</li>
            <li>• Official Lake Ride Pros merchandise</li>
            <li>• Shipped from USA</li>
            <li>• 7-14 day delivery</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
