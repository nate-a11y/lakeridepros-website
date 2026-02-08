'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo, useCallback } from 'react';
import { ChevronDown, Facebook, Instagram, Twitter, Youtube, AtSign } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { BookingModal } from './BookingModal';
import CartIcon from '@/components/cart/CartIcon';

type DropdownType = 'services' | 'partners' | 'shop' | 'about' | 'social';
type DropdownState = Record<DropdownType, boolean>;

const initialDropdownState: DropdownState = {
  services: false,
  partners: false,
  shop: false,
  about: false,
  social: false,
};

// TikTok icon component (not available in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/lakeridepros',
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/lakeridepros',
    icon: Instagram,
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com/LakeRidePros?s=09',
    icon: Twitter,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@lakeridepros?si=oS45binC05S-krrq',
    icon: Youtube,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@lakeridepros?_r=1&_t=ZT-91WVPg1ADlu',
    icon: TikTokIcon,
  },
];

interface Service {
  name: string;
  slug: string;
}

interface HeaderClientProps {
  services: Service[];
  popularServiceSlugs?: string[];
}

export default function HeaderClient({ services, popularServiceSlugs = [] }: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState<DropdownState>(initialDropdownState);

  // Memoized dropdown handlers to prevent recreation on every render
  const openDropdown = useCallback((type: DropdownType) => {
    setDropdowns(prev => ({ ...prev, [type]: true }));
  }, []);

  const closeDropdown = useCallback((type: DropdownType) => {
    setDropdowns(prev => ({ ...prev, [type]: false }));
  }, []);

  const toggleDropdown = useCallback((type: DropdownType) => {
    setDropdowns(prev => ({ ...prev, [type]: !prev[type] }));
  }, []);

  // Memoize service dropdown items to avoid recreation on every render
  const serviceDropdownItems = useMemo(() => [
    { name: 'All Services', href: '/services' },
    ...services.map((service) => ({
      name: service.name,
      href: `/services/${service.slug}`,
    })),
  ], [services]);

  // Use analytics-based popular services, fallback to hardcoded list
  const fallbackServiceSlugs = useMemo(() => [
    'wedding-transportation',
    'airport-shuttle',
    'nightlife-transportation',
    'corporate-transportation',
    'private-aviation-transportation',
  ], []);

  // Use analytics data if available, otherwise use fallback
  const featuredServiceSlugs = useMemo(() =>
    popularServiceSlugs.length > 0 ? popularServiceSlugs : fallbackServiceSlugs,
    [popularServiceSlugs, fallbackServiceSlugs]
  );

  const featuredServices = useMemo(() => services
    .filter(s => featuredServiceSlugs.includes(s.slug))
    .sort((a, b) => featuredServiceSlugs.indexOf(a.slug) - featuredServiceSlugs.indexOf(b.slug))
    .map(s => ({ name: s.name, href: `/services/${s.slug}` })),
    [services, featuredServiceSlugs]
  );

  const otherServices = useMemo(() => services
    .filter(s => !featuredServiceSlugs.includes(s.slug))
    .map(s => ({ name: s.name, href: `/services/${s.slug}` })),
    [services, featuredServiceSlugs]
  );

  const navigation = useMemo(() => [
    {
      name: 'Services',
      href: '/services',
      hasDropdown: true,
      dropdownType: 'services',
      dropdownItems: serviceDropdownItems,
    },
    { name: 'Fleet', href: '/fleet' },
    {
      name: 'Partners',
      href: '/wedding-partners',
      hasDropdown: true,
      dropdownType: 'partners',
      dropdownItems: [
        { name: 'Wedding Partners', href: '/wedding-partners' },
        { name: 'Local Premier Partners', href: '/local-premier-partners' },
        { name: 'Trusted Referral Partners', href: '/trusted-referral-partners' },
      ]
    },
    {
      name: 'Shop & Perks',
      href: '/shop',
      hasDropdown: true,
      dropdownType: 'shop',
      dropdownItems: [
        { name: 'Merch Store', href: '/shop' },
        { name: 'Gift Cards', href: '/gift-cards' },
        { name: 'Insider Membership', href: '/insider-membership-benefits' },
      ]
    },
    {
      name: 'About',
      href: '/about-us',
      hasDropdown: true,
      dropdownType: 'about',
      dropdownItems: [
        { name: 'Our Team', href: '/our-drivers' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Blog', href: '/blog' },
        { name: 'Events', href: '/events' },
        { name: 'Testimonials', href: '/testimonials' },
      ]
    },
    { name: 'Contact', href: '/contact' },
  ], [serviceDropdownItems]);

  return (
    <header className="bg-white dark:bg-dark-bg-secondary border-b border-neutral-200 dark:border-dark-border sticky top-0 z-50 transition-colors">
      <nav aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center h-full py-2">
            <Link href="/" className="flex items-center h-full">
              <Image
                src="/Color logo - no background.png"
                alt="Lake Ride Pros Logo"
                width={150}
                height={50}
                className="w-auto h-full max-w-[128px] sm:max-w-[144px] md:max-w-[160px] object-contain"
                quality={65}
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {navigation.map((item) => (
              item.hasDropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  role="none"
                  onMouseEnter={() => openDropdown(item.dropdownType as DropdownType)}
                  onMouseLeave={() => closeDropdown(item.dropdownType as DropdownType)}
                  onFocus={() => openDropdown(item.dropdownType as DropdownType)}
                  onBlur={(e) => {
                    // Only close if focus moves outside the dropdown container
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      closeDropdown(item.dropdownType as DropdownType);
                    }
                  }}
                >
                  <button
                    className="text-lrp-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm font-semibold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 -mx-1"
                    aria-expanded={dropdowns[item.dropdownType as DropdownType]}
                    aria-haspopup="true"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleDropdown(item.dropdownType as DropdownType);
                      }
                      if (e.key === 'Escape') {
                        closeDropdown(item.dropdownType as DropdownType);
                      }
                    }}
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  </button>

                  {item.dropdownType === 'services' && dropdowns.services && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                    <div role="menu" aria-label="Services submenu" className="w-[600px] bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl border border-neutral-200 dark:border-dark-border p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Featured Services Column */}
                        <div>
                          <div className="text-xs font-bold text-primary uppercase mb-3">Most Popular</div>
                          <div className="space-y-1">
                            {featuredServices.map((service) => (
                              <Link
                                key={service.name}
                                href={service.href}
                                role="menuitem"
                                className="block px-3 py-2 text-sm text-neutral-900 dark:text-white hover:bg-lrp-green/10 hover:text-lrp-green transition-colors rounded-md"
                              >
                                {service.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Other Services Column - Scrollable */}
                        <div>
                          <div className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase mb-3">All Services</div>
                          <div className="space-y-1 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                            <Link
                              href="/services"
                              role="menuitem"
                              className="block px-3 py-2 text-sm font-semibold text-primary hover:bg-lrp-green/10 transition-colors rounded-md"
                            >
                              View All Services →
                            </Link>
                            {otherServices.map((service) => (
                              <Link
                                key={service.name}
                                href={service.href}
                                role="menuitem"
                                className="block px-3 py-2 text-sm text-neutral-900 dark:text-white hover:bg-lrp-green/10 hover:text-lrp-green transition-colors rounded-md"
                              >
                                {service.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  )}

                  {item.dropdownType === 'partners' && dropdowns.partners && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                    <div role="menu" aria-label="Partners submenu" className="w-64 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl border border-neutral-200 dark:border-dark-border py-2 z-50">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          role="menuitem"
                          className="block px-4 py-2 text-sm text-neutral-900 dark:text-white hover:bg-lrp-green/10 hover:text-lrp-green transition-colors"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                    </div>
                  )}

                  {item.dropdownType === 'shop' && dropdowns.shop && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                    <div role="menu" aria-label="Shop & Perks submenu" className="w-64 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl border border-neutral-200 dark:border-dark-border py-2">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          role="menuitem"
                          className="block px-4 py-2 text-sm text-neutral-900 dark:text-white hover:bg-lrp-green/10 hover:text-lrp-green transition-colors"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                    </div>
                  )}

                  {item.dropdownType === 'about' && dropdowns.about && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                    <div role="menu" aria-label="About submenu" className="w-64 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl border border-neutral-200 dark:border-dark-border py-2">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          role="menuitem"
                          className="block px-4 py-2 text-sm text-neutral-900 dark:text-white hover:bg-lrp-green/10 hover:text-lrp-green transition-colors"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lrp-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm font-semibold relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {item.name}
                </Link>
              )
            ))}

            {/* Quote Now Button */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="bg-primary hover:bg-primary-dark text-lrp-black px-6 py-2.5 rounded-lg font-semibold transition-colors hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Quote Now
            </button>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Social Media Dropdown - hidden on mobile */}
            <div
              className="hidden md:block relative"
              role="presentation"
              onMouseEnter={() => openDropdown('social')}
              onMouseLeave={() => closeDropdown('social')}
              onFocus={() => openDropdown('social')}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  closeDropdown('social');
                }
              }}
            >
              <button
                className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary"
                aria-expanded={dropdowns.social}
                aria-haspopup="true"
                aria-label="Social media links"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown('social');
                  }
                  if (e.key === 'Escape') {
                    closeDropdown('social');
                  }
                }}
              >
                <AtSign className="w-4 h-4" />
              </button>

              {/* Animated Dropdown */}
              {dropdowns.social && (
              <div
                role="menu"
                aria-label="Social media links"
                className="absolute top-full right-0 pt-0 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl border border-neutral-200 dark:border-dark-border py-2 z-50 min-w-[160px]"
              >
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-lrp-green/10 hover:text-primary dark:hover:text-primary transition-colors"
                      aria-label={`Follow Lake Ride Pros on ${social.name} (opens in new tab)`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{social.name}</span>
                    </a>
                  );
                })}
              </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Icon */}
            <CartIcon />

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:!hidden inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary-dark hover:bg-green-50 dark:hover:bg-dark-bg-tertiary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 0px))' }}>
            <nav aria-label="Mobile navigation" className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <Link
                        href={item.href}
                        className="text-lrp-black dark:text-white hover:text-primary dark:hover:text-primary hover:bg-green-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200 px-3 py-2 text-base font-semibold rounded-lg block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <div className="pl-4 space-y-1 max-h-[280px] overflow-y-auto pr-2">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary hover:bg-green-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200 px-3 py-1.5 text-sm rounded-lg block"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-lrp-black dark:text-white hover:text-primary dark:hover:text-primary hover:bg-green-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200 px-3 py-2 text-base font-semibold rounded-lg block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Quote Now Button */}
              <button
                onClick={() => {
                  setIsBookingOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="bg-primary hover:bg-primary-dark text-lrp-black px-6 py-3 rounded-lg font-semibold text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Quote Now
              </button>
            </nav>
          </div>
        )}
      </nav>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </header>
  );
}
