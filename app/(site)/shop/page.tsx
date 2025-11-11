import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shop Lake Ride Pros Merchandise | T-Shirts, Hats & More',
  description: 'Shop official Lake Ride Pros merchandise. High-quality t-shirts, hats, hoodies and accessories. Show your Lake Ozarks pride!',
  keywords: ['Lake Ride Pros shop', 'Lake Ozarks merchandise', 'LRP apparel', 'transportation merchandise'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/shop',
  },
}

// Force dynamic rendering so Payload CMS is available at request time
export const dynamic = 'force-dynamic'

async function getProducts() {
  try {
    const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001'
    const res = await fetch(`${payloadUrl}/api/products?where[status][equals]=active&limit=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ShopPage() {
  const products = await getProducts()

  const categories = [
    { name: 'All Products', value: 'all' },
    { name: 'Apparel', value: 'apparel' },
    { name: 'Accessories', value: 'accessories' },
    { name: 'Drinkware', value: 'drinkware' },
    { name: 'Home & Living', value: 'home' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero - Reduced padding */}
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
        </div>
      </section>

      {/* Category Filter - Improved styling */}
      <section className="border-b dark:border-dark-border sticky top-0 bg-white dark:bg-dark-bg-primary z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.value}
                className="px-5 py-2.5 rounded-lg border-2 border-lrp-green/20 text-lrp-green hover:bg-lrp-green hover:text-white hover:border-lrp-green font-semibold whitespace-nowrap transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-neutral-100 dark:bg-dark-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-neutral-400 dark:text-neutral-400" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                Coming Soon!
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                We're working on bringing you awesome Lake Ride Pros merchandise. Check back soon!
              </p>
              <Link
                href="/"
                className="inline-block bg-lrp-green hover:bg-lrp-green-dark text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
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
    </div>
  )
}

function ProductCard({ product }: { product: any }) {
  const image = product.images?.[0]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  // Truncate title at 60 characters
  const truncatedTitle = product.name.length > 60
    ? product.name.substring(0, 60) + '...'
    : product.name

  return (
    <Link
      href={`/shop/products/${product.slug}`}
      className="group bg-white dark:bg-dark-bg-secondary rounded-xl border border-neutral-200 dark:border-dark-border overflow-hidden hover:shadow-2xl hover:border-lrp-green/30 dark:hover:border-lrp-green/50 transition-all duration-300 flex flex-col h-full"
    >
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
            <ShoppingBag className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-2" />
            <span className="text-sm text-neutral-400 dark:text-neutral-500">No Image</span>
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
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
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
  )
}
