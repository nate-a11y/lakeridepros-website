'use client'

import { useState } from 'react'
import { LazyBookingModal } from '@/components/LazyBookingModal'
import { cn } from '@/lib/utils'

interface FleetBookingCTAProps {
  vehicleName: string
  accentVariant?: 'default' | 'pink'
}

export default function FleetBookingCTA({ vehicleName, accentVariant = 'default' }: FleetBookingCTAProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label={`Book ${vehicleName}`}
        className={cn(
          'inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
          accentVariant === 'pink'
            ? 'bg-[#db2777] hover:bg-[#be185d] focus:ring-[#db2777] shadow-pink-900/20'
            : 'bg-primary hover:bg-primary-dark focus:ring-primary',
        )}
      >
        Book This Vehicle
      </button>
      {isOpen && <LazyBookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  )
}
