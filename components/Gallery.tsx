'use client'

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  createContext,
  useContext,
} from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import FocusTrap from 'focus-trap-react'
import { ChevronLeft, ChevronRight, X, Maximize2, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface GalleryImage {
  src: string
  alt: string
}

export interface GalleryProps {
  images: GalleryImage[]
  title?: string
  mode?: 'carousel' | 'grid'
  showLightbox?: boolean
  aspectRatio?: string
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Shared context so thumbnails + lightbox can read the same state    */
/* ------------------------------------------------------------------ */

interface GalleryCtx {
  images: GalleryImage[]
  selectedIndex: number
  scrollTo: (index: number) => void
  openLightbox: (index: number) => void
}

const Ctx = createContext<GalleryCtx>({
  images: [],
  selectedIndex: 0,
  scrollTo: () => {},
  openLightbox: () => {},
})

/* ------------------------------------------------------------------ */
/*  Gallery (public)                                                   */
/* ------------------------------------------------------------------ */

export default function Gallery({
  images,
  title,
  mode = 'carousel',
  showLightbox = true,
  aspectRatio = '4/3',
  className,
}: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = useCallback(
    (index: number) => {
      if (!showLightbox) return
      setLightboxIndex(index)
      setLightboxOpen(true)
    },
    [showLightbox],
  )

  const scrollTo = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const ctx = useMemo<GalleryCtx>(
    () => ({ images, selectedIndex, scrollTo, openLightbox }),
    [images, selectedIndex, scrollTo, openLightbox],
  )

  if (images.length === 0) return null

  return (
    <Ctx.Provider value={ctx}>
      <div
        className={cn('relative', className)}
        role="region"
        aria-label={title ? `${title} gallery` : 'Image gallery'}
      >
        {mode === 'carousel' ? (
          <GalleryCarousel
            aspectRatio={aspectRatio}
            showLightbox={showLightbox}
          />
        ) : (
          <GalleryGrid />
        )}
      </div>

      {showLightbox && lightboxOpen && (
        <GalleryLightbox
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          title={title}
        />
      )}
    </Ctx.Provider>
  )
}

/* ------------------------------------------------------------------ */
/*  GalleryCarousel                                                    */
/* ------------------------------------------------------------------ */

function GalleryCarousel({
  aspectRatio,
  showLightbox,
}: {
  aspectRatio: string
  showLightbox: boolean
}) {
  const { images, selectedIndex, scrollTo, openLightbox } = useContext(Ctx)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false })

  /* keep embla ↔ context in sync */
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    scrollTo(emblaApi.selectedScrollSnap())
  }, [emblaApi, scrollTo])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  /* when context index changes externally (e.g. thumbnail click), scroll embla */
  useEffect(() => {
    if (!emblaApi) return
    if (emblaApi.selectedScrollSnap() !== selectedIndex) {
      emblaApi.scrollTo(selectedIndex)
    }
  }, [emblaApi, selectedIndex])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className="space-y-3">
      {/* Main viewport */}
      <div className="relative group rounded-xl overflow-hidden bg-neutral-100 dark:bg-dark-bg-secondary">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative min-w-0 flex-[0_0_100%]"
                style={{ aspectRatio }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Counter badge */}
        <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-lg text-sm font-medium pointer-events-none">
          {selectedIndex + 1} / {images.length}
        </div>

        {/* Expand button */}
        {showLightbox && (
          <button
            onClick={() => openLightbox(selectedIndex)}
            className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="View fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail filmstrip */}
      {images.length > 1 && <GalleryThumbnails variant="light" />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  GalleryGrid                                                        */
/* ------------------------------------------------------------------ */

function GalleryGrid() {
  const { images, openLightbox } = useContext(Ctx)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => openLightbox(i)}
          className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:border-lrp-green hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lrp-green focus:ring-offset-2"
          aria-label={`View ${img.alt} in fullscreen`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-contain p-2 transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-lrp-green text-white p-3 rounded-full">
              <ZoomIn className="w-6 h-6" />
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  GalleryLightbox                                                    */
/* ------------------------------------------------------------------ */

function GalleryLightbox({
  startIndex,
  onClose,
  title,
}: {
  startIndex: number
  onClose: () => void
  title?: string
}) {
  const { images } = useContext(Ctx)
  const [currentIndex, setCurrentIndex] = useState(startIndex)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex,
    skipSnaps: false,
  })

  /* sync embla → state */
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  /* keyboard nav */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') emblaApi?.scrollPrev()
      if (e.key === 'ArrowRight') emblaApi?.scrollNext()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [emblaApi, onClose])

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  )

  /* context for the thumbnail strip inside lightbox */
  const lbCtx = useMemo<GalleryCtx>(
    () => ({
      images,
      selectedIndex: currentIndex,
      scrollTo,
      openLightbox: () => {},
    }),
    [images, currentIndex, scrollTo],
  )

  return (
    <FocusTrap
      focusTrapOptions={{
        initialFocus: false,
        allowOutsideClick: true,
        escapeDeactivates: false,
      }}
    >
      <div
        className="fixed inset-0 z-[200] flex flex-col bg-black/95"
        role="dialog"
        aria-modal="true"
        aria-label={title ? `${title} fullscreen gallery` : 'Fullscreen gallery'}
      >
        {/* ARIA live for screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Showing image {currentIndex + 1} of {images.length}
          {title ? `: ${images[currentIndex]?.alt}` : ''}
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 z-10">
          <span className="bg-white/10 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main carousel */}
        <div className="flex-1 relative min-h-0">
          <div ref={emblaRef} className="h-full overflow-hidden">
            <div className="flex h-full">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="min-w-0 flex-[0_0_100%] flex items-center justify-center px-4"
                >
                  <div className="relative w-full h-full max-w-6xl mx-auto">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority={i === startIndex}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>

        {/* Bottom thumbnail strip */}
        {images.length > 1 && (
          <div className="py-3 px-4">
            <Ctx.Provider value={lbCtx}>
              <GalleryThumbnails variant="dark" />
            </Ctx.Provider>
          </div>
        )}
      </div>
    </FocusTrap>
  )
}

/* ------------------------------------------------------------------ */
/*  GalleryThumbnails                                                  */
/* ------------------------------------------------------------------ */

function GalleryThumbnails({ variant }: { variant: 'light' | 'dark' }) {
  const { images, selectedIndex, scrollTo } = useContext(Ctx)
  const containerRef = useRef<HTMLDivElement>(null)

  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  /* scroll active thumb into view */
  useEffect(() => {
    if (!thumbApi) return
    thumbApi.scrollTo(selectedIndex)
  }, [thumbApi, selectedIndex])

  const isDark = variant === 'dark'
  const size = 'w-16 h-16 md:w-20 md:h-20'

  return (
    <div ref={thumbRef} className="overflow-hidden">
      <div ref={containerRef} className="flex gap-2 py-1 px-0.5">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              'flex-shrink-0 rounded-lg overflow-hidden transition-all focus:outline-none focus:ring-2',
              size,
              i === selectedIndex
                ? isDark
                  ? 'ring-4 ring-white shadow-lg'
                  : 'ring-4 ring-lrp-green shadow-lg'
                : isDark
                  ? 'ring-2 ring-white/30 hover:ring-white/60 opacity-60 hover:opacity-100'
                  : 'ring-2 ring-neutral-200 dark:ring-neutral-700 hover:ring-lrp-green/50 opacity-70 hover:opacity-100',
              isDark ? 'focus:ring-white' : 'focus:ring-lrp-green',
            )}
            aria-label={`View image ${i + 1}`}
            aria-current={i === selectedIndex ? 'true' : undefined}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
