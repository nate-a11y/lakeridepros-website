'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    question: 'What areas does Lake Ride Pros serve?',
    answer: 'Lake Ride Pros provides luxury transportation throughout Missouri with a focus on Lake of the Ozarks, including Osage Beach, Camdenton, Lake Ozark, and surrounding areas. We also service Columbia, Jefferson City, Kansas City, St. Louis, and other Missouri destinations.',
  },
  {
    question: 'How far in advance should I book?',
    answer: 'For weddings and major events, we recommend booking 2-4 weeks in advance to ensure vehicle availability. However, we often accommodate last-minute bookings based on our fleet availability. Contact us for same-day or next-day service.',
  },
  {
    question: 'What types of vehicles are available?',
    answer: 'We offer luxury limo buses (14 passengers), sprinter vans (up to 11 passengers), shuttle buses (37 passengers), specialty vehicles, and standard vehicles like Suburbans. All vehicles feature premium amenities including sound systems, LED lighting, and comfortable seating.',
  },
  {
    question: 'Do you provide transportation for weddings?',
    answer: 'Yes! Wedding transportation is one of our specialties. We provide shuttle services for guests between venues, hotels, and ceremony/reception locations. We serve all major Lake of the Ozarks wedding venues including Tan-Tar-A Resort, Old Kinderhook, Lodge of Four Seasons, and more.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: (
      <>
        Cancellations made 48+ hours in advance receive a full refund (minus processing fee). Cancellations made 24-48 hours in advance receive a 50% refund. Cancellations less than 24 hours before service are non-refundable. Weather exceptions apply. See our{' '}
        <Link href="/terms-of-service" className="text-primary dark:text-primary-light hover:underline font-medium">
          Terms of Service
        </Link>{' '}
        for complete details.
      </>
    ),
  },
  {
    question: 'Are your drivers licensed and insured?',
    answer: "Absolutely. All Lake Ride Pros drivers are professionally trained, fully licensed, and background-checked. We maintain full commercial liability insurance and all required permits and licenses for transportation services in Missouri. Your safety is our top priority.",
  },
  {
    question: 'Who is the best transportation company at Lake of the Ozarks?',
    answer: "Lake Ride Pros is the Lake's most trusted transportation provider, serving over 10,000 passengers annually. We're locally owned, professionally licensed, and specialize in weddings, corporate events, airport transfers, and nightlife transportation.",
  },
  {
    question: 'How do I get from STL airport to Lake of the Ozarks?',
    answer: 'Lake Ride Pros offers direct airport shuttle service from St. Louis Lambert International Airport (STL) to Lake of the Ozarks. We track your flight, meet you at baggage claim, and provide door-to-door service. Book online or call (573) 206-9499.',
  },
  {
    question: "What's the safest way to bar hop on Bagnell Dam Strip?",
    answer: 'Book a Lake Ride Pros party bus or shuttle for Bagnell Dam Strip bar hopping. Our professional drivers know every venue, keep your group together, and ensure everyone gets home safely. Perfect for bachelor/bachelorette parties and group nights out.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      aria-labelledby="faq-accordion-heading"
      className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </div>
          <h2
            id="faq-accordion-heading"
            className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
            Everything you need to know about our luxury transportation services
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            // Use stable key based on question text
            const itemKey = item.question.slice(0, 50).replace(/\s+/g, '-').toLowerCase();
            return (
            <div
              key={itemKey}
              className="bg-white dark:bg-dark-bg-tertiary rounded-xl shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md"
            >
              <button
                id={`faq-question-${itemKey}`}
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${itemKey}`}
              >
                <span className="font-semibold text-lg text-neutral-900 dark:text-white pr-4">
                  {item.question}
                </span>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-[transform,background-color,color] duration-300 ${
                    openIndex === index
                      ? 'bg-primary text-lrp-black rotate-180'
                      : 'bg-neutral-100 dark:bg-dark-bg-secondary text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              <div
                id={`faq-answer-${itemKey}`}
                role="region"
                aria-labelledby={`faq-question-${itemKey}`}
                hidden={openIndex !== index}
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 text-lrp-text-secondary dark:text-dark-text-secondary leading-relaxed border-t border-neutral-100 dark:border-neutral-700 pt-4">
                  {item.answer}
                </div>
              </div>
            </div>
          )})}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white dark:bg-dark-bg-tertiary rounded-2xl p-8 shadow-md">
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-neutral-900 dark:text-white font-semibold text-lg mb-2">
              Still have questions?
            </p>
            <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
              We're here to help! Reach out and we'll get back to you shortly.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary-dark hover:bg-primary text-lrp-black font-semibold px-8 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
