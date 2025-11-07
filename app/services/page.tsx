import { Metadata } from 'next';
import ServiceCard from '@/components/ServiceCard';
import BookingWidget from '@/components/BookingWidget';
import { getServices } from '@/lib/api/payload';

export const metadata: Metadata = {
  title: 'Transportation Services | Lake Ride Pros',
  description: 'Explore our premium transportation services including airport transfers, corporate transportation, special events, and more at Lake of the Ozarks.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/services',
  },
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const servicesData = await getServices().catch(() => ({ docs: [] }));
  const services = servicesData.docs || [];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Our Transportation Services
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Professional, reliable, and luxurious transportation for every occasion
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                Services information will be available soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Ready to Book?
            </h2>
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
              Reserve your luxury transportation today
            </p>
          </div>
          <BookingWidget />
        </div>
      </section>
    </>
  );
}
