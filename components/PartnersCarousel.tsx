import Image from 'next/image'
import Link from 'next/link'
import { getMemberLogos, getMediaUrl } from '@/lib/api/sanity'

interface PartnerData {
  _id: string
  name: string
  slug?: string
  website?: string
  logoUrl: string
  isPremierPartner?: boolean | null
  isWeddingPartner?: boolean | null
}

interface PartnersCarouselProps {
  partners: PartnerData[]
}

function partnerHref(partner: PartnerData): string | undefined {
  if (!partner.slug) return partner.website
  if (partner.isPremierPartner) return `/local-premier-partners/${partner.slug}`
  if (partner.isWeddingPartner) return `/wedding-partners/${partner.slug}`
  return `/partners/${partner.slug}`
}

const knownMemberLogos: Record<string, string> = {
  '9158f75fa85e99ce20dc96c0164e0aea42852c2a': 'Lake Area Chamber of Commerce',
  '413e461e77e241b913cb72fa7ad23d3692487c9b': 'Lake West Chamber of Commerce',
}

function memberLogoName(name: string, imageUrl: string): string {
  const knownName = Object.entries(knownMemberLogos).find(([assetId]) => imageUrl.includes(assetId))?.[1]
  if (knownName) return knownName

  const normalized = name.trim()
  return /^\d[\d\s_n-]+$/i.test(normalized) ? 'Lake Ride Pros professional association membership' : normalized
}

/** Manual scroll-snap keeps the trusted-partner carousel without autoplay or duplicate links. */
export default async function PartnersCarousel({ partners }: PartnersCarouselProps) {
  if (partners.length === 0) return null

  const memberLogos = await getMemberLogos().catch(() => [])

  return (
    <section id="partner-proof" aria-labelledby="partner-heading" className="bg-lrp-black py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 border-t border-white/25 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-semibold text-primary-dark">Local trust travels both ways</p>
            <h2 id="partner-heading" className="mt-3 max-w-3xl text-balance font-celebri text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl">
              Organizations around the Lake ride with us.
            </h2>
          </div>
          <Link href="/local-premier-partners" className="font-bold underline decoration-primary decoration-2 underline-offset-8 hover:text-primary-light focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-light">
            Explore local partners
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[100rem] overflow-x-auto overscroll-x-contain px-4 scrollbar-hide sm:px-6 lg:px-8">
        <ul className="flex snap-x snap-mandatory border-y border-white/25 lg:grid lg:grid-cols-6 lg:snap-none">
          {partners.map(partner => {
            const href = partnerHref(partner)
            const content = (
              <>
                <Image
                  src={partner.logoUrl}
                  alt={partner.name}
                  width={176}
                  height={88}
                  quality={75}
                  sizes="176px"
                  className="h-16 w-40 object-contain transition-transform duration-200 motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-visible:scale-[1.03]"
                />
                <span className="mt-4 text-center text-sm font-bold">{partner.name}</span>
              </>
            )

            return (
              <li key={partner._id} className="flex min-w-56 snap-start border-r border-white/20 last:border-r-0 lg:min-w-0">
                {href ? (
                  <Link
                    href={href}
                    className="group flex min-h-44 w-full flex-col items-center justify-center px-5 py-6 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-primary-light"
                    {...(!partner.slug ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex min-h-44 w-full flex-col items-center justify-center px-5 py-6">{content}</div>
                )}
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs text-white/55 lg:hidden">Swipe to explore trusted partners</p>
      </div>

      {memberLogos.length > 0 && (
        <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-7 border-t border-white/25 pt-8 lg:grid-cols-[12rem_1fr] lg:items-center">
            <h3 className="text-sm font-black text-white/55">Proud members of</h3>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-7 lg:justify-end">
              {memberLogos.map(logo => {
                const imageUrl = getMediaUrl(logo.logo)
                const organizationName = imageUrl ? memberLogoName(logo.name, imageUrl) : logo.name
                return imageUrl ? (
                  <figure key={logo._id} className="flex min-w-44 flex-col items-center gap-3">
                    <Image src={imageUrl} alt={`${organizationName} logo`} width={190} height={88} sizes="190px" className="h-16 w-auto max-w-48 object-contain" />
                    <figcaption className="max-w-48 text-center text-xs font-semibold text-white/65">
                      {organizationName}
                    </figcaption>
                  </figure>
                ) : null
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
