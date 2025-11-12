'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingCart, Check, ExternalLink } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

interface QuickViewModalProps {
  product: any
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variants?.[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const { addItem } = useCart()

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  // Group variants by size
  const sizes = Array.from(
    new Set<string>(product.variants?.map((v: any) => v.size as string) || [])
  )

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
      image: product.images?.[0]?.image?.url || '',
      imageAlt: product.images?.[0]?.alt || product.name,
    })

    setAddedToCart(true)
    setTimeout(() => {
      setAddedToCart(false)
      onClose()
    }, 1500)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-dark-bg-primary rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-neutral-100 dark:bg-dark-bg-secondary hover:bg-neutral-200 dark:hover:bg-dark-bg-tertiary flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-square bg-neutral-100 dark:bg-dark-bg-secondary rounded-xl overflow-hidden mb-4">
                {product.images?.[selectedImage]?.image?.url ? (
                  <Image
                    src={product.images[selectedImage].image.url}
                    alt={product.images[selectedImage].alt || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="w-24 h-24 text-neutral-300 dark:text-neutral-500" />
                    <span className="absolute bottom-4 text-neutral-500 dark:text-neutral-400 text-sm">No Image Available</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <span className="bg-lrp-green text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      Featured
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      Sale
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((img: any, index: number) => (
                    img?.image?.url ? (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-lrp-green'
                            : 'border-neutral-200 dark:border-dark-border hover:border-lrp-green/50'
                        }`}
                      >
                        <Image
                          src={img.image.url}
                          alt={img.alt || 'Product image'}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : null
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                {typeof product.name === 'string' ? product.name : 'Product'}
              </h2>

              {/* Category */}
              {product.categories && product.categories.length > 0 && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 capitalize mb-4">
                  {product.categories[0].replace('-', ' ')}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-lrp-green dark:text-lrp-green-light">
                  ${(product.price + (selectedVariant?.priceModifier || 0)).toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-neutral-500 line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      Save ${(product.compareAtPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-neutral-700 dark:text-neutral-300 mb-6 text-sm leading-relaxed line-clamp-3">
                {product.description?.root?.children?.[0]?.children?.[0]?.text ||
                  product.description ||
                  'High-quality Lake Ride Pros merchandise'}
              </p>

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                    Select Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: string) => {
                      const variant = product.variants.find((v: any) => v.size === size)
                      const isSelected = selectedVariant?.size === size
                      const inStock = variant?.inStock !== false

                      return (
                        <button
                          key={size}
                          onClick={() => inStock && setSelectedVariant(variant)}
                          disabled={!inStock}
                          className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all text-sm ${
                            isSelected
                              ? 'border-lrp-green bg-lrp-green text-white'
                              : inStock
                              ? 'border-neutral-300 dark:border-dark-border hover:border-lrp-green'
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
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-neutral-300 dark:border-dark-border hover:border-lrp-green flex items-center justify-center font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-neutral-300 dark:border-dark-border hover:border-lrp-green flex items-center justify-center font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={addedToCart || !selectedVariant}
                  className="w-full bg-lrp-green hover:bg-lrp-green-dark disabled:bg-neutral-400 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>

                <Link
                  href={`/shop/products/${product.slug}`}
                  className="w-full border-2 border-neutral-300 dark:border-dark-border hover:border-lrp-green text-neutral-900 dark:text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  onClick={onClose}
                >
                  View Full Details
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
