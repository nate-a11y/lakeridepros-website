import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import BookingWidget from '@/components/BookingWidget';
import {
  getServices,
  getRandomVehicles,
  getRandomTestimonials,
  getPartners,
  getMediaUrl,
} from '@/lib/api/payload';
import { getLatestBlogPostsLocal } from '@/lib/api/payload-local';
import { localBusinessSchema, organizationSchema, faqSchema } from '@/lib/schemas';
import { getPopularServicesLocal } from '@/lib/analytics-server';

// Lazy load below-fold components to reduce initial main thread work
const SpotifyEmbed = nextDynamic(() => import('@/components/SpotifyEmbed'));
const ServicesShowcase = nextDynamic(() => import('@/components/ServicesShowcase'));
const FeaturedVehiclesSection = nextDynamic(() => import('@/components/FeaturedVehiclesSection'));
const FeaturedBlogSection = nextDynamic(() => import('@/components/FeaturedBlogSection'));
const TestimonialsCarousel = nextDynamic(() => import('@/components/TestimonialsCarousel'));
const PartnersCarousel = nextDynamic(() => import('@/components/PartnersCarousel'));
const PopularServicesRanking = nextDynamic(() => import('@/components/PopularServicesRanking'));
const HowItWorks = nextDynamic(() => import('@/components/HowItWorks'));
const WhyChooseUs = nextDynamic(() => import('@/components/WhyChooseUs'));
const ServiceAreasMap = nextDynamic(() => import('@/components/ServiceAreasMap')); // Keep SSR for local SEO keywords
const MemberLogosSection = nextDynamic(() => import('@/components/MemberLogosSection'));
const FAQAccordion = nextDynamic(() => import('@/components/FAQAccordion'));
const NewsletterSignup = nextDynamic(() => import('@/components/NewsletterSignup'));

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
  // Optimized: Reduced limits to minimize HTML payload size
  const [servicesData, vehicles, blogPosts, testimonials, partnersData, popularServicesData] = await Promise.all([
    getServices({ limit: 30 }).catch(() => ({ docs: [] })), // For services section + popular filtering
    getRandomVehicles(3).catch(() => []),
    getLatestBlogPostsLocal(10).catch(() => []),
    getRandomTestimonials(3, false, 5).catch(() => []), // Random 5-star testimonials
    getPartners(undefined, true).catch(() => []),
    getPopularServicesLocal(5).catch(() => []),
  ]);

  const services = servicesData.docs || [];

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

  // Filter and sort services by popularity
  const popularServices = services
    .filter(s => popularServiceSlugs.includes(s.slug))
    .sort((a, b) => popularServiceSlugs.indexOf(a.slug) - popularServiceSlugs.indexOf(b.slug))
    .slice(0, 4); // Show top 4 on home page

  // Transform partners to minimal data for client component (reduces HTML payload)
  const partners = partnersData.slice(0, 12).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    website: p.website,
    blurb: p.blurb,
    logoUrl: getMediaUrl(p.logo?.url),
  }));

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
      <ServicesShowcase services={services.slice(0, 6)} />

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

      {/* Partner Logos Section - Client component handles infinite scroll */}
      {partners.length > 0 && <PartnersCarousel partners={partners} />}

      {/* Most Requested Services Section */}
      <PopularServicesRanking services={popularServices} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Why Choose Lake Ride Pros Section */}
      <WhyChooseUs />

      {/* Service Areas Section */}
      <ServiceAreasMap />

      {/* Proud Members Of Section */}
      <MemberLogosSection />

      {/* FAQ Section */}
      <FAQAccordion />

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </>
  );
}
