/** @type {import('next').NextConfig} */
const legacySlugRedirects = [
  {
    "source": "/events/Bring-Me-The-Horizon",
    "destination": "/events/bring-me-the-horizon-enterprise-center-2026-05-11",
    "permanent": true
  },
  {
    "source": "/events/Megan-Moroney",
    "destination": "/events/megan-moroney-enterprise-center-2026-06-13",
    "permanent": true
  },
  {
    "source": "/events/forrest-frank%20-%20Copy",
    "destination": "/events/forrest-frank-copy",
    "permanent": true
  },
  {
    "source": "/events/three-days-grace%20-%20Copy",
    "destination": "/events/three-days-grace-copy",
    "permanent": true
  },
  {
    "source": "/events/zac-brown-band%20-%20Copy",
    "destination": "/events/zac-brown-band-copy",
    "permanent": true
  },
  {
    "source": "/wedding-partners/Cherry-Pic'd-Photography",
    "destination": "/wedding-partners/cherry-pic-d-photography",
    "permanent": true
  },
  {
    "source": "/wedding-partners/Dragonfly-Meadows-Venue-and-B%26B",
    "destination": "/wedding-partners/dragonfly-meadows-venue-and-b-and-b",
    "permanent": true
  },
  {
    "source": "/shop/products/-lrp-white-tough-phone-cases",
    "destination": "/shop/products/lrp-white-tough-phone-cases",
    "permanent": true
  },
  {
    "source": "/events/bring-me-the-horizon",
    "destination": "/events/bring-me-the-horizon-t-mobile-center-2026-05-12",
    "permanent": true
  },
  {
    "source": "/events/megan-moroney",
    "destination": "/events/megan-moroney-t-mobile-center-2026-08-16",
    "permanent": true
  },
  {
    "source": "/partners/hytech-marine-upholstery-flooring",
    "destination": "/local-premier-partners/hytech-marine-upholstery-flooring",
    "permanent": true
  },
  {
    "source": "/partners/sunrise-movers",
    "destination": "/local-premier-partners/sunrise-movers",
    "permanent": true
  }
];

const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  reactCompiler: false,
  serverExternalPackages: ['jspdf', 'jspdf-autotable', 'fflate'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Site content is capped at 1200px. Larger candidates caused Next.js to
    // expose 300KB-1.3MB vehicle images without improving rendered quality.
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    qualities: [65, 75, 80, 85],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'www.lakeridepros.com' },
      { protocol: 'https', hostname: 'lakeridepros.com' },
      { protocol: 'https', hostname: 'lakeridepros-website.vercel.app' },
      { protocol: 'https', hostname: '*.vercel.app' },
      { protocol: 'http', hostname: 'localhost', port: '3001' },
      { protocol: 'http', hostname: 'localhost', port: '3000' },
    ],
  },
  async redirects() {
    return [
      ...legacySlugRedirects,
      { source: '/home', destination: '/', permanent: true },
      { source: '/what-our-customers-say', destination: '/testimonials', permanent: true },
      { source: '/merch-store/:path*', destination: '/shop', permanent: true },
      { source: '/lrp-blog/:path*', destination: '/blog', permanent: true },
      { source: '/luxury-shuttle-bus', destination: '/fleet/shuttle-bus', permanent: true },
      { source: '/rescue-squad-1', destination: '/fleet/rescue-squad', permanent: true },
      { source: '/lrp-limo-bus', destination: '/fleet/limo-bus', permanent: true },
      { source: '/luxury-sprinter-van', destination: '/fleet/sprinter-van', permanent: true },
      { source: '/our-fleet-and-drivers', destination: '/fleet', permanent: true },
      { source: '/fleet/lrp7-madison', destination: '/fleet', permanent: true },
      { source: '/fleet/lrp11-kelley', destination: '/fleet', permanent: true },
      { source: '/fleet/lrp4-jasey', destination: '/fleet', permanent: true },
      { source: '/fleet/lrp5', destination: '/fleet', permanent: true },
      { source: '/fleet/lrp17-sandra', destination: '/fleet', permanent: true },
      { source: '/fleet/lrp20-nick', destination: '/fleet', permanent: true },
      { source: '/events-1', destination: '/services/group-event-transportation', permanent: true },
      { source: '/25484956-256c-4ca3-bcb1-05c6bb284472', destination: '/our-drivers', permanent: true },
      { source: '/referral-partners', destination: '/trusted-referral-partners', permanent: true },
      { source: '/partners/lrp-promotions', destination: '/trusted-referral-partners', permanent: true },
      { source: '/airport-transportation-solutions', destination: '/services', permanent: true },
      { source: '/premium-private-transportation-service', destination: '/services', permanent: true },
      { source: '/hourly-charter-services', destination: '/services', permanent: true },
      { source: '/transportation-for-events', destination: '/services', permanent: true },
      { source: '/point-to-point-transfer', destination: '/services', permanent: true },
      { source: '/long-distance-trips', destination: '/services', permanent: true },
      { source: '/bachelor-and-bachelorette-parties-1', destination: '/services', permanent: true },
      { source: '/taxi-rideshare-lake-ozarks', destination: '/services', permanent: true },
      { source: '/luxury-transportation-services', destination: '/services', permanent: true },
      { source: '/reservations-quotes', destination: '/book', permanent: true },
      { source: '/private-airports', destination: '/services', permanent: true },
      { source: '/upcoming-events-around-the-lake', destination: '/blog', permanent: true },
      { source: '/community-sponsorships-donations', destination: '/about-us', permanent: true },
      { source: '/frequently-asked-questions', destination: '/contact', permanent: true },
      { source: '/accessibility-statement', destination: '/accessibility', permanent: true },
      { source: '/driver-links', destination: '/', permanent: true },
      { source: '/policies', destination: '/privacy-policy', permanent: true },
      { source: '/merch-store-promo', destination: '/shop', permanent: true },
      { source: '/airport-shuttle', destination: '/services/airport-transfers', permanent: true },
      { source: '/concert-transportation', destination: '/services/concert-transportation', permanent: true },
      { source: '/corporate-transportation', destination: '/services/corporate-executive-travel', permanent: true },
      { source: '/golf-outing-transportation', destination: '/services/golf-outing-transportation', permanent: true },
      { source: '/group-event-transportation', destination: '/services/group-event-transportation', permanent: true },
      { source: '/nightlife-transportation', destination: '/services/party-bus-nightlife', permanent: true },
      { source: '/wedding-transportation', destination: '/services/wedding-transportation', permanent: true },
      { source: '/wine-tour-shuttle', destination: '/services/wine-tour-shuttle', permanent: true },
      { source: '/bachelor-party-transportation', destination: '/services/bachelor-party-transportation', permanent: true },
      { source: '/old-kinderhook-transportation', destination: '/services/old-kinderhook-transportation', permanent: true },
      { source: '/admin', destination: '/studio', permanent: true },
      { source: '/services/airport-shuttle', destination: '/services/airport-transfers', permanent: true },
      { source: '/services/bachelor-bachelorette-transportation', destination: '/services/bachelor-party-transportation', permanent: true },
      { source: '/services/birthday-celebration-transportation', destination: '/services/special-events-transportation', permanent: true },
      { source: '/services/corporate-transportation', destination: '/services/corporate-executive-travel', permanent: true },
      { source: '/services/nightlife-transportation', destination: '/services/party-bus-nightlife', permanent: true },
      { source: '/services/private-aviation-transportation', destination: '/services/private-aviation-transfers', permanent: true },
    ];
  },
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

export default nextConfig
