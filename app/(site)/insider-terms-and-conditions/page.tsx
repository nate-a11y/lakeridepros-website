import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Insider Terms and Conditions - Lake Ride Pros',
  description: 'Terms and conditions for the Lake Ride Pros Insider membership program. Review membership rules, benefits, and policies.',
  keywords: ['insider terms', 'membership conditions', 'Lake Ride Pros terms', 'membership policy'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/insider-terms-and-conditions',
  },
}

export default function InsiderTermsAndConditionsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Membership Benefits and Terms with Lake Ride Pros
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Please review the terms and conditions of our Insider membership program.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content Section */}
      <section className="py-16 bg-section-alt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-themed max-w-none">
            <p className="mb-8">
              These Terms and Conditions (&ldquo;Terms&rdquo;) govern your participation in the Lake Ride Pros Insiders Program (&ldquo;Program&rdquo;) offered by Lake Ride Pros, LLC (&ldquo;Lake Ride Pros,&rdquo; &ldquo;LRP,&rdquo; or &ldquo;we&rdquo;). By enrolling in the Lake Ride Pros Insiders Program or utilizing its benefits, you agree to these Terms.
            </p>

            {/* Section 1 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">1. Membership Fees</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Individual Memberships: $19.99/month</li>
              <li>Family Memberships: $29.99/month</li>
              <li>Business Memberships: $39.99/month</li>
              <li>Memberships on Hold: $9.99/month</li>
            </ul>
            <p className="mb-6">
              Membership fees are non-refundable, except in cases where cancellation is due to changes initiated by LRP, in which case prorated refunds may apply. Fees will be automatically charged on a recurring basis until canceled. All members of a family membership must reside at the same address. Members continuing through the transition are grandfathered into existing family membership rules.
            </p>

            {/* Section 2 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">2. Earning Points</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">Point-to-Point Reservations</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>One-Way Trips: Earn 1 point</li>
              <li>Round Trips: Earn 2 points</li>
              <li>Additional Stops: Do not earn points</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3">Hourly Reservations</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>SUVs: Earn 3 points</li>
              <li>Limo Bus and Rescue Squad Truck: Earn 4 points</li>
              <li>Luxury Sprinter and Shuttle: Earn 5 points</li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">3. Membership Levels</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">Individual Memberships</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Bronze: 1-20 points</li>
              <li>Silver: 21-60 points</li>
              <li>Gold: 61-100 points</li>
              <li>Diamond: 101+ points</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3">Family and Business Memberships</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Bronze: 1-40 points</li>
              <li>Silver: 41-120 points</li>
              <li>Gold: 121-200 points</li>
              <li>Diamond: 201+ points</li>
            </ul>

            {/* Section 4 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">4. Redeeming Points</h2>
            <p className="mb-6">
              Points can be redeemed for rewards such as discounts, upgrades, and exclusive experiences. Rewards and options are subject to availability and may change without notice. Lake Ride Pros is not responsible for rewards unavailability due to external circumstances, technical issues, or operational constraints.
            </p>

            {/* Section 5 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">5. Cancellation, Hold Status, and Termination</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">Cancellation</h3>
            <p className="mb-4">
              Members may cancel their membership at any time by providing written notice at least 30 days in advance. Upon cancellation, all points will be surrendered. Rewards may be used until the membership cancellation date expires.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Hold Status</h3>
            <p className="mb-4">
              Members may place their membership on hold for $9.99/month. Points and membership status are retained while on hold, and there is no time limit on the hold status.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Termination by the Company</h3>
            <p className="mb-6">
              Lake Ride Pros reserves the right to terminate memberships for fraudulent activity, abuse of the program, or failure to comply with these Terms. Members can manage their accounts, including cancellations, via the{' '}
              <Link href="/insider-login" className="text-primary hover:text-primary-dark underline">
                Insider Membership Portal
              </Link>.
            </p>

            {/* Section 6 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">6. Liability</h2>
            <p className="mb-6">
              The Lake Ride Pros Insiders Program is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; LRP disclaims liability for external circumstances such as technical failures or service unavailability that affect point redemption. Liability is limited to the value of unused points in a member&apos;s account at the time of dispute. Membership fees are non-refundable, except as outlined in Section 1.
            </p>

            {/* Section 7 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">7. Accessibility Compliance</h2>
            <p className="mb-6">
              Lake Ride Pros is committed to adhering to all applicable requirements under the Americans with Disabilities Act (ADA). Accessible transportation services will be provided whenever reasonably possible, and accommodations will be made for passengers with disabilities.
            </p>

            {/* Section 8 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">8. How Lake Ride Pros Insiders Works</h2>
            <p className="mb-4">
              The Lake Ride Pros Insiders Program provides customers with exclusive benefits and discounts, subject to driver availability and operational factors. To utilize your membership:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Ride Requests:</strong> Contact your regular driver or use LRP&apos;s online platform to schedule a ride.</li>
              <li><strong>Verification:</strong> Inform the driver of your membership and provide your membership details. A valid membership card and photo ID may be required.</li>
              <li><strong>Advance Scheduling:</strong> Schedule rides in advance to ensure availability. Last-minute requests may have limited availability.</li>
            </ul>

            {/* Section 9 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">9. Geographic Scope</h2>
            <p className="mb-6">
              Lake Ride Pros Insiders benefits are available within LRP&apos;s service areas, primarily Camden, Miller, and Morgan counties. Services outside these areas may be subject to additional fees or limitations.
            </p>

            {/* Section 10 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">10. Program Changes</h2>
            <p className="mb-6">
              Lake Ride Pros reserves the right to modify or discontinue the Program, adjust membership fees, benefits, or ride rates with 30 days&apos; notice provided via email. Members may cancel their membership if they disagree with the changes, with prorated refunds provided as outlined in Section 5.
            </p>

            {/* Section 11 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">11. Amendments to Terms</h2>
            <p className="mb-6">
              LRP may update these Terms and will notify members of material changes. Continued use of your membership constitutes acceptance of the revised Terms.
            </p>

            {/* Section 12 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">12. Transfer of Rights</h2>
            <p className="mb-6">
              LRP reserves the right to assign or transfer its rights and obligations under the Program to another entity. If a transfer occurs, the new entity assumes responsibility for fulfilling the Program&apos;s obligations.
            </p>

            {/* Section 13 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">13. Minimum Fare</h2>
            <p className="mb-6">
              A minimum fare of $13.00 applies to all rides taken under the Lake Ride Pros Insiders Program.
            </p>

            {/* Section 14 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">14. Contact Us</h2>
            <p className="mb-2">
              For questions or concerns about your membership, contact us at:
            </p>
            <ul className="list-none pl-0 mb-6">
              <li><strong>Email:</strong>{' '}
                <a href="mailto:contactus@lakeridepros.com" className="text-primary hover:text-primary-dark underline">
                  contactus@lakeridepros.com
                </a>
              </li>
              <li><strong>Phone:</strong>{' '}
                <a href="tel:+15732069499" className="text-primary hover:text-primary-dark underline">
                  (573) 206-9499
                </a>
              </li>
              <li><strong>Website:</strong>{' '}
                <a href="https://www.lakeridepros.com" className="text-primary hover:text-primary-dark underline">
                  www.lakeridepros.com
                </a>
              </li>
            </ul>

            {/* Copyright */}
            <p className="text-muted text-center mt-12 pt-8 border-t border-themed">
              &copy; 2025 Lake Ride Pros. All Rights Reserved
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
