'use client'

import { usePhoneModal } from '@/lib/store/phoneModal'
import { ReactNode } from 'react'

interface PhoneLinkProps {
  children: ReactNode
  className?: string
}

export function PhoneLink({ children, className }: PhoneLinkProps) {
  const { openModal } = usePhoneModal()

  return (
    <button
      onClick={openModal}
      className={className}
      type="button"
    >
      {children}
    </button>
  )
}
