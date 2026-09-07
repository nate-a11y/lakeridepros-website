import Image from 'next/image'
import Link from 'next/link'
import { Globe, Phone, Mail, MapPin } from 'lucide-react'
import Gallery, { type GalleryImage } from '@/components/Gallery'
import { getMediaUrl } from '@/lib/api/sanity'
import { normalizeExternalWebsiteUrl } from '@/lib/external-url'
import type { Partner } from '@/types/sanity'

interface PartnerDetailProps {
  partner: Partner
  backLink: string
  categoryLabel: string
  displayCategory?: string
  blurb?: string
  description?: string
}

export default function PartnerDetail({ partner, backLink, categoryLabel, displayCategory = categoryLabel, blurb, description }: PartnerDetailProps) {
  const logoObj = typeof partner.logo === 'object' ? partner.logo : null
  const logoUrl = logoObj ? getMediaUrl(logoObj) : null
  const websiteUrl = normalizeExternalWebsiteUrl(partner.website)
  const galleryImages: GalleryImage[] = (partner.images || []).map((imageItem, index) => {
    const src = typeof imageItem === 'object' ? getMediaUrl(imageItem) : null
    return src ? { src, alt: `${partner.name} - Image ${index + 1}` } : null
  }).filter((image): image is GalleryImage => image !== null)

  return (
    <div className="min-h-screen bg-white text-lrp-black" data-partner-page>
      <div className="bg-lrp-black text-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pb-14 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10">
            <ol className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0 text-sm leading-relaxed text-white/75">
              <li><Link href="/" className="min-h-11 hover:text-white hover:underline">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={backLink} className="min-h-11 hover:text-white hover:underline">{categoryLabel}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="min-w-0 break-words py-2">{partner.name}</li>
            </ol>
          </nav>
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_240px] md:gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">
              <h1 className="max-w-3xl break-words font-celebri text-[2.65rem] leading-[1.04] tracking-[-0.035em] sm:text-6xl lg:text-7xl">{partner.name}</h1>
              <p className="mt-5 text-base font-semibold text-lrp-green-light">{displayCategory}</p>
              {blurb && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{blurb}</p>}
            </div>
            {logoUrl && (
              <div className="flex h-52 w-full max-w-sm items-center justify-center bg-white p-7 sm:h-60 md:max-w-none lg:h-72">
                <Image src={logoUrl} alt={partner.name} width={300} height={270} sizes="(min-width: 1024px) 244px, (min-width: 768px) 184px, 300px" className="h-full w-full object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <aside aria-label={`${partner.name} contact information`} className="min-w-0 border-t-4 border-lrp-green pt-5 lg:row-start-1 lg:col-start-2">
            <h2 className="font-celebri text-2xl">Contact</h2>
            <div className="mt-4 grid gap-2 text-sm">
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${partner.name} website (opens in new tab)`} className="!flex min-h-11 w-fit max-w-full !justify-start gap-3 font-bold text-lrp-black underline decoration-lrp-green decoration-2 underline-offset-4 hover:decoration-lrp-black">
                  <Globe className="h-5 w-5 shrink-0" aria-hidden="true" /><span>Visit Website</span>
                </a>
              )}
              {partner.phone && (
                <a href={`tel:${partner.phone}`} className="!flex min-h-11 w-fit max-w-full !justify-start gap-3 text-lrp-black hover:underline">
                  <Phone className="h-5 w-5 shrink-0" aria-hidden="true" /><span>{partner.phone}</span>
                </a>
              )}
              {partner.email && (
                <a href={`mailto:${partner.email}`} className="!flex min-h-11 w-fit max-w-full !justify-start gap-3 text-lrp-black hover:underline">
                  <Mail className="h-5 w-5 shrink-0" aria-hidden="true" /><span className="break-all">{partner.email}</span>
                </a>
              )}
              {partner.address && (
                <div className="flex min-h-11 max-w-full items-start gap-3 py-3 text-lrp-black/75">
                  <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" /><span className="min-w-0 break-words">{partner.address}</span>
                </div>
              )}
            </div>
          </aside>
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            {description && (
              <section aria-labelledby="partner-about">
                <h2 id="partner-about" className="font-celebri text-3xl tracking-tight sm:text-4xl">About</h2>
                <p className="mt-5 max-w-3xl whitespace-pre-wrap break-words leading-relaxed text-lrp-black/75">{description}</p>
              </section>
            )}
            {galleryImages.length > 0 && (
              <section aria-labelledby="partner-gallery" className={description ? 'mt-12' : ''}>
                <h2 id="partner-gallery" className="mb-6 font-celebri text-3xl tracking-tight sm:text-4xl">Gallery</h2>
                <Gallery images={galleryImages} title={partner.name} mode="grid" className="[&_button]:rounded-none" />
              </section>
            )}
          </div>

        </div>
        <Link href={backLink} className="mt-10 min-h-11 max-w-full !justify-start font-semibold text-lrp-black underline decoration-lrp-green decoration-2 underline-offset-4 hover:decoration-lrp-black">Back to {categoryLabel}</Link>
      </div>
    </div>
  )
}
