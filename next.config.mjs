import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React Compiler (moved from experimental in Next.js 16)
  reactCompiler: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Allow larger file uploads (default is 1mb)
    },
  },
  sassOptions: {
    silenceDeprecations: ['import', 'legacy-js-api'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.lakeridepros.com',
      },
      {
        protocol: 'https',
        hostname: 'lakeridepros.com',
      },
      {
        protocol: 'https',
        hostname: 'lakeridepros-website.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  // Redirects for SEO
  async redirects() {
    return [
      // Homepage variations
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/what-our-customers-say',
        destination: '/testimonials',
        permanent: true,
      },

      // Old merch store → New shop
      {
        source: '/merch-store/:path*',
        destination: '/shop',
        permanent: true,
      },

      // Old blog → New blog
      {
        source: '/lrp-blog/:path*',
        destination: '/blog',
        permanent: true,
      },

      // Old fleet URLs → New fleet URLs
      {
        source: '/luxury-shuttle-bus',
        destination: '/fleet/shuttle-bus',
        permanent: true,
      },
      {
        source: '/rescue-squad-1',
        destination: '/fleet/rescue-squad',
        permanent: true,
      },
      {
        source: '/lrp-limo-bus',
        destination: '/fleet/limo-bus',
        permanent: true,
      },
      {
        source: '/luxury-sprinter-van',
        destination: '/fleet/sprinter-van',
        permanent: true,
      },
      {
        source: '/our-fleet-and-drivers',
        destination: '/fleet',
        permanent: true,
      },

      // Old event/misc pages
      {
        source: '/events-1',
        destination: '/services/group-event-transportation',
        permanent: true,
      },
      // Old UUID-based URLs (likely old driver profiles)
      {
        source: '/25484956-256c-4ca3-bcb1-05c6bb284472',
        destination: '/our-drivers',
        permanent: true,
      },

      // Old service pages → Services or relevant pages
      {
        source: '/airport-transportation-solutions',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/premium-private-transportation-service',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/hourly-charter-services',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/transportation-for-events',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/point-to-point-transfer',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/long-distance-trips',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/bachelor-and-bachelorette-parties-1',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/taxi-rideshare-lake-ozarks',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/luxury-transportation-services',
        destination: '/services',
        permanent: true,
      },

      // Booking/contact related
      {
        source: '/reservations-quotes',
        destination: '/book',
        permanent: true,
      },

      // Other old pages
      {
        source: '/private-airports',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/upcoming-events-around-the-lake',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/community-sponsorships-donations',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/frequently-asked-questions',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/accessibility-statement',
        destination: '/accessibility',
        permanent: true,
      },
      {
        source: '/driver-links',
        destination: '/',
        permanent: true,
      },
      {
        source: '/policies',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/merch-store-promo',
        destination: '/shop',
        permanent: true,
      },

      // Root-level service URLs → /services/* format (legacy URL support)
      {
        source: '/airport-shuttle',
        destination: '/services/airport-transfers',
        permanent: true,
      },
      {
        source: '/concert-transportation',
        destination: '/services/concert-transportation',
        permanent: true,
      },
      {
        source: '/corporate-transportation',
        destination: '/services/corporate-executive-travel',
        permanent: true,
      },
      {
        source: '/golf-outing-transportation',
        destination: '/services/golf-outing-transportation',
        permanent: true,
      },
      {
        source: '/group-event-transportation',
        destination: '/services/group-event-transportation',
        permanent: true,
      },
      {
        source: '/nightlife-transportation',
        destination: '/services/party-bus-nightlife',
        permanent: true,
      },
      {
        source: '/wedding-transportation',
        destination: '/services/wedding-transportation',
        permanent: true,
      },
      {
        source: '/wine-tour-shuttle',
        destination: '/services/wine-tour-shuttle',
        permanent: true,
      },
      {
        source: '/bachelor-party-transportation',
        destination: '/services/bachelor-party-transportation',
        permanent: true,
      },
      {
        source: '/old-kinderhook-transportation',
        destination: '/services/old-kinderhook-transportation',
        permanent: true,
      },

      // Careers redirect
      {
        source: '/careers',
        destination: '/careers/driver-application',
        permanent: true,
      },

      // Legacy service slugs that no longer exist in CMS → redirect to closest match or services page
      {
        source: '/services/airport-shuttle',
        destination: '/services/airport-transfers',
        permanent: true,
      },
      {
        source: '/services/bachelor-bachelorette-transportation',
        destination: '/services/bachelor-party-transportation',
        permanent: true,
      },
      {
        source: '/services/birthday-celebration-transportation',
        destination: '/services/special-events-transportation',
        permanent: true,
      },
      {
        source: '/services/corporate-transportation',
        destination: '/services/corporate-executive-travel',
        permanent: true,
      },
      {
        source: '/services/nightlife-transportation',
        destination: '/services/party-bus-nightlife',
        permanent: true,
      },
      {
        source: '/services/private-aviation-transportation',
        destination: '/services/private-aviation-transfers',
        permanent: true,
      },
    ];
  },
  // Security headers for SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
}

export default withPayload(nextConfig, {
  configPath: './src/payload.config.ts',
  generateLayouts: false
})
