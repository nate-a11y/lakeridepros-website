import Link from 'next/link';
import { getServices } from '@/lib/api/payload';
import { getPopularServicesLocal } from '@/lib/analytics-server';

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

  // Fetch services dynamically from CMS, but only show popular ones
  let dynamicServices: Array<{ name: string; href: string }> = [];
  try {
    const servicesResponse = await getServices({ limit: 100 });
    // Filter to only popular services and maintain order
    dynamicServices = popularServiceSlugs
      .map(slug => {
        const service = servicesResponse.docs.find(s => s.slug === slug);
        return service ? { name: service.title, href: `/services/${service.slug}` } : null;
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
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
  };

  return (
    <footer className="bg-primary-dark dark:bg-dark-bg-primary text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Column 1 - Quick Links */}
          <div>
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
          </div>

          {/* Column 2 - Services */}
          <div>
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
          </div>

          {/* Column 3 - Service Areas */}
          <div>
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
          </div>

          {/* Column 4 - Partners */}
          <div>
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

            {/* Insiders */}
            <h3 className="text-white font-bold mb-4 text-lg mt-6">Insiders</h3>
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
          </div>

          {/* Column 5 - Company */}
          <div>
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

            {/* Careers */}
            <h3 className="text-white font-bold mb-4 text-lg mt-6">Careers</h3>
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

            {/* Legal Links */}
            <h3 className="text-white font-bold mb-4 text-lg mt-6">Legal</h3>
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
          </div>

          {/* Column 5 - Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:5732069499"
                  className="text-white/90 hover:text-lrp-green-light transition-colors text-sm"
                  aria-label="Call Lake Ride Pros at 573-206-9499"
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
