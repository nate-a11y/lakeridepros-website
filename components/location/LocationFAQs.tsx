import type { ReactNode } from 'react'
import LocationSection from '@/components/location/LocationSection'

export interface LocationFAQ {
  question: string
  /** Plain-text source of truth, also used in optional FAQPage JSON-LD. */
  answer: string
  /** Use only to add markup/links to the same answer, not to change its meaning. */
  displayAnswer?: ReactNode
}

export interface LocationFAQsProps {
  title: string
  items: readonly LocationFAQ[]
  id?: string
  /** Off by default: existing routes already emit FAQPage schema. Never emit both. */
  includeSchema?: boolean
  tone?: 'white' | 'gray'
}

export function buildLocationFAQSchema(items: readonly LocationFAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

/** Native details preserve server HTML, keyboard operation and zero accordion JS. */
export default function LocationFAQs({
  title,
  items,
  id = 'location-faq',
  includeSchema = false,
  tone = 'gray',
}: LocationFAQsProps) {
  if (items.length === 0) return null
  return (
    <>
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildLocationFAQSchema(items)).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <LocationSection id={id} title={title} tone={tone}>
        <div className="border-t-2 border-lrp-black">
          {items.map((item) => (
            <details key={item.question} className="border-b border-lrp-black/25">
              <summary className="cursor-pointer py-6 pr-3 font-celebri text-lg leading-relaxed hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrp-black">
                {item.question}
              </summary>
              <div className="max-w-3xl space-y-4 pb-6 leading-relaxed">
                {item.displayAnswer ?? <p>{item.answer}</p>}
              </div>
            </details>
          ))}
        </div>
      </LocationSection>
    </>
  )
}
