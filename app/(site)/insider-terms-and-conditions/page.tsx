import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Insider Rewards Terms and Conditions | Lake Ride Pros',
  description:
    'Terms and conditions for Lake Ride Pros Insider Rewards, including membership plans, points, reward levels, and member benefits.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/insider-terms-and-conditions',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const sections = [
  ['membership', 'Membership plans and billing'],
  ['accounts', 'Members and approved riders'],
  ['discounts', 'Ride discounts'],
  ['points', 'Earning status points'],
  ['tiers', 'Reward levels'],
  ['benefits', 'Benefits by level'],
  ['definitions', 'Benefit definitions'],
  ['portal', 'Member portal and communications'],
  ['changes', 'Changes, cancellation, and termination'],
  ['general', 'General program terms'],
]

function TermsSection({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-32 border-t border-white/10 py-9 first:border-t-0 first:pt-0"
    >
      <h2
        id={`${id}-heading`}
        className="text-2xl font-black text-white sm:text-3xl"
      >
        {number}. {title}
      </h2>
      <div className="mt-5 space-y-4 text-base leading-7 text-white/65">
        {children}
      </div>
    </section>
  )
}

export default function InsiderTermsAndConditionsPage() {
  return (
    <div className="bg-black text-white">
      <header className="border-b border-primary/20 bg-[radial-gradient(circle_at_top,rgba(76,187,23,0.2),transparent_42%)]">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">
            Lake Ride Pros Insider Rewards
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
            Program Terms &amp; Conditions
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/60">
            These terms govern enrollment and participation in the Lake Ride
            Pros Insider Rewards membership program.
          </p>
          <p className="mt-6 text-sm font-semibold text-white/60">
            Last updated: July 29, 2026
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <nav
            aria-label="Terms sections"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              On this page
            </p>
            <ol className="mt-4 space-y-2 text-sm">
              {sections.map(([id, label], index) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="block rounded-lg px-2 py-1.5 text-white/55 transition hover:bg-white/5 hover:text-white"
                  >
                    {index + 1}. {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <Link
            href="/insiders"
            className="mt-4 block rounded-xl bg-primary px-5 py-3 text-center font-black text-black hover:bg-primary-dark"
          >
            Member sign in
          </Link>
        </aside>

        <article className="min-w-0 rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-9 lg:p-12">
          <div className="mb-10 rounded-2xl border border-primary/25 bg-primary/8 p-5 text-sm leading-6 text-white/70">
            <p>
              These Terms and Conditions (&ldquo;Terms&rdquo;) govern the Lake
              Ride Pros Insider Rewards program (&ldquo;Program&rdquo;) offered
              by Lake Ride Pros, LLC (&ldquo;Lake Ride Pros,&rdquo;
              &ldquo;LRP,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or
              &ldquo;us&rdquo;). By enrolling, maintaining an active membership,
              or using a Program benefit, the account owner and each approved
              rider agree to these Terms.
            </p>
          </div>

          <TermsSection
            id="membership"
            number={1}
            title="Membership plans and billing"
          >
            <p>The Program offers the following subscription plans:</p>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-white/5 text-white">
                  <tr>
                    <th className="px-4 py-3 font-black">Plan</th>
                    <th className="px-4 py-3 font-black">Monthly</th>
                    <th className="px-4 py-3 font-black">Annual</th>
                    <th className="px-4 py-3 font-black">Included riders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="px-4 py-3 font-bold text-white">
                      Individual
                    </td>
                    <td className="px-4 py-3">$9.99</td>
                    <td className="px-4 py-3">$99</td>
                    <td className="px-4 py-3">1 member</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-white">Family</td>
                    <td className="px-4 py-3">$19.99</td>
                    <td className="px-4 py-3">$199</td>
                    <td className="px-4 py-3">Up to 5 approved riders</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-white">Business</td>
                    <td className="px-4 py-3">$29.99</td>
                    <td className="px-4 py-3">$299</td>
                    <td className="px-4 py-3">Up to 10 approved riders</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Chargebee securely processes plan enrollment, renewals, payment
              methods, and billing history. Membership fees recur monthly or
              annually according to the option selected at checkout until the
              subscription is canceled.
            </p>
            <p>
              Membership charges are non-refundable except where required by law
              or expressly approved by Lake Ride Pros. A failed or overdue
              payment may place benefits on hold until the account returns to
              good standing.
            </p>
          </TermsSection>

          <TermsSection
            id="accounts"
            number={2}
            title="Members and approved riders"
          >
            <p>
              An Individual plan covers one member. A Family plan covers up to
              five approved riders. A Business plan covers up to ten approved
              riders. Family and Business riders may have different addresses.
            </p>
            <p>
              The account owner controls the membership, is responsible for
              subscription charges, and must keep approved-rider information
              accurate. Only riders listed on an active account may receive
              Program benefits. Lake Ride Pros may request reasonable identity
              verification before applying a benefit.
            </p>
            <p>
              Rider changes are controlled to prevent benefit sharing outside
              the active membership. The account owner may request rider
              additions or removals through the member portal, subject to plan
              capacity and review.
            </p>
          </TermsSection>

          <TermsSection id="discounts" number={3} title="Ride discounts">
            <p>
              Active members receive the discount associated with their current
              reward level on eligible rides: Bronze 5%, Silver 10%, Gold 15%,
              and Diamond 20%.
            </p>
            <p>
              The membership must be active and associated with the reservation
              before the ride is confirmed. The account owner must book and pay
              when using a Guest Savings Pass. Discounts cannot be combined with
              another offer unless Lake Ride Pros expressly allows it.
            </p>
            <p>
              Eligibility may exclude third-party charges, gratuities, taxes,
              tolls, already-discounted packages, farmed or affiliate service,
              or other charges that Lake Ride Pros does not control. Any
              exclusion applicable to a reservation will be disclosed during
              quoting or booking.
            </p>
          </TermsSection>

          <TermsSection id="points" number={4} title="Earning status points">
            <p>
              Points are earned only on completed, paid reservations matched to
              an active member or approved rider. Cancelled, unpaid, fully
              refunded, fraudulent, test, or duplicate reservations do not earn
              points. If a qualifying ride is later reversed or refunded, its
              points may also be reversed.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Point-to-point one-way', '1 point'],
                ['Point-to-point round trip', '2 points'],
                ['Additional stops', 'No points'],
                ['Hourly SUV', '3 points'],
                ['Limo Bus or Rescue Squad', '4 points'],
                ['Luxury Sprinter or Luxury Shuttle Bus', '5 points'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/3 px-4 py-3"
                >
                  <span>{label}</span>
                  <strong className="shrink-0 text-primary">{value}</strong>
                </div>
              ))}
            </div>
            <p>
              Moovs trip records are used to match and verify ride activity.
              Members should report a missing or incorrect ride through the
              member portal so Lake Ride Pros can review it.
            </p>
          </TermsSection>

          <TermsSection id="tiers" number={5} title="Reward levels">
            <p>
              Reward status is calculated from eligible points earned during a
              rolling 12-month qualification period.
            </p>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-white/5 text-white">
                  <tr>
                    <th className="px-4 py-3">Level</th>
                    <th className="px-4 py-3">Discount</th>
                    <th className="px-4 py-3">Individual</th>
                    <th className="px-4 py-3">Family / Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="px-4 py-3 font-bold text-amber-300">
                      Bronze
                    </td>
                    <td className="px-4 py-3">5%</td>
                    <td className="px-4 py-3">0–20</td>
                    <td className="px-4 py-3">0–40</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-200">
                      Silver
                    </td>
                    <td className="px-4 py-3">10%</td>
                    <td className="px-4 py-3">21–60</td>
                    <td className="px-4 py-3">41–120</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-yellow-300">
                      Gold
                    </td>
                    <td className="px-4 py-3">15%</td>
                    <td className="px-4 py-3">61–100</td>
                    <td className="px-4 py-3">121–200</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-cyan-200">
                      Diamond
                    </td>
                    <td className="px-4 py-3">20%</td>
                    <td className="px-4 py-3">101+</td>
                    <td className="px-4 py-3">201+</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Existing members at relaunch will have their current status
              protected for the first Program year. If their calculated status
              is higher, the higher status applies. After protection expires,
              the rolling 12-month calculation controls unless Lake Ride Pros
              has recorded a specific correction.
            </p>
          </TermsSection>

          <TermsSection
            id="benefits"
            number={6}
            title="Benefits by reward level"
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-amber-600/30 bg-amber-950/20 p-5">
                <h3 className="text-xl font-black text-amber-300">Bronze</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>5% off eligible rides</li>
                  <li>Insider Local Perks</li>
                  <li>Exclusive member promotions</li>
                  <li>Earn status points</li>
                  <li>Deposits waived on eligible rides</li>
                  <li>Lost item coordination fee waived</li>
                  <li>Price Protection after confirmation</li>
                  <li>Membership savings statements and portal access</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-300/30 bg-slate-400/5 p-5">
                <h3 className="text-xl font-black text-slate-200">Silver</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Everything included in Bronze</li>
                  <li>10% off eligible rides</li>
                  <li>Priority waitlist</li>
                  <li>Early-access notices</li>
                  <li>2 Flex Credits per year</li>
                  <li>$10 anniversary ride credit upon renewal</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-5">
                <h3 className="text-xl font-black text-yellow-300">Gold</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Everything included in Silver</li>
                  <li>15% off eligible rides</li>
                  <li>48-hour event access</li>
                  <li>4 Flex Credits per year</li>
                  <li>
                    Nonalcoholic beverage package on eligible hourly rides when
                    requested in advance
                  </li>
                  <li>10% merchandise discount</li>
                  <li>1 Guest Savings Pass per membership year</li>
                  <li>$25 anniversary ride credit upon renewal</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/5 p-5">
                <h3 className="text-xl font-black text-cyan-200">Diamond</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Everything included in Gold</li>
                  <li>20% off eligible rides</li>
                  <li>Top-priority waitlist</li>
                  <li>72-hour event access</li>
                  <li>Limited-edition merchandise gift</li>
                  <li>6 Flex Credits per year</li>
                  <li>
                    Nonalcoholic beverage package on eligible hourly rides when
                    requested in advance
                  </li>
                  <li>2 Guest Savings Passes per membership year</li>
                  <li>Dedicated membership booking assistance</li>
                  <li>$50 anniversary ride credit upon renewal</li>
                  <li>Diamond Priority Pass</li>
                </ul>
              </div>
            </div>
            <p>
              Benefits do not guarantee vehicle, event, partner, product, or
              staff availability. A priority or early-access benefit improves
              placement or notice but does not displace an existing confirmed
              reservation or override safety, law, capacity, or operational
              requirements.
            </p>
          </TermsSection>

          <TermsSection
            id="definitions"
            number={7}
            title="Benefit definitions and limits"
          >
            <h3 className="font-black text-white">Flex Credit</h3>
            <p>
              One Flex Credit waives one eligible change or cancellation fee on
              a standard point-to-point reservation when notice is provided at
              least two hours before pickup. It does not cover no-shows, late
              cancellations, hourly vehicles, specialty vehicles, or expenses
              already incurred. Flex Credits have no cash value and do not roll
              over unless Lake Ride Pros expressly states otherwise.
            </p>
            <h3 className="pt-2 font-black text-white">Guest Savings Pass</h3>
            <p>
              A Guest Savings Pass allows the account owner to share the
              account&apos;s current percentage discount on one eligible
              standard ride. The member must book and pay for the reservation. A
              pass is consumed when applied and has no cash value.
            </p>
            <h3 className="pt-2 font-black text-white">
              Anniversary Ride Credit
            </h3>
            <p>
              The applicable credit is issued after a paid annual renewal or 12
              consecutive monthly payments. It expires 60 days after issuance,
              applies only to eligible standard transportation, and has no cash
              value.
            </p>
            <h3 className="pt-2 font-black text-white">Insider Local Perks</h3>
            <p>
              Local Perks are discounts, upgrades, complimentary items, or
              special access offered by participating Premier Partners. Offers,
              eligibility, instructions, and availability can change throughout
              the year. Partner fulfillment is subject to the partner&apos;s own
              terms.
            </p>
            <h3 className="pt-2 font-black text-white">Price Protection</h3>
            <p>
              Once a member rate is confirmed, it will not increase unless the
              reservation changes. Added time, mileage, stops, passengers,
              vehicles, services, fees, or other requested changes may change
              the final price.
            </p>
            <h3 className="pt-2 font-black text-white">
              Special-event access and Priority Pass
            </h3>
            <p>
              Event notices, priority waitlists, and Diamond Priority Pass
              status are subject to availability. They do not guarantee service
              and do not override safety, legal capacity, driver-hour, existing
              reservation, or operational requirements.
            </p>
          </TermsSection>

          <TermsSection
            id="portal"
            number={8}
            title="Member portal, notices, and records"
          >
            <p>
              Members use a passwordless email magic link to access the secure
              member portal. The portal may display matched rides, points,
              current level, benefits, approved riders, billing snapshots,
              promotions, events, local perks, and support requests.
            </p>
            <p>
              Members are responsible for maintaining access to the account
              email and promptly reporting unauthorized access. Billing changes
              are managed through Chargebee. Rewards and ride records are
              managed through Lake Ride Pros systems and Moovs trip data.
            </p>
            <p>
              Program notices remain available in the member portal and may also
              be delivered by email, browser or mobile push notification, or
              optional text message according to each member&apos;s settings.
              Text messages require the member&apos;s express opt-in and may be
              turned off in the portal or by replying STOP. Message and data
              rates may apply. Delivery through an external channel is not
              guaranteed, so members should use the portal as the primary record
              of Program notices.
            </p>
          </TermsSection>

          <TermsSection
            id="changes"
            number={9}
            title="Changes, cancellation, suspension, and termination"
          >
            <p>
              The account owner may request cancellation through the Chargebee
              billing portal or Lake Ride Pros membership support. Cancellation
              stops future renewal according to the billing terms shown in
              Chargebee. Benefits continue only through the paid subscription
              period unless the account is suspended or terminated for cause.
            </p>
            <p>
              On full cancellation, unused benefits, points, and protected
              status are forfeited unless Lake Ride Pros states otherwise in
              writing. Re-enrollment may begin as a new membership.
            </p>
            <p>
              Lake Ride Pros may suspend or terminate an account for nonpayment,
              fraud, misuse, unauthorized sharing, inaccurate rider information,
              policy violations, or threatening or inappropriate conduct toward
              staff, drivers, passengers, or partners.
            </p>
            <p>
              Lake Ride Pros may modify Program fees, benefits, discounts,
              levels, or rules. Members will receive at least 30 days&apos;
              notice of a material change through email, the portal, or a
              website posting. Continued participation after the effective date
              means the updated terms apply.
            </p>
          </TermsSection>

          <TermsSection id="general" number={10} title="General Program terms">
            <p>
              Membership does not guarantee transportation availability. Advance
              booking is strongly recommended. Weather, safety, mechanical
              issues, driver availability, third-party disruptions, and legal or
              operational limits may affect service.
            </p>
            <p>
              Program benefits apply primarily within the Lake Ride Pros service
              area. Trips outside that area may include travel, mileage,
              lodging, or other charges and may have benefit limitations
              disclosed during quoting.
            </p>
            <p>
              The Program is offered as available. To the maximum extent allowed
              by law, Lake Ride Pros is not responsible for indirect or
              consequential loss arising solely from Program availability,
              technical interruptions, a partner offer, or an unavailable
              benefit. Nothing in these Terms limits a right that cannot legally
              be limited.
            </p>
            <p>
              Lake Ride Pros supports accessible transportation and will provide
              reasonable accommodations whenever reasonably possible. Contact us
              before travel when a specific accommodation is needed.
            </p>
            <p>
              If one provision is unenforceable, the remaining Terms remain in
              effect. Lake Ride Pros may assign Program administration with the
              associated obligations. These Terms, together with the checkout
              terms and reservation terms, are the agreement governing Program
              participation.
            </p>
            <div className="mt-7 rounded-2xl border border-white/10 bg-white/3 p-5">
              <h3 className="font-black text-white">Membership support</h3>
              <p className="mt-2">
                Lake Ride Pros, LLC
                <br />
                <a
                  className="font-bold text-primary hover:underline"
                  href="mailto:contactus@lakeridepros.com"
                >
                  contactus@lakeridepros.com
                </a>
                <br />
                <a
                  className="font-bold text-primary hover:underline"
                  href="tel:+15732069499"
                >
                  (573) 206-9499
                </a>
                <br />
                <a
                  className="font-bold text-primary hover:underline"
                  href="https://www.lakeridepros.com"
                >
                  www.lakeridepros.com
                </a>
              </p>
            </div>
          </TermsSection>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row">
            <Link
              href="/insider-membership-benefits"
              className="rounded-xl bg-primary px-5 py-3 text-center font-black text-black hover:bg-primary-dark"
            >
              View Insider Rewards
            </Link>
            <Link
              href="/insiders"
              className="rounded-xl border border-white/20 px-5 py-3 text-center font-bold hover:border-primary hover:text-primary"
            >
              Open member portal
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
