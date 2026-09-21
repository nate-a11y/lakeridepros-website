import CommercePage from '@/components/commerce-editorial/CommercePage'
import {
  getFourthwallProduct,
  getFourthwallProductImage,
  getFourthwallStartingPrice,
  plainFourthwallDescription,
} from '@/lib/fourthwall/storefront'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import FourthwallProductArtwork from '../../FourthwallProductArtwork'
import FourthwallProductActions from './FourthwallProductActions'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const candidate = await getFourthwallProduct(slug)
  const product = candidate && 'id' in candidate ? candidate : null

  if (!product) {
    return {
      title: 'Lake Ride Pros Shop — New Merch Coming Soon',
      robots: { index: false, follow: true },
    }
  }

  const description = plainFourthwallDescription(product.description)
  const image = getFourthwallProductImage(product)

  return {
    title: `${product.name} | Lake Ride Pros Shop`,
    description: description || `Shop ${product.name} from Lake Ride Pros.`,
    alternates: {
      canonical: `https://www.lakeridepros.com/shop/products/${product.slug}`,
    },
    openGraph: image ? { images: [{ url: image, alt: product.name }] } : undefined,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const candidate = await getFourthwallProduct(slug)
  const product = candidate && 'id' in candidate ? candidate : null

  // Missing configuration, an empty catalog, and unknown product URLs all
  // return shoppers to the live holding page rather than exposing a dead end.
  if (!product) redirect('/shop')

  const image = getFourthwallProductImage(product)
  const description = plainFourthwallDescription(product.description)
  const startingPrice = getFourthwallStartingPrice(product)

  return (
    <CommercePage variant="shop">
      <article className="min-h-[70vh] bg-neutral-50 px-4 py-12 dark:bg-lrp-black sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center font-bold text-primary-dark underline decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary dark:text-primary-light"
          >
            Back to shop
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-square overflow-hidden border border-black/10 bg-white dark:border-white/15 dark:bg-dark-bg-secondary">
              <FourthwallProductArtwork
                src={image}
                alt={product.name}
                featured
                priority
              />
            </div>

            <div className="self-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-dark dark:text-primary-light">
                Lake Ride Pros Merch
              </p>
              <h1 className="mt-3 text-balance font-boardson text-5xl font-bold text-lrp-black dark:text-white sm:text-6xl">
                {product.name}
              </h1>
              <p className="mt-5 text-2xl font-black text-primary-dark dark:text-primary-light">
                {startingPrice === null ? 'Currently unavailable' : `From $${startingPrice.toFixed(2)}`}
              </p>
              {description && (
                <p className="mt-6 text-pretty text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {description}
                </p>
              )}
              <div className="mt-8">
                <FourthwallProductActions product={product} />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Secure checkout, shipping, taxes, and order support are handled by Fourthwall.
              </p>
            </div>
          </div>
        </div>
      </article>
    </CommercePage>
  )
}
