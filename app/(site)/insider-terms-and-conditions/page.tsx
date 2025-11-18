import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insider Terms and Conditions - Lake Ride Pros',
  description: 'Terms and conditions for the Lake Ride Pros Insider membership program. Review membership rules, benefits, and policies.',
  keywords: ['insider terms', 'membership conditions', 'Lake Ride Pros terms', 'membership policy'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/insider-terms-and-conditions',
  },
}

export default function InsiderTermsAndConditionsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Insider Terms and Conditions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Please review the terms and conditions of our Insider membership program.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content Section */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-neutral-600 dark:text-neutral-300 text-center text-lg">
              Terms and conditions content coming soon.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
