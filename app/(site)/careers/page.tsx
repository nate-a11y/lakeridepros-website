import CorePage from '@/components/core-editorial/CorePage'
import CoreHero from '@/components/core-editorial/CoreHero'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Car, BriefcaseBusiness, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Careers | Lake Ride Pros - Join Our Team',
  description: 'Join the Lake Ride Pros team at Lake of the Ozarks. Apply as a professional driver or explore detailing, dispatch, sales, and other team roles. Missouri\'s Best award-winning transportation company.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/careers',
  },
  openGraph: {
    title: 'Careers | Lake Ride Pros - Join Our Team',
    description: 'Join the Lake Ride Pros team at Lake of the Ozarks. Apply as a professional driver or explore detailing, dispatch, sales, and other team roles.',
    url: 'https://www.lakeridepros.com/careers',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Careers' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers | Lake Ride Pros - Join Our Team',
    description: 'Join the Lake Ride Pros team at Lake of the Ozarks. Apply as a professional driver or explore detailing, dispatch, sales, and other team roles.',
    images: ['/og-image.jpg'],
  },
}

export default function CareersPage() {
  return (
    <CorePage>
      {/* Hero Section */}
      <CoreHero image="shuttle">

            <h1 className="font-boardson text-4xl md:text-6xl font-bold text-white text-left">
              Join the Lake Ride Pros Team
            </h1>


            <p className="text-white/90 text-left mt-6 text-xl max-w-3xl mx-auto">
              Work with Missouri&apos;s Best award-winning luxury transportation company at Lake of the Ozarks. We&apos;re looking for dedicated professionals who share our passion for exceptional service.
            </p>

        </CoreHero>

      {/* Career Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 - Professional Driver */}

              <div className="h-full bg-white border-t border-black/25 py-8 flex flex-col transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <Car className="w-7 h-7 text-[#2f730e]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Professional Driver
                    </h2>
                    <span className="inline-block mt-2 py-0.5 text-xs font-semibold bg-white text-[#2f730e]">
                      11-Step Application
                    </span>
                  </div>
                </div>

                <p className="text-lrp-text-secondary mb-8 flex-grow">
                  Join our team of professional drivers providing luxury transportation at Lake of the Ozarks. CDL preferred but not required. Full DOT compliance application.
                </p>

                <Link
                  href="/careers/driver-application"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 font-semibold bg-primary text-lrp-black hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Apply as Driver
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>


            {/* Card 2 - General Application */}

              <div className="h-full bg-white border-t border-black/25 py-8 flex flex-col transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <BriefcaseBusiness className="w-7 h-7 text-[#2f730e]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      General Application
                    </h2>
                    <span className="inline-block mt-2 py-0.5 text-xs font-semibold bg-white text-[#2f730e]">
                      Quick Application
                    </span>
                  </div>
                </div>

                <p className="text-lrp-text-secondary mb-8 flex-grow">
                  Apply for part-time detailing, dispatch, sales, brand ambassador, or other non-driving opportunities with Lake Ride Pros.
                </p>

                <Link
                  href="/careers/general-application"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 font-semibold bg-primary text-lrp-black hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>

          </div>

          {/* Additional Info */}

            <div className="mt-12 text-left">
              <p className="text-lrp-text-secondary">
                Questions about careers at Lake Ride Pros?{' '}
                <a
                  href="mailto:owners@lakeridepros.com"
                  className="text-[#2f730e] hover:text-[#2f730e] underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  owners@lakeridepros.com
                </a>
              </p>
            </div>

        </div>
      </section>
    </CorePage>
  )
}
