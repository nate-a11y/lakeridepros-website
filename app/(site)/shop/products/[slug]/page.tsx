import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductActions from './ProductActions'

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001'

  try {
    const res = await fetch(
      `${payloadUrl}/api/products?where[slug][equals]=${slug}&depth=2`,
      {
        // Use no-store to prevent caching failed responses
        // If we used revalidate, a 500 error would be cached and the retry button wouldn't work
        cache: 'no-store',
      }
    )

    // Server errors (500, 503, etc.) should NOT be cached as 404
    // Throw to trigger error boundary instead
    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    // Product truly doesn't exist - safe to return null for 404
    if (!data.docs || data.docs.length === 0) {
      return null
    }

    return data.docs[0]
  } catch (error) {
    // Network errors, timeouts, JSON parse errors should NOT be cached as 404
    // Re-throw to trigger error boundary
    console.error('Error fetching product:', error)
    throw error
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-lrp-green hover:underline">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop" className="text-lrp-green hover:underline">
                Shop
              </Link>
            </li>
            <li>/</li>
            <li className="text-neutral-600 dark:text-neutral-300">
              {typeof product.name === 'string' ? product.name : 'Product'}
            </li>
          </ol>
        </nav>

        {/* Product Info & Actions (Client Component handles everything) */}
        <ProductActions product={product} />
      </div>
    </div>
  )
}
