'use client'

import { useMemo, useCallback } from 'react'
import { ColorSwatch } from './ColorSwatch'
import { cn } from '@/lib/utils'

interface Variant {
  name: string
  sku: string
  price?: number | null
  inStock?: boolean | null
  size?: string | null
  color?: string | null
  colorHex?: string | null
  printifyVariantId?: string | null
}

interface VariantSelectorProps {
  variants: Variant[]
  selectedVariant: Variant | null
  onVariantChange: (variant: Variant) => void
  basePrice: number
  className?: string
}

interface ColorOption {
  color: string
  colorHex: string
  variants: Variant[]
  hasAvailableStock: boolean
}

interface SizeOption {
  size: string
  variants: Variant[]
  hasAvailableStock: boolean
}

/**
 * Build a size/color availability matrix
 * Returns true if a specific size+color combination is in stock
 */
function buildAvailabilityMatrix(variants: Variant[]): Map<string, boolean> {
  const matrix = new Map<string, boolean>()

  for (const variant of variants) {
    const key = `${variant.size || ''}_${variant.color || ''}`
    matrix.set(key, variant.inStock === true)
  }

  return matrix
}

/**
 * Check if a size/color combination is available
 */
function isComboAvailable(
  matrix: Map<string, boolean>,
  size: string | null,
  color: string | null
): boolean {
  const key = `${size || ''}_${color || ''}`
  return matrix.get(key) === true
}

/**
 * Find the variant for a given size/color combination
 */
function findVariant(
  variants: Variant[],
  size: string | null,
  color: string | null
): Variant | null {
  return variants.find(v =>
    (v.size || '') === (size || '') &&
    (v.color || '') === (color || '')
  ) || null
}

/**
 * Premium variant selector with size/color matrix
 * Provides visual feedback about which combinations are available
 */
export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
  basePrice,
  className,
}: VariantSelectorProps) {
  // Extract unique colors with their hex values
  const colorOptions = useMemo<ColorOption[]>(() => {
    const colorMap = new Map<string, ColorOption>()

    for (const variant of variants) {
      if (!variant.color) continue

      const existing = colorMap.get(variant.color)
      if (existing) {
        existing.variants.push(variant)
        if (variant.inStock) existing.hasAvailableStock = true
      } else {
        colorMap.set(variant.color, {
          color: variant.color,
          colorHex: variant.colorHex || '',
          variants: [variant],
          hasAvailableStock: variant.inStock === true,
        })
      }
    }

    return Array.from(colorMap.values())
  }, [variants])

  // Extract unique sizes in a logical order
  const sizeOptions = useMemo<SizeOption[]>(() => {
    const sizeMap = new Map<string, SizeOption>()
    const sizeOrder = [
      'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL',
      'XXS', 'XXL', 'XXXL',
      'One Size', 'OS',
      // Numeric sizes
      '6', '7', '8', '9', '10', '11', '12', '13', '14',
      // Device sizes (phone cases etc)
      'iPhone 12', 'iPhone 12 Pro', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 15', 'iPhone 15 Pro',
    ]

    for (const variant of variants) {
      if (!variant.size) continue

      const existing = sizeMap.get(variant.size)
      if (existing) {
        existing.variants.push(variant)
        if (variant.inStock) existing.hasAvailableStock = true
      } else {
        sizeMap.set(variant.size, {
          size: variant.size,
          variants: [variant],
          hasAvailableStock: variant.inStock === true,
        })
      }
    }

    // Sort sizes by our predefined order
    const sortedSizes = Array.from(sizeMap.values()).sort((a, b) => {
      const aIndex = sizeOrder.findIndex(s => a.size.toUpperCase().includes(s.toUpperCase()))
      const bIndex = sizeOrder.findIndex(s => b.size.toUpperCase().includes(s.toUpperCase()))

      if (aIndex === -1 && bIndex === -1) return a.size.localeCompare(b.size)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

    return sortedSizes
  }, [variants])

  // Build availability matrix
  const availabilityMatrix = useMemo(
    () => buildAvailabilityMatrix(variants),
    [variants]
  )

  // Determine what's currently selected
  const selectedColor = selectedVariant?.color || null
  const selectedSize = selectedVariant?.size || null

  // Handle color selection
  const handleColorSelect = useCallback((color: string) => {
    // Find the best variant for this color
    // Prefer: same size if available, or first available, or first
    const colorVariants = variants.filter(v => v.color === color)

    // Try to keep the same size
    if (selectedSize) {
      const sameSize = colorVariants.find(v => v.size === selectedSize && v.inStock)
      if (sameSize) {
        onVariantChange(sameSize)
        return
      }
    }

    // Pick first in-stock variant
    const firstAvailable = colorVariants.find(v => v.inStock)
    if (firstAvailable) {
      onVariantChange(firstAvailable)
      return
    }

    // Pick first variant (even if out of stock, for display)
    if (colorVariants.length > 0) {
      onVariantChange(colorVariants[0])
    }
  }, [variants, selectedSize, onVariantChange])

  // Handle size selection
  const handleSizeSelect = useCallback((size: string) => {
    // Find the variant for this size + current color
    const variant = findVariant(variants, size, selectedColor)
    if (variant) {
      onVariantChange(variant)
      return
    }

    // If no exact match, find any variant with this size
    const sizeVariants = variants.filter(v => v.size === size)
    const firstAvailable = sizeVariants.find(v => v.inStock) || sizeVariants[0]
    if (firstAvailable) {
      onVariantChange(firstAvailable)
    }
  }, [variants, selectedColor, onVariantChange])

  // Determine display mode based on variant structure
  const hasColors = colorOptions.length > 0
  const hasSizes = sizeOptions.length > 0
  // Only show generic variants if NO color AND NO size fields are populated
  // This prevents showing variants twice (once in color/size selectors, once in generic)
  const hasOnlyGenericVariants = !hasColors && !hasSizes && variants.length > 1

  // Check if current size is available in selected color
  const isSizeAvailableInColor = useCallback((size: string) => {
    if (!selectedColor) return true
    return isComboAvailable(availabilityMatrix, size, selectedColor)
  }, [availabilityMatrix, selectedColor])

  // Check if current color is available in selected size
  const isColorAvailableInSize = useCallback((color: string) => {
    if (!selectedSize) return true
    return isComboAvailable(availabilityMatrix, selectedSize, color)
  }, [availabilityMatrix, selectedSize])

  return (
    <div className={cn('space-y-6', className)}>
      {/* Color Selection */}
      {hasColors && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-neutral-900 dark:text-white">
              Color
            </label>
            {selectedColor && (
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {selectedColor}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Color options">
            {colorOptions.map((option) => {
              const isAvailable = hasSizes
                ? isColorAvailableInSize(option.color)
                : option.hasAvailableStock

              return (
                <ColorSwatch
                  key={option.color}
                  color={option.color}
                  colorHex={option.colorHex}
                  isSelected={selectedColor === option.color}
                  isAvailable={isAvailable}
                  onClick={() => handleColorSelect(option.color)}
                  size="md"
                  showLabel={colorOptions.length <= 8}
                />
              )
            })}
          </div>
          {colorOptions.length > 8 && selectedColor && (
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Selected: <span className="font-medium text-neutral-900 dark:text-white">{selectedColor}</span>
            </p>
          )}
        </div>
      )}

      {/* Size Selection */}
      {hasSizes && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-neutral-900 dark:text-white">
              Size
            </label>
            {selectedSize && (
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {selectedSize}
              </span>
            )}
          </div>

          {sizeOptions.length <= 10 ? (
            // Grid of size buttons
            <div className="flex flex-wrap gap-2" role="group" aria-label="Size options">
              {sizeOptions.map((option) => {
                const isAvailable = hasColors
                  ? isSizeAvailableInColor(option.size)
                  : option.hasAvailableStock
                const isSelected = selectedSize === option.size

                return (
                  <button
                    key={option.size}
                    onClick={() => isAvailable && handleSizeSelect(option.size)}
                    disabled={!isAvailable}
                    aria-label={`Select size ${option.size}${!isAvailable ? ', out of stock' : ''}`}
                    aria-pressed={isSelected}
                    className={cn(
                      'min-w-[3rem] px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-lrp-green focus-visible:ring-offset-2',
                      isSelected && 'border-lrp-green bg-lrp-green text-white',
                      !isSelected && isAvailable && 'border-neutral-200 dark:border-dark-border text-neutral-900 dark:text-white hover:border-lrp-green hover:bg-lrp-green/5',
                      !isAvailable && 'border-neutral-200 dark:border-dark-border/50 text-neutral-400 dark:text-neutral-600 cursor-not-allowed line-through opacity-60'
                    )}
                  >
                    {option.size}
                  </button>
                )
              })}
            </div>
          ) : (
            // Dropdown for many sizes
            <select
              value={selectedSize || ''}
              onChange={(e) => handleSizeSelect(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white font-medium focus:outline-none focus:border-lrp-green transition-all dark:[color-scheme:dark]"
              aria-label="Select size"
            >
              <option value="" disabled>Select a size</option>
              {sizeOptions.map((option) => {
                const isAvailable = hasColors
                  ? isSizeAvailableInColor(option.size)
                  : option.hasAvailableStock

                return (
                  <option
                    key={option.size}
                    value={option.size}
                    disabled={!isAvailable}
                  >
                    {option.size} {!isAvailable ? '(Out of Stock)' : ''}
                  </option>
                )
              })}
            </select>
          )}
        </div>
      )}

      {/* Generic Variant Selection - ONLY when no color AND no size fields exist */}
      {hasOnlyGenericVariants && !hasColors && !hasSizes && (
        <div>
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">
            Select Option
          </label>

          {variants.length <= 6 ? (
            // Card-style buttons for few variants
            <div className="space-y-2" role="group" aria-label="Product options">
              {variants.map((variant, index) => {
                const isSelected = selectedVariant?.sku === variant.sku
                const isAvailable = variant.inStock === true
                const priceDisplay = variant.price && variant.price !== basePrice
                  ? `$${variant.price.toFixed(2)}`
                  : null

                return (
                  <button
                    key={variant.sku || index}
                    onClick={() => isAvailable && onVariantChange(variant)}
                    disabled={!isAvailable}
                    aria-label={`Select ${variant.name}${priceDisplay ? `, ${priceDisplay}` : ''}${!isAvailable ? ', out of stock' : ''}`}
                    aria-pressed={isSelected}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border-2 text-left transition-all duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-lrp-green focus-visible:ring-offset-2',
                      isSelected && 'border-lrp-green bg-lrp-green/5',
                      !isSelected && isAvailable && 'border-neutral-200 dark:border-dark-border hover:border-lrp-green',
                      !isAvailable && 'border-neutral-200 dark:border-dark-border/50 opacity-60 cursor-not-allowed'
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className={cn(
                        'font-medium',
                        isSelected ? 'text-lrp-green-dark dark:text-lrp-green-light' : 'text-neutral-900 dark:text-white',
                        !isAvailable && 'line-through'
                      )}>
                        {variant.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {priceDisplay && (
                          <span className={cn(
                            'text-sm font-semibold',
                            isSelected ? 'text-lrp-green-dark dark:text-lrp-green-light' : 'text-neutral-600 dark:text-neutral-400'
                          )}>
                            {priceDisplay}
                          </span>
                        )}
                        {!isAvailable && (
                          <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            // Dropdown for many variants
            <select
              value={selectedVariant?.sku || ''}
              onChange={(e) => {
                const variant = variants.find(v => v.sku === e.target.value)
                if (variant) onVariantChange(variant)
              }}
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white font-medium focus:outline-none focus:border-lrp-green transition-all dark:[color-scheme:dark]"
              aria-label="Select option"
            >
              <option value="" disabled>Select an option</option>
              {variants.map((variant, index) => {
                const isAvailable = variant.inStock === true
                const priceDisplay = variant.price && variant.price !== basePrice
                  ? ` - $${variant.price.toFixed(2)}`
                  : ''

                return (
                  <option
                    key={variant.sku || index}
                    value={variant.sku}
                    disabled={!isAvailable}
                  >
                    {variant.name}{priceDisplay} {!isAvailable ? '(Out of Stock)' : ''}
                  </option>
                )
              })}
            </select>
          )}
        </div>
      )}

      {/* Stock Status */}
      {selectedVariant && (
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            selectedVariant.inStock ? 'bg-green-500' : 'bg-red-500'
          )} />
          <span className={cn(
            'text-sm font-medium',
            selectedVariant.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-500'
          )}>
            {selectedVariant.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      )}
    </div>
  )
}

export default VariantSelector
