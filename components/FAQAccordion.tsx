'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { homeFaqs } from '@/lib/homeFaqs'

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section aria-labelledby="faq-accordion-heading" className="bg-lrp-black py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(16rem,0.72fr)_1.28fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 font-semibold text-primary-dark">Answers before you book</p>
          <h2
            id="faq-accordion-heading"
            className="text-balance font-celebri text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl"
          >
            Ask us anything. Start here.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-white/65">
            Straight answers about service areas, timing, vehicles, airports, weddings, and safety.
            If your trip is unusual, our local team will help plan it.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex min-h-12 items-center border-b-2 border-primary pb-1 font-bold text-white hover:text-primary-light focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-light"
          >
            Ask a different question
          </Link>
        </div>

        <div className="border-t border-white/25">
          {homeFaqs.map((item, index) => {
            const itemKey = item.question
              .slice(0, 50)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
            const isOpen = openIndex === index

            return (
              <article key={item.question} className="border-b border-white/25">
                <h3>
                  <button
                    id={`faq-question-${itemKey}`}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-primary-light"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${itemKey}`}
                  >
                    <span className="text-lg font-black sm:text-xl">{item.question}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 motion-safe:transition-transform ${isOpen ? 'rotate-180 text-primary-light' : 'text-white/45'}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-answer-${itemKey}`}
                  role="region"
                  aria-labelledby={`faq-question-${itemKey}`}
                  hidden={!isOpen}
                  className="max-w-3xl pb-7 pr-10 leading-relaxed text-white/68"
                >
                  <p>{item.answer}</p>
                  {item.link && (
                    <Link
                      href={item.link.href}
                      className="mt-3 inline-block font-bold text-primary-light underline decoration-primary/50 underline-offset-4 hover:decoration-primary-light"
                    >
                      {item.link.label}
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
