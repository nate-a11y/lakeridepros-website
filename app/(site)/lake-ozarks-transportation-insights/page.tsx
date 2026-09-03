import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { BarChart3, CalendarDays, CarFront, MapPin, Plane, Quote, ShieldCheck, Users } from 'lucide-react'
import Link from 'next/link'
import { PhoneLink } from '@/components/PhoneLink'
import { formatInsightNumber, transportationInsights as insights } from '@/lib/transportation-insights'

const canonicalUrl = 'https://www.lakeridepros.com/lake-ozarks-transportation-insights'
const pageDescription =
  'Original Lake of the Ozarks transportation insights from 14,000+ completed trip records, including seasonality, booking lead times, group sizes, and airports.'

export const metadata: Metadata = {
  title: 'Lake Ozarks Transportation Data & Planning Insights',
  description: pageDescription,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: 'article',
    url: canonicalUrl,
    siteName: 'Lake Ride Pros',
    title: 'Lake Ozarks Transportation Data & Planning Insights',
    description:
      'Plan with original data from more than 14,000 completed Lake Ride Pros trip records.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros transportation fleet' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lake Ozarks Transportation Data & Planning Insights',
    description: 'Original planning insights from more than 14,000 completed transportation records.',
    images: ['/og-image.jpg'],
  },
}

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Lake of the Ozarks Transportation Planning Insights',
  description:
    'Aggregated and anonymized analysis of completed Lake Ride Pros trip records, including seasonal demand, booking lead time, party size, trip distance, and airport activity.',
  url: canonicalUrl,
  creator: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    url: 'https://www.lakeridepros.com',
  },
  datePublished: insights.publishedDate,
  dateModified: insights.publishedDate,
  temporalCoverage: `${insights.periodStart}/${insights.periodEnd}`,
  spatialCoverage: {
    '@type': 'Place',
    name: 'Lake of the Ozarks, Missouri',
  },
  variableMeasured: [
    'Completed trip legs',
    'Reservation count',
    'Seasonal demand',
    'Day-of-week demand',
    'Recorded passenger count',
    'Recorded trip distance',
    'Booking lead time',
    'Airport trip activity',
  ],
  measurementTechnique: 'Aggregate analysis of internal trip operations data with customer details removed',
  isAccessibleForFree: true,
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What 14,000+ Lake of the Ozarks Trip Records Reveal About Planning Transportation',
  description: pageDescription,
  datePublished: insights.publishedDate,
  dateModified: insights.publishedDate,
  mainEntityOfPage: canonicalUrl,
  author: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    url: 'https://www.lakeridepros.com/about-us',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.lakeridepros.com/Color%20logo%20-%20no%20background.png',
    },
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'When is transportation busiest at Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In Lake Ride Pros completed-trip data for 2024 and 2025, 60.8% of trip legs occurred from May through August. Friday and Saturday together accounted for 44.7% of completed trip legs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How early should I book Lake of the Ozarks transportation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Observed median booking lead times were 2 days for nightlife, 6 days for airport transportation, 25 days for bachelor and bachelorette trips, and 89 days for weddings among records with usable trip-type and booking timestamps. Peak dates should be reserved earlier.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which airports are commonly used for Lake of the Ozarks trips?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lake Ride Pros completed-trip records most frequently referenced Springfield-Branson National, Lee C. Fine Memorial, Columbia Regional, St. Louis Lambert International, Kansas City International, and Grand Glaize-Osage Beach airports.',
      },
    },
  ],
}

const iconClass = 'size-8 text-lrp-green'

const localAuthorityReviews = [
  {
    name: 'Nikki Sorenson',
    title: 'Real Estate Agent',
    company: 'Swift & Co Realty',
    quote: 'Lake Ride Pros take the “worry” out of driving around the Lake and are next level when it comes to service and catering to their passengers.',
    url: 'https://www.google.com/maps/reviews/AbFvOqkKwxAZOztVph309QgKq3elinPcQ0hm_3ylKI_n4EhmRAUzM3NTbzMkp84jUFbsRzlhFncBtA',
  },
  {
    name: 'Melissa Carroll',
    title: 'President, Lake West Chamber',
    company: 'Town and Country Supermarket',
    quote: 'Very knowledgeable about the lake area, and getting in and out of the amphitheater. LRP vehicles are always immaculate.',
    url: 'https://www.google.com/maps/reviews/AbFvOqnKoCbDEsgu99m_Dfykg4ZBcGWboGPCud9IauhulYylKGkfuAF6CZ0h-NCrEHMLEKWmwBXtdg',
  },
  {
    name: 'Brett Burnell',
    title: 'Real Estate Agent',
    company: 'RE/MAX Next Generation',
    quote: 'Very professional and made for a great office Christmas party. Nate was great to communicate with and very accommodating.',
    url: 'https://www.google.com/maps/reviews/AbFvOqkNnLUx9oXqHZ-81PJc3Fz2YIv9NvxUTBpw3-3tNoicpSYsulTURo0xkQSxuemGmwK1_KfB',
  },
  {
    name: 'Hannah Gerard',
    title: 'Community Impact Director',
    company: 'United Way of Central Missouri',
    quote: 'Their cars are always so clean and the drivers are friendly and professional.',
    url: 'https://www.google.com/maps/reviews/AbFvOqnW0-mgepqRmS16FvhI0BGns8lYUK9OX551x_crm18bVywIjGdY0kNfqIq2MHsz5DC8I2AaLg',
  },
]

const operationalReviewStories: Array<{
  title: string
  reviewer: string
  summary: string
  lesson: string
  reviewUrl: string
  secondaryReviewUrl?: string
  relatedHref: string
  relatedLabel: string
}> = [
  {
    title: 'A wedding plan with three transportation jobs',
    reviewer: 'Jennifer Loveall',
    summary:
      'Lake Ride Pros moved guests from parking to the ceremony, carried the wedding party to the reception, and drove the couple to the airport. When the requested time was found to be wrong the night before, the schedule was corrected without disrupting the wedding day.',
    lesson: 'Build one coordinated manifest for guest shuttles, wedding-party travel, and the final departure.',
    reviewUrl: 'https://www.google.com/maps/reviews/AbFvOqm7_-xLFIZK3Z__u-3iw82Gy-lHMqU63EF8VOlcnrtxMrJMH4UfX78x7KpFNDeGnn4FdzYT',
    relatedHref: '/services/wedding-transportation',
    relatedLabel: 'Plan wedding transportation',
  },
  {
    title: 'A narrow lakefront road changed the last mile',
    reviewer: 'Hannah Sullivan',
    summary:
      'A large shuttle could not safely reach a lakefront house with narrow roads and no turnaround. The group walked to the staged bus for departure, and the team positioned an SUV to carry guests down the hill when they returned.',
    lesson: 'Share road width, grade, gates, and turnaround space before assigning a large vehicle.',
    reviewUrl: 'https://www.google.com/maps/reviews/AbFvOqnt-2Mu5ppWCKVpyLW_hV1-_df2Tx4QSrLp-2YqRcAXIslXnYsf2iNcDcL0s5167eO2t1loLw',
    relatedHref: '/services/vacation-rental-transportation',
    relatedLabel: 'Plan vacation-rental transportation',
  },
  {
    title: 'Flight tracking handled early arrivals at COU',
    reviewer: 'Tracy Goulet and Jackie Gould',
    summary:
      'Two Columbia Regional Airport customers independently reported that their flights landed early and their Lake Ride Pros driver was already waiting. One trip was arranged with less than a day of notice during a stressful change of plans.',
    lesson: 'Provide the flight number so dispatch can monitor real arrival time instead of relying only on the timetable.',
    reviewUrl: 'https://www.google.com/maps/reviews/AbFvOqkFt9jwGYqYPcNjSzGEXqo2cCT9TwVH_P_XY5SysH4KCmsX1MWojcIJFWtGH6kqg4c1IyKbxA',
    secondaryReviewUrl: 'https://www.google.com/maps/reviews/AbFvOqmaXmjAj-5O-G-gtMpWoz39WCzZknYS26b8wEI6xi3DFZzUreTIihGSt6PXBGsZ9t1skD-atw',
    relatedHref: '/columbia-to-lake-ozarks',
    relatedLabel: 'See Columbia-to-Lake transportation',
  },
  {
    title: 'A crosswind diversion required an airport pivot',
    reviewer: 'Jim Brodigan',
    summary:
      'After crosswinds forced an unexpected landing at Lee C. Fine instead of Camdenton, Lake Ride Pros returned after another pickup and transported the traveler to the car left at the original airport.',
    lesson: 'Private-aviation plans should include the tail number, destination airport, and a backup-airport contact plan.',
    reviewUrl: 'https://www.google.com/maps/reviews/AbFvOqks3QIN_L-peJZGkH9hVltplS3zaP8szzpo_aeAnk2net9rVKafuCdkmzcK80LWOaE3Py3ocQ',
    relatedHref: '/lake-ozarks-airport-transportation',
    relatedLabel: 'Compare Lake-area airports',
  },
  {
    title: 'Six wedding rides required a mixed fleet',
    reviewer: 'Kristi Merritt',
    summary:
      'A wedding itinerary used six scheduled rides and a mix of shuttles, an SUV, and a limo bus to move different groups between lodging and the venue.',
    lesson: 'Different passenger waves may need different vehicles; one oversized vehicle is not always the best plan.',
    reviewUrl: 'https://www.google.com/maps/reviews/AbFvOqnRZ7Dh_VK8XN0D5-QnwrmD_WIb69v2OWrmoE3pgp3cc2Fq4WSqSyvFfz8s4p1eZCcypZkQsA',
    relatedHref: '/services/wedding-transportation',
    relatedLabel: 'Plan a multi-vehicle wedding',
  },
]

export default function LakeOzarksTransportationInsightsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="min-h-screen bg-white text-neutral-900 dark:bg-dark-bg-primary dark:text-white">
        <article>
          <header className="bg-neutral-950 py-16 text-white sm:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <BarChart3 className="size-4" aria-hidden="true" />
                Original Lake Ride Pros data
              </div>
              <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                What 14,000+ Lake of the Ozarks Trip Records Reveal About Planning Transportation
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white sm:text-xl">
                The short answer: demand concentrates in summer and on Fridays and Saturdays, while the right
                booking window changes sharply by trip type. These findings come from anonymized Lake Ride Pros
                operating records—not a generic travel survey.
              </p>
              <p className="mt-5 text-sm text-white">
                Published <time dateTime={insights.publishedDate}>September 3, 2026</time> · Data through{' '}
                <time dateTime={insights.periodEnd}>September 2, 2026</time>
              </p>
            </div>
          </header>

          <section aria-labelledby="quick-findings" className="py-14 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 id="quick-findings" className="text-3xl font-bold tracking-tight sm:text-4xl">
                The findings in 30 seconds
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <InsightCard
                  icon={<CarFront className={iconClass} aria-hidden="true" />}
                  value={`${formatInsightNumber(insights.completedTripLegs)} records`}
                  label="Completed trip legs analyzed"
                />
                <InsightCard
                  icon={<CalendarDays className={iconClass} aria-hidden="true" />}
                  value={`${insights.fullYearSample.mayThroughAugustPercent}%`}
                  label="Of 2024–2025 trips occurred May through August"
                />
                <InsightCard
                  icon={<Users className={iconClass} aria-hidden="true" />}
                  value={`${insights.fullYearSample.fridayAndSaturdayPercent}%`}
                  label="Of 2024–2025 trips occurred Friday or Saturday"
                />
                <InsightCard
                  icon={<MapPin className={iconClass} aria-hidden="true" />}
                  value={`${insights.medianDistanceMiles} miles`}
                  label="Median distance when mileage was recorded"
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="booking-window" className="bg-neutral-50 py-14 dark:bg-dark-bg-secondary sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 id="booking-window" className="text-3xl font-bold tracking-tight sm:text-4xl">
                How far ahead do people actually book?
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700 dark:text-neutral-300">
                Nightlife transportation is often arranged close to the date. Weddings and destination group
                trips are planned much earlier. For a peak summer weekend, earlier is safer regardless of trip type.
              </p>
              <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-dark-bg-primary">
                <table className="w-full min-w-[620px] text-left">
                  <caption className="sr-only">Median booking lead time by trip type</caption>
                  <thead className="bg-neutral-100 text-sm uppercase tracking-wide text-neutral-700 dark:bg-dark-bg-tertiary dark:text-neutral-300">
                    <tr>
                      <th scope="col" className="px-5 py-4">Trip type</th>
                      <th scope="col" className="px-5 py-4">Observed median</th>
                      <th scope="col" className="px-5 py-4">Usable records</th>
                      <th scope="col" className="px-5 py-4">Practical planning target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {insights.bookingLeadTimes.map((row) => (
                      <tr key={row.tripType}>
                        <th scope="row" className="px-5 py-4 font-bold">{row.tripType}</th>
                        <td className="px-5 py-4">{row.medianDays} days</td>
                        <td className="px-5 py-4">{formatInsightNumber(row.records)}</td>
                        <td className="px-5 py-4">{planningTarget(row.tripType)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                Lead-time analysis uses only completed records with both a usable original booking timestamp and a
                labeled trip type. The wedding sample is smaller than the other categories, so use it as directional
                planning evidence rather than a guarantee of availability.
              </p>
            </div>
          </section>

          <section aria-labelledby="vehicle-size" className="py-14 sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 id="vehicle-size" className="text-3xl font-bold tracking-tight sm:text-4xl">
                What vehicle sizes do groups use?
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700 dark:text-neutral-300">
                Actual party sizes show why passenger capacity alone is not enough. Luggage, coolers, mobility
                needs, and the experience your group wants can all require a larger vehicle.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {insights.observedGroupSizes.map((row) => (
                  <div key={row.vehicle} className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700">
                    <h3 className="text-xl font-bold">{row.vehicle}</h3>
                    <p className="mt-3 text-4xl font-extrabold text-lrp-green-dark dark:text-lrp-green">
                      {row.medianPassengers}
                    </p>
                    <p className="mt-1 font-semibold">median recorded party size</p>
                    <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                      75% of recorded groups had {row.seventyFifthPercentile} passengers or fewer ·{' '}
                      {formatInsightNumber(row.records)} completed records
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl bg-lrp-green/10 p-6">
                <p className="font-bold">Capacity is not a packing recommendation.</p>
                <p className="mt-2 leading-7 text-neutral-700 dark:text-neutral-300">
                  Tell us your passenger count and luggage before booking. A vehicle&apos;s legal seating capacity may
                  not leave the space your group needs for airport bags, golf clubs, wedding attire, or accessibility
                  equipment. See the <Link href="/fleet" className="font-bold text-lrp-green-dark underline dark:text-lrp-green">current fleet</Link>{' '}
                  or ask us to size it with you.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="airport-patterns" className="bg-neutral-50 py-14 dark:bg-dark-bg-secondary sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-start gap-4">
                <Plane className="mt-1 size-9 shrink-0 text-lrp-green" aria-hidden="true" />
                <div>
                  <h2 id="airport-patterns" className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Which airports appear in Lake trips?
                  </h2>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700 dark:text-neutral-300">
                    Springfield-Branson, Lee C. Fine, and Columbia Regional were the most frequently referenced
                    airport endpoints in the completed records we analyzed.
                  </p>
                </div>
              </div>
              <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-dark-bg-primary">
                <table className="w-full min-w-[560px] text-left">
                  <caption className="sr-only">Completed trip legs referencing each airport</caption>
                  <thead className="bg-neutral-100 text-sm uppercase tracking-wide text-neutral-700 dark:bg-dark-bg-tertiary dark:text-neutral-300">
                    <tr>
                      <th scope="col" className="px-5 py-4">Airport</th>
                      <th scope="col" className="px-5 py-4">Completed trip legs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {insights.airportTripLegs.map((row) => (
                      <tr key={row.airport}>
                        <th scope="row" className="px-5 py-4 font-bold">{row.airport}</th>
                        <td className="px-5 py-4">{formatInsightNumber(row.completedTripLegs)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-6">
                <Link href="/lake-ozarks-airport-transportation" className="font-bold text-lrp-green-dark underline dark:text-lrp-green">
                  Compare Lake of the Ozarks airport transportation options
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="takeaways" className="py-14 sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 id="takeaways" className="text-3xl font-bold tracking-tight sm:text-4xl">
                What should a Lake traveler do with this data?
              </h2>
              <ol className="mt-8 grid gap-5 md:grid-cols-2">
                <Takeaway number="1" title="Reserve summer weekends first">
                  May through August and Fridays and Saturdays carry the most concentrated demand in the two full
                  years analyzed.
                </Takeaway>
                <Takeaway number="2" title="Use trip type to set your deadline">
                  A nightlife ride and a wedding shuttle do not share the same planning window. Weddings and large
                  destination groups should start months—not days—ahead.
                </Takeaway>
                <Takeaway number="3" title="Size for belongings, not just bodies">
                  Give us the real count for checked bags, golf clubs, coolers, mobility equipment, and child seats
                  before selecting a vehicle.
                </Takeaway>
                <Takeaway number="4" title="Share the exact pickup constraints">
                  Lake roads, steep drives, gates, narrow turnarounds, docks, and venue loading rules can change the
                  best vehicle and pickup plan.
                </Takeaway>
              </ol>
            </div>
          </section>

          <section aria-labelledby="local-proof" className="bg-neutral-50 py-14 dark:bg-dark-bg-secondary sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 id="local-proof" className="text-3xl font-bold tracking-tight sm:text-4xl">
                Local experience behind the numbers
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700 dark:text-neutral-300">
                Trip data shows the pattern. Reviews from local professionals show what execution looks like on the
                ground—from amphitheater traffic and office events to repeat transportation around the Lake.
              </p>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {localAuthorityReviews.map((review) => (
                  <figure key={review.name} className="rounded-2xl border border-neutral-200 bg-white p-6 text-lrp-black">
                    <Quote className="size-7 text-lrp-green" aria-hidden="true" />
                    <blockquote className="mt-4 text-lg leading-8 text-lrp-black">
                      “{review.quote}”
                    </blockquote>
                    <figcaption className="mt-5 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                      <p className="font-bold">{review.name}</p>
                      <p className="text-sm text-lrp-text-secondary">
                        {review.title} · {review.company}
                      </p>
                      <a
                        href={review.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-bold text-lrp-black underline"
                      >
                        Read the Google review<span className="sr-only"> from {review.name} (opens in a new tab)</span>
                      </a>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="operational-stories" className="py-14 sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 id="operational-stories" className="text-3xl font-bold tracking-tight sm:text-4xl">
                Five real-world planning lessons from customer reviews
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700 dark:text-neutral-300">
                These customer-reported examples show why Lake transportation depends on more than mileage and
                passenger count. Each one points to a practical question worth answering before dispatch day.
              </p>
              <div className="mt-8 space-y-5">
                {operationalReviewStories.map((story) => (
                  <article key={story.title} className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700 sm:p-8">
                    <p className="text-sm font-bold uppercase tracking-wide text-lrp-green-dark dark:text-lrp-green">
                      Customer-reported example · {story.reviewer}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">{story.title}</h3>
                    <p className="mt-4 leading-7 text-neutral-700 dark:text-neutral-300">{story.summary}</p>
                    <p className="mt-4 rounded-xl bg-neutral-100 p-4 font-semibold leading-7 dark:bg-dark-bg-tertiary">
                      Planning takeaway: {story.lesson}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold">
                      <a
                        href={story.reviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lrp-green-dark underline dark:text-lrp-green"
                      >
                        Read the Google review<span className="sr-only"> from {story.reviewer} (opens in a new tab)</span>
                      </a>
                      {story.secondaryReviewUrl && (
                        <a
                          href={story.secondaryReviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lrp-green-dark underline dark:text-lrp-green"
                        >
                          Read the second Google review<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                      <Link href={story.relatedHref} className="text-lrp-green-dark underline dark:text-lrp-green">
                        {story.relatedLabel}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="methodology" className="bg-neutral-950 py-14 text-white sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-start gap-4">
                <ShieldCheck className="mt-1 size-9 shrink-0 text-lrp-green" aria-hidden="true" />
                <div>
                  <h2 id="methodology" className="text-3xl font-bold tracking-tight">Methodology and privacy</h2>
                  <div className="mt-5 space-y-4 leading-7 text-white/85">
                    <p>
                      We analyzed {formatInsightNumber(insights.completedTripLegs)} completed trip-leg records across{' '}
                      {formatInsightNumber(insights.distinctReservations)} reservations from{' '}
                      <time dateTime={insights.periodStart}>January 19, 2024</time> through{' '}
                      <time dateTime={insights.periodEnd}>September 2, 2026</time>. A trip leg is one scheduled
                      pickup-to-drop-off segment; a round trip commonly produces two legs.
                    </p>
                    <p>
                      Seasonal and day-of-week percentages use the two complete calendar years, 2024 and 2025, so a
                      partial 2026 does not distort the comparison. Distance calculations use{' '}
                      {formatInsightNumber(insights.recordsWithDistance)} valid recorded distances, and group-size
                      calculations use {formatInsightNumber(insights.recordsWithPassengerCounts)} valid passenger counts.
                    </p>
                    <p>
                      Results are aggregated and anonymized. No passenger names, contact information, private
                      addresses, prices, driver notes, or individual itineraries are included. This operational
                      dataset does not contain every ride in company history and should not be treated as a public
                      download or a guarantee of future availability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-lrp-green py-14 text-center sm:py-16" aria-labelledby="insights-cta">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 id="insights-cta" className="text-3xl font-extrabold text-neutral-950 sm:text-4xl">
                Turn the data into a transportation plan
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg !text-neutral-950">
                Share your date, stops, group size, and luggage. We&apos;ll recommend the right vehicle and timing.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/book" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-neutral-950 px-8 py-3 font-bold text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-lrp-green">
                  Request a Quote
                </Link>
                <PhoneLink className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-neutral-950 px-8 py-3 font-bold text-neutral-950 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-lrp-green">
                  Call or Text (573) 206-9499
                </PhoneLink>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  )
}

function InsightCard({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-6 shadow-sm dark:border-neutral-700 dark:bg-dark-bg-secondary">
      {icon}
      <p className="mt-5 text-3xl font-extrabold">{value}</p>
      <p className="mt-2 leading-6 text-neutral-600 dark:text-neutral-300">{label}</p>
    </div>
  )
}

function Takeaway({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <li className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lrp-green font-extrabold text-neutral-950" aria-hidden="true">
          {number}
        </span>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="mt-4 leading-7 text-neutral-700 dark:text-neutral-300">{children}</p>
    </li>
  )
}

function planningTarget(tripType: string) {
  switch (tripType) {
    case 'Wedding':
      return 'Start 3–6 months ahead'
    case 'Bachelor / bachelorette':
      return 'Start at least 1 month ahead'
    case 'Airport':
      return 'Book at least 1 week ahead when possible'
    default:
      return 'Book several days ahead; earlier for peak dates'
  }
}
