'use client'

import { useEffect, useState } from 'react'
import { useMoovsFAB } from '@/hooks/useMoovsFAB'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [mounted, setMounted] = useState(false)

  // Hide Moovs FAB when modal is open
  useMoovsFAB(isOpen)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      // Add body class for modal-open state
      document.body.classList.add('modal-open')

      // Hide Moovs FAB when modal is open
      const moovsElements = document.querySelectorAll('[id*="moovs"], [class*="moovs"]')
      moovsElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none'
        }
      })
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset'
      // Remove body class
      document.body.classList.remove('modal-open')

      // Show Moovs FAB when modal closes
      const moovsElements = document.querySelectorAll('[id*="moovs"], [class*="moovs"]')
      moovsElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = ''
        }
      })
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
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
      className="booking-modal fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" aria-hidden="true" />

      {/* Modal - Increased z-index to be above everything */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        aria-describedby="booking-modal-description"
        className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-dark-bg-secondary rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lake Ride Pros Branded Header */}
        <div className="flex items-center justify-between p-6 bg-primary">
          <div>
            <h2 id="booking-modal-title" className="text-2xl font-bold text-white">
              Book Your Ride
            </h2>
            <p id="booking-modal-description" className="text-white/90 text-sm mt-1">
              Lake Ride Pros - Premium Transportation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-dark rounded-lg transition-colors z-10"
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
        <div className="relative w-full h-[calc(90vh-100px)] overflow-y-auto">
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
