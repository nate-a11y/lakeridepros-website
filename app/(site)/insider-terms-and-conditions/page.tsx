import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Insider Terms and Conditions - Lake Ride Pros',
  description: 'Terms and conditions for the Lake Ride Pros Insiders Membership & Rewards Program. Review membership rules, benefits, and policies.',
  keywords: ['insider terms', 'membership conditions', 'Lake Ride Pros terms', 'membership policy'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/insider-terms-and-conditions',
  },
  openGraph: {
    title: 'Insider Terms and Conditions | Lake Ride Pros',
    description: 'Terms and conditions for the Lake Ride Pros Insiders Membership & Rewards Program.',
    url: 'https://www.lakeridepros.com/insider-terms-and-conditions',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Insider Terms' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insider Terms and Conditions | Lake Ride Pros',
    description: 'Terms and conditions for the Lake Ride Pros Insiders Membership & Rewards Program.',
    images: ['/og-image.jpg'],
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
              Lake Ride Pros Insiders Membership &amp; Rewards Program
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Terms and Conditions
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content Section */}
      <section className="py-16 bg-section-alt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-themed max-w-none">
            <p className="mb-4">
              These Terms and Conditions (&ldquo;Terms&rdquo;) govern participation in the Lake Ride Pros Insiders Membership &amp; Rewards Program (&ldquo;Program&rdquo;) offered by Lake Ride Pros, LLC (&ldquo;Lake Ride Pros,&rdquo; &ldquo;LRP,&rdquo; &ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
            </p>
            <p className="mb-8">
              By enrolling in the Program, maintaining an active membership, or utilizing any associated benefits, you (&ldquo;Member&rdquo;) agree to be bound by these Terms.
            </p>

            {/* Section 1 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">1. Membership Structure and Fees</h2>
            <p className="mb-4">Membership is offered on a subscription basis and billed monthly as follows:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Individual Membership: $19.99/month</li>
              <li>Family Membership: $29.99/month</li>
              <li>Business Membership: $39.99/month</li>
              <li>Hold / Vacation Status: $9.99/month</li>
            </ul>
            <p className="mb-4">Membership fees are:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Non-refundable</li>
              <li>Automatically billed on a recurring basis</li>
              <li>Charged to the payment method on file until canceled</li>
            </ul>
            <p className="mb-4">
              Family Memberships require all members to reside at the same primary address unless otherwise grandfathered under prior membership structures.
            </p>
            <p className="mb-6">
              Lake Ride Pros reserves the right to modify membership pricing with proper notice as outlined in Section 10.
            </p>

            {/* Section 2 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">2. Earning Reward Points</h2>
            <p className="mb-4">Members earn Lake Ride Pros Reward Points based on completed reservations.</p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Point-to-Point Reservations</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>One-Way Trip: 1 Point</li>
              <li>Round Trip: 2 Points</li>
              <li>Additional Stops: No Points Awarded</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3">Hourly Reservations</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>SUVs: 3 Points</li>
              <li>Limo Bus &amp; Rescue Squad Truck: 4 Points</li>
              <li>Luxury Sprinter &amp; Luxury Shuttle Bus: 5 Points</li>
            </ul>
            <p className="mb-6">
              Points are earned only on completed, paid reservations booked under the active membership.
            </p>

            {/* Section 3 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">3. Membership Levels</h2>
            <p className="mb-4">Membership tiers are determined by cumulative earned points.</p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Individual Memberships</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Bronze: 1&ndash;20 Points</li>
              <li>Silver: 21&ndash;60 Points</li>
              <li>Gold: 61&ndash;100 Points</li>
              <li>Diamond: 101+ Points</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3">Family &amp; Business Memberships</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Bronze: 1&ndash;40 Points</li>
              <li>Silver: 41&ndash;120 Points</li>
              <li>Gold: 121&ndash;200 Points</li>
              <li>Diamond: 201+ Points</li>
            </ul>
            <p className="mb-6">
              Tier status is maintained as long as membership remains active or on Hold Status.
            </p>

            {/* Section 4 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">4. Membership Benefits and Rewards</h2>
            <p className="mb-6">The following benefits apply to active Insiders Members based on tier level.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Benefits Available to All Members</h3>

            <h4 className="text-lg font-semibold mt-4 mb-2">Members-Only Offers</h4>
            <p className="mb-4">Exclusive promotions available only to active Insiders Members.</p>

            <h4 className="text-lg font-semibold mt-4 mb-2">No Deposits</h4>
            <p className="mb-4">Deposit requirements are waived for all reservations booked under an active membership.</p>

            <h4 className="text-lg font-semibold mt-4 mb-2">Waived Lost &amp; Found Fees</h4>
            <p className="mb-4">If a personal item is left in a vehicle, retrieval and return coordination fees are waived.</p>

            <h4 className="text-lg font-semibold mt-4 mb-2">LRP Price Protection</h4>
            <p className="mb-4">Ride pricing will not fluctuate based on time of day, seasonal demand, or year of booking.</p>

            <h4 className="text-lg font-semibold mt-4 mb-2">Earn LRP Reward Points</h4>
            <p className="mb-4">All completed rides earn reward points based on reservation type.</p>

            <h4 className="text-lg font-semibold mt-4 mb-2">Ride Discounts by Tier</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Bronze: 0%</li>
              <li>Silver: 10%</li>
              <li>Gold: 15%</li>
              <li>Diamond: 20%</li>
            </ul>
            <p className="mb-6">Discounts apply to standard ride rates and cannot be combined with other promotional pricing unless stated.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Additional Benefits &mdash; Silver, Gold &amp; Diamond</h3>

            <h4 className="text-lg font-semibold mt-4 mb-2">Relaxed Cancellation Fees</h4>
            <p className="mb-6">Cancellation fees are waived for active Insiders Members at these tiers. Advance notice is still encouraged to maintain scheduling efficiency.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Additional Benefits &mdash; Gold &amp; Diamond</h3>

            <h4 className="text-lg font-semibold mt-4 mb-2">Beverages Available</h4>
            <p className="mb-4">Complimentary beverages are available upon request at the time of reservation. Availability may vary by vehicle and trip type.</p>

            <h4 className="text-lg font-semibold mt-4 mb-2">VIP Premier Access</h4>
            <p className="mb-4">Priority access to special events, high-demand dates, and exclusive promotions when available.</p>

            <h4 className="text-lg font-semibold mt-4 mb-2">One Free Monthly Ride</h4>
            <p className="mb-2">Includes one (1) complimentary ride per calendar month:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Up to 15 miles from pickup location</li>
              <li>Additional mileage billed at standard vehicle rate</li>
              <li>Subject to availability and scheduling requirements</li>
            </ul>
            <p className="mb-6">Unused free rides do not roll over.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Additional Benefits &mdash; Diamond Only</h3>

            <h4 className="text-lg font-semibold mt-4 mb-2">Limited Edition LRP Merchandise</h4>
            <p className="mb-4">Access to exclusive, limited-run Lake Ride Pros branded merchandise releases.</p>

            <h4 className="text-lg font-semibold mt-4 mb-2">LRP Priority Pass</h4>
            <p className="mb-4">Diamond Members receive priority dispatch status, allowing expedited placement into the next available vehicle when operationally feasible.</p>
            <p className="mb-6">Priority Pass does not override safety, legal capacity, or pre-scheduled reservations.</p>

            {/* Section 5 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">5. Cancellation, Hold Status, and Termination</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Membership Cancellation</h3>
            <p className="mb-4">Members may cancel at any time with a minimum 30-day written notice.</p>
            <p className="mb-2">Upon cancellation:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>All accumulated points are surrendered</li>
              <li>Tier status is forfeited</li>
              <li>Benefits remain active until cancellation effective date</li>
            </ul>
            <p className="mb-6">If membership is later restarted, the Member will begin as a brand-new enrollee with no prior points or status.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Hold / Vacation Status</h3>
            <p className="mb-4">Members may place their membership on Hold / Vacation Status for $9.99/month.</p>
            <p className="mb-2">While on Hold:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Membership remains active</li>
              <li>Tier status is retained</li>
              <li>Billing is reduced to Hold rate</li>
              <li>Benefits may be limited or paused operationally</li>
            </ul>
            <p className="mb-4">There is no time limit on Hold Status.</p>
            <p className="mb-6">If a membership is fully canceled instead of placed on Hold, all points and status are permanently surrendered.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Termination by Lake Ride Pros</h3>
            <p className="mb-2">Lake Ride Pros reserves the right to suspend or terminate membership for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Fraudulent activity</li>
              <li>Abuse of benefits</li>
              <li>Policy violations</li>
              <li>Non-payment</li>
              <li>Threatening or inappropriate conduct toward staff or partners</li>
            </ul>
            <p className="mb-4">Termination results in forfeiture of all points, status, and benefits.</p>
            <p className="mb-6">
              Members can manage their accounts, including cancellations, via the{' '}
              <Link href="/insider-login" className="text-primary hover:text-primary-dark underline">
                Insider Membership Portal
              </Link>.
            </p>

            {/* Section 6 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">6. How the Insiders Program Works</h2>
            <p className="mb-4">To utilize membership benefits:</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Ride Requests</h3>
            <p className="mb-4">Book through the LRP platform, dispatch, or approved driver contact.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Verification</h3>
            <p className="mb-4">Members may be required to present membership credentials and photo ID.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Advance Scheduling</h3>
            <p className="mb-4">Advance booking is strongly recommended. Last-minute requests are subject to availability.</p>
            <p className="mb-6">Membership does not guarantee vehicle availability.</p>

            {/* Section 7 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">7. Geographic Scope</h2>
            <p className="mb-2">Benefits apply within Lake Ride Pros&apos; primary service areas, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Camden County</li>
              <li>Miller County</li>
              <li>Morgan County</li>
            </ul>
            <p className="mb-6">Trips outside these areas may incur additional mileage fees, travel charges, or benefit limitations.</p>

            {/* Section 8 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">8. Minimum Fare Requirement</h2>
            <p className="mb-6">
              A minimum fare of $13.00 applies to all rides booked under the Insiders Program, regardless of discounts or promotions.
            </p>

            {/* Section 9 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">9. Liability Limitation</h2>
            <p className="mb-4">The Program is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo;</p>
            <p className="mb-2">Lake Ride Pros is not liable for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Technical outages</li>
              <li>Scheduling limitations</li>
              <li>Third-party disruptions</li>
              <li>Weather or safety cancellations</li>
            </ul>
            <p className="mb-4">Liability, if any, is limited to the value of the active membership period in dispute.</p>
            <p className="mb-6">Membership fees remain non-refundable except where required by law.</p>

            {/* Section 10 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">10. Program Changes</h2>
            <p className="mb-2">Lake Ride Pros reserves the right to modify:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Membership fees</li>
              <li>Benefits</li>
              <li>Tier structures</li>
              <li>Discounts</li>
              <li>Program rules</li>
            </ul>
            <p className="mb-4">Members will receive at least 30 days notice of material changes via email or website posting.</p>
            <p className="mb-6">Continued membership constitutes acceptance of updates.</p>

            {/* Section 11 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">11. Amendments to Terms</h2>
            <p className="mb-6">
              These Terms may be updated periodically. Continued participation after updates constitutes agreement to the revised Terms.
            </p>

            {/* Section 12 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">12. Transfer of Rights</h2>
            <p className="mb-6">
              Lake Ride Pros may assign or transfer Program operations to another entity. All obligations will transfer accordingly.
            </p>

            {/* Section 13 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">13. Accessibility Compliance</h2>
            <p className="mb-6">
              Lake Ride Pros complies with the Americans with Disabilities Act (ADA) and will provide accessible transportation accommodations whenever reasonably possible.
            </p>

            {/* Section 14 */}
            <h2 className="text-2xl font-bold mt-10 mb-4">14. Contact Information</h2>
            <p className="mb-2">For membership support or questions:</p>
            <ul className="list-none pl-0 mb-6">
              <li><strong>Lake Ride Pros, LLC</strong></li>
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
              &copy; 2026 Lake Ride Pros. All Rights Reserved
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
