'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star, Search, X, Heart, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import QuickViewModal from './QuickViewModal'
import { getMediaUrl } from '@/lib/utils'
import type { Product, Media } from '@/src/payload-types'

interface ShopClientProps {
  initialProducts: Product[]
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [wishlist, setWishlist] = useState<Set<string | number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const categories = [
    { name: 'All Products', value: 'all' },
    { name: 'Apparel', value: 'apparel' },
    { name: 'Accessories', value: 'accessories' },
    { name: 'Drinkware', value: 'drinkware' },
    { name: 'Home & Living', value: 'home' },
  ]

  const sortOptions = [
    { name: 'Featured', value: 'featured' },
    { name: 'Price: Low to High', value: 'price-asc' },
    { name: 'Price: High to Low', value: 'price-desc' },
    { name: 'Newest First', value: 'newest' },
  ]

  // Filter, search, and sort products
  const { filteredAndSortedProducts, totalProducts, totalPages } = useMemo(() => {
    let filtered = initialProducts

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) =>
        product.categories?.includes(selectedCategory as 'apparel' | 'accessories' | 'drinkware' | 'home')
      )
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        (typeof product.description === 'object' && product.description?.root ?
          JSON.stringify(product.description).toLowerCase().includes(query) : false) ||
        product.categories?.some((cat) => cat.toLowerCase().includes(query))
      )
    }

    // Sort
    const sorted = [...filtered]
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        break
      case 'featured':
      default:
        // Featured products first
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
    }

    // Pagination
    const total = sorted.length
    const pages = Math.ceil(total / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = sorted.slice(startIndex, endIndex)

    return {
      filteredAndSortedProducts: paginated,
      totalProducts: total,
      totalPages: pages,
    }
  }, [initialProducts, selectedCategory, searchQuery, sortBy, currentPage, pageSize])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery, sortBy])

  const toggleWishlist = (productId: string | number) => {
    setWishlist(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-lrp-black dark:bg-lrp-black">
      {/* Hero Section - Premium Design */}
      <section className="relative bg-gradient-to-br from-lrp-green via-lrp-green to-lrp-green-dark py-16 md:py-20 overflow-hidden">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Diagonal stripe pattern */}
        <div className="absolute inset-0 opacity-5 pattern-diagonal-stripes"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
          <h1 className="font-boardson text-5xl md:text-6xl font-bold text-white text-center mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            Lake Ride Pros Shop
          </h1>
          <p className="text-white/90 text-center text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Show your Lake Ozarks pride with official Lake Ride Pros merchandise
          </p>

          {/* Premium Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 transition-colors group-focus-within:text-lrp-green z-10" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-12 py-4 rounded-xl bg-lrp-black/80 backdrop-blur-md text-white placeholder:text-neutral-500 border-2 border-transparent focus:border-lrp-green focus:outline-none focus:scale-[1.02] focus:shadow-[0_8px_24px_rgba(76,187,23,0.3)] transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Sorting Bar - Premium Pills */}
      <section className="border-b border-dark-border sticky top-0 bg-lrp-black z-30 shadow-lg backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Premium Category Filter Pills */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category.value
                      ? 'bg-lrp-green text-white shadow-[0_4px_16px_rgba(76,187,23,0.4)] scale-105'
                      : 'bg-transparent border-2 border-lrp-green/30 text-lrp-green hover:bg-lrp-green hover:text-white hover:border-lrp-green hover:scale-105 hover:shadow-[0_4px_16px_rgba(76,187,23,0.3)]'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Premium Sort Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-3 rounded-xl border-2 border-dark-border bg-dark-bg-secondary text-lrp-black font-semibold cursor-pointer hover:border-lrp-green/50 transition-all focus:outline-none focus:border-lrp-green focus:shadow-[0_0_0_3px_rgba(76,187,23,0.1)]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-dark-bg-secondary">
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Results Count & Page Size Selector */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="text-sm text-neutral-400" suppressHydrationWarning>
              Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
              {searchQuery && <span className="text-lrp-green"> matching "{searchQuery}"</span>}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="page-size" className="text-sm text-neutral-400 whitespace-nowrap">
                Show:
              </label>
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border-2 border-dark-border bg-dark-bg-secondary text-lrp-black text-sm font-semibold cursor-pointer hover:border-lrp-green/50 transition-all focus:outline-none focus:border-lrp-green"
              >
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={60}>60</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid - Premium Layout */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-dark-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 border border-dark-border">
                <Search className="w-12 h-12 text-neutral-400" />
              </div>
              <h2 className="font-boardson text-4xl font-bold text-white mb-4">
                No Products Found
              </h2>
              <p className="text-neutral-400 mb-8 max-w-md mx-auto text-lg">
                {searchQuery
                  ? `No products match "${searchQuery}". Try a different search term.`
                  : 'No products available in this category. Check back soon!'}
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="inline-block bg-lrp-green hover:bg-lrp-green-dark text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-[0_8px_24px_rgba(76,187,23,0.4)] hover:scale-105"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product, index: number) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={() => setQuickViewProduct(product)}
                  isWishlisted={wishlist.has(product.id)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-12">
              {/* Page Info */}
              <div className="text-sm text-neutral-400">
                Page {currentPage} of {totalPages}
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border-2 border-dark-border bg-dark-bg-secondary text-lrp-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-lrp-green transition-all"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border-2 border-dark-border bg-dark-bg-secondary text-lrp-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-lrp-green transition-all"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                          currentPage === pageNum
                            ? 'border-lrp-green bg-lrp-green text-white'
                            : 'border-dark-border bg-dark-bg-secondary text-lrp-black hover:border-lrp-green'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border-2 border-dark-border bg-dark-bg-secondary text-lrp-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-lrp-green transition-all"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border-2 border-dark-border bg-dark-bg-secondary text-lrp-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-lrp-green transition-all"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Premium Free Shipping Banner */}
      <section className="relative bg-gradient-to-r from-lrp-green via-lrp-green-light to-lrp-green-dark py-10 mt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-white text-xl font-bold flex items-center justify-center gap-3 drop-shadow-lg">
            <span className="text-3xl">🚚</span>
            Free Shipping on Orders Over $50!
          </p>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  onQuickView: () => void
  isWishlisted: boolean
  onToggleWishlist: () => void
  index: number
}

function ProductCard({ product, onQuickView, isWishlisted, onToggleWishlist, index }: ProductCardProps) {
  // Use featuredImage first, then fall back to first image in gallery
  // Handle multiple possible data structures for maximum compatibility
  let image: Media | null = null

  // Try featuredImage (could be populated object or null)
  if (product.featuredImage && typeof product.featuredImage === 'object') {
    image = product.featuredImage as Media
  }

  // Fall back to gallery image if no featured image
  if (!image?.url && product.images && product.images.length > 0) {
    const firstImageItem = product.images[0]
    // Handle nested structure: images[0].image
    if (firstImageItem && typeof firstImageItem.image === 'object') {
      image = firstImageItem.image as Media
    }
    // Handle flat structure: images[0] might be the Media object directly
    else if (firstImageItem && typeof firstImageItem === 'object' && 'url' in firstImageItem) {
      image = firstImageItem as unknown as Media
    }
  }

  // Debug logging for image issues
  if (typeof window !== 'undefined' && !image?.url) {
    console.log('Product missing image:', {
      productId: product.id,
      productName: product.name,
      featuredImage: product.featuredImage,
      firstImage: product.images?.[0],
      hasImages: !!product.images?.length,
      imageUrl: image?.url,
    })
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  // Truncate title at 60 characters
  const truncatedTitle = product.name.length > 60
    ? product.name.substring(0, 60) + '...'
    : product.name

  return (
    <div
      className="group bg-dark-bg-secondary rounded-2xl border border-lrp-green/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(76,187,23,0.2)] hover:border-lrp-green/30 flex flex-col h-full relative"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Premium Wishlist Heart */}
      <button
        onClick={(e) => {
          e.preventDefault()
          onToggleWishlist()
        }}
        className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-all shadow-lg hover:bg-black/80"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={`w-5 h-5 transition-all ${
            isWishlisted
              ? 'fill-lrp-green text-lrp-green scale-110'
              : 'text-white/80 hover:text-lrp-green'
          }`}
        />
      </button>

      <Link href={`/shop/products/${product.slug}`} className="flex-1 flex flex-col w-full">
        {/* Premium Image / Branded Placeholder */}
        <div className="relative aspect-square bg-dark-bg-tertiary overflow-hidden w-full">
          {image?.url ? (
            <Image
              src={getMediaUrl(image.url)}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
              priority={false}
              onError={(_e) => {
                console.error('Image failed to load:', {
                  productName: product.name,
                  imageUrl: getMediaUrl(image.url),
                  originalUrl: image.url,
                })
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
              {/* Branded "No Image" Placeholder */}
              <div className="absolute inset-0 bg-gradient-radial from-dark-bg-secondary to-lrp-black"></div>
              <div className="relative z-10 flex flex-col items-center">
                <ShoppingBag className="w-20 h-20 text-lrp-green/20 mb-3" />
                <span className="text-sm text-neutral-500 font-medium tracking-wide">No Image</span>
              </div>
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5 pattern-diagonal-green"></div>
            </div>
          )}

          {/* Premium Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-lrp-green text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 backdrop-blur-sm">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                Sale
              </span>
            )}
          </div>

          {/* Premium Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center backdrop-blur-0 group-hover:backdrop-blur-sm">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onQuickView()
              }}
              aria-label={`Quick view ${product.name}`}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-lrp-green text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-lrp-green-dark hover:scale-105 transform"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Premium Details Section */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Category Tag - Premium Style */}
          {product.categories && product.categories.length > 0 && (
            <p className="text-xs text-neutral-400 uppercase mb-2 font-semibold tracking-wider">
              {product.categories[0].replace('-', ' ')}
            </p>
          )}

          {/* Title - Premium Typography */}
          <h3 className="font-semibold text-base text-white mb-3 group-hover:text-lrp-green-light transition-colors line-clamp-2 min-h-[3rem]">
            {typeof truncatedTitle === 'string' ? truncatedTitle : 'Product'}
          </h3>

          {/* Premium Price Display */}
          <div className="flex items-baseline gap-2 mb-5 mt-auto">
            <span className="text-3xl font-bold text-lrp-green">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
            </span>
            {hasDiscount && (
              <span className="text-sm text-neutral-500 line-through">
                ${typeof product.compareAtPrice === 'number' ? product.compareAtPrice.toFixed(2) : '0.00'}
              </span>
            )}
          </div>

          {/* Premium View Details Button */}
          <span className="block w-full bg-lrp-green group-hover:bg-lrp-green-dark text-white py-3 rounded-xl font-bold transition-all group-hover:scale-[1.02] group-hover:shadow-[0_4px_16px_rgba(76,187,23,0.4)] text-sm text-center">
            View Details →
          </span>

          {/* Available Sizes - Premium Style */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {Array.from(new Set(product.variants.map((v) => v.size).filter((s): s is string => !!s)))
                .slice(0, 4)
                .map((size: string) => (
                  <span
                    key={size}
                    className="text-[10px] border border-lrp-green/30 px-2.5 py-1 rounded text-neutral-400 font-semibold tracking-wide"
                  >
                    {size.toUpperCase()}
                  </span>
                ))}
              {Array.from(new Set(product.variants.map((v) => v.size).filter((s): s is string => !!s))).length > 4 && (
                <span className="text-[10px] px-2.5 py-1 text-neutral-500 font-semibold">
                  +{Array.from(new Set(product.variants.map((v) => v.size).filter((s): s is string => !!s))).length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
