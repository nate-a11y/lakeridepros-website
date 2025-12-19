'use client';

import { useState } from 'react';
import { BookingModal } from './BookingModal';

interface QuoteCTAProps {
  notes?: string;
}

export default function QuoteCTA({ notes }: QuoteCTAProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          Get a Quote Today
        </h3>
        <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
          {notes || 'Contact Lake Ride Pros for personalized pricing tailored to your needs.'}
        </p>
        <button
          onClick={() => setIsBookingOpen(true)}
          className="bg-primary hover:bg-primary-dark text-lrp-black px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg inline-flex items-center gap-2"
        >
          Quote Now
        </button>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}
