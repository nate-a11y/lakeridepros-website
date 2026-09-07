import type { ReactNode } from 'react'
import Link from 'next/link'

interface PartnerDirectoryShellProps {
  title: string
  description: string
  currentPath: string
  ctaTitle: string
  ctaDescription: string
  ctaLabel: string
  children: ReactNode
}

const directories = [
  { href: '/local-premier-partners', label: 'Local Premier Partners' },
  { href: '/wedding-partners', label: 'Wedding Partners' },
  { href: '/trusted-referral-partners', label: 'Trusted Referral Partners' },
]

export default function PartnerDirectoryShell({
  title, description, currentPath, ctaTitle, ctaDescription, ctaLabel, children,
}: PartnerDirectoryShellProps) {
  return (
    <div className="min-h-screen bg-white text-lrp-black" data-partner-page>
      <section className="bg-lrp-black text-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8 lg:pt-20">
          <h1 className="max-w-4xl text-balance font-celebri text-5xl leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{description}</p>
          <nav aria-label="Partner directories" className="mt-9 flex flex-col items-start gap-x-8 gap-y-1 sm:mt-12 sm:flex-row sm:flex-wrap">
            {directories.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={href === currentPath ? 'page' : undefined}
                className={`min-h-11 border-b-2 py-2 text-sm font-semibold ${href === currentPath ? 'border-lrp-green text-white' : 'border-transparent text-white/75 hover:border-white hover:text-white'}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      {children}
      <section className="bg-lrp-gray py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14 lg:px-8">
          <div>
            <h2 className="max-w-2xl text-balance font-celebri text-3xl leading-tight tracking-tight sm:text-4xl">{ctaTitle}</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-lrp-black/75">{ctaDescription}</p>
          </div>
          <Link href="/contact" className="min-h-14 w-fit bg-lrp-green px-8 py-4 text-center font-bold text-lrp-black hover:bg-lrp-green-light">
            {ctaLabel}
          </Link>
        </div>
      </section>
    </div>
  )
}
