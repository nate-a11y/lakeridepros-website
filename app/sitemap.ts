import { MetadataRoute } from 'next';
import {
  getServicesLocal,
  getBlogPostsLocal,
  getVehiclesLocal,
  getPagesLocal,
  getPartnersLocal,
  getDriverProfiles,
  getUpcomingEvents,
  getVenues,
} from '@/lib/api/sanity';
import { FourthwallStorefrontError, getFourthwallProducts } from '@/lib/fourthwall/storefront';

// Resolve the same current catalog/calendar as the public routes, not a build-time snapshot.
export const dynamic = 'force-dynamic';

// Normalized docs have slug flattened to string by normalizeDoc()
interface SitemapDoc {
  slug: string | { current: string };
  updatedAt?: string;
  _updatedAt?: string;
  publishedDate?: string;
  [key: string]: unknown;
}

interface PartnerDoc {
  slug?: string | { current: string } | null;
  updatedAt?: string;
  _updatedAt?: string;
  isWeddingPartner?: boolean | null;
  isPremierPartner?: boolean | null;
  isReferralPartner?: boolean | null;
  isPromotion?: boolean | null;
  category?: string | null;
  [key: string]: unknown;
}

interface DriverDoc {
  slug?: string | { current: string } | null;
  name?: string | null;
  updatedAt?: string;
  _updatedAt?: string;
}

function getSlugValue(slug?: string | { current: string } | null): string | null {
  if (!slug) return null;
  return typeof slug === 'string' ? slug : slug.current;
}

function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment);
}

function lastModified(doc: { updatedAt?: string; _updatedAt?: string; publishedDate?: string }): Date | undefined {
  const value = doc.updatedAt || doc._updatedAt || doc.publishedDate;
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : undefined;
}

async function getSanityData() {
  try {
    // Fetch all dynamic content from Sanity
    const [servicesResponse, blogPostsResponse, vehicles, pages, allPartners, events, venuesResponse] = await Promise.all([
      getServicesLocal(),
      getBlogPostsLocal({ limit: 100 }),
      getVehiclesLocal(),
      getPagesLocal(),
      getPartnersLocal(), // Fetch all active partners
      getUpcomingEvents(),
      getVenues(),
    ]);

    return {
      services: servicesResponse.docs,
      blogPosts: blogPostsResponse.docs,
      vehicles,
      pages,
      allPartners,
      events,
      venues: venuesResponse.docs,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Sanity error';
    console.error(`[Sitemap] Error fetching Sanity data: ${message}`);
    return { services: [], blogPosts: [], vehicles: [], pages: [], allPartners: [], events: [], venues: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.lakeridepros.com';
  const currentDate = new Date();

  // Static pages with priority and change frequency
  const staticRoutes = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/book', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/fleet', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/pricing', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/about-us', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { url: '/gift-cards', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/music', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/shop', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/testimonials', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/lake-ozarks-transportation-insights', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/events', priority: 0.8, changeFrequency: 'daily' as const },

    // All service pages are now CMS-driven and included via serviceSitemapEntries below

    // Partner pages
    { url: '/wedding-partners', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/local-premier-partners', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/trusted-referral-partners', priority: 0.7, changeFrequency: 'monthly' as const },

    // Local landing pages
    { url: '/transportation-osage-beach', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/transportation-camdenton', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/transportation-lake-ozark', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/transportation-sunrise-beach', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/transportation-laurie', priority: 0.9, changeFrequency: 'monthly' as const },

    // City-to-Lake landing pages (capturing nearby city searches)
    { url: '/columbia-to-lake-ozarks', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/jefferson-city-to-lake-ozarks', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/springfield-to-lake-ozarks', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/st-louis-to-lake-ozarks', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/kansas-city-to-lake-ozarks', priority: 0.9, changeFrequency: 'monthly' as const },

    // Specialty landing pages
    { url: '/bagnell-dam-strip-transportation', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/lake-ozarks-airport-transportation', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/services/restaurant-shuttle', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/services/boat-dock-pickup', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/services/lodge-of-four-seasons-transportation', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/services/executive-black-car-service', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/services/vacation-rental-transportation', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/services/hotel-shuttle-service', priority: 0.8, changeFrequency: 'monthly' as const },

    // Career pages
    { url: '/careers', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/careers/driver-application', priority: 0.7, changeFrequency: 'monthly' as const },

    // Team page
    { url: '/our-drivers', priority: 0.7, changeFrequency: 'weekly' as const },

    // Insider membership pages
    { url: '/insider-membership-benefits', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/insider-terms-and-conditions', priority: 0.5, changeFrequency: 'yearly' as const },

    // Legal pages
    { url: '/privacy-policy', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/terms-of-service', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/accessibility', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/return-policy', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  const staticSitemapEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Fetch public CMS content and the same live catalog as the shop.
  const [sanityData, drivers, products] = await Promise.all([
    getSanityData(),
    getDriverProfiles(),
    getFourthwallProducts({ throwOnError: true }).catch((error: unknown) => {
      if (error instanceof FourthwallStorefrontError && error.reason === 'configuration') return [];
      throw error; // An outage must not publish a partial catalog as a successful sitemap.
    }),
  ]);
  const { services, blogPosts, vehicles, pages, allPartners, events, venues } = sanityData;

  // Dynamic service pages
  const serviceSitemapEntries = services.map((service: SitemapDoc) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: lastModified(service),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Blog posts
  const blogSitemapEntries = blogPosts.map((post: SitemapDoc) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: lastModified(post),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Only upcoming active events resolve as indexable detail pages; expired
  // events redirect to the calendar and therefore do not belong in the sitemap.
  // Match the live calendar's date-only guard so today's midnight events remain
  // included. Filter after the cached read, not with GROQ's time-sensitive now().
  const todayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const eventSitemapEntries = events.flatMap((event) => {
    const slug = getSlugValue(event.slug);
    const eventDateStr = (event.date || '').split('T')[0];
    const venueActive = typeof event.venue === 'object' ? event.venue?.active !== false : true;
    if (!slug || event.active === false || !venueActive || eventDateStr < todayStr) return [];
    return [{
      url: `${baseUrl}/events/${encodePathSegment(slug)}`,
      lastModified: lastModified(event),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }];
  });

  // Vehicles
  const vehicleSitemapEntries = vehicles.map((vehicle: SitemapDoc) => ({
    url: `${baseUrl}/fleet/${vehicle.slug}`,
    lastModified: lastModified(vehicle),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Products share the storefront's public/available/stock filtering.
  const productSitemapEntries = products.flatMap((product) => {
    const slug = getSlugValue(product.slug);

    // Invalid imported slugs must not publish broken product URLs.
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return [];

    return [{
      url: `${baseUrl}/shop/products/${encodePathSegment(slug)}`,
      lastModified: lastModified(product),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }];
  });

  // Custom pages
  const pageSitemapEntries = (pages as SitemapDoc[]).map((page: SitemapDoc) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: lastModified(page),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Partner pages - categorize by type for correct URL paths
  const partnerSitemapEntries: MetadataRoute.Sitemap = [];

  allPartners.forEach((partner: PartnerDoc) => {
    // Skip partners without a slug
    if (!partner.slug) return;

    let urlPath: string;
    const partnerSlug = getSlugValue(partner.slug);
    if (!partnerSlug) return;
    if (partnerSlug === 'lrp-promotions') return;
    const encodedSlug = encodePathSegment(partnerSlug);
    const isPremierPartner =
      partner.isPremierPartner === true || partner.category === 'local-premier';
    const isWeddingPartner =
      partner.isWeddingPartner === true || partner.category === 'wedding';

    // Determine the correct URL path based on partner type
    // Priority: premier > wedding > referral. Legacy category remains authoritative
    // when a migrated partner also has referral/promotion checkboxes set.
    if (isPremierPartner) {
      urlPath = `/local-premier-partners/${encodedSlug}`;
    } else if (isWeddingPartner) {
      urlPath = `/wedding-partners/${encodedSlug}`;
    } else {
      // Referral partners and promotions go to /partners/
      urlPath = `/partners/${encodedSlug}`;
    }

    partnerSitemapEntries.push({
      url: `${baseUrl}${urlPath}`,
      lastModified: lastModified(partner),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    });
  });

  // Driver profile pages
  const driverSitemapEntries: MetadataRoute.Sitemap = [];

  (drivers as DriverDoc[]).forEach((driver) => {
    const slug = getSlugValue(driver.slug);
    if (!slug) return;
    if (driver.name?.trim().toLowerCase() === 'open') return;

    driverSitemapEntries.push({
      url: `${baseUrl}/our-drivers/${encodePathSegment(slug)}`,
      lastModified: lastModified(driver),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    });
  });

  const entries = [
    ...staticSitemapEntries,
    ...serviceSitemapEntries,
    ...blogSitemapEntries,
    ...eventSitemapEntries,
    ...venues.map((venue) => ({
      url: `${baseUrl}/events/venues/${encodePathSegment(venue.slug)}`,
      lastModified: lastModified(venue),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...vehicleSitemapEntries,
    ...productSitemapEntries,
    ...pageSitemapEntries,
    ...partnerSitemapEntries,
    ...driverSitemapEntries,
  ];
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
