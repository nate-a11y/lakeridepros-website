import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Accessibility Statement | Lake Ride Pros',
  description: 'Lake Ride Pros is committed to ensuring digital accessibility for people with disabilities. Learn about our accessibility standards and how to provide feedback.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/accessibility',
  },
}

export default function AccessibilityPage() {
  return (
    <div className="bg-white dark:bg-dark-bg-primary py-16">
      <article className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-lrp-black dark:text-white mb-8">
          Accessibility Statement
        </h1>

        <section className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-lrp-black dark:text-white mt-8 mb-4">
            Our Commitment
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Lake Ride Pros is committed to ensuring digital accessibility for people with disabilities.
            We are continually improving the user experience for everyone and applying the relevant
            accessibility standards to ensure we provide equal access to all our visitors.
          </p>

          <h2 className="text-2xl font-bold text-lrp-black dark:text-white mt-8 mb-4">
            Conformance Status
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            We aim to conform to the{' '}
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark underline"
            >
              Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
            </a>.
            These guidelines explain how to make web content more accessible for people with disabilities
            and user-friendly for everyone.
          </p>

          <h2 className="text-2xl font-bold text-lrp-black dark:text-white mt-8 mb-4">
            Accessibility Features
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-4">
            Our website includes the following accessibility features:
          </p>
          <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-6 space-y-2">
            <li>Keyboard navigation support throughout the site</li>
            <li>Visible focus indicators for keyboard users</li>
            <li>Skip navigation link to bypass repetitive content</li>
            <li>Alternative text for images</li>
            <li>Semantic HTML structure with proper heading hierarchy</li>
            <li>ARIA labels and roles for screen reader compatibility</li>
            <li>Sufficient color contrast ratios for text and interactive elements</li>
            <li>Responsive design that works at 200% zoom</li>
            <li>Support for dark mode and high contrast preferences</li>
            <li>Respect for reduced motion preferences</li>
          </ul>

          <h2 className="text-2xl font-bold text-lrp-black dark:text-white mt-8 mb-4">
            Third-Party Content
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Some features on our website, such as the booking system, are provided by third-party vendors.
            While we work with vendors who share our commitment to accessibility, we cannot guarantee
            the accessibility of third-party content. If you experience difficulty accessing any
            third-party content, please contact us for assistance.
          </p>

          <h2 className="text-2xl font-bold text-lrp-black dark:text-white mt-8 mb-4">
            Feedback and Contact Information
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-4">
            We welcome your feedback on the accessibility of Lake Ride Pros. If you encounter any
            accessibility barriers or have suggestions for improvement, please let us know:
          </p>

          <div className="bg-neutral-50 dark:bg-dark-bg-secondary rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-lrp-black dark:text-white mb-4">
              Contact Methods
            </h3>
            <ul className="space-y-3">
              <li>
                <strong className="text-lrp-black dark:text-white">Email:</strong>{' '}
                <a
                  href="mailto:contactus@lakeridepros.com"
                  className="text-primary hover:text-primary-dark underline"
                  aria-label="Email Lake Ride Pros at contactus@lakeridepros.com"
                >
                  contactus@lakeridepros.com
                </a>
              </li>
              <li>
                <strong className="text-lrp-black dark:text-white">Phone:</strong>{' '}
                <a
                  href="tel:5732069499"
                  className="text-primary hover:text-primary-dark underline"
                  aria-label="Call Lake Ride Pros at 573-206-9499"
                >
                  (573) 206-9499
                </a>
              </li>
              <li>
                <strong className="text-lrp-black dark:text-white">Contact Form:</strong>{' '}
                <Link
                  href="/contact"
                  className="text-primary hover:text-primary-dark underline"
                >
                  Visit our contact page
                </Link>
              </li>
            </ul>
          </div>

          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            We aim to respond to accessibility feedback within <strong>5 business days</strong> and
            will work with you to provide the information you need in an accessible format.
          </p>

          <h2 className="text-2xl font-bold text-lrp-black dark:text-white mt-8 mb-4">
            Technical Specifications
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            The accessibility of Lake Ride Pros relies on the following technologies to work with
            the particular combination of web browser and any assistive technologies or plugins
            installed on your computer:
          </p>
          <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-6 space-y-2">
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
            <li>ARIA (Accessible Rich Internet Applications)</li>
          </ul>

          <h2 className="text-2xl font-bold text-lrp-black dark:text-white mt-8 mb-4">
            Limitations and Alternatives
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Despite our best efforts to ensure accessibility of Lake Ride Pros, there may be some
            limitations. If you experience any accessibility issues, please contact us. We are
            committed to working with you to ensure you have equal access to our services.
          </p>

          <h2 className="text-2xl font-bold text-lrp-black dark:text-white mt-8 mb-4">
            Assessment and Testing
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Lake Ride Pros has been tested using the following methods:
          </p>
          <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-6 space-y-2">
            <li>Automated accessibility testing tools</li>
            <li>Manual keyboard navigation testing</li>
            <li>Screen reader compatibility testing</li>
            <li>Color contrast analysis</li>
            <li>Zoom and responsive design testing</li>
          </ul>

          <h2 className="text-2xl font-bold text-lrp-black dark:text-white mt-8 mb-4">
            Ongoing Improvement
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            We view accessibility as an ongoing commitment. We regularly review our website and
            implement improvements to enhance accessibility. We also provide training to our staff
            on accessibility best practices.
          </p>

          <div className="bg-primary/10 dark:bg-primary/20 border-l-4 border-primary rounded-r-lg p-6 mt-8">
            <p className="text-neutral-800 dark:text-neutral-200 font-medium">
              <strong className="text-lrp-black dark:text-white">Last Updated:</strong> January 2025
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-dark-border">
            <p className="text-neutral-700 dark:text-neutral-300">
              This statement was created with guidance from the{' '}
              <a
                href="https://www.w3.org/WAI/planning/statements/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark underline"
              >
                W3C Accessibility Statement Generator
              </a>.
            </p>
          </div>
        </section>
      </article>
    </div>
  )
}
