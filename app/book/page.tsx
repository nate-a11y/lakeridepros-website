import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Your Ride | Lake Ride Pros',
  description: 'Book your luxury transportation at Lake of the Ozarks. Available 24/7 for weddings, events, wine tours, and nights out.',
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary" data-page="booking">
      {/* Lake Ride Pros Branded Header */}
      <div className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Book Your Ride
          </h1>
          <p className="text-white/90 text-center mt-4 text-lg max-w-2xl mx-auto">
            Select your vehicle, choose your date and time, and we'll handle the rest.
            Premium transportation at Lake of the Ozarks.
          </p>
        </div>
      </div>

      {/* Moovs Booking Interface */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl overflow-hidden border border-neutral-200 dark:border-dark-border">
          <iframe
            src="https://customer.moovs.app/lake-ride-pros/iframe"
            title="Lake Ride Pros Booking System"
            className="w-full border-0"
            style={{ minHeight: '900px', height: 'calc(100vh - 250px)' }}
            allow="payment"
          />
        </div>
      </div>

      {/* Contact Help Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-neutral-50 dark:bg-dark-bg-secondary rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-lrp-black dark:text-white mb-4">
            Need Help Booking?
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Our team is available 24/7 to assist with your transportation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:5732069499"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold text-lg inline-flex items-center justify-center gap-2 transition-all"
            >
              📞 (573) 206-9499
            </a>
            <a
              href="mailto:bookings@lakeridepros.com"
              className="bg-white dark:bg-dark-bg-tertiary border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold text-lg inline-flex items-center justify-center gap-2 transition-all"
            >
              ✉️ Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
