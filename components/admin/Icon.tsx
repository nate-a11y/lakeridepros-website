'use client'

import React from 'react'
import Image from 'next/image'

export const Icon: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/Color logo - no background (1).svg"
        alt="LRP"
        width={32}
        height={32}
        className="w-8 h-8 object-contain"
        priority
      />
    </div>
  )
}
