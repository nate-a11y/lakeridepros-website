'use client'

import React from 'react'
import Image from 'next/image'

export const Logo: React.FC = () => {
  return (
    <div className="p-4 flex items-center justify-center">
      <Image
        src="/Color logo - no background (1).svg"
        alt="Lake Ride Pros"
        width={180}
        height={60}
        className="w-auto h-10 object-contain"
        priority
      />
    </div>
  )
}
