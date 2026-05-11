'use client'

import { useState } from 'react'
import { LazyBookingModal } from '@/components/LazyBookingModal'

interface FleetBookingCTAProps {
  vehicleName: string
}

export default function FleetBookingCTA({ vehicleName }: FleetBookingCTAProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label={`Book ${vehicleName}`}
        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Book This Vehicle
      </button>
      {isOpen && <LazyBookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  )
}
