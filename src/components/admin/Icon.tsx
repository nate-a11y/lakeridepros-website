import React from 'react'
import Image from 'next/image'

export const Icon = () => {
  return (
    <div className="custom-icon">
      <Image
        src="/icon-192.png"
        alt="LRP"
        width={32}
        height={32}
        style={{
          objectFit: 'contain',
        }}
        priority
      />
    </div>
  )
}
