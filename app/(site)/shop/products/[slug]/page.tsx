import { permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import ProductActions from './ProductActions'
import { Metadata } from 'next'
import { getProductBySlug, getMediaUrl } from '@/lib/api/sanity'
import type { Product } from '@/types/sanity'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
  const params = await props.params
  const product = await getProductBySlug(params.slug).catch(() => null);

  if (!product) {
    return {
      title: 'Product Not Found | Lake Ride Pros Shop',
    };
  }

  const productName = typeof product.name === 'string' ? product.name : 'Product';
  const description = product.shortDescription || (typeof product.description === 'string' ? product.description.substring(0, 155) : productName);
  const imageUrl = product.featuredImage
    ? getMediaUrl(product.featuredImage)
    : 'https://www.lakeridepros.com/og-image.jpg';

  return {
    title: `${productName} | Lake Ride Pros Merchandise`,
    description: `${description}. Shop official Lake Ride Pros gear and merchandise.`,
    keywords: product.tags ? product.tags.map((t: { tag: string }) => t.tag).join(', ') : `${productName}, Lake of the Ozarks merchandise, Lake Ride Pros shop`,
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

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params
  const product = await getProductBySlug(params.slug)

  if (!product) {
    permanentRedirect('/shop')
  }

  const productName = typeof product.name === 'string' ? product.name : 'Product';
  const imageUrl = product.featuredImage
    ? getMediaUrl(product.featuredImage)
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
