'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { FourthwallImage } from '@/lib/fourthwall/storefront'
import FourthwallProductArtwork from '../../FourthwallProductArtwork'

const THUMBNAILS_PER_PAGE = 8

interface FourthwallProductGalleryProps {
  images: FourthwallImage[]
  productName: string
}

export default function FourthwallProductGallery({ images, productName }: FourthwallProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const image = images[selectedIndex]
  const src = image?.transformedUrl || image?.url || ''
  const pageStart = Math.floor(selectedIndex / THUMBNAILS_PER_PAGE) * THUMBNAILS_PER_PAGE

  function moveImage(direction: number) {
    setSelectedIndex(index => (index + direction + images.length) % images.length)
  }

  return (
    <section aria-label={`${productName} image gallery`} className="min-w-0 space-y-4">
      <div className="relative aspect-square overflow-hidden border border-black/10 bg-white">
        <FourthwallProductArtwork
          key={src}
          src={src}
          alt={productName}
          featured
          priority={selectedIndex === 0}
        />
      </div>

      {images.length > 1 && (
        <>
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              aria-label="Previous product image"
              onClick={() => moveImage(-1)}
              className="size-11 border border-neutral-300 text-lrp-black hover:border-primary focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <p role="status" aria-label="Product image position" aria-live="polite" aria-atomic="true" className="text-sm font-bold text-neutral-600">
              Image {selectedIndex + 1} of {images.length}
            </p>
            <button
              type="button"
              aria-label="Next product image"
              onClick={() => moveImage(1)}
              className="size-11 border border-neutral-300 text-lrp-black hover:border-primary focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="Product image thumbnails">
            {images.slice(pageStart, pageStart + THUMBNAILS_PER_PAGE).map((thumbnail, offset) => {
              const index = pageStart + offset
              return (
                <button
                  key={thumbnail.url || thumbnail.transformedUrl}
                  type="button"
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={index === selectedIndex}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative aspect-square min-h-11 w-full overflow-hidden border-2 bg-neutral-100 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary ${index === selectedIndex ? 'border-primary-dark' : 'border-transparent hover:border-neutral-400'}`}
                >
                  <Image
                    src={thumbnail.transformedUrl || thumbnail.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </button>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
