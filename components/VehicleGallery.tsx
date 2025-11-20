'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import type { Media } from '@/src/payload-types';

interface VehicleImage {
  image: Media;
  alt?: string;
}

interface VehicleGalleryProps {
  images: VehicleImage[];
  vehicleName: string;
  featuredImage?: Media;
}

export default function VehicleGallery({
  images,
  vehicleName,
  featuredImage,
}: VehicleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Combine featured image with gallery images
  const allImages: VehicleImage[] = [];

  if (featuredImage) {
    allImages.push({ image: featuredImage, alt: `${vehicleName} - Featured` });
  }

  images.forEach((img) => {
    // Only add if it's not the same as featured image
    if (!featuredImage || img.image.id !== featuredImage.id) {
      allImages.push(img);
    }
  });

  const currentImage = allImages[currentIndex];

  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= allImages.length) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);

    // Scroll thumbnail into view
    if (thumbnailContainerRef.current) {
      const thumbnail = thumbnailContainerRef.current.children[index] as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [allImages.length]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % allImages.length);
  }, [currentIndex, allImages.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + allImages.length) % allImages.length);
  }, [currentIndex, allImages.length, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isLightboxOpen]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  if (allImages.length === 0) {
    return null;
  }

  const getImageUrl = (media: Media) => {
    return media.url?.startsWith('http') ? media.url : `${process.env.NEXT_PUBLIC_SERVER_URL}${media.url}`;
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative group">
        <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-900 to-black">
          {currentImage && (
            <Image
              src={getImageUrl(currentImage.image)}
              alt={currentImage.alt || `${vehicleName} - Image ${currentIndex + 1}`}
              fill
              className={`object-contain transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={currentIndex === 0}
            />
          )}

          {/* Image counter */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
            {currentIndex + 1} / {allImages.length}
          </div>

          {/* Expand button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white opacity-0 group-hover:opacity-100"
            aria-label="View fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {/* Navigation arrows - only show if more than 1 image */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Strip - only show if more than 1 image */}
      {allImages.length > 1 && (
        <div className="relative">
          <div
            ref={thumbnailContainerRef}
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all snap-center focus:outline-none focus:ring-2 focus:ring-primary ${
                  index === currentIndex
                    ? 'ring-4 ring-primary shadow-lg scale-105'
                    : 'ring-2 ring-neutral-200 dark:ring-neutral-700 hover:ring-primary/50 opacity-70 hover:opacity-100'
                }`}
                aria-label={`View image ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              >
                <Image
                  src={getImageUrl(img.image)}
                  alt={img.alt || `${vehicleName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              setIsLightboxOpen(false);
            }
          }}
          aria-label="Close lightbox (click or press Escape)"
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white z-10"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium z-10">
            {currentIndex + 1} / {allImages.length}
          </div>

          {/* Main lightbox image */}
          <div
            role="presentation"
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {currentImage && (
              <div className="relative max-w-7xl max-h-full w-full h-full">
                <Image
                  src={getImageUrl(currentImage.image)}
                  alt={currentImage.alt || `${vehicleName} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            )}

            {/* Navigation in lightbox */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip in lightbox */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-4xl w-full px-4">
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory justify-center">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(index);
                    }}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all snap-center focus:outline-none focus:ring-2 focus:ring-white ${
                      index === currentIndex
                        ? 'ring-4 ring-white shadow-lg scale-110'
                        : 'ring-2 ring-white/30 hover:ring-white/60 opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={getImageUrl(img.image)}
                      alt={img.alt || `${vehicleName} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
