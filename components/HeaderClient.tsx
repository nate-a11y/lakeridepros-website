'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'
import { MoovsBookingLink } from '@/components/MoovsBookingLink'
import CartIcon from '@/components/cart/CartIcon'

interface Service {
  name: string
  slug: string
}

interface HeaderClientProps {
  services: Service[]
  popularServiceSlugs?: string[]
}

type MenuName = 'services' | 'partners' | 'explore'

const partners = [
  { name: 'Wedding partners', href: '/wedding-partners' },
  { name: 'Local premier partners', href: '/local-premier-partners' },
  { name: 'Trusted referral partners', href: '/trusted-referral-partners' },
]

const explore = [
  { name: 'Manage your profile', href: 'https://customer.moovs.app/lake-ride-pros/user/profile' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Lake guides', href: '/blog' },
  { name: 'Music', href: '/music' },
  { name: 'Our drivers', href: '/our-drivers' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Gift cards', href: '/gift-cards' },
  { name: 'Shop', href: '/shop' },
  { name: 'Insider membership', href: '/insider-membership-benefits' },
  { name: 'About Lake Ride Pros', href: '/about-us' },
]

const focus = 'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-light'

export default function HeaderClient({ services, popularServiceSlugs = [] }: HeaderClientProps) {
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<MenuName | null>(null)
  const mobileMenuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!mobileOpen) return

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return
      setMobileOpen(false)
      mobileMenuButton.current?.focus()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [mobileOpen])

  const orderedServices = useMemo(() => {
    const fallback = [
      'airport-transfers',
      'wedding-transportation',
      'corporate-executive-travel',
      'group-shuttle-services',
      'events-festivals',
      'party-bus-nightlife',
    ]
    const priority = popularServiceSlugs.length > 0 ? popularServiceSlugs : fallback
    return [...services].sort((a, b) => {
      const aIndex = priority.indexOf(a.slug)
      const bIndex = priority.indexOf(b.slug)
      if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
  }, [popularServiceSlugs, services])

  function closeMobile() {
    setMobileOpen(false)
  }

  function desktopMenu(name: MenuName, label: string, children: React.ReactNode) {
    const isOpen = openMenu === name
    return (
      <div
        className="relative"
        role="none"
        onMouseEnter={() => setOpenMenu(name)}
        onMouseLeave={() => setOpenMenu(null)}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpenMenu(null)
        }}
        onClick={event => {
          if ((event.target as Element).closest('a')) setOpenMenu(null)
        }}
        onKeyDownCapture={event => {
          if (event.key === 'Escape') {
            event.preventDefault()
            setOpenMenu(null)
            event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus()
          }
        }}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`flex min-h-12 items-center gap-1 text-sm font-bold text-white/85 hover:text-primary-light ${focus}`}
          onClick={() => setOpenMenu(isOpen ? null : name)}
          onKeyDown={event => {
            if (event.key === 'Escape') setOpenMenu(null)
          }}
        >
          {label} <ChevronDown className={`size-4 motion-safe:transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        {isOpen && children}
      </div>
    )
  }

  function mobileGroup(name: MenuName, label: string, links: Array<{ name: string; href: string }>) {
    const isOpen = mobileExpanded === name
    return (
      <div className="border-b border-white/20">
        <button
          type="button"
          className="flex w-full items-center justify-between py-4 text-left text-lg font-black text-white"
          aria-expanded={isOpen}
          onClick={() => setMobileExpanded(isOpen ? null : name)}
        >
          {label} <ChevronDown className={`size-5 motion-safe:transition-transform ${isOpen ? 'rotate-180 text-primary-light' : ''}`} aria-hidden="true" />
        </button>
        {isOpen && (
          <ul className="grid gap-1 pb-4 sm:grid-cols-2">
            {links.map(link => (
              <li key={link.href}>
                <Link href={link.href} onClick={closeMobile} className="block py-2 text-sm text-white/70 hover:text-primary-light">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  const serviceLinks = orderedServices.map(service => ({ name: service.name, href: `/services/${service.slug}` }))

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-lrp-black text-white">
      <nav aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" aria-label="Lake Ride Pros home" className={`flex h-full shrink-0 items-center py-2 ${focus}`}>
            <Image
              src="/Color logo - no background.png"
              alt=""
              width={320}
              height={324}
              sizes="56px"
              quality={75}
              loading="eager"
              fetchPriority="high"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <div className="hidden items-center gap-6 lg:flex [&>a]:min-w-11">
            {desktopMenu('services', 'Services', (
              <div className="absolute left-0 top-full w-[42rem] border-t-2 border-primary bg-white p-7 text-lrp-black shadow-2xl">
                <div className="flex items-end justify-between border-b border-black/20 pb-5">
                  <div>
                    <p className="text-xs font-bold text-primary-dark">Everyday rides to full weekends</p>
                    <p className="mt-1 text-2xl font-black">Choose the plan, not the vehicle.</p>
                  </div>
                  <Link href="/services" className="text-sm font-bold underline decoration-primary decoration-2 underline-offset-4">All services</Link>
                </div>
                <ul className="mt-4 grid max-h-[23rem] grid-cols-2 gap-x-8 overflow-y-auto">
                  {serviceLinks.map(link => (
                    <li key={link.href} className="border-b border-black/10">
                      <Link href={link.href} className="block py-3 text-sm font-bold hover:text-primary-dark">{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link href="/fleet" className={`text-sm font-bold text-white/85 hover:text-primary-light ${focus}`}>Fleet</Link>
            {desktopMenu('partners', 'Partners', (
              <div className="absolute left-0 top-full w-72 border-t-2 border-primary bg-white px-6 py-4 text-lrp-black shadow-2xl">
                <ul>{partners.map(link => <li key={link.href}><Link href={link.href} className="block border-b border-black/10 py-3 text-sm font-bold hover:text-primary-dark">{link.name}</Link></li>)}</ul>
              </div>
            ))}
            <Link href="/events" className={`text-sm font-bold text-white/85 hover:text-primary-light ${focus}`}>Events</Link>
            {desktopMenu('explore', 'Explore', (
              <div className="absolute right-0 top-full w-80 border-t-2 border-primary bg-white px-6 py-4 text-lrp-black shadow-2xl">
                <ul className="grid grid-cols-2 gap-x-5">{explore.map(link => <li key={link.href}><Link href={link.href} className="block border-b border-black/10 py-3 text-sm font-bold hover:text-primary-dark">{link.name}</Link></li>)}</ul>
              </div>
            ))}
            <Link href="/contact" className={`text-sm font-bold text-white/85 hover:text-primary-light ${focus}`}>Contact</Link>
            <MoovsBookingLink location="header" className="inline-flex min-h-11 items-center justify-center bg-primary px-5 py-3 text-sm font-black text-lrp-black hover:bg-primary-light focus-visible:ring-white focus-visible:ring-offset-lrp-black">
              Quote or book
            </MoovsBookingLink>
            <CartIcon />
          </div>

          <div className="flex items-center gap-3 lg:hidden [&>a]:min-w-11">
            <CartIcon />
            <button
              ref={mobileMenuButton}
              type="button"
              className={`inline-flex size-11 items-center justify-center text-primary-light ${focus}`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(value => !value)}
            >
              {mobileOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-menu" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/20 pb-8 lg:hidden">
            {mobileGroup('services', 'Services', [{ name: 'All services', href: '/services' }, ...serviceLinks])}
            <div className="grid grid-cols-2 gap-x-6 border-b border-white/20 py-2">
              <Link href="/fleet" onClick={closeMobile} className="py-4 text-lg font-black">Fleet</Link>
              <Link href="/events" onClick={closeMobile} className="py-4 text-lg font-black">Events</Link>
            </div>
            {mobileGroup('partners', 'Partners', partners)}
            {mobileGroup('explore', 'Explore', explore)}
            <div className="grid gap-3 pt-6 sm:grid-cols-2">
              <MoovsBookingLink location="mobile_header" onClick={closeMobile} className="inline-flex min-h-14 items-center justify-center bg-primary px-6 py-4 font-black text-lrp-black hover:bg-primary-light focus-visible:ring-white focus-visible:ring-offset-lrp-black">
                Quote or book
              </MoovsBookingLink>
              <Link href="/contact" onClick={closeMobile} className="inline-flex min-h-14 items-center justify-center border border-white/45 px-6 py-4 font-black">Contact us</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
