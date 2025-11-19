'use client'

import { useEffect, useState } from 'react'
import { usePhoneModal } from '@/lib/store/phoneModal'
import { Phone, MessageSquare } from 'lucide-react'

const PHONE_NUMBER = '5732069499'
const PHONE_DISPLAY = '(573) 206-9499'

export function PhoneModal() {
  const [mounted, setMounted] = useState(false)
  const { isOpen, closeModal } = usePhoneModal()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll
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
        closeModal()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeModal])

  if (!mounted || !isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={closeModal}
      role="presentation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" aria-hidden="true" />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-modal-title"
        aria-describedby="phone-modal-description"
        className="relative w-full max-w-sm bg-white dark:bg-dark-bg-secondary rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-primary">
          <div>
            <h2 id="phone-modal-title" className="text-xl font-bold text-white">
              Contact Us
            </h2>
            <p id="phone-modal-description" className="text-white/90 text-sm mt-1">
              {PHONE_DISPLAY}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-primary-dark rounded-lg transition-colors z-10"
            aria-label="Close contact modal"
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
            How would you like to reach us?
          </p>

          {/* Call Button */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="flex items-center justify-center gap-3 w-full p-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-semibold"
            onClick={closeModal}
          >
            <Phone className="w-5 h-5" />
            Call Us
          </a>

          {/* Text Button */}
          <a
            href={`sms:${PHONE_NUMBER}`}
            className="flex items-center justify-center gap-3 w-full p-4 bg-gray-100 hover:bg-gray-200 dark:bg-dark-bg-tertiary dark:hover:bg-dark-bg-primary text-gray-800 dark:text-white rounded-lg transition-colors font-semibold"
            onClick={closeModal}
          >
            <MessageSquare className="w-5 h-5" />
            Text Us
          </a>
        </div>
      </div>
    </div>
  )
}
