import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Lake Ride Pros',
  description: 'Lake Ride Pros privacy policy and data protection practices.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Header */}
      <div className="bg-lrp-green py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Privacy Policy
          </h1>
          <p className="text-white/90 text-center mt-4">
            Last Updated: November 7, 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert max-w-none">

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              Lake Ride Pros LLC ("we," "us," or "our") operates www.lakeridepros.com and provides
              transportation services at Lake of the Ozarks, Missouri. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you visit our website or
              use our services.
            </p>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              By using our website or services, you agree to the collection and use of information in
              accordance with this policy. If you do not agree with our policies and practices, please
              do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              1. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-lrp-black dark:text-white mb-3">
              1.1 Personal Information
            </h3>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-4 space-y-2">
              <li>Book transportation services</li>
              <li>Purchase gift cards or merchandise</li>
              <li>Contact us with inquiries</li>
              <li>Subscribe to our newsletter or communications</li>
              <li>Create an account on our booking platform</li>
            </ul>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              This information may include:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-6 space-y-2">
              <li>Name and contact information (email, phone number, address)</li>
              <li>Pickup and drop-off locations</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Trip details and preferences</li>
              <li>Special requests or accessibility needs</li>
            </ul>

            <h3 className="text-xl font-semibold text-lrp-black dark:text-white mb-3">
              1.2 Automatically Collected Information
            </h3>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-6 space-y-2">
              <li>IP address and browser type</li>
              <li>Operating system and device information</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-lrp-black dark:text-white mb-3">
              1.3 Location Information
            </h3>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              With your permission, we may collect location data to:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-4 space-y-2">
              <li>Provide accurate pickup and drop-off services</li>
              <li>Calculate trip distances and pricing</li>
              <li>Improve service efficiency and routing</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-4 space-y-2">
              <li>Process and fulfill your transportation bookings</li>
              <li>Process payments and prevent fraudulent transactions</li>
              <li>Communicate with you about your reservations and our services</li>
              <li>Send booking confirmations, receipts, and service updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations and enforce our terms</li>
              <li>Analyze usage patterns and optimize our operations</li>
              <li>Ensure passenger and driver safety</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              3. How We Share Your Information
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              We may share your information with:
            </p>

            <h3 className="text-xl font-semibold text-lrp-black dark:text-white mb-3">
              3.1 Service Providers
            </h3>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-6 space-y-2">
              <li><strong>Moovs:</strong> Our booking platform partner for reservation management</li>
              <li><strong>Stripe:</strong> Payment processing services</li>
              <li><strong>Email service providers:</strong> For communications and newsletters</li>
              <li><strong>Analytics providers:</strong> To understand website usage and improve services</li>
            </ul>

            <h3 className="text-xl font-semibold text-lrp-black dark:text-white mb-3">
              3.2 Legal Requirements
            </h3>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-6">
              We may disclose your information if required by law, court order, or governmental request,
              or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
            </p>

            <h3 className="text-xl font-semibold text-lrp-black dark:text-white mb-3">
              3.3 Business Transfers
            </h3>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              If Lake Ride Pros is involved in a merger, acquisition, or sale of assets, your information
              may be transferred as part of that transaction.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              4. Data Security
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              We implement appropriate technical and organizational security measures to protect your
              personal information, including:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-4 space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure payment processing through PCI-compliant providers</li>
              <li>Regular security assessments and updates</li>
              <li>Limited access to personal information by authorized personnel only</li>
              <li>Secure data storage and backup procedures</li>
            </ul>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              However, no method of transmission over the internet or electronic storage is 100% secure.
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-4 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our website</li>
              <li>Improve website functionality and user experience</li>
              <li>Analyze traffic and usage patterns</li>
              <li>Deliver relevant advertising</li>
            </ul>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              You can control cookies through your browser settings. However, disabling cookies may
              affect your ability to use certain features of our website.
            </p>

            <h3 className="text-xl font-semibold text-lrp-black dark:text-white mb-3">
              Types of Cookies We Use:
            </h3>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-4 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for website operation</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences (e.g., dark mode)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              6. Your Privacy Rights
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Data portability:</strong> Request your data in a portable format</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
            </ul>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:contactus@lakeridepros.com" className="text-lrp-green hover:text-lrp-green-light">
                contactus@lakeridepros.com
              </a>
              {' '}or{' '}
              <a href="tel:5732069499" className="text-lrp-green hover:text-lrp-green-light">
                (573) 206-9499
              </a>
              .
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              7. Data Retention
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              We retain your personal information only as long as necessary to:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-4 space-y-2">
              <li>Provide our services to you</li>
              <li>Comply with legal, tax, and accounting obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
              <li>Maintain business records for operational purposes</li>
            </ul>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              Booking and payment records are typically retained for 7 years to comply with financial
              regulations. Marketing data is retained until you opt out or request deletion.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              8. Third-Party Websites
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              Our website may contain links to third-party websites, including our booking platform (Moovs).
              We are not responsible for the privacy practices of these external sites. We encourage you
              to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              Our services are not directed to individuals under the age of 18. We do not knowingly
              collect personal information from children. If you are a parent or guardian and believe
              your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* California Privacy Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              10. California Privacy Rights
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              If you are a California resident, you have additional rights under the California Consumer
              Privacy Act (CCPA), including:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-4 space-y-2">
              <li>Right to know what personal information we collect, use, and disclose</li>
              <li>Right to request deletion of your personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your CCPA rights</li>
            </ul>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              To exercise these rights, contact us at{' '}
              <a href="mailto:contactus@lakeridepros.com" className="text-lrp-green hover:text-lrp-green-light">
                contactus@lakeridepros.com
              </a>
              .
            </p>
          </section>

          {/* Email Communications */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              11. Email Communications
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              We may send you:
            </p>
            <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary mb-4 space-y-2">
              <li><strong>Transactional emails:</strong> Booking confirmations, receipts, and service updates (required)</li>
              <li><strong>Marketing emails:</strong> Promotions, news, and special offers (optional)</li>
            </ul>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              You can opt out of marketing emails by clicking "unsubscribe" in any marketing email or
              by contacting us directly. You cannot opt out of transactional emails related to your bookings.
            </p>
          </section>

          {/* Updates to Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-lrp-green mb-4">
              12. Changes to This Privacy Policy
            </h2>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              We may update this Privacy Policy from time to time to reflect changes in our practices
              or legal requirements. We will notify you of any material changes by posting the new policy
              on this page and updating the "Last Updated" date. Your continued use of our services after
              changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

        </div>

        {/* Contact Card */}
        <div className="mt-12 bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
          <h2 className="text-xl font-bold text-lrp-black dark:text-white mb-4">
            Questions About Our Privacy Policy?
          </h2>
          <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
            If you have any questions or concerns about how we handle your data, please contact us:
          </p>
          <div className="space-y-2">
            <p className="text-neutral-700 dark:text-white">
              <strong>Lake Ride Pros LLC</strong>
            </p>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              Lake of the Ozarks, Missouri
            </p>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              Email:{' '}
              <a href="mailto:contactus@lakeridepros.com" className="text-lrp-green hover:text-lrp-green-light">
                contactus@lakeridepros.com
              </a>
            </p>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              Phone:{' '}
              <a href="tel:5732069499" className="text-lrp-green hover:text-lrp-green-light">
                (573) 206-9499
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
