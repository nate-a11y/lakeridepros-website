import type { Metadata } from 'next'
import Link from 'next/link'
import ShopClient from './ShopClient'
import type { Product } from '@/types/sanity'
import { getProducts } from '@/lib/api/sanity'

export const metadata: Metadata = {
  title: 'Shop Lake Ride Pros Merchandise | T-Shirts, Hats & More',
  description: 'Shop official Lake Ride Pros merchandise. High-quality t-shirts, hats, hoodies and accessories. Show your Lake Ozarks pride!',
  keywords: ['Lake Ride Pros shop', 'Lake Ozarks merchandise', 'LRP apparel', 'transportation merchandise'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/shop',
  },
  openGraph: {
    title: 'Shop Lake Ride Pros Merchandise',
    description: 'Shop official Lake Ride Pros merchandise. High-quality t-shirts, hats, hoodies and accessories.',
    url: 'https://www.lakeridepros.com/shop',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Shop' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Lake Ride Pros Merchandise',
    description: 'Shop official Lake Ride Pros merchandise. Show your Lake Ozarks pride!',
    images: ['/og-image.jpg'],
  },
}

export default async function ShopPage() {
  const { docs: products } = await getProducts()

  return (
    <>
      <ShopClient initialProducts={products} />
      {/* Server-side rendered product links for SEO crawlers */}
      {/* Hidden visually but accessible to search engines */}
      <nav aria-label="All products" className="sr-only">
        <h2>All Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <Link href={`/shop/products/${product.slug}`}>
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
