import Link from 'next/link';
import { getServicesLocal } from '@/lib/api/sanity';
import { getPopularServicesLocal } from '@/lib/analytics-server';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

// TikTok icon component (not available in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/lakeridepros',
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/lakeridepros',
    icon: Instagram,
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com/LakeRidePros?s=09',
    icon: Twitter,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@lakeridepros?si=oS45binC05S-krrq',
    icon: Youtube,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@lakeridepros?_r=1&_t=ZT-91WVPg1ADlu',
    icon: TikTokIcon,
  },
];

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  // Fallback popular services (same as header)
  const fallbackServiceSlugs = [
    'wedding-transportation',
    'airport-shuttle',
    'nightlife-transportation',
    'corporate-transportation',
    'private-aviation-transportation',
    'group-shuttle-services',
  ];

  // Fetch popular services from analytics (same as header)
  let popularServiceSlugs: string[] = [];
  try {
    const popularServices = await getPopularServicesLocal(6);
    popularServiceSlugs = popularServices.map(s => s.slug);
  } catch (error) {
    console.error('Error fetching popular services for footer:', error);
    // Use fallback if analytics fails
    popularServiceSlugs = fallbackServiceSlugs;
  }

  // If no popular services from analytics, use fallback
  if (popularServiceSlugs.length === 0) {
    popularServiceSlugs = fallbackServiceSlugs;
  }

  // Fetch services dynamically from CMS (using local Payload - required for build-time static generation)
  let dynamicServices: Array<{ name: string; href: string }> = [];
  try {
    const servicesResponse = await getServicesLocal();
    // Filter to only popular services and maintain order
    dynamicServices = popularServiceSlugs
      .map(slug => {
        const service = servicesResponse.docs.find(s => String(s.slug) === slug);
        return service ? { name: service.title, href: `/services/${String(service.slug)}` } : null;
      })
      .filter((s): s is { name: string; href: string } => s !== null);

    // Add "View All Services" link at the end
    dynamicServices.push({ name: 'View All Services →', href: '/services' });
  } catch (error) {
    console.error('Error fetching services for footer:', error);
    // Fall back to static list if fetch fails
    dynamicServices = [
      { name: 'Wedding Transportation', href: '/services/wedding-transportation' },
      { name: 'Airport Transfers', href: '/services/airport-shuttle' },
      { name: 'Nightlife & Party', href: '/services/nightlife-transportation' },
      { name: 'Corporate Travel', href: '/services/corporate-transportation' },
      { name: 'View All Services →', href: '/services' },
    ];
  }

  const footerLinks = {
    quickLinks: [
      { name: 'Book a Ride', href: '/book' },
      { name: 'Services', href: '/services' },
      { name: 'Fleet', href: '/fleet' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Gift Cards', href: '/gift-cards' },
      { name: 'Check Gift Card Balance', href: '/gift-card-balance' },
      { name: 'Shop', href: '/shop' },
    ],
    services: dynamicServices,
    serviceAreas: [
      { name: 'Osage Beach Transportation', href: '/transportation-osage-beach' },
      { name: 'Camdenton Transportation', href: '/transportation-camdenton' },
      { name: 'Lake Ozark Transportation', href: '/transportation-lake-ozark' },
      { name: 'Sunrise Beach Transportation', href: '/transportation-sunrise-beach' },
      { name: 'Laurie Transportation', href: '/transportation-laurie' },
      { name: 'Kansas City to Lake Ozarks', href: '/kansas-city-to-lake-ozarks' },
      { name: 'St. Louis to Lake Ozarks', href: '/st-louis-to-lake-ozarks' },
      { name: 'Columbia to Lake Ozarks', href: '/columbia-to-lake-ozarks' },
      { name: 'Jefferson City to Lake', href: '/jefferson-city-to-lake-ozarks' },
      { name: 'Springfield to Lake', href: '/springfield-to-lake-ozarks' },
      { name: 'Bagnell Dam Strip', href: '/bagnell-dam-strip-transportation' },
      { name: 'Airport Transportation', href: '/lake-ozarks-airport-transportation' },
    ],
    partners: [
      { name: 'Wedding Partners', href: '/wedding-partners' },
      { name: 'Local Premier Partners', href: '/local-premier-partners' },
      { name: 'Trusted Referral Partners', href: '/trusted-referral-partners' },
    ],
    insiders: [
      { name: 'Membership Benefits', href: '/insider-membership-benefits' },
      { name: 'Terms & Conditions', href: '/insider-terms-and-conditions' },
    ],
    company: [
      { name: 'About Us', href: '/about-us' },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Blog', href: '/blog' },
      { name: 'Music', href: '/music' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Return Policy', href: '/return-policy' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
  };

  return (
    <footer className="bg-primary-dark dark:bg-dark-bg-primary text-lrp-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8 items-start">
          {/* Column 1 - Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 2 - Services */}
          <nav aria-label="Services">
            <h3 className="text-white font-bold mb-4 text-lg">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 - Service Areas */}
          <nav aria-label="Service areas">
            <h3 className="text-white font-bold mb-4 text-lg">Service Areas</h3>
            <ul className="space-y-2">
              {footerLinks.serviceAreas.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4 - Partners */}
          <div>
            <nav aria-label="Partners">
              <h3 className="text-white font-bold mb-4 text-lg">Partners</h3>
              <ul className="space-y-2">
                {footerLinks.partners.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Insiders */}
            <nav aria-label="Insiders membership" className="mt-6">
              <h3 className="text-white font-bold mb-4 text-lg">Insiders</h3>
              <ul className="space-y-2">
                {footerLinks.insiders.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 5 - Company */}
          <div>
            <nav aria-label="Company">
              <h3 className="text-white font-bold mb-4 text-lg">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Careers */}
            <nav aria-label="Careers" className="mt-6">
              <h3 className="text-white font-bold mb-4 text-lg">Careers</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/careers/driver-application"
                    className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                  >
                    Driver Application
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers/application-status"
                    className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                  >
                    Application Status
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 6 - Legal & Contact */}
          <div>
            <nav aria-label="Legal">
              <h3 className="text-white font-bold mb-4 text-lg">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div className="mt-6">
              <h3 className="text-white font-bold mb-4 text-lg">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="tel:5732069499"
                    className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                    aria-label="Call Lake Ride Pros"
                  >
                    (573) 206-9499
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contactus@lakeridepros.com"
                    className="text-white/90 hover:text-lrp-green-light transition-colors text-sm break-words"
                    aria-label="Email Lake Ride Pros"
                  >
                    contactus@lakeridepros.com
                  </a>
                </li>
                <li>
                  <span className="text-white/90 text-sm">
                    Lake of the Ozarks, MO
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex justify-center items-center gap-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-lrp-green-light transition-colors"
                  aria-label={`Follow Lake Ride Pros on ${social.name} (opens in new tab)`}
                >
                  <Icon className="w-6 h-6" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/90 text-sm">
            © {currentYear} Lake Ride Pros LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
