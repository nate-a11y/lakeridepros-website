import CommercePage from '@/components/commerce-editorial/CommercePage'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lake Ride Pros Shop — New Merch Coming Soon',
  description: 'The Lake Ride Pros merch shop is being upgraded with better gear and a better shopping experience.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/shop',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function ShopPage() {
  return (
    <CommercePage variant="shop">
      <main className="flex min-h-[70vh] items-center bg-neutral-50 px-4 py-20 dark:bg-lrp-black">
        <section className="mx-auto w-full max-w-3xl border border-black/10 bg-white p-8 text-center shadow-xl dark:border-white/15 dark:bg-dark-bg-secondary sm:p-14">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-dark dark:text-primary-light">
            Lake Ride Pros Merch
          </p>
          <h1 className="mt-4 text-balance font-boardson text-5xl font-bold text-lrp-black dark:text-white sm:text-6xl">
            Better gear is on the way.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            We are rebuilding the Lake Ride Pros shop with better merchandise and a better shopping experience. Check back soon for the new collection.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center bg-primary px-7 py-3 font-black text-lrp-black hover:bg-primary-light focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-dark"
            >
              Back to Lake Ride Pros
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center border-2 border-lrp-black px-7 py-3 font-black text-lrp-black hover:bg-lrp-black hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-lrp-black"
            >
              Contact us
            </Link>
          </div>
        </section>
      </main>
    </CommercePage>
  )
}
