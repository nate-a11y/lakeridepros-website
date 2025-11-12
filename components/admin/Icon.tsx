'use client'

import React from 'react'
import Image from 'next/image'

export const Icon: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image
        src="/Color logo - no background.png"
        alt="LRP"
        width={32}
        height={32}
        style={{
          width: '32px',
          height: '32px',
          objectFit: 'contain',
        }}
        priority
      />
    </div>
  )
}
