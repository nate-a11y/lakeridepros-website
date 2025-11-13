'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star, Search, X, Heart, ShoppingCart as CartIcon, ChevronDown } from 'lucide-react'
import QuickViewModal from './QuickViewModal'
import { getMediaUrl } from '@/lib/utils'

interface ShopClientProps {
  initialProducts: any[]
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

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
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = initialProducts

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product: any) =>
        product.categories?.includes(selectedCategory)
      )
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((product: any) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase?.().includes(query) ||
        product.categories?.some((cat: string) => cat.toLowerCase().includes(query))
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

    return sorted
  }, [initialProducts, selectedCategory, searchQuery, sortBy])

  const toggleWishlist = (productId: string) => {
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
    <div className="min-h-screen bg-[#060606] dark:bg-[#060606]">
      {/* Hero Section - Premium Design */}
      <section className="relative bg-gradient-to-br from-lrp-green via-lrp-green to-lrp-green-dark py-16 md:py-20 overflow-hidden">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Diagonal stripe pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
        }}></div>

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
                className="w-full pl-14 pr-12 py-4 rounded-xl bg-[#060606]/80 backdrop-blur-md text-white placeholder:text-neutral-500 border-2 border-transparent focus:border-lrp-green focus:outline-none focus:scale-[1.02] focus:shadow-[0_8px_24px_rgba(76,187,23,0.3)] transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Sorting Bar - Premium Pills */}
      <section className="border-b border-[#1a1a1a] sticky top-0 bg-[#060606] z-30 shadow-lg backdrop-blur-sm">
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
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-3 rounded-xl border-2 border-[#1a1a1a] bg-[#0f0f0f] text-white font-semibold cursor-pointer hover:border-lrp-green/50 transition-all focus:outline-none focus:border-lrp-green focus:shadow-[0_0_0_3px_rgba(76,187,23,0.1)]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#0f0f0f]">
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-neutral-400" suppressHydrationWarning>
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
            {searchQuery && <span className="text-lrp-green"> matching "{searchQuery}"</span>}
          </div>
        </div>
      </section>

      {/* Products Grid - Premium Layout */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#0f0f0f] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#1a1a1a]">
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
              {filteredAndSortedProducts.map((product: any, index: number) => (
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
  product: any
  onQuickView: () => void
  isWishlisted: boolean
  onToggleWishlist: () => void
  index: number
}

function ProductCard({ product, onQuickView, isWishlisted, onToggleWishlist, index }: ProductCardProps) {
  // Use featuredImage first, then fall back to first image in gallery
  const featuredImage = product.featuredImage
  const galleryImage = product.images?.[0]?.image
  const image = featuredImage || galleryImage

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  // Truncate title at 60 characters
  const truncatedTitle = product.name.length > 60
    ? product.name.substring(0, 60) + '...'
    : product.name

  return (
    <div
      className="group bg-[#0f0f0f] rounded-2xl border border-lrp-green/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(76,187,23,0.2)] hover:border-lrp-green/30 flex flex-col h-full relative"
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

      <Link href={`/shop/products/${product.slug}`} className="flex-1 flex flex-col">
        {/* Premium Image / Branded Placeholder */}
        <div className="relative aspect-square bg-[#1a1a1a] overflow-hidden">
          {image?.url ? (
            <Image
              src={getMediaUrl(image.url)}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
              {/* Branded "No Image" Placeholder */}
              <div className="absolute inset-0 bg-gradient-radial from-[#0f0f0f] to-[#060606]"></div>
              <div className="relative z-10 flex flex-col items-center">
                <ShoppingBag className="w-20 h-20 text-lrp-green/20 mb-3" />
                <span className="text-sm text-neutral-500 font-medium tracking-wide">No Image</span>
              </div>
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(76,187,23,0.1) 10px, rgba(76,187,23,0.1) 20px)'
              }}></div>
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
              onClick={(e) => {
                e.preventDefault()
                onQuickView()
              }}
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
          <button className="w-full bg-lrp-green hover:bg-lrp-green-dark text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(76,187,23,0.4)] text-sm">
            View Details
          </button>

          {/* Available Sizes - Premium Style */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {Array.from(new Set<string>(product.variants.map((v: any) => v.size as string)))
                .slice(0, 4)
                .map((size: string) => (
                  <span
                    key={size}
                    className="text-[10px] border border-lrp-green/30 px-2.5 py-1 rounded text-neutral-400 font-semibold tracking-wide"
                  >
                    {size.toUpperCase()}
                  </span>
                ))}
              {Array.from(new Set<string>(product.variants.map((v: any) => v.size as string))).length > 4 && (
                <span className="text-[10px] px-2.5 py-1 text-neutral-500 font-semibold">
                  +{Array.from(new Set<string>(product.variants.map((v: any) => v.size as string))).length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
