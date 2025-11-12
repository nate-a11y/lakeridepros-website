import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <div className="custom-logo">
      <Image
        src="/Color logo - no background.png"
        alt="Lake Ride Pros"
        width={160}
        height={40}
        style={{
          objectFit: 'contain',
          maxHeight: '40px',
          width: 'auto',
        }}
        priority
      />
    </div>
  )
}
