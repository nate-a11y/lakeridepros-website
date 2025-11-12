'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { BookingModal } from './BookingModal';
import CartIcon from '@/components/cart/CartIcon';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [partnersDropdownOpen, setPartnersDropdownOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    {
      name: 'Services',
      href: '/services',
      hasDropdown: true,
      dropdownType: 'services',
      dropdownItems: [
        { name: 'All Services', href: '/services' },
        { name: 'Wedding Transportation', href: '/wedding-transportation' },
        { name: 'Bachelor Party Transportation', href: '/bachelor-party-transportation' },
        { name: 'Wine Tour Shuttle', href: '/wine-tour-shuttle' },
      ]
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
    { name: 'Blog', href: '/blog' },
    { name: 'Shop', href: '/shop' },
    { name: 'Gift Cards', href: '/gift-cards' },
    { name: 'Contact', href: '/contact' },
  ];

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
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              item.hasDropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.dropdownType === 'services') setServicesDropdownOpen(true);
                    if (item.dropdownType === 'partners') setPartnersDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (item.dropdownType === 'services') setServicesDropdownOpen(false);
                    if (item.dropdownType === 'partners') setPartnersDropdownOpen(false);
                  }}
                >
                  <button
                    className="text-lrp-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm font-semibold flex items-center gap-1"
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {((item.dropdownType === 'services' && servicesDropdownOpen) ||
                    (item.dropdownType === 'partners' && partnersDropdownOpen)) && (
                    <div className="absolute top-full left-0 pt-0 w-64 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl border border-neutral-200 dark:border-dark-border py-2 z-50">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-neutral-900 dark:text-white hover:bg-lrp-green/10 hover:text-lrp-green transition-colors"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
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

            {/* Book Now Button */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              Book Now
            </button>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Icon */}
            <CartIcon />

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary-dark hover:bg-green-50 dark:hover:bg-dark-bg-tertiary transition-colors"
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
          <div id="mobile-menu" className="md:hidden pb-4">
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
                      <div className="pl-4 space-y-1">
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

              {/* Mobile Book Now Button */}
              <button
                onClick={() => {
                  setIsBookingOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold text-center transition-all"
              >
                Book Now
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
