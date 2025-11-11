'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star, Search, X, Heart, ShoppingCart as CartIcon, ChevronDown } from 'lucide-react'
import QuickViewModal from './QuickViewModal'

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
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero */}
      <section className="bg-gradient-to-r from-lrp-green to-lrp-green-dark py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-3">
            Lake Ride Pros Shop
          </h1>
          <p className="text-white/95 text-center text-base md:text-lg max-w-2xl mx-auto font-medium">
            Show your Lake Ozarks pride with official Lake Ride Pros merchandise
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Sorting Bar */}
      <section className="border-b dark:border-dark-border sticky top-0 bg-white dark:bg-dark-bg-primary z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-5 py-2.5 rounded-lg border-2 font-semibold whitespace-nowrap transition-all shadow-sm active:scale-95 ${
                    selectedCategory === category.value
                      ? 'bg-lrp-green text-white border-lrp-green shadow-md'
                      : 'border-lrp-green/20 text-lrp-green hover:bg-lrp-green hover:text-white hover:border-lrp-green hover:shadow-md'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2.5 rounded-lg border-2 border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white font-semibold cursor-pointer hover:border-lrp-green transition-colors focus:outline-none focus:border-lrp-green"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400" suppressHydrationWarning>
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-neutral-100 dark:bg-dark-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-neutral-400 dark:text-neutral-400" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                No Products Found
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
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
                  className="inline-block bg-lrp-green hover:bg-lrp-green-dark text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredAndSortedProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={() => setQuickViewProduct(product)}
                  isWishlisted={wishlist.has(product.id)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="bg-gradient-to-r from-lrp-green to-lrp-green-dark py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-lg font-semibold flex items-center justify-center gap-2">
            <span className="text-2xl">🚚</span>
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
}

function ProductCard({ product, onQuickView, isWishlisted, onToggleWishlist }: ProductCardProps) {
  const image = product.images?.[0]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  // Truncate title at 60 characters
  const truncatedTitle = product.name.length > 60
    ? product.name.substring(0, 60) + '...'
    : product.name

  return (
    <div className="group bg-white dark:bg-dark-bg-secondary rounded-xl border border-neutral-200 dark:border-dark-border overflow-hidden hover:shadow-2xl hover:border-lrp-green/30 dark:hover:border-lrp-green/50 transition-all duration-300 flex flex-col h-full relative">
      {/* Wishlist Heart */}
      <button
        onClick={(e) => {
          e.preventDefault()
          onToggleWishlist()
        }}
        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-dark-bg-primary/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isWishlisted
              ? 'fill-red-500 text-red-500'
              : 'text-neutral-400 hover:text-red-500'
          }`}
        />
      </button>

      <Link href={`/shop/products/${product.slug}`} className="flex-1 flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-neutral-50 dark:bg-dark-bg-primary overflow-hidden">
          {image?.image?.url ? (
            <Image
              src={image.image.url}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-neutral-400 dark:text-neutral-300 mb-2" />
              <span className="text-sm text-neutral-500 dark:text-neutral-300">No Image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-lrp-green text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
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

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault()
                onQuickView()
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white px-6 py-2.5 rounded-lg font-semibold shadow-xl hover:bg-lrp-green hover:text-white transform scale-95 hover:scale-100 transition-all"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Title - Truncated */}
          <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-2 group-hover:text-lrp-green dark:group-hover:text-lrp-green-light transition-colors line-clamp-2 min-h-[3rem]">
            {truncatedTitle}
          </h3>

          {/* Category - Subtle */}
          {product.categories && product.categories.length > 0 && (
            <p className="text-xs text-neutral-500 dark:text-neutral-500 capitalize mb-3 font-medium">
              {product.categories[0].replace('-', ' ')}
            </p>
          )}

          {/* Price - Make it pop! */}
          <div className="flex items-baseline gap-2 mb-4 mt-auto">
            <span className="text-2xl font-extrabold text-lrp-green dark:text-lrp-green-light">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* View Details Button */}
          <button className="w-full bg-neutral-900 dark:bg-lrp-green hover:bg-lrp-green dark:hover:bg-lrp-green-dark text-white py-2.5 rounded-lg font-semibold transition-all group-hover:shadow-lg text-sm">
            View Details
          </button>

          {/* Available Sizes - Compact */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {Array.from(new Set<string>(product.variants.map((v: any) => v.size as string)))
                .slice(0, 4)
                .map((size: string) => (
                  <span
                    key={size}
                    className="text-[10px] border border-neutral-300 dark:border-neutral-600 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-400 font-medium"
                  >
                    {size.toUpperCase()}
                  </span>
                ))}
              {Array.from(new Set<string>(product.variants.map((v: any) => v.size as string))).length > 4 && (
                <span className="text-[10px] px-2 py-0.5 text-neutral-500 dark:text-neutral-500 font-medium">
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
