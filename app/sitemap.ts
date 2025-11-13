import { MetadataRoute } from 'next';

async function getPayloadData() {
  const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001';

  try {
    // Fetch all dynamic content from Payload CMS
    const [servicesRes, blogRes, vehiclesRes, productsRes, pagesRes] = await Promise.all([
      fetch(`${payloadUrl}/api/services?limit=100`, { next: { revalidate: 3600 } }),
      fetch(`${payloadUrl}/api/blog-posts?limit=100&where[published][equals]=true`, { next: { revalidate: 3600 } }),
      fetch(`${payloadUrl}/api/vehicles?limit=100`, { next: { revalidate: 3600 } }),
      fetch(`${payloadUrl}/api/products?limit=100&where[status][equals]=published`, { next: { revalidate: 3600 } }),
      fetch(`${payloadUrl}/api/pages?limit=100&where[published][equals]=true`, { next: { revalidate: 3600 } }),
    ]);

    const services = servicesRes.ok ? (await servicesRes.json()).docs : [];
    const blogPosts = blogRes.ok ? (await blogRes.json()).docs : [];
    const vehicles = vehiclesRes.ok ? (await vehiclesRes.json()).docs : [];
    const products = productsRes.ok ? (await productsRes.json()).docs : [];
    const pages = pagesRes.ok ? (await pagesRes.json()).docs : [];

    return { services, blogPosts, vehicles, products, pages };
  } catch (error) {
    console.error('Error fetching Payload data for sitemap:', error);
    return { services: [], blogPosts: [], vehicles: [], products: [], pages: [] };
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
    { url: '/about-us', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { url: '/gift-cards', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/gift-card-balance', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/shop', priority: 0.7, changeFrequency: 'weekly' as const },

    // Service pages are now dynamically generated from CMS below

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

  // Fetch dynamic content from Payload CMS
  const { services, blogPosts, vehicles, products, pages } = await getPayloadData();

  // Dynamic service pages
  const serviceSitemapEntries = services.map((service: any) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.updatedAt || currentDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Blog posts
  const blogSitemapEntries = blogPosts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedDate || currentDate),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Vehicles
  const vehicleSitemapEntries = vehicles.map((vehicle: any) => ({
    url: `${baseUrl}/fleet/${vehicle.slug}`,
    lastModified: new Date(vehicle.updatedAt || currentDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Products
  const productSitemapEntries = products.map((product: any) => ({
    url: `${baseUrl}/shop/products/${product.slug}`,
    lastModified: new Date(product.updatedAt || currentDate),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Custom pages
  const pageSitemapEntries = pages.map((page: any) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.updatedAt || currentDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticSitemapEntries,
    ...serviceSitemapEntries,
    ...blogSitemapEntries,
    ...vehicleSitemapEntries,
    ...productSitemapEntries,
    ...pageSitemapEntries,
  ];
}
