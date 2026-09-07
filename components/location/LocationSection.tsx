import type { ReactNode } from 'react'

export interface LocationSectionProps {
  id: string
  title: string
  introduction?: ReactNode
  children: ReactNode
  tone?: 'white' | 'gray' | 'dark'
}

const tones = {
  white: 'bg-white text-lrp-black',
  gray: 'bg-lrp-gray text-lrp-black',
  dark: 'bg-lrp-black text-white',
} as const

/** A flexible content boundary: route-specific prose, lists and links stay intact. */
export default function LocationSection({
  id,
  title,
  introduction,
  children,
  tone = 'white',
}: LocationSectionProps) {
  return (
    <section aria-labelledby={`${id}-heading`} className={`py-14 sm:py-20 ${tones[tone]}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="grid gap-5 lg:grid-cols-12 lg:gap-12">
          <h2
            id={`${id}-heading`}
            className="max-w-3xl text-balance font-celebri text-3xl leading-[1.06] tracking-[-0.035em] sm:text-4xl lg:col-span-7"
          >
            {title}
          </h2>
          {introduction && (
            <div className="max-w-xl space-y-4 leading-relaxed lg:col-span-5">{introduction}</div>
          )}
        </header>
        <div className="mt-9 sm:mt-12">{children}</div>
      </div>
    </section>
  )
}
