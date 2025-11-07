import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
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

    // Fleet pages
    { url: '/fleet/limo-bus', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/fleet/sprinter-van', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/fleet/shuttle-bus', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/fleet/rescue-squad', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/fleet/suburbans', priority: 0.9, changeFrequency: 'monthly' as const },

    // Legal pages
    { url: '/privacy-policy', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/terms-of-service', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/accessibility', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  const routes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // TODO: Add dynamic blog post URLs from Payload CMS
  // Fetch blog posts and add to sitemap when CMS is connected

  return routes;
}
