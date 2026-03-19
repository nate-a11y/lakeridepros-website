import type { Metadata } from 'next'
import Link from 'next/link'
import { Car, Megaphone, ArrowRight } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Careers | Lake Ride Pros - Join Our Team',
  description: 'Join the Lake Ride Pros team at Lake of the Ozarks. Apply as a professional driver or sales & brand ambassador. Missouri\'s Best award-winning transportation company.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/careers',
  },
  openGraph: {
    title: 'Careers | Lake Ride Pros - Join Our Team',
    description: 'Join the Lake Ride Pros team at Lake of the Ozarks. Apply as a professional driver or sales & brand ambassador.',
    url: 'https://www.lakeridepros.com/careers',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Careers' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers | Lake Ride Pros - Join Our Team',
    description: 'Join the Lake Ride Pros team at Lake of the Ozarks. Apply as a professional driver or sales & brand ambassador.',
    images: ['/og-image.jpg'],
  },
}

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary transition-colors">
      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h1 className="font-boardson text-4xl md:text-6xl font-bold text-white text-center">
              Join the Lake Ride Pros Team
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-white/90 text-center mt-6 text-xl max-w-3xl mx-auto">
              Work with Missouri&apos;s Best award-winning luxury transportation company at Lake of the Ozarks. We&apos;re looking for dedicated professionals who share our passion for exceptional service.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Career Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 - Professional Driver */}
            <ScrollReveal delay={0.1} direction="left">
              <div className="h-full bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border rounded-lg p-8 flex flex-col transition-colors hover:shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Car className="w-7 h-7 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      Professional Driver
                    </h2>
                    <span className="inline-block mt-1 px-3 py-0.5 text-xs font-semibold bg-primary/10 dark:bg-primary/20 text-primary rounded-full">
                      11-Step Application
                    </span>
                  </div>
                </div>

                <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-8 flex-grow">
                  Join our team of professional drivers providing luxury transportation at Lake of the Ozarks. CDL preferred but not required. Full DOT compliance application.
                </p>

                <Link
                  href="/careers/driver-application"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 font-semibold rounded-lg bg-primary text-lrp-black hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Apply as Driver
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 2 - Sales & Brand Ambassador */}
            <ScrollReveal delay={0.2} direction="right">
              <div className="h-full bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border rounded-lg p-8 flex flex-col transition-colors hover:shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-7 h-7 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      Sales &amp; Brand Ambassador
                    </h2>
                    <span className="inline-block mt-1 px-3 py-0.5 text-xs font-semibold bg-primary/10 dark:bg-primary/20 text-primary rounded-full">
                      Quick Application
                    </span>
                  </div>
                </div>

                <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-8 flex-grow">
                  Help grow the Lake Ride Pros brand. Build relationships with venues, hotels, and event planners across the Lake area.
                </p>

                <Link
                  href="/careers/general-application"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 font-semibold rounded-lg bg-primary text-lrp-black hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Additional Info */}
          <ScrollReveal delay={0.3}>
            <div className="mt-12 text-center">
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                Questions about careers at Lake Ride Pros?{' '}
                <a
                  href="mailto:owners@lakeridepros.com"
                  className="text-primary hover:text-primary-dark underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  owners@lakeridepros.com
                </a>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
