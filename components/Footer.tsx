import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: 'Book a Ride', href: '/book' },
      { name: 'Services', href: '/services' },
      { name: 'Fleet', href: '/fleet' },
      { name: 'Gift Cards', href: '/gift-cards' },
      { name: 'Shop', href: '/shop' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-lrp-green-light transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Company */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-lrp-green-light transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-lrp-green-light transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:5732069499"
                  className="text-white/90 hover:text-lrp-green-light transition-colors"
                  aria-label="Call Lake Ride Pros at 573-206-9499"
                >
                  (573) 206-9499
                </a>
              </li>
              <li>
                <a
                  href="mailto:owners@lakeridepros.com"
                  className="text-white/90 hover:text-lrp-green-light transition-colors"
                  aria-label="Email Lake Ride Pros"
                >
                  owners@lakeridepros.com
                </a>
              </li>
              <li>
                <span className="text-white/90">
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
