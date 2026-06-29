/** @type {import('next').NextConfig} */
const legacySlugRedirects = [
  {
    "source": "/our-drivers/LRP17",
    "destination": "/our-drivers/lrp17",
    "permanent": true
  },
  {
    "source": "/our-drivers/LRP19",
    "destination": "/our-drivers/lrp19",
    "permanent": true
  },
  {
    "source": "/our-drivers/LRP7",
    "destination": "/our-drivers/lrp7",
    "permanent": true
  },
  {
    "source": "/our-drivers/LRP9",
    "destination": "/our-drivers/lrp9",
    "permanent": true
  },
  {
    "source": "/events/Avenged-Sevenfold-and-Good-Charlotte",
    "destination": "/events/avenged-sevenfold-and-good-charlotte",
    "permanent": true
  },
  {
    "source": "/events/Brandon-Lake-with-Franni-Cash-and-Pat-Barrett",
    "destination": "/events/brandon-lake-with-franni-cash-and-pat-barrett",
    "permanent": true
  },
  {
    "source": "/events/Bring-Me-The-Horizon",
    "destination": "/events/bring-me-the-horizon-enterprise-center-2026-05-11",
    "permanent": true
  },
  {
    "source": "/events/Eric-Church-with-special-guest-49-winchester",
    "destination": "/events/eric-church-with-special-guest-49-winchester",
    "permanent": true
  },
  {
    "source": "/events/Guns-and-Roses-World-Tour-2026",
    "destination": "/events/guns-and-roses-world-tour-2026",
    "permanent": true
  },
  {
    "source": "/events/Kolby-copper",
    "destination": "/events/kolby-copper",
    "permanent": true
  },
  {
    "source": "/events/MC4D",
    "destination": "/events/mc4d",
    "permanent": true
  },
  {
    "source": "/events/Megan-Moroney",
    "destination": "/events/megan-moroney-enterprise-center-2026-06-13",
    "permanent": true
  },
  {
    "source": "/events/Monster-Energy-SMX-World-Championship-Final",
    "destination": "/events/monster-energy-smx-world-championship-final",
    "permanent": true
  },
  {
    "source": "/events/New-Edition-Way-Tour-Featuring-New-Edition-Boyz-II-Men-and-Toni-Braxton",
    "destination": "/events/new-edition-way-tour-featuring-new-edition-boyz-ii-men-and-toni-braxton",
    "permanent": true
  },
  {
    "source": "/events/Nine-Inch-Nails",
    "destination": "/events/nine-inch-nails",
    "permanent": true
  },
  {
    "source": "/events/The-Queens-4-Legends-1-Stage",
    "destination": "/events/the-queens-4-legends-1-stage",
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
    "source": "/local-premier-partners/AED-EMPIRE",
    "destination": "/local-premier-partners/aed-empire",
    "permanent": true
  },
  {
    "source": "/wedding-partners/Cherry-Pic'd-Photography",
    "destination": "/wedding-partners/cherry-pic-d-photography",
    "permanent": true
  },
  {
    "source": "/partners/Citywide-home-mortgage",
    "destination": "/partners/citywide-home-mortgage",
    "permanent": true
  },
  {
    "source": "/wedding-partners/Dragonfly-Meadows-Venue-and-B%26B",
    "destination": "/wedding-partners/dragonfly-meadows-venue-and-b-and-b",
    "permanent": true
  },
  {
    "source": "/partners/I-Gotta-Captain",
    "destination": "/partners/i-gotta-captain",
    "permanent": true
  },
  {
    "source": "/wedding-partners/In-your-element-event-planning",
    "destination": "/wedding-partners/in-your-element-event-planning",
    "permanent": true
  },
  {
    "source": "/wedding-partners/Lawson-Vacation-Experts",
    "destination": "/wedding-partners/lawson-vacation-experts",
    "permanent": true
  },
  {
    "source": "/partners/Quick-Tees-Scree-Printing-and-Embroidery",
    "destination": "/partners/quick-tees-scree-printing-and-embroidery",
    "permanent": true
  },
  {
    "source": "/partners/Taboo-Burger-and-Ice-Cream",
    "destination": "/partners/taboo-burger-and-ice-cream",
    "permanent": true
  },
  {
    "source": "/wedding-partners/The-Hedge-Haus-at-Loz",
    "destination": "/wedding-partners/the-hedge-haus-at-loz",
    "permanent": true
  },
  {
    "source": "/wedding-partners/The-Rustic-Canteen",
    "destination": "/wedding-partners/the-rustic-canteen",
    "permanent": true
  },
  {
    "source": "/partners/Timeless-Bakers-Pub",
    "destination": "/partners/timeless-bakers-pub",
    "permanent": true
  },
  {
    "source": "/local-premier-partners/Woodward-photo-video-marketing",
    "destination": "/local-premier-partners/woodward-photo-video-marketing",
    "permanent": true
  },
  {
    "source": "/shop/products/-lrp-white-tough-phone-cases",
    "destination": "/shop/products/lrp-white-tough-phone-cases",
    "permanent": true
  },
  {
    "source": "/fleet/LRP1",
    "destination": "/fleet/lrp1",
    "permanent": true
  },
  {
    "source": "/fleet/LRP2",
    "destination": "/fleet/lrp2",
    "permanent": true
  },
  {
    "source": "/fleet/LRP3",
    "destination": "/fleet/lrp3",
    "permanent": true
  },
  {
    "source": "/fleet/LRP5",
    "destination": "/fleet/lrp5",
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
    "source": "/events/venues/Enterprise-Center",
    "destination": "/events/venues/enterprise-center",
    "permanent": true
  },
  {
    "source": "/events/venues/Lazy-gators",
    "destination": "/events/venues/lazy-gators",
    "permanent": true
  },
  {
    "source": "/events/venues/T-Mobile-Center",
    "destination": "/events/venues/t-mobile-center",
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
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
      { source: '/events-1', destination: '/services/group-event-transportation', permanent: true },
      { source: '/25484956-256c-4ca3-bcb1-05c6bb284472', destination: '/our-drivers', permanent: true },
      { source: '/referral-partners', destination: '/trusted-referral-partners', permanent: true },
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
