import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import BookingWidget from '@/components/BookingWidget';
import ServicesShowcase from '@/components/ServicesShowcase';
import FeaturedVehiclesSection from '@/components/FeaturedVehiclesSection';
import FeaturedBlogSection from '@/components/FeaturedBlogSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import PopularServicesRanking from '@/components/PopularServicesRanking';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import ServiceAreasMap from '@/components/ServiceAreasMap';
import FAQAccordion from '@/components/FAQAccordion';
import {
  getRandomTestimonials,
  getPartners,
} from '@/lib/api/payload';
import { getMediaUrl } from '@/lib/api/payload';
import { getServicesLocal, getBlogPostsLocal, getFeaturedVehiclesLocal } from '@/lib/api/payload-local';
import { localBusinessSchema, organizationSchema, faqSchema } from '@/lib/schemas';
import { getPopularServicesLocal } from '@/lib/analytics-server';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lakeridepros.com'),
  title: 'Lake of the Ozarks Transportation | Weddings, Airport, Nightlife | Lake Ride Pros',
  description: 'Premier luxury transportation at Lake of the Ozarks. Wedding shuttles, airport transfers (MCI, STL, SGF), nightlife party buses. Professional drivers, 24/7 service.',
  keywords: [
    'Lake of the Ozarks transportation',
    'luxury transportation Missouri',
    'party bus Lake Ozarks',
    'wedding transportation',
    'wine tour shuttle',
    'Osage Beach limo service',
    'bachelor party bus',
    'transportation near me Lake Ozarks',
    'shuttle service Osage Beach'
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
  const [allServicesData, vehicles, blogPosts, testimonials, partners, popularServicesData] = await Promise.all([
    getServicesLocal().catch(() => []), // Direct database query for services with images
    getFeaturedVehiclesLocal(3).catch(() => []), // Direct database query for vehicles with images
    getBlogPostsLocal(3).catch(() => []), // Direct database query for blog posts with images
    getRandomTestimonials(3, false, 5).catch(() => []), // Random 5-star testimonials
    getPartners(undefined, true).catch(() => []),
    getPopularServicesLocal(5).catch(() => []),
  ]);

  const services = allServicesData.slice(0, 6); // For "Our Services" section display
  const allServices = allServicesData; // For filtering popular services

  // Use analytics-based popular services, fallback to hardcoded list (same as header)
  const fallbackServiceSlugs = [
    'wedding-transportation',
    'airport-shuttle',
    'nightlife-transportation',
    'corporate-transportation',
    'private-aviation-transportation',
  ];

  const popularServiceSlugs = popularServicesData.length > 0
    ? popularServicesData.map(s => s.slug)
    : fallbackServiceSlugs;

  // Filter and sort services by popularity (same logic as header)
  // Use allServices to ensure we have all services available for filtering
  const popularServices = allServices
    .filter(s => popularServiceSlugs.includes(s.slug))
    .sort((a, b) => popularServiceSlugs.indexOf(a.slug) - popularServiceSlugs.indexOf(b.slug))
    .slice(0, 4); // Show top 4 on home page

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
      <ServicesShowcase services={services} />

      {/* Featured Vehicles Section */}
      <FeaturedVehiclesSection vehicles={vehicles} />

      {/* Latest Blog Posts Section */}
      <FeaturedBlogSection posts={blogPosts} />

      {/* Testimonials Section with Review Schema */}
      <TestimonialsCarousel
        testimonials={testimonials}
        title="What Our Clients Say"
        subtitle="Hear from those who have experienced our premium service"
        includeSchema={true}
      />

      {/* Partner Logos Section */}
      {partners.length > 0 && (
        <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-8">
              Trusted by Leading Organizations
            </h2>
          </div>
          <div className="space-y-6">
            {/* First row - scrolling left */}
            <div className="relative">
              <div className="flex animate-scroll-left">
                {[...partners, ...partners].map((partner, index) => {
                  const partnerLink = partner.slug ? `/partners/${partner.slug}` : partner.website;
                  const logoImage = (
                    <Image
                      src={getMediaUrl(partner.logo.url)}
                      alt={partner.name}
                      width={128}
                      height={64}
                      className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                    />
                  );

                  return partnerLink ? (
                    <Link
                      key={`row1-${partner.id}-${index}`}
                      href={partnerLink}
                      className="flex-shrink-0 mx-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                      aria-label={`View ${partner.name} partner page`}
                      {...(!partner.slug && partner.website ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {logoImage}
                    </Link>
                  ) : (
                    <div key={`row1-${partner.id}-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center">
                      {logoImage}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Second row - scrolling left (delayed) */}
            <div className="relative">
              <div className="flex animate-scroll-left-delayed">
                {[...partners.slice().reverse(), ...partners.slice().reverse()].map((partner, index) => {
                  const partnerLink = partner.slug ? `/partners/${partner.slug}` : partner.website;
                  const logoImage = (
                    <Image
                      src={getMediaUrl(partner.logo.url)}
                      alt={partner.name}
                      width={128}
                      height={64}
                      className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                    />
                  );

                  return partnerLink ? (
                    <Link
                      key={`row2-${partner.id}-${index}`}
                      href={partnerLink}
                      className="flex-shrink-0 mx-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                      aria-label={`View ${partner.name} partner page`}
                      {...(!partner.slug && partner.website ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {logoImage}
                    </Link>
                  ) : (
                    <div key={`row2-${partner.id}-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center">
                      {logoImage}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Most Requested Services Section */}
      <PopularServicesRanking services={popularServices} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Why Choose Lake Ride Pros Section */}
      <WhyChooseUs />

      {/* Service Areas Section */}
      <ServiceAreasMap />

      {/* FAQ Section */}
      <FAQAccordion />

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </>
  );
}
