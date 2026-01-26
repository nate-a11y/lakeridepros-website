'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookingModal } from './BookingModal'

export default function HeroSection() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-dark-bg-primary py-24 lg:py-32 overflow-hidden transition-colors">
        {/* Green accent shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 dark:opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-light opacity-10 dark:opacity-20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-boardson text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-lrp-black dark:text-white">
              Premium <span className="text-primary-dark dark:text-primary-light">Luxury Transportation</span> at Lake of the Ozarks
            </h1>
            <p className="text-center text-xl mt-6 mb-8 text-lrp-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
              Missouri's premier transportation service. Safe rides, good times. Perfect for{' '}
              <strong className="font-bold text-lrp-black dark:text-white">weddings</strong>,{' '}
              <strong className="font-bold text-lrp-black dark:text-white">wine tours</strong>,{' '}
              <strong className="font-bold text-lrp-black dark:text-white">bachelor parties</strong>, and special events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="bg-primary hover:bg-primary-dark text-lrp-black font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Book Your Ride
              </button>
              <Link
                href="/fleet"
                className="bg-white dark:bg-dark-bg-secondary hover:bg-primary-light dark:hover:bg-primary border-2 border-primary text-primary dark:text-primary-light hover:text-lrp-black font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-md"
              >
                View Our Fleet
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>First Aid & CPR Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>AED & Stop the Bleed Trained</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  )
}
