import type { Metadata } from 'next'
import ShopClient from './ShopClient'

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
    const res = await fetch(`${payloadUrl}/api/products?where[status][equals]=active&limit=100&depth=2`, {
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

  return <ShopClient initialProducts={products} />
}
