'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Sparkles } from 'lucide-react'

export default function NewRatesBanner() {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <section className="relative bg-black overflow-hidden">
      {/* Subtle green glow effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-lrp-green opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-lrp-green opacity-10 rounded-full blur-3xl"></div>

      {/* Dismiss button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-4 right-4 z-20 text-white/60 hover:text-white transition-colors p-2"
        aria-label="Dismiss banner"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Main content */}
        <div className="text-center mb-8">
          {/* Sparkle accent */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-lrp-green" />
            <span className="text-lrp-green font-semibold text-sm uppercase tracking-wider">2026 Update</span>
            <Sparkles className="w-5 h-5 text-lrp-green" />
          </div>

          <h2 className="font-boardson text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            New Rates for the New Year
          </h2>

          <p className="text-xl sm:text-2xl text-white/90 font-medium mb-2">
            More Competitive. More Transparent.
          </p>

          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Check out our pricing tab or submit a quote request today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center bg-lrp-green hover:bg-lrp-green-light text-black font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:shadow-lrp-green/20"
            >
              View Our Pricing
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold px-8 py-4 rounded-xl text-lg transition-all"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Service Tiers Image */}
        <div className="relative w-full max-w-5xl mx-auto">
          <Image
            src="/466df96c-5190-47a6-b16c-9c50fc5ee9b1.jpg"
            alt="Lake Ride Pros three service tiers: FLEX for flexible scheduling, LRP BLACK for premium executive service, and Elite for luxury experiences. Uniquely Designed. Professionally Delivered. Award-winning transportation at Lake of the Ozarks."
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  )
}
