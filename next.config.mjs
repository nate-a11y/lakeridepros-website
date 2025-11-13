import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lakeridepros-website.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
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
  async redirects() {
    return [
      // Core service pages - redirect to CMS versions
      {
        source: '/wedding-transportation',
        destination: '/services/wedding-transportation',
        permanent: true,
      },
      {
        source: '/airport-shuttle',
        destination: '/services/airport-shuttle',
        permanent: true,
      },
      {
        source: '/corporate-transportation',
        destination: '/services/corporate-transportation',
        permanent: true,
      },
      {
        source: '/nightlife-transportation',
        destination: '/services/nightlife-transportation',
        permanent: true,
      },
      {
        source: '/private-aviation-transportation',
        destination: '/services/private-aviation-transportation',
        permanent: true,
      },
      // Event & activity services
      {
        source: '/bachelor-party-transportation',
        destination: '/services/bachelor-party-transportation',
        permanent: true,
      },
      {
        source: '/wine-tour-shuttle',
        destination: '/services/wine-tour-shuttle',
        permanent: true,
      },
      {
        source: '/brewery-tour-transportation',
        destination: '/services/brewery-tour-transportation',
        permanent: true,
      },
      {
        source: '/concert-transportation',
        destination: '/services/concert-transportation',
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
        source: '/charter-bus-service',
        destination: '/services/charter-bus-service',
        permanent: true,
      },
      {
        source: '/prom-transportation',
        destination: '/services/prom-transportation',
        permanent: true,
      },
      {
        source: '/new-years-eve-transportation',
        destination: '/services/new-years-eve-transportation',
        permanent: true,
      },
      {
        source: '/taxi-service',
        destination: '/services/taxi-service',
        permanent: true,
      },
      // Venue-specific services
      {
        source: '/tan-tar-a-transportation',
        destination: '/services/tan-tar-a-transportation',
        permanent: true,
      },
      {
        source: '/margaritaville-transportation',
        destination: '/services/margaritaville-transportation',
        permanent: true,
      },
      {
        source: '/old-kinderhook-transportation',
        destination: '/services/old-kinderhook-transportation',
        permanent: true,
      },
      // Event-specific services
      {
        source: '/lake-ozarks-shootout-transportation',
        destination: '/services/lake-ozarks-shootout-transportation',
        permanent: true,
      },
      {
        source: '/bikefest-transportation',
        destination: '/services/bikefest-transportation',
        permanent: true,
      },
      // Old/legacy pages
      {
        source: '/lake-ozarks-tours',
        destination: '/services',
        permanent: true,
      },
    ];
  },
}

export default withPayload(nextConfig, {
  configPath: './src/payload.config.ts',
  generateLayouts: false
})
