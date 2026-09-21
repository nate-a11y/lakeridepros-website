'use client'

import Image from 'next/image'
import { useState } from 'react'

interface FourthwallProductArtworkProps {
  alt: string
  featured?: boolean
  priority?: boolean
  src: string
}

export default function FourthwallProductArtwork({
  alt,
  featured = false,
  priority = false,
  src,
}: FourthwallProductArtworkProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className="relative flex h-full min-h-72 items-center justify-center overflow-hidden bg-[#10120f] p-8 text-center text-white sm:min-h-96"
        role="img"
        aria-label={`${alt} product preview coming soon`}
      >
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" aria-hidden="true" />
        <div className="absolute inset-y-0 left-1/3 w-px bg-white/10" aria-hidden="true" />
        <div className="absolute inset-y-0 right-1/3 w-px bg-white/10" aria-hidden="true" />
        <div className="relative w-full max-w-xs border border-white/20 bg-black/35 px-8 py-10">
          <Image
            src="/White logo - no background.svg"
            alt=""
            width={180}
            height={183}
            className="mx-auto h-auto w-28 sm:w-36"
          />
          <p className="mt-6 border-t border-white/20 pt-5 text-sm font-bold leading-relaxed text-white/75">
            Product photography is on the way.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-72 overflow-hidden bg-[#efefeb] sm:min-h-96">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={featured
          ? '(min-width: 1024px) 58vw, 100vw'
          : '(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw'}
        className="object-contain p-5 sm:p-8"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
