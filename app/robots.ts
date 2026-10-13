import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.lakeridepros.com';

  return {
    rules: {
      userAgent: ['*', 'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'Claude-Web', 'Anthropic-AI', 'PerplexityBot', 'Google-Extended', 'Bingbot'],
      allow: '/',
      disallow: ['/api/', '/admin/', '/studio', '/private/', '/bridal-show-admin', '/giveaways-admin', '/checkout/', '/camden-county', '/insiders/auth/', '/insider-login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
