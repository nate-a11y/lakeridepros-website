import { MetadataRoute } from 'next';
import {
  getServicesLocal,
  getBlogPostsLocal,
  getVehiclesLocal,
  getProductsLocal,
  getPagesLocal,
  getPartnersLocal,
} from '@/lib/api/payload-local';
import { getDriversForWebsite } from '@/lib/supabase/drivers';

interface PayloadDoc {
  slug: string;
  updatedAt?: string;
  publishedDate?: string;
}

interface PartnerDoc {
  slug?: string | null;
  updatedAt?: string;
  isWeddingPartner?: boolean | null;
  isPremierPartner?: boolean | null;
  isReferralPartner?: boolean | null;
  isPromotion?: boolean | null;
  category?: string | null;
}

interface DriverDoc {
  id: string;
  updated_at: string;
}

async function getPayloadData() {
  try {
    // Fetch all dynamic content using local Payload queries (no HTTP)
    const [servicesResponse, blogPostsResponse, vehicles, products, pages, allPartners] = await Promise.all([
      getServicesLocal(),
      getBlogPostsLocal({ limit: 100 }),
      getVehiclesLocal(),
      getProductsLocal(),
      getPagesLocal(),
      getPartnersLocal(), // Fetch all active partners
    ]);

    return {
      services: servicesResponse.docs,
      blogPosts: blogPostsResponse.docs,
      vehicles,
      products,
      pages,
      allPartners,
    };
  } catch (error) {
    console.error('Error fetching Payload data for sitemap:', error);
    return { services: [], blogPosts: [], vehicles: [], products: [], pages: [], allPartners: [] };
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
    { url: '/gift-card-balance', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/shop', priority: 0.7, changeFrequency: 'weekly' as const },

    // All service pages are now CMS-driven and included via serviceSitemapEntries below

    // Fleet pages
    { url: '/fleet/limo-bus', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/fleet/sprinter-van', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/fleet/shuttle-bus', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/fleet/rescue-squad', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/fleet/suburbans', priority: 0.9, changeFrequency: 'monthly' as const },

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

    // Career pages
    { url: '/careers/driver-application', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/careers/application-status', priority: 0.5, changeFrequency: 'monthly' as const },

    // Team page
    { url: '/our-drivers', priority: 0.7, changeFrequency: 'weekly' as const },

    // Insider membership pages
    { url: '/insider-membership-benefits', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/insider-terms-and-conditions', priority: 0.5, changeFrequency: 'yearly' as const },

    // Shopping cart (important for e-commerce)
    { url: '/cart', priority: 0.5, changeFrequency: 'daily' as const },

    // Legal pages
    { url: '/privacy-policy', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/terms-of-service', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/accessibility', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  const staticSitemapEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Fetch dynamic content from Payload CMS and Supabase
  const [payloadData, drivers] = await Promise.all([
    getPayloadData(),
    getDriversForWebsite(),
  ]);
  const { services, blogPosts, vehicles, products, pages, allPartners } = payloadData;

  // Dynamic service pages
  const serviceSitemapEntries = services.map((service: PayloadDoc) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.updatedAt || currentDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Blog posts
  const blogSitemapEntries = blogPosts.map((post: PayloadDoc) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedDate || currentDate),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Vehicles
  const vehicleSitemapEntries = vehicles.map((vehicle: PayloadDoc) => ({
    url: `${baseUrl}/fleet/${vehicle.slug}`,
    lastModified: new Date(vehicle.updatedAt || currentDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Products
  const productSitemapEntries = products.map((product: PayloadDoc) => ({
    url: `${baseUrl}/shop/products/${product.slug}`,
    lastModified: new Date(product.updatedAt || currentDate),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Custom pages
  const pageSitemapEntries = pages.map((page: PayloadDoc) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.updatedAt || currentDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Partner pages - categorize by type for correct URL paths
  const partnerSitemapEntries: MetadataRoute.Sitemap = [];

  allPartners.forEach((partner: PartnerDoc) => {
    // Skip partners without a slug
    if (!partner.slug) return;

    const hasCheckboxSet =
      partner.isPremierPartner === true ||
      partner.isReferralPartner === true ||
      partner.isWeddingPartner === true ||
      partner.isPromotion === true;

    let urlPath: string;

    // Determine the correct URL path based on partner type
    if (hasCheckboxSet) {
      if (partner.isWeddingPartner) {
        urlPath = `/wedding-partners/${partner.slug}`;
      } else if (partner.isPremierPartner) {
        urlPath = `/local-premier-partners/${partner.slug}`;
      } else {
        // Referral partners and promotions go to /partners/
        urlPath = `/partners/${partner.slug}`;
      }
    } else {
      // Legacy category field fallback
      if (partner.category === 'wedding') {
        urlPath = `/wedding-partners/${partner.slug}`;
      } else if (partner.category === 'local-premier') {
        urlPath = `/local-premier-partners/${partner.slug}`;
      } else {
        urlPath = `/partners/${partner.slug}`;
      }
    }

    partnerSitemapEntries.push({
      url: `${baseUrl}${urlPath}`,
      lastModified: new Date(partner.updatedAt || currentDate),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    });
  });

  // Driver profile pages
  const driverSitemapEntries = drivers.map((driver: DriverDoc) => ({
    url: `${baseUrl}/our-drivers/${driver.id}`,
    lastModified: new Date(driver.updated_at || currentDate),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    ...staticSitemapEntries,
    ...serviceSitemapEntries,
    ...blogSitemapEntries,
    ...vehicleSitemapEntries,
    ...productSitemapEntries,
    ...pageSitemapEntries,
    ...partnerSitemapEntries,
    ...driverSitemapEntries,
  ];
}
