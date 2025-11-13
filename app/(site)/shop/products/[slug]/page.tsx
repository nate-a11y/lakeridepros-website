import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductActions from './ProductActions'
import { Metadata } from 'next'

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

function getMediaUrl(url: string): string {
  if (!url) return '/placeholder-service.jpg';
  if (url.startsWith('http')) return url;
  const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001';
  return `${PAYLOAD_API_URL}${url}`;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug).catch(() => null);

  if (!product) {
    return {
      title: 'Product Not Found | Lake Ride Pros Shop',
    };
  }

  const productName = typeof product.name === 'string' ? product.name : 'Product';
  const description = product.shortDescription || (typeof product.description === 'string' ? product.description.substring(0, 155) : productName);
  const imageUrl = product.featuredImage?.url
    ? getMediaUrl(product.featuredImage.url)
    : 'https://www.lakeridepros.com/og-image.jpg';

  return {
    title: `${productName} | Lake Ride Pros Merchandise`,
    description: `${description}. Shop official Lake Ride Pros gear and merchandise.`,
    keywords: product.tags ? product.tags.join(', ') : `${productName}, Lake of the Ozarks merchandise, Lake Ride Pros shop`,
    alternates: {
      canonical: `https://www.lakeridepros.com/shop/products/${params.slug}`,
    },
    openGraph: {
      title: productName,
      description: description,
      url: `https://www.lakeridepros.com/shop/products/${params.slug}`,
      siteName: 'Lake Ride Pros',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: productName,
      description: description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const productName = typeof product.name === 'string' ? product.name : 'Product';
  const imageUrl = product.featuredImage?.url
    ? getMediaUrl(product.featuredImage.url)
    : 'https://www.lakeridepros.com/og-image.jpg';

  // Product Schema for SEO
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: product.shortDescription || productName,
    image: imageUrl,
    brand: {
      '@type': 'Brand',
      name: 'Lake Ride Pros'
    },
    offers: {
      '@type': 'Offer',
      price: product.price || 0,
      priceCurrency: 'USD',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://www.lakeridepros.com/shop/products/${params.slug}`,
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.lakeridepros.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://www.lakeridepros.com/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: productName,
        item: `https://www.lakeridepros.com/shop/products/${params.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
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
                {productName}
              </li>
            </ol>
          </nav>

          {/* Product Info & Actions (Client Component handles everything) */}
          <ProductActions product={product} />
        </div>
      </div>
    </>
  )
}
