'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import ThemeToggle from './ThemeToggle';
import { BookingModal } from './BookingModal';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { itemCount, openCart } = useCart();

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
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/Color logo - no background.png"
                alt="Lake Ride Pros Logo"
                width={150}
                height={50}
                className="w-32 sm:w-36 md:w-40 h-auto"
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

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-primary hover:text-primary-dark transition-colors"
              aria-label="Shopping cart"
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
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary-dark hover:bg-green-50 dark:hover:bg-dark-bg-tertiary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
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
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
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
            </div>
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
