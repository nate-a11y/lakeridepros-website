import type { Metadata } from 'next';
import FleetLensHero from '@/components/home/FleetLensHero';
import ServicesLens from '@/components/home/ServicesLens';
import OperationsProof from '@/components/home/OperationsProof';
import ReviewsEditorial from '@/components/home/ReviewsEditorial';
import LocalIntelligence from '@/components/home/LocalIntelligence';
import FinalBookingClose from '@/components/home/FinalBookingClose';
import PartnersCarousel from '@/components/PartnersCarousel';
import FAQAccordion from '@/components/FAQAccordion';
import NewsletterSignup from '@/components/NewsletterSignup';
import {
  getServices,
  getVehicles,
  getRandomTestimonials,
  getPartners,
  getMediaUrl,
  getLatestBlogPostsLocal,
} from '@/lib/api/sanity';
import { resolveSlug } from '@/types/sanity';
import { localBusinessSchema, organizationSchema, faqSchema } from '@/lib/schemas';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lakeridepros.com'),
  title: 'Lake of the Ozarks Transportation | Lake Ride Pros',
  description: 'Lake of the Ozarks transportation and professional rides throughout Missouri for airports, weddings, resorts, events, nightlife, and groups from 1 to 37.',
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
    title: 'Lake Ride Pros | Lake of the Ozarks & Missouri Transportation',
    description: 'Private rides, airport transfers, weddings, resorts, events, and group transportation from 1 to 37 passengers throughout Missouri.',
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
    title: 'Lake Ride Pros | Missouri Transportation',
    description: 'Private rides, airport transfers, weddings, resorts, events, and groups from Lake of the Ozarks throughout Missouri.',
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

// Homepage content is CMS-backed and already uses revalidated Sanity queries.
// Rebuild the route periodically instead of forcing every request through SSR.
export const revalidate = 300;

const preferredVehicleGalleryIndices: Record<string, number[]> = {
  flex: [4, 0, 10],
  elite: [0, 2, 1],
  'executive-sprinter-van': [4, 0, 1],
  'lrp-limo-bus': [0, 3, 4],
  'rescue-squad-1': [0, 3, 4],
  'pink-patrol': [0, 1, 3],
  'executive-shuttle-bus': [2, 4, 3],
};

function meaningfulAlt(candidate: string | undefined, fallback: string) {
  const value = candidate?.trim();
  const internalLabel = /^(?:(?:img|image|dsc|photo)[-_ ]*\d+|lrp(?:\d+|[a-z]{2,}\s*[-–]))/i;
  if (!value || value.length < 8 || internalLabel.test(value)) return fallback;
  return value;
}

export default async function HomePage() {
  const [servicesData, vehiclesData, blogPosts, testimonials, partnersData, googleReviewSummary] = await Promise.all([
    getServices({ limit: 30 }).catch(() => ({ docs: [] })),
    getVehicles({ limit: 30 }).catch(() => ({ docs: [] })),
    getLatestBlogPostsLocal(6).catch(() => []),
    getRandomTestimonials(3, false, 5).catch(() => []), // Random 5-star testimonials
    getPartners(undefined, true).catch(() => []),
    client.fetch<{reviewCount: number; ratingValue: number | null}>(groq`{
      "reviewCount": count(*[
        _type == "testimonial"
        && source == "google"
        && googleReviewStatus != "not_found"
      ]),
      "ratingValue": math::avg(*[
        _type == "testimonial"
        && source == "google"
        && googleReviewStatus != "not_found"
        && defined(rating)
      ].rating)
    }`).catch(() => ({reviewCount: 322, ratingValue: 5})),
  ]);

  const services = servicesData.docs || [];
  const vehicles = vehiclesData.docs || [];

  // Deliberately broad: the homepage should represent how the whole Lake moves,
  // rather than over-indexing on nightlife or any single trip type.
  const featuredServiceSlugs = [
    'airport-transfers',
    'wedding-transportation',
    'corporate-executive-travel',
    'group-shuttle-services',
    'events-festivals',
    'party-bus-nightlife',
  ];
  const featuredServices = featuredServiceSlugs
    .map(slug => services.find(service => resolveSlug(service.slug) === slug))
    .filter((service): service is (typeof services)[number] => Boolean(service));

  // Keep large CMS documents and full galleries on the server. The two client
  // interactions receive only the strings they render.
  const fleetLensVehicles = vehicles.flatMap(vehicle => {
    const slug = resolveSlug(vehicle.slug);
    const preferredGallery = (preferredVehicleGalleryIndices[slug] || [0, 1, 2])
      .map(index => vehicle.images?.[index])
      .filter((image): image is NonNullable<typeof image> => Boolean(image?.image));
    const candidates = [
      ...preferredGallery.map(item => ({ image: item.image, alt: item.alt })),
      ...(vehicle.featuredImage ? [{ image: vehicle.featuredImage, alt: vehicle.featuredImage.alt }] : []),
    ];
    const seenUrls = new Set<string>();
    const images = candidates.flatMap((candidate, index) => {
      const url = candidate.image ? getMediaUrl(candidate.image) : '';
      if (!url || seenUrls.has(url)) return [];
      seenUrls.add(url);
      return [{
        url,
        alt: meaningfulAlt(candidate.alt || candidate.image?.alt, `${vehicle.name}, Lake Ride Pros fleet view ${index + 1}`),
        objectPosition: candidate.image?.hotspot
          ? `${candidate.image.hotspot.x * 100}% ${candidate.image.hotspot.y * 100}%`
          : 'center',
      }];
    }).slice(0, 3);
    if (images.length === 0) return [];
    return [{
      _id: vehicle._id,
      name: vehicle.name,
      slug,
      images,
    }];
  });

  const servicePreviews = (featuredServices.length > 0 ? featuredServices : services.slice(0, 6)).map(service => ({
    slug: resolveSlug(service.slug),
    title: service.title,
    imageUrl: service.image ? getMediaUrl(service.image) : '',
    imageAlt: meaningfulAlt(service.image?.alt, `${service.title} transportation with Lake Ride Pros`),
    objectPosition: service.image?.hotspot
      ? `${service.image.hotspot.x * 100}% ${service.image.hotspot.y * 100}%`
      : 'center',
  }));

  const closingVehicle = vehicles.find(vehicle => resolveSlug(vehicle.slug) === 'pink-patrol');
  const closingImage = closingVehicle?.images?.[0]?.image || closingVehicle?.featuredImage;

  const partners = partnersData.slice(0, 12).map(partner => ({
    _id: partner._id,
    name: partner.name,
    slug: resolveSlug(partner.slug),
    website: partner.website,
    blurb: partner.blurb,
    logoUrl: getMediaUrl(partner.logo),
    isPremierPartner: partner.isPremierPartner,
    isWeddingPartner: partner.isWeddingPartner,
  }));

  const currentLocalBusinessSchema = {
    ...localBusinessSchema,
    aggregateRating: {
      ...localBusinessSchema.aggregateRating,
      ratingValue: (googleReviewSummary.ratingValue ?? 5).toFixed(1),
      reviewCount: String(googleReviewSummary.reviewCount || 322),
    },
  };

  return (
    <>
      {/* SEO Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(currentLocalBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <FleetLensHero
        vehicles={fleetLensVehicles}
        ratingValue={googleReviewSummary.ratingValue ?? 5}
        reviewCount={googleReviewSummary.reviewCount || 322}
      />

      <ServicesLens services={servicePreviews} />

      <OperationsProof />

      <ReviewsEditorial
        testimonials={testimonials}
        ratingValue={googleReviewSummary.ratingValue ?? 5}
        reviewCount={googleReviewSummary.reviewCount || 322}
      />

      {partners.length > 0 && <PartnersCarousel partners={partners} />}

      <LocalIntelligence posts={blogPosts} />

      <NewsletterSignup />

      {/* FAQ Section */}
      <FAQAccordion />

      <FinalBookingClose
        imageUrl={closingImage ? getMediaUrl(closingImage) : undefined}
        imageAlt={meaningfulAlt(closingImage?.alt, closingVehicle ? `${closingVehicle.name}, part of the Lake Ride Pros fleet` : 'Lake Ride Pros fleet vehicle')}
      />
    </>
  );
}
