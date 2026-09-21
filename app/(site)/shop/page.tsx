import CommercePage from '@/components/commerce-editorial/CommercePage'
import {
  getFourthwallProductImage,
  getFourthwallProducts,
  getFourthwallStartingPrice,
} from '@/lib/fourthwall/storefront'
import type { Metadata } from 'next'
import Link from 'next/link'
import FourthwallProductArtwork from './FourthwallProductArtwork'

export async function generateMetadata(): Promise<Metadata> {
  const products = await getFourthwallProducts()

  if (products.length === 0) {
    return {
      title: 'Lake Ride Pros Shop — New Merch Coming Soon',
      description: 'The Lake Ride Pros merch shop is being upgraded with better gear and a better shopping experience.',
      alternates: { canonical: 'https://www.lakeridepros.com/shop' },
      robots: { index: false, follow: true },
    }
  }

  return {
    title: 'Lake Ride Pros Shop | Premium Merch and Gear',
    description: 'Shop the latest Lake Ride Pros apparel, hats, drinkware, and gear.',
    alternates: { canonical: 'https://www.lakeridepros.com/shop' },
  }
}

export default async function ShopPage() {
  const products = await getFourthwallProducts()
  const hasSingleProduct = products.length === 1

  return (
    <CommercePage variant="shop">
      {products.length === 0 ? (
        <div className="min-h-screen bg-white text-lrp-black">
          <section className="relative overflow-hidden bg-lrp-black text-white">
            <div className="relative mx-auto grid max-w-7xl lg:min-h-[30rem] lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
              <div className="flex flex-col justify-center px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                <p className="text-base font-bold text-[#75d446]">The Lake Ride Pros shop</p>
                <h1 className="mt-4 max-w-3xl font-boardson text-5xl font-bold leading-[0.96] text-white sm:text-6xl lg:text-7xl">
                  Gear for the good part of the ride.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
                  A new collection is taking shape for lake days, road trips, and the people who make every mile better.
                </p>
              </div>

              <div className="relative hidden overflow-hidden border-l border-white/15 lg:block" aria-hidden="true">
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/10" />
                <div className="absolute inset-y-0 right-1/3 w-px bg-white/10" />
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                <div className="absolute inset-10 flex items-center justify-center border border-white/15 bg-white/[0.03]">
                  <div className="grid size-48 place-items-center border-[18px] border-primary/90 bg-lrp-black text-center">
                    <span className="font-boardson text-5xl font-bold tracking-[-0.08em] text-white">LRP</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto grid max-w-5xl gap-8 border-y border-black/15 py-9 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-lrp-black sm:text-4xl">The collection is in the works.</h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                  We are choosing better materials and testing the details before anything goes on sale. No filler, no rush job.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link
                  href="/"
                  className="inline-flex min-h-12 items-center justify-center bg-primary px-7 py-3 font-black text-lrp-black transition-colors hover:bg-primary-light focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-dark"
                >
                  Back to Lake Ride Pros
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center border-2 border-lrp-black px-7 py-3 font-black text-lrp-black transition-colors hover:bg-lrp-black hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </section>

          <section className="bg-lrp-black px-5 py-7 text-white sm:px-8">
            <p className="mx-auto max-w-7xl text-sm font-bold text-white/70">
              Built carefully in Lake of the Ozarks. Launching when it is ready.
            </p>
          </section>
        </div>
      ) : (
        <div className="min-h-screen bg-white text-lrp-black">
          <section className="relative overflow-hidden bg-lrp-black text-white">
            <div className="relative mx-auto grid max-w-7xl lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
              <div className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
                <p className="text-base font-bold text-[#75d446]">The Lake Ride Pros shop</p>
                <h1 className="mt-4 max-w-3xl font-boardson text-5xl font-bold leading-[0.96] text-white sm:text-6xl lg:text-7xl">
                  Gear for the good part of the ride.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
                  Useful, comfortable pieces inspired by lake days, road trips, and the people who make every mile better.
                </p>
              </div>

              <div className="relative hidden border-l border-white/15 lg:flex lg:items-end lg:p-10" aria-hidden="true">
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/10" />
                <div className="absolute inset-y-0 right-1/3 w-px bg-white/10" />
                <div className="relative ml-auto max-w-xs border-t-4 border-primary pt-5">
                  <p className="text-2xl font-black leading-tight text-white">Made for wherever the day goes next.</p>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="shop-collection-heading" className="bg-white px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 flex flex-col gap-3 border-b border-black/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="shop-collection-heading" className="text-3xl font-black tracking-tight text-lrp-black sm:text-4xl">
                    Shop the collection
                  </h2>
                  <p className="mt-2 max-w-2xl text-neutral-600">
                    {hasSingleProduct
                      ? 'Our first piece is ready. More Lake Ride Pros gear is on the way.'
                      : `${products.length} pieces, selected for life on and off the lake.`}
                  </p>
                </div>
                <p className="text-sm font-bold text-neutral-500">Secure checkout powered by Fourthwall</p>
              </div>

              {hasSingleProduct ? (
                products.map(product => {
                  const imageUrl = getFourthwallProductImage(product)
                  const startingPrice = getFourthwallStartingPrice(product)

                  return (
                    <article key={product.id} className="mx-auto max-w-6xl border border-black/15 bg-[#f5f5f1]">
                      <Link
                        href={`/shop/products/${product.slug}`}
                        className="group grid min-h-[32rem] w-full lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        style={{ display: 'grid' }}
                      >
                        <FourthwallProductArtwork
                          src={imageUrl}
                          alt={product.name}
                          featured
                          priority
                        />
                        <div className="flex flex-col justify-between border-t border-black/15 bg-white p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
                          <div>
                            <p className="text-sm font-bold text-primary-dark">New in the shop</p>
                            <h3 className="mt-4 text-3xl font-black tracking-tight text-lrp-black sm:text-4xl">
                              {product.name}
                            </h3>
                            <p className="mt-4 text-lg font-black text-primary-dark">
                              {startingPrice === null ? 'Currently unavailable' : `From $${startingPrice.toFixed(2)}`}
                            </p>
                          </div>
                          <div className="mt-10 border-t border-black/15 pt-6">
                            <span className="inline-flex min-h-12 items-center border-b-4 border-primary text-base font-black text-lrp-black transition-colors group-hover:border-lrp-black">
                              View product and options
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  )
                })
              ) : (
                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product, index) => {
                    const imageUrl = getFourthwallProductImage(product)
                    const startingPrice = getFourthwallStartingPrice(product)

                    return (
                      <article key={product.id} className="border border-black/15 bg-white">
                        <Link
                          href={`/shop/products/${product.slug}`}
                          className="group block h-full focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                          <div className="aspect-[4/5]">
                            <FourthwallProductArtwork
                              src={imageUrl}
                              alt={product.name}
                              priority={index < 3}
                            />
                          </div>
                          <div className="border-t border-black/15 p-6">
                            <h3 className="text-xl font-black text-lrp-black group-hover:text-primary-dark">
                              {product.name}
                            </h3>
                            <p className="mt-2 font-bold text-primary-dark">
                              {startingPrice === null ? 'Currently unavailable' : `From $${startingPrice.toFixed(2)}`}
                            </p>
                          </div>
                        </Link>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="bg-lrp-black px-5 py-8 text-white sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-4 text-sm font-bold text-white/75 sm:grid-cols-3 sm:gap-8">
              <p>Made on demand to reduce waste.</p>
              <p>Secure checkout handled by Fourthwall.</p>
              <p>Questions? Lake Ride Pros is here to help.</p>
            </div>
          </section>
        </div>
      )}
    </CommercePage>
  )
}
