'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { BookingModal } from './BookingModal';
import CartIcon from '@/components/cart/CartIcon';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Fleet', href: '/fleet' },
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
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lrp-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm font-semibold relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {item.name}
              </Link>
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
            <nav aria-label="Mobile navigation" className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lrp-black dark:text-white hover:text-primary dark:hover:text-primary hover:bg-green-50 dark:hover:bg-dark-bg-tertiary transition-colors duration-200 px-3 py-2 text-base font-semibold rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
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
