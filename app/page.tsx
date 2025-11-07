import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import BookingWidget from '@/components/BookingWidget';
import ServiceCard from '@/components/ServiceCard';
import VehicleCard from '@/components/VehicleCard';
import BlogPostCard from '@/components/BlogPostCard';
import NewsletterSignup from '@/components/NewsletterSignup';
import {
  getServices,
  getFeaturedVehicles,
  getLatestBlogPosts,
  getTestimonials,
  getPartners,
} from '@/lib/api/payload';
import { getMediaUrl } from '@/lib/api/payload';
import { localBusinessSchema, organizationSchema, faqSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lakeridepros.com'),
  title: 'Lake Ride Pros | Premier Luxury Transportation at Lake of the Ozarks',
  description: 'Missouri\'s premier luxury transportation at Lake of the Ozarks. Limo buses, sprinter vans, shuttle buses for weddings, wine tours, bachelor parties. Professional drivers, 24/7 availability. Book now!',
  keywords: [
    'Lake of the Ozarks transportation',
    'luxury transportation Missouri',
    'party bus Lake Ozarks',
    'wedding transportation',
    'wine tour shuttle',
    'Osage Beach limo service',
    'bachelor party bus'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.lakeridepros.com',
    siteName: 'Lake Ride Pros',
    title: 'Lake Ride Pros - Premier Transportation at Lake of the Ozarks',
    description: 'Luxury limo buses, sprinter vans, and shuttle services for weddings, events, and nights out.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lake Ride Pros luxury transportation vehicles'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lake Ride Pros - Premium Transportation',
    description: 'Luxury transportation at Lake of the Ozarks',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.lakeridepros.com',
  },
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data with error handling
  const [servicesData, vehicles, blogPosts, testimonials, partners] = await Promise.all([
    getServices({ limit: 6 }).catch(() => ({ docs: [] })),
    getFeaturedVehicles(3).catch(() => []),
    getLatestBlogPosts(3).catch(() => []),
    getTestimonials(true).catch(() => []),
    getPartners(true).catch(() => []),
  ]);

  const services = servicesData.docs || [];

  return (
    <>
      {/* SEO Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section with Booking Modal */}
      <HeroSection />

      {/* Booking Widget Section */}
      <section id="booking" className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingWidget />
        </div>
      </section>

      {/* Services Overview Section */}
      {services.length > 0 && (
        <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Our Services
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                From airport transfers to special events, we provide premium transportation
                for every occasion
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/services"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Vehicles Section */}
      {vehicles.length > 0 && (
        <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Featured Vehicles
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                Our fleet of luxury vehicles ensures a comfortable and stylish experience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/fleet"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                View Full Fleet
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts Section */}
      {blogPosts.length > 0 && (
        <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Latest News & Updates
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                Stay informed with our latest articles and company news
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Read More Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                Hear from those who have experienced our premium service
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white dark:bg-dark-bg-tertiary p-6 rounded-lg shadow-md transition-colors"
                >
                  <div className="flex items-center mb-4">
                    {testimonial.rating && (
                      <div className="flex text-secondary dark:text-primary">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating! ? 'fill-current' : 'fill-neutral-300 dark:fill-neutral-600'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center">
                    {testimonial.image && (
                      <img
                        src={getMediaUrl(testimonial.image.url)}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      {testimonial.title && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{testimonial.title}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partner Logos Section */}
      {partners.length > 0 && (
        <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-8">
              Trusted by Leading Organizations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {partners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-center">
                  <img
                    src={getMediaUrl(partner.logo.url)}
                    alt={partner.name}
                    className="h-16 object-contain filter grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </>
  );
}
