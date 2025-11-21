import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: false,
    serverActions: {
      bodySizeLimit: '10mb', // Allow larger file uploads (default is 1mb)
    },
  },
  sassOptions: {
    silenceDeprecations: ['import', 'legacy-js-api'],
  },
  images: {
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
        destination: '/',
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
