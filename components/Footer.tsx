import Image from 'next/image'
import Link from 'next/link'
import { getServicesLocal } from '@/lib/api/sanity'
import { getPopularServicesLocal } from '@/lib/analytics-server'
import { FacebookIcon, InstagramIcon, TikTokIcon, XIcon, YouTubeIcon } from '@/components/SocialIcons'

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/lakeridepros', icon: FacebookIcon },
  { name: 'Instagram', href: 'https://instagram.com/lakeridepros', icon: InstagramIcon },
  { name: 'X', href: 'https://x.com/LakeRidePros?s=09', icon: XIcon },
  { name: 'YouTube', href: 'https://youtube.com/@lakeridepros?si=oS45binC05S-krrq', icon: YouTubeIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com/@lakeridepros?_r=1&_t=ZT-91WVPg1ADlu', icon: TikTokIcon },
]

const placeLinks = [
  { name: 'Osage Beach', href: '/transportation-osage-beach' },
  { name: 'Camdenton', href: '/transportation-camdenton' },
  { name: 'Lake Ozark', href: '/transportation-lake-ozark' },
  { name: 'Sunrise Beach', href: '/transportation-sunrise-beach' },
  { name: 'Laurie', href: '/transportation-laurie' },
  { name: 'Bagnell Dam Strip', href: '/bagnell-dam-strip-transportation' },
  { name: 'Kansas City', href: '/kansas-city-to-lake-ozarks' },
  { name: 'St. Louis', href: '/st-louis-to-lake-ozarks' },
  { name: 'Columbia', href: '/columbia-to-lake-ozarks' },
  { name: 'Jefferson City', href: '/jefferson-city-to-lake-ozarks' },
  { name: 'Springfield', href: '/springfield-to-lake-ozarks' },
  { name: 'Airport transportation', href: '/lake-ozarks-airport-transportation' },
]

const exploreLinks = [
  { name: 'Manage your profile', href: 'https://customer.moovs.app/lake-ride-pros/user/profile' },
  { name: 'Fleet', href: '/fleet' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Gift cards', href: '/gift-cards' },
  { name: 'Check gift card balance', href: '/gift-card-balance' },
  { name: 'Shop', href: '/shop' },
  { name: 'Insider membership', href: '/insider-membership-benefits' },
  { name: 'Events', href: '/events' },
  { name: 'Music', href: '/music' },
]

const companyLinks = [
  { name: 'About us', href: '/about-us' },
  { name: 'Our drivers', href: '/our-drivers' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Lake guides', href: '/blog' },
  { name: 'Wedding partners', href: '/wedding-partners' },
  { name: 'Local premier partners', href: '/local-premier-partners' },
  { name: 'Careers', href: '/careers' },
  { name: 'Application status', href: '/careers/application-status' },
  { name: 'Contact', href: '/contact' },
]

const legalLinks = [
  { name: 'Privacy', href: '/privacy-policy' },
  { name: 'Terms', href: '/terms-of-service' },
  { name: 'Returns', href: '/return-policy' },
  { name: 'Accessibility', href: '/accessibility' },
]

const linkClass = 'min-w-11 text-sm leading-relaxed text-white/70 hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-light'

export default async function Footer() {
  const fallbackSlugs = [
    'wedding-transportation',
    'airport-transfers',
    'party-bus-nightlife',
    'corporate-executive-travel',
    'private-aviation-transportation',
    'group-shuttle-services',
  ]
  let popularSlugs = fallbackSlugs

  try {
    const popular = await getPopularServicesLocal(6)
    if (popular.length > 0) popularSlugs = popular.map(service => service.slug)
  } catch {
    // The stable fallback keeps useful links available during analytics outages.
  }

  let serviceLinks: Array<{ name: string; href: string }> = []
  try {
    const services = await getServicesLocal()
    serviceLinks = popularSlugs.flatMap(slug => {
      const service = services.docs.find(item => String(item.slug) === slug)
      return service ? [{ name: service.title, href: `/services/${String(service.slug)}` }] : []
    })
  } catch {
    serviceLinks = [
      { name: 'Wedding transportation', href: '/services/wedding-transportation' },
      { name: 'Airport transportation', href: '/services/airport-transfers' },
      { name: 'Group shuttles', href: '/services/group-shuttle-services' },
      { name: 'Nightlife transportation', href: '/services/party-bus-nightlife' },
    ]
  }

  return (
    <footer className="bg-lrp-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="grid gap-10 border-b border-white/20 pb-12 lg:grid-cols-[1.05fr_1.95fr] lg:gap-20">
          <div>
            <Link href="/" className="inline-flex focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-light">
              <Image
                src="/Color logo - no background.png"
                alt="Lake Ride Pros"
                width={320}
                height={324}
                sizes="(min-width: 640px) 176px, 144px"
                className="h-auto w-36 object-contain sm:w-44"
              />
            </Link>
            <p className="mt-6 max-w-sm text-balance text-2xl font-black leading-tight">
              Based at the Lake. Ready across Missouri.
            </p>
            <address className="mt-6 grid justify-items-start gap-2 not-italic">
              <a href="tel:+15732069499" className="text-xl font-black hover:text-primary-light">(573) 206-9499</a>
              <a href="mailto:contactus@lakeridepros.com" className="max-w-full break-all text-sm text-white/70 hover:text-primary-light sm:break-normal">contactus@lakeridepros.com</a>
              <span className="text-sm text-white/55">Lake of the Ozarks, Missouri</span>
            </address>
            <div className="mt-7 flex items-center gap-1">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Lake Ride Pros on ${name} (opens in a new tab)`}
                  className="inline-flex size-11 items-center justify-center text-white/65 hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            <nav aria-label="Popular services">
              <h2 className="mb-4 text-sm font-black text-primary-light">Ride</h2>
              <ul className="space-y-2.5">
                {serviceLinks.map(link => <li key={link.href}><Link href={link.href} className={linkClass}>{link.name}</Link></li>)}
                <li><Link href="/services" className="text-sm font-bold text-white hover:text-primary-light">All services</Link></li>
              </ul>
            </nav>
            <nav aria-label="Explore Lake Ride Pros">
              <h2 className="mb-4 text-sm font-black text-primary-light">Explore</h2>
              <ul className="space-y-2.5">
                {exploreLinks.map(link => <li key={link.href}><Link href={link.href} className={linkClass}>{link.name}</Link></li>)}
              </ul>
            </nav>
            <nav aria-label="Service areas">
              <h2 className="mb-4 text-sm font-black text-primary-light">Where we drive</h2>
              <ul className="grid gap-x-4 gap-y-2.5 sm:block sm:space-y-2.5">
                {placeLinks.map(link => <li key={link.href}><Link href={link.href} className={linkClass}>{link.name}</Link></li>)}
              </ul>
            </nav>
            <nav aria-label="Company">
              <h2 className="mb-4 text-sm font-black text-primary-light">Company</h2>
              <ul className="space-y-2.5">
                {companyLinks.map(link => <li key={link.href}><Link href={link.href} className={linkClass}>{link.name}</Link></li>)}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-7 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lake Ride Pros LLC. All rights reserved.</p>
          <nav aria-label="Legal links">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map(link => <li key={link.href}><Link href={link.href} className="min-w-11 hover:text-white">{link.name}</Link></li>)}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
