'use client'

import { useEffect, useState } from 'react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />

      {/* Modal */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-dark-bg-secondary rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lake Ride Pros Branded Header */}
        <div className="flex items-center justify-between p-6 bg-primary">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Book Your Ride
            </h2>
            <p className="text-white/90 text-sm mt-1">
              Lake Ride Pros - Premium Transportation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-dark rounded-lg transition-colors"
            aria-label="Close booking modal"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Moovs Iframe Container */}
        <div className="relative w-full h-[calc(90vh-100px)]">
          <iframe
            src="https://customer.moovs.app/lake-ride-pros/iframe"
            title="Lake Ride Pros Booking"
            className="w-full h-full border-0"
            allow="payment"
          />
        </div>
      </div>
    </div>
  )
}
