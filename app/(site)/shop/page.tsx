import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

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
      {/* Hero */}
      <section className="bg-lrp-green py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Lake Ride Pros Shop
          </h1>
          <p className="text-white/90 text-center text-lg max-w-2xl mx-auto">
            Show your Lake Ozarks pride with official Lake Ride Pros merchandise.
            High-quality apparel and accessories.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b dark:border-dark-border sticky top-0 bg-white dark:bg-dark-bg-primary z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.value}
                className="px-6 py-2 rounded-full border-2 border-lrp-green text-lrp-green hover:bg-lrp-green hover:text-white font-semibold whitespace-nowrap transition-all"
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
              <ShoppingBag className="w-20 h-20 text-neutral-400 dark:text-neutral-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                Coming Soon!
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                We're working on bringing you awesome Lake Ride Pros merchandise. Check back soon!
              </p>
              <Link
                href="/"
                className="inline-block bg-lrp-green hover:bg-lrp-green-dark text-white px-8 py-3 rounded-lg font-bold transition-all"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="bg-lrp-green py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-lg font-semibold">
            🚚 Free Shipping on Orders Over $50!
          </p>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: any }) {
  const image = product.images?.[0]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <Link
      href={`/shop/products/${product.slug}`}
      className="group bg-white dark:bg-dark-bg-secondary rounded-lg border dark:border-dark-border overflow-hidden hover:shadow-xl transition-all"
    >
      {/* Image */}
      <div className="relative aspect-square bg-neutral-100 dark:bg-dark-bg-primary overflow-hidden">
        {image ? (
          <Image
            src={image.image.url}
            alt={image.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-20 h-20 text-neutral-300 dark:text-neutral-300" />
          </div>
        )}

        {/* Badges */}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-lrp-green text-white px-3 py-1 rounded-full text-sm font-bold">
            Featured
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Sale
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2 group-hover:text-lrp-green transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-lrp-green">
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-neutral-500 dark:text-neutral-400 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Category */}
        {product.categories && product.categories.length > 0 && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 capitalize">
            {product.categories[0].replace('-', ' ')}
          </p>
        )}

        {/* Available Sizes */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex gap-1 mt-3 flex-wrap">
            {Array.from(new Set<string>(product.variants.map((v: any) => v.size as string))).slice(0, 5).map((size: string) => (
              <span
                key={size}
                className="text-xs border border-neutral-300 dark:border-dark-border px-2 py-1 rounded"
              >
                {size.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
