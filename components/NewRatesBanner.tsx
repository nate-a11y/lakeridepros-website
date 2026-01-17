'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Sparkles, Clock, ChevronDown, CheckCircle } from 'lucide-react'
import { useHasMounted } from '@/hooks/useHasMounted'

// Check expiration and dismissal status - runs only on client
function getInitialDismissedState(): boolean {
  if (typeof window === 'undefined') return true

  // Check if popup has expired (after Feb 15, 2026)
  const expirationDate = new Date('2026-02-16T00:00:00')
  const now = new Date()
  if (now >= expirationDate) return true

  // Check if user has already dismissed this popup
  return localStorage.getItem('newRates2026Dismissed') === 'true'
}

export default function NewRatesBanner() {
  const isMounted = useHasMounted()
  const [showStopTheClock, setShowStopTheClock] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [manuallyDismissed, setManuallyDismissed] = useState(false)

  // Compute dismissed state on client
  const isDismissed = useMemo(() => {
    if (!isMounted) return true
    if (manuallyDismissed) return true
    return getInitialDismissedState()
  }, [isMounted, manuallyDismissed])

  const handleDismiss = () => {
    setManuallyDismissed(true)
    if (dontShowAgain) {
      localStorage.setItem('newRates2026Dismissed', 'true')
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted || isDismissed) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-3xl md:w-full md:max-h-[90vh] bg-black rounded-2xl shadow-2xl z-50 overflow-y-auto animate-in zoom-in-95 fade-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-rates-title"
      >
        {/* Green glow effects */}
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-lrp-green opacity-15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-lrp-green opacity-15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-20 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative px-6 py-8 md:px-10 md:py-10">
          {/* Main content */}
          <div className="text-center mb-6">
            {/* Sparkle accent */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-lrp-green" />
              <span className="text-lrp-green font-semibold text-sm uppercase tracking-wider">2026 Update</span>
              <Sparkles className="w-5 h-5 text-lrp-green" />
            </div>

            <h2 id="new-rates-title" className="font-boardson text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              New Rates for the New Year
            </h2>

            <p className="text-lg sm:text-xl text-white/90 font-medium mb-2">
              More Competitive. More Transparent.
            </p>

            <p className="text-base text-white/70 max-w-xl mx-auto mb-6">
              Check out our pricing tab or submit a quote request today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                href="/pricing"
                onClick={handleDismiss}
                className="inline-flex items-center justify-center bg-lrp-green hover:bg-lrp-green-light text-black font-bold px-6 py-3 rounded-xl text-base transition-all shadow-lg hover:shadow-xl hover:shadow-lrp-green/20"
              >
                View Our Pricing
              </Link>
              <Link
                href="/book"
                onClick={handleDismiss}
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold px-6 py-3 rounded-xl text-base transition-all"
              >
                Get a Quote
              </Link>
            </div>
          </div>

          {/* Stop the Clock Accordion */}
          <div className="max-w-xl mx-auto mb-6">
            <button
              onClick={() => setShowStopTheClock(!showStopTheClock)}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 transition-all group"
              aria-expanded={showStopTheClock}
            >
              <Clock className="w-5 h-5 text-lrp-green" />
              <span className="text-white font-semibold text-sm sm:text-base">Introducing "Stop the Clock"</span>
              <ChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-300 ${showStopTheClock ? 'rotate-180' : ''}`} />
            </button>

            {/* Expandable Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showStopTheClock ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <p className="text-white/90 text-center text-sm mb-4">
                  Pause the meter when you don't need the vehicle during hourly reservations
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <h4 className="text-white font-bold text-sm mb-2">How It Works</h4>
                    <ul className="space-y-1.5 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-lrp-green mt-0.5 flex-shrink-0" />
                        <span>Available after 2 hours into reservation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-lrp-green mt-0.5 flex-shrink-0" />
                        <span>Pause for up to 4 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-lrp-green mt-0.5 flex-shrink-0" />
                        <span>Must be pre-planned at booking</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <h4 className="text-white font-bold text-sm mb-2">Pricing</h4>
                    <div className="space-y-1">
                      <div>
                        <span className="text-xl font-bold text-lrp-green">$200</span>
                        <span className="text-white/70 text-xs ml-2">first 4 hours paused</span>
                      </div>
                      <div>
                        <span className="text-lg font-bold text-lrp-green">$50</span>
                        <span className="text-white/70 text-xs ml-2">/hr after 4 hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/pricing#stop-the-clock"
                    onClick={handleDismiss}
                    className="inline-flex items-center gap-2 text-lrp-green hover:text-lrp-green-light font-semibold text-sm transition-colors"
                  >
                    Learn more on our pricing page
                    <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Service Tiers Image */}
          <div className="relative w-full max-w-lg mx-auto">
            <Image
              src="/466df96c-5190-47a6-b16c-9c50fc5ee9b1.jpg"
              alt="Lake Ride Pros three service tiers: FLEX for vehicles up to 4 passengers, Elite for vehicles up to 7 passengers, and LRP BLACK Suburban service with select beverages included. Award-winning transportation at Lake of the Ozarks."
              width={1920}
              height={1080}
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>

          {/* Don't show again checkbox and skip link */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <button
                type="button"
                role="checkbox"
                aria-checked={dontShowAgain}
                onClick={() => setDontShowAgain(!dontShowAgain)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  dontShowAgain
                    ? 'bg-lrp-green border-lrp-green'
                    : 'border-white/40 hover:border-white/60'
                }`}
              >
                {dontShowAgain && (
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-white/60 group-hover:text-white/80 text-sm transition-colors">
                Don't show this again
              </span>
            </label>
            <button
              onClick={handleDismiss}
              className="text-white/50 hover:text-white/70 text-sm transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
