'use client'

import React from 'react'
import Image from 'next/image'

export const Logo: React.FC = () => {
  return (
    <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image
        src="/Color logo - no background.png"
        alt="Lake Ride Pros"
        width={180}
        height={60}
        style={{
          width: 'auto',
          height: '40px',
          objectFit: 'contain',
        }}
        priority
      />
    </div>
  )
}
