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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-lrp-black dark:text-white">
              Premium Transportation at{' '}
              <span className="text-primary dark:text-primary-light">Lake of the Ozarks</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-neutral-600 dark:text-neutral-300 font-medium">
              Safe rides, good times. Perfect for weddings, wine tours, and wild nights out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Book Your Ride
              </button>
              <Link
                href="/fleet"
                className="bg-white dark:bg-dark-bg-secondary hover:bg-primary-light dark:hover:bg-primary border-2 border-primary text-primary dark:text-primary-light hover:text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-md"
              >
                View Our Fleet
              </Link>
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
