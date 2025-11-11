import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductActions from './ProductActions'

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  try {
    const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001'
    const res = await fetch(
      `${payloadUrl}/api/products?where[slug][equals]=${slug}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    )

    if (!res.ok) {
      return null
    }

    const data = await res.json()

    if (!data.docs || data.docs.length === 0) {
      return null
    }

    return data.docs[0]
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
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
            <li className="text-neutral-600 dark:text-neutral-300">{product.name}</li>
          </ol>
        </nav>

        {/* Product Info & Actions (Client Component handles everything) */}
        <ProductActions product={product} />
      </div>
    </div>
  )
}
