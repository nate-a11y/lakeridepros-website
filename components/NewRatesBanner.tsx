'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Sparkles, Clock, ChevronDown, CheckCircle } from 'lucide-react'

export default function NewRatesBanner() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [showStopTheClock, setShowStopTheClock] = useState(false)

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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

          {/* Stop the Clock Accordion */}
          <div className="max-w-2xl mx-auto mb-10">
            <button
              onClick={() => setShowStopTheClock(!showStopTheClock)}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 transition-all group"
              aria-expanded={showStopTheClock}
            >
              <Clock className="w-5 h-5 text-lrp-green" />
              <span className="text-white font-semibold">Introducing "Stop the Clock"</span>
              <span className="text-white/70 text-sm hidden sm:inline">— Save on hourly rentals</span>
              <ChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-300 ${showStopTheClock ? 'rotate-180' : ''}`} />
            </button>

            {/* Expandable Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showStopTheClock ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <p className="text-white/90 text-center mb-6">
                  Pause the meter when you don't need the vehicle during hourly reservations
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">How It Works</h4>
                    <ul className="space-y-2 text-sm text-white/80">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-lrp-green mt-0.5 flex-shrink-0" />
                        <span>Available after 2 hours into reservation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-lrp-green mt-0.5 flex-shrink-0" />
                        <span>Pause for up to 4 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-lrp-green mt-0.5 flex-shrink-0" />
                        <span>Must be pre-planned at booking</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Pricing</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-2xl font-bold text-lrp-green">$200</span>
                        <span className="text-white/70 text-sm ml-2">first 4 hours paused</span>
                      </div>
                      <div>
                        <span className="text-xl font-bold text-lrp-green">$50</span>
                        <span className="text-white/70 text-sm ml-2">/hr after 4 hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-white/60 text-sm text-center mb-4">
                  Perfect for dinners, wedding ceremonies, or any event where you don't need the vehicle
                </p>

                <div className="text-center">
                  <Link
                    href="/pricing#stop-the-clock"
                    className="inline-flex items-center gap-2 text-lrp-green hover:text-lrp-green-light font-semibold transition-colors"
                  >
                    Learn more on our pricing page
                    <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Tiers Image */}
        <div className="relative w-full max-w-5xl mx-auto">
          <Image
            src="/466df96c-5190-47a6-b16c-9c50fc5ee9b1.jpg"
            alt="Lake Ride Pros three service tiers: FLEX for vehicles up to 4 passengers, Elite for vehicles up to 7 passengers, and LRP BLACK Suburban service with select beverages included. Award-winning transportation at Lake of the Ozarks."
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
