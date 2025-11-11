import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Your Ride | Lake Ride Pros',
  description: 'Book your luxury transportation at Lake of the Ozarks. Available 24/7 for weddings, events, wine tours, and nights out.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/book',
  },
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary" data-page="booking">
      {/* Lake Ride Pros Branded Header */}
      <section className="bg-primary py-16" aria-labelledby="booking-page-title">
        <div className="container mx-auto px-4">
          <h1 id="booking-page-title" className="text-4xl md:text-5xl font-bold text-white text-center">
            Book Your Ride
          </h1>
          <p className="text-white/90 text-center mt-4 text-lg max-w-2xl mx-auto">
            Select your vehicle, choose your date and time, and we'll handle the rest.
            Premium transportation at Lake of the Ozarks.
          </p>
        </div>
      </section>

      {/* Moovs Booking Interface */}
      <section className="container mx-auto px-4 py-8" aria-label="Booking form">
        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl overflow-hidden border border-neutral-200 dark:border-dark-border">
          <iframe
            src="https://customer.moovs.app/lake-ride-pros/iframe"
            title="Lake Ride Pros Booking System - Select vehicle, date, time and complete your reservation"
            className="w-full border-0"
            style={{ minHeight: '900px', height: 'calc(100vh - 250px)' }}
            allow="payment"
          />
        </div>
      </section>

      {/* Contact Help Section */}
      <aside className="container mx-auto px-4 pb-16" aria-labelledby="booking-help-title">
        <div className="bg-neutral-50 dark:bg-dark-bg-secondary rounded-lg p-8 text-center">
          <h2 id="booking-help-title" className="text-2xl font-bold text-lrp-black dark:text-white mb-4">
            Need Help Booking?
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Our team is available 24/7 to assist with your transportation needs
          </p>
          <nav aria-label="Contact options" className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:5732069499"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold text-lg inline-flex items-center justify-center gap-2 transition-all"
              aria-label="Call Lake Ride Pros at 573-206-9499"
            >
              <span aria-hidden="true">📞</span> (573) 206-9499
            </a>
            <a
              href="mailto:contactus@lakeridepros.com"
              className="bg-white dark:bg-dark-bg-tertiary border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold text-lg inline-flex items-center justify-center gap-2 transition-all"
              aria-label="Email Lake Ride Pros at contactus@lakeridepros.com"
            >
              <span aria-hidden="true">✉️</span> Email Us
            </a>
          </nav>
        </div>
      </aside>
    </div>
  )
}
