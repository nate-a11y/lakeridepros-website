'use client'

import { usePhoneModal } from '@/lib/store/phoneModal'
import { ReactNode, memo } from 'react'

interface PhoneLinkProps {
  children: ReactNode
  className?: string
}

export const PhoneLink = memo(function PhoneLink({ children, className }: PhoneLinkProps) {
  const { openModal } = usePhoneModal()

  return (
    <button
      onClick={openModal}
      className={className}
      type="button"
      aria-label="Call Lake Ride Pros - Opens phone options"
    >
      {children}
    </button>
  )
})
