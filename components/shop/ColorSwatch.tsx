'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColorSwatchProps {
  color: string
  colorHex?: string
  isSelected?: boolean
  isAvailable?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

/**
 * Fallback color mapping for common color names
 * Used when Printify doesn't provide a hex value
 */
const COLOR_FALLBACKS: Record<string, string> = {
  // Basic colors
  'black': '#000000',
  'white': '#FFFFFF',
  'red': '#DC2626',
  'blue': '#2563EB',
  'navy': '#1E3A5A',
  'navy blue': '#1E3A5A',
  'green': '#16A34A',
  'yellow': '#EAB308',
  'orange': '#EA580C',
  'purple': '#9333EA',
  'pink': '#EC4899',
  'brown': '#78350F',
  'gray': '#6B7280',
  'grey': '#6B7280',

  // Extended colors
  'charcoal': '#36454F',
  'heather': '#9CA3AF',
  'heather grey': '#9CA3AF',
  'heather gray': '#9CA3AF',
  'maroon': '#800000',
  'burgundy': '#800020',
  'forest': '#228B22',
  'forest green': '#228B22',
  'olive': '#808000',
  'tan': '#D2B48C',
  'beige': '#F5F5DC',
  'cream': '#FFFDD0',
  'ivory': '#FFFFF0',
  'gold': '#FFD700',
  'silver': '#C0C0C0',
  'teal': '#008080',
  'turquoise': '#40E0D0',
  'coral': '#FF7F50',
  'salmon': '#FA8072',
  'lavender': '#E6E6FA',
  'mint': '#98FF98',
  'mint green': '#98FF98',
  'royal': '#4169E1',
  'royal blue': '#4169E1',
  'sky blue': '#87CEEB',
  'light blue': '#ADD8E6',
  'dark blue': '#00008B',
  'dark green': '#006400',
  'light green': '#90EE90',

  // Special/patterns
  'camo': 'linear-gradient(45deg, #4A5D23 25%, #8B8C7A 25%, #8B8C7A 50%, #4A5D23 50%, #4A5D23 75%, #78866B 75%)',
  'camouflage': 'linear-gradient(45deg, #4A5D23 25%, #8B8C7A 25%, #8B8C7A 50%, #4A5D23 50%, #4A5D23 75%, #78866B 75%)',
  'tie dye': 'conic-gradient(from 0deg, #FF6B6B, #4ECDC4, #FFE66D, #95E1D3, #FF6B6B)',
  'rainbow': 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF)',
  'transparent': 'transparent',
  'clear': 'transparent',
}

/**
 * Get the display color for a swatch
 * Returns either a hex color or a CSS gradient
 */
function getSwatchColor(color: string, colorHex?: string): string {
  // If we have a hex value from Printify, use it
  if (colorHex && colorHex.startsWith('#')) {
    return colorHex
  }

  // Look up the color name in our fallbacks
  const normalizedColor = color.toLowerCase().trim()
  return COLOR_FALLBACKS[normalizedColor] || '#808080' // Default to gray
}

/**
 * Determine if a color is light (needs dark checkmark)
 */
function isLightColor(color: string): boolean {
  // Handle gradients and transparent
  if (color.includes('gradient') || color === 'transparent') {
    return true
  }

  // Parse hex color
  const hex = color.replace('#', '')
  if (hex.length !== 6) return true

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6
}

/**
 * Premium color swatch component with hex color preview
 */
export function ColorSwatch({
  color,
  colorHex,
  isSelected = false,
  isAvailable = true,
  onClick,
  size = 'md',
  showLabel = false,
  className,
}: ColorSwatchProps) {
  const swatchColor = getSwatchColor(color, colorHex)
  const isGradient = swatchColor.includes('gradient')
  const isTransparent = swatchColor === 'transparent'
  const isLight = isLightColor(swatchColor)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  const checkSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <button
        onClick={onClick}
        disabled={!isAvailable}
        aria-label={`Select color ${color}${!isAvailable ? ', out of stock' : ''}`}
        aria-pressed={isSelected}
        className={cn(
          'relative rounded-full transition-all duration-200 flex items-center justify-center',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-lrp-green focus-visible:ring-offset-2',
          sizeClasses[size],
          isSelected && 'ring-2 ring-lrp-green ring-offset-2 dark:ring-offset-dark-bg',
          !isAvailable && 'opacity-40 cursor-not-allowed',
          isAvailable && !isSelected && 'hover:scale-110 hover:shadow-lg',
          // Border for light colors and white
          (isLight || isTransparent) && 'border border-neutral-300 dark:border-neutral-600'
        )}
        style={{
          background: isGradient ? swatchColor : undefined,
          backgroundColor: !isGradient ? swatchColor : undefined,
        }}
      >
        {/* Checkered background for transparent */}
        {isTransparent && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #ccc 25%, transparent 25%),
                linear-gradient(-45deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(-45deg, transparent 75%, #ccc 75%)
              `,
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
            }}
          />
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <Check
            className={cn(
              checkSizeClasses[size],
              'drop-shadow-md',
              isLight ? 'text-neutral-900' : 'text-white'
            )}
            strokeWidth={3}
          />
        )}

        {/* Out of stock diagonal line */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-red-500 rotate-45 rounded-full" />
          </div>
        )}
      </button>

      {showLabel && (
        <span
          className={cn(
            'text-xs font-medium text-center max-w-full truncate',
            isSelected ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400',
            !isAvailable && 'line-through opacity-60'
          )}
        >
          {color}
        </span>
      )}
    </div>
  )
}

export default ColorSwatch
