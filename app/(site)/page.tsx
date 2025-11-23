import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import BookingWidget from '@/components/BookingWidget';
import SpotifyEmbed from '@/components/SpotifyEmbed';
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
  getServices,
  getRandomVehicles,
  getLatestBlogPosts,
  getRandomTestimonials,
  getPartners,
} from '@/lib/api/payload';
import { getMediaUrl } from '@/lib/api/payload';
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
  // Fetch data with error handling - use HTTP API calls for consistent media URLs
  const [servicesData, allServicesData, vehicles, blogPosts, testimonials, partners, popularServicesData] = await Promise.all([
    getServices({ limit: 6 }).catch(() => ({ docs: [] })), // For "Our Services" section
    getServices({ limit: 100 }).catch(() => ({ docs: [] })), // For filtering popular services
    getRandomVehicles(3).catch(() => []),
    getLatestBlogPosts(10).catch(() => []),
    getRandomTestimonials(3, false, 5).catch(() => []), // Random 5-star testimonials
    getPartners(undefined, true).catch(() => []),
    getPopularServicesLocal(5).catch(() => []),
  ]);

  const services = servicesData.docs || []; // For "Our Services" section display
  const allServices = allServicesData.docs || []; // For filtering popular services

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

      {/* Spotify Music Section */}
      <SpotifyEmbed
        artistId="44y7Dl9jKhtIq1SJ7uKv7v"
        title="Ride With The Vibe"
        subtitle="Set the mood for your Lake trip with music from our featured artist"
      />

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
          <div className="relative">
            <div className="flex animate-scroll-left">
              {[...partners, ...partners].map((partner, index) => {
                const partnerLink = partner.slug ? `/partners/${partner.slug}` : partner.website;
                const partnerContent = (
                  <div className="flex flex-col items-center space-y-3 max-w-xs">
                    <Image
                      src={getMediaUrl(partner.logo.url)}
                      alt={partner.name}
                      width={200}
                      height={100}
                      className="h-24 w-auto object-contain transition-all"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-neutral-900 dark:text-white text-lg mb-1">
                        {partner.name}
                      </h3>
                      {partner.blurb && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                          {partner.blurb}
                        </p>
                      )}
                    </div>
                  </div>
                );

                return partnerLink ? (
                  <Link
                    key={`partner-${partner.id}-${index}`}
                    href={partnerLink}
                    className="flex-shrink-0 mx-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg hover:scale-105 transition-transform"
                    aria-label={`View ${partner.name} partner page`}
                    {...(!partner.slug && partner.website ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {partnerContent}
                  </Link>
                ) : (
                  <div key={`partner-${partner.id}-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center">
                    {partnerContent}
                  </div>
                );
              })}
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
