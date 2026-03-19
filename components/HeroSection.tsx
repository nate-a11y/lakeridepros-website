'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import ParticleField from './ui/ParticleField'
import TypeWriter from './ui/TypeWriter'
import { BookingModal } from './BookingModal'

export default function HeroSection() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-dark-bg-primary py-24 lg:py-32 overflow-hidden transition-colors">
        {/* Particle Field Background */}
        <ParticleField />

        {/* Green accent shapes */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 dark:opacity-20 rounded-full blur-3xl"
          animate={shouldReduceMotion ? undefined : {
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-72 h-72 bg-primary-light opacity-10 dark:opacity-20 rounded-full blur-3xl"
          animate={shouldReduceMotion ? undefined : {
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Animated Heading */}
            <motion.h1
              className="font-boardson text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-lrp-black dark:text-white"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              Premium{' '}
              <span className="text-chrome">Luxury Transportation</span>
              {' '}at Lake of the Ozarks
            </motion.h1>

            {/* TypeWriter Subtitle */}
            <motion.p
              className="text-center text-xl mt-6 mb-8 text-lrp-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto"
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <TypeWriter
                text="Missouri's premier transportation service. Safe rides, good times."
                delay={800}
                speed={35}
              />
            </motion.p>

            {/* Service highlights */}
            <motion.p
              className="text-center text-lg mb-8 text-lrp-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.5 }}
            >
              Perfect for{' '}
              <strong className="font-bold text-lrp-black dark:text-white">weddings</strong>,{' '}
              <strong className="font-bold text-lrp-black dark:text-white">wine tours</strong>,{' '}
              <strong className="font-bold text-lrp-black dark:text-white">bachelor parties</strong>, and special events.
            </motion.p>

            {/* Animated CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 4 }}
            >
              <motion.button
                onClick={() => setIsBookingOpen(true)}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                className="bg-primary hover:bg-primary-dark text-lrp-black font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl shadow-green-glow"
              >
                Book Your Ride
              </motion.button>
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              >
                <Link
                  href="/fleet"
                  className="bg-white dark:bg-dark-bg-secondary hover:bg-primary-light dark:hover:bg-primary border-2 border-primary text-primary dark:text-primary-light hover:text-lrp-black font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-md"
                >
                  View Our Fleet
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-lrp-text-secondary dark:text-dark-text-secondary"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 4.5 }}
            >
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
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="mt-16"
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5, duration: 1 }}
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center text-neutral-400 dark:text-neutral-500"
              >
                <span className="text-xs uppercase tracking-widest mb-2">Scroll to explore</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
                </svg>
              </motion.div>
            </motion.div>
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
