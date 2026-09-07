import Link from 'next/link'
import type { ReactNode } from 'react'

export interface LocationEditorialItem {
  title: string
  description: ReactNode
  /** Only the heading is linked: descriptions can retain their own internal links. */
  href?: string
}

/** Open, divided editorial rows for landmarks, services, operating proof or routes. */
export default function LocationEditorialList({
  items,
  layout = 'rows',
}: {
  items: readonly LocationEditorialItem[]
  layout?: 'rows' | 'facts'
}) {
  if (layout === 'facts' && items.every((item) => !item.href))
    return (
      <ul className="grid gap-x-10 border-t-2 border-current sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="border-b border-current/25 py-6 sm:py-8">
            <h3 className="font-celebri text-3xl leading-tight sm:text-4xl">{item.title}</h3>
            <div className="mt-3 space-y-3 leading-relaxed">{item.description}</div>
          </li>
        ))}
      </ul>
    )
  return (
    <ul className="border-t-2 border-current">
      {items.map((item) => (
        <li key={item.title} className="grid gap-3 border-b border-current/25 py-6 sm:grid-cols-12 sm:gap-8">
          <h3 className="font-celebri text-xl leading-snug sm:col-span-4">
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center gap-3 underline decoration-primary decoration-2 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              >
                {item.title}
                <span aria-hidden="true">↗</span>
              </Link>
            ) : (
              item.title
            )}
          </h3>
          <div className="max-w-3xl space-y-3 leading-relaxed sm:col-span-8">{item.description}</div>
        </li>
      ))}
    </ul>
  )
}
