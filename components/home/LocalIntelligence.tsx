import Image from 'next/image'
import Link from 'next/link'
import { getMediaUrl } from '@/lib/api/sanity'
import { resolveSlug, type BlogPost } from '@/types/sanity'

interface LocalIntelligenceProps {
  /** Published Sanity posts, in the order they should be featured. */
  posts: readonly BlogPost[]
}

const localAreas = [
  {
    name: 'Osage Beach',
    href: '/transportation-osage-beach',
    description: 'Margaritaville Lake Resort, hotels and waterfront venues.',
  },
  {
    name: 'Lake Ozark',
    href: '/transportation-lake-ozark',
    description: 'Lodge of Four Seasons, restaurants and lakefront stays.',
  },
  {
    name: 'Camdenton',
    href: '/transportation-camdenton',
    description: 'Old Kinderhook, wedding venues and local wineries.',
  },
] as const

const textLink =
  'underline decoration-primary decoration-2 underline-offset-4 hover:decoration-lrp-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrp-black'

/** Local coverage remains useful and crawlable even when the journal is unavailable. */
export default function LocalIntelligence({ posts }: LocalIntelligenceProps) {
  const seenSlugs = new Set<string>()
  const articles = posts.flatMap((post) => {
    const slug = post.slug ? resolveSlug(post.slug).trim() : ''
    if (!slug || !post.title?.trim() || post.published === false || seenSlugs.has(slug)) {
      return []
    }

    seenSlugs.add(slug)
    return [{ post, href: `/blog/${encodeURIComponent(slug)}`, image: getMediaUrl(post.featuredImage) }]
  })

  // Use real editorial photography, never an empty image frame or unrelated fallback.
  const lead = articles.find((article) => article.image) ?? articles[0]
  const furtherReading = articles.filter((article) => article !== lead).slice(0, 3)

  return (
    <section
      aria-labelledby="local-intelligence-heading"
      className="bg-white py-16 text-lrp-black sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl sm:mb-12">
          <h2
            id="local-intelligence-heading"
            className="font-celebri text-4xl leading-[1.1] tracking-[-0.035em] sm:text-5xl"
          >
            More Lake. Less figuring it out.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
            Wedding weekends, airport arrivals, a night out with friends. Plan your
            time at Lake of the Ozarks with people who drive it every day.
          </p>
        </header>

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            {lead ? (
              <article>
                <Link
                  href={lead.href}
                  className="group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrp-black"
                  style={{ display: 'block' }}
                >
                  {lead.image && (
                    <div className="relative mb-6 aspect-[16/10] overflow-hidden bg-lrp-gray-light">
                      <Image
                        src={lead.image}
                        alt={lead.post.featuredImage?.alt || ''}
                        fill
                        quality={65}
                        sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="max-w-2xl font-celebri text-2xl leading-tight tracking-[-0.02em] decoration-primary decoration-2 underline-offset-4 group-hover:underline sm:text-3xl">
                    {lead.post.title}
                  </h3>
                </Link>
                {lead.post.excerpt && (
                  <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-relaxed sm:text-base">
                    {lead.post.excerpt}
                  </p>
                )}
              </article>
            ) : (
              <div className="max-w-xl">
                <h3 className="font-celebri text-2xl">Start with the trip you have in mind.</h3>
                <p className="mt-4 leading-relaxed">
                  From resort guest shuttles to wedding transportation and private
                  group rides, explore ways to get around the Lake together.
                </p>
                <Link href="/services" className={`mt-4 font-semibold ${textLink}`}>
                  Explore transportation services
                </Link>
              </div>
            )}

            {furtherReading.length > 0 && (
              <nav aria-label="More Lake of the Ozarks planning guides" className="mt-8">
                <ul className="space-y-1">
                  {furtherReading.map(({ post, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`py-2 text-base font-semibold leading-snug ${textLink}`}
                        style={{ display: 'inline-flex', justifyContent: 'flex-start' }}
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <Link href="/blog" className={`mt-5 text-sm font-semibold ${textLink}`}>
              Browse all Lake guides
            </Link>
          </div>

          <aside className="border-t-4 border-primary pt-6 lg:pt-7" aria-labelledby="local-coverage-heading">
            <h3 id="local-coverage-heading" className="font-celebri text-3xl tracking-[-0.025em]">
              Where we drive
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed">
              Based at Lake of the Ozarks, Lake Ride Pros provides private rides,
              wedding transportation and group shuttles across the Lake and throughout Missouri.
            </p>

            <nav aria-label="Lake Ride Pros service areas" className="mt-5">
              <ul className="space-y-3">
                {localAreas.map((area) => (
                  <li key={area.href}>
                    <Link href={area.href} className={`font-celebri text-xl ${textLink}`}>
                      {area.name}
                    </Link>
                    <p className="max-w-sm text-sm leading-relaxed">{area.description}</p>
                  </li>
                ))}
                <li>
                  <div className="flex flex-wrap gap-x-5">
                    <Link href="/transportation-sunrise-beach" className={`font-celebri text-xl ${textLink}`}>
                      Sunrise Beach
                    </Link>
                    <Link href="/transportation-laurie" className={`font-celebri text-xl ${textLink}`}>
                      Laurie
                    </Link>
                  </div>
                  <p className="text-sm leading-relaxed">Private rides on the west side of the Lake.</p>
                </li>
              </ul>
            </nav>

            <div className="mt-6 border-t border-lrp-gray-light pt-4">
              <Link href="/lake-ozarks-airport-transportation" className={`font-celebri text-xl ${textLink}`}>
                Airport transfers &amp; beyond
              </Link>
              <p className="mt-1 max-w-sm text-sm leading-relaxed">
                Kansas City, St. Louis, Springfield and Columbia airport transfers,
                plus trips to Jefferson City and destinations across Missouri.
              </p>
              <Link href="/services" className={`mt-3 text-sm font-semibold ${textLink}`}>
                See all transportation services
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
