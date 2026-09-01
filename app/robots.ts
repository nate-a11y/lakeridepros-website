import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.lakeridepros.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/studio/',
          '/private/',
          '/bridal-show-admin',
          '/giveaways-admin',
          '/checkout/',
          '/camden-county',
        ],
      },
      // AI Crawler policies - allow indexing for AI search
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
      {
        userAgent: 'Claude-SearchBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
      {
        userAgent: 'Claude-User',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
      // Backward-compatible Anthropic user agents seen in older guidance
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/', '/private/', '/camden-county'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
