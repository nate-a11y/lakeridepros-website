import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const serviceAreas = [
  ['Osage Beach', 'Tan-Tar-A Resort, Margaritaville, Bagnell Dam Strip, and lakefront venues', '/transportation-osage-beach'],
  ['Camdenton', 'Old Kinderhook, local wineries, wedding venues, and special events', '/transportation-camdenton'],
  ['Lake Ozark', 'Lodge of Four Seasons, lakefront properties, restaurants, and event venues', '/transportation-lake-ozark'],
  ['Statewide', 'Columbia, Jefferson City, Kansas City, St. Louis, and destinations beyond the Lake', '/services'],
]

export default function ServiceAreasMap() {
  return (
    <section aria-labelledby="service-areas-heading" className="bg-[#0a0a0a] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-t border-white/25 pt-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="mb-4 font-semibold text-[#7bea45]">Home base: Lake of the Ozarks</p>
            <h2
              id="service-areas-heading"
              className="max-w-4xl font-celebri text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl"
            >
              Local knowledge. Missouri reach.
            </h2>
          </div>
          <p className="max-w-lg leading-relaxed text-white/68 lg:col-span-4">
            Based at Lake of the Ozarks, we provide professional transportation throughout Missouri
            with deep familiarity across the Lake&apos;s roads, resorts, venues, and airports.
          </p>
        </div>

        <ol className="mt-14 border-t border-white/25">
          {serviceAreas.map(([name, description, href], index) => (
            <li key={name} className="border-b border-white/25">
              <Link
                href={href}
                className="group grid gap-3 py-7 sm:grid-cols-[4rem_1fr_1.4fr_auto] sm:items-center"
                style={{ display: 'grid' }}
              >
                <span className="text-sm text-[#7bea45]">0{index + 1}</span>
                <h3 className="text-2xl font-black tracking-[-0.025em] sm:text-3xl">{name}</h3>
                <p className="max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">{description}</p>
                <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
