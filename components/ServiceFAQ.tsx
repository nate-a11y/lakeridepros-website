'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '@/lib/serviceFAQs';

interface ServiceFAQProps {
  faqs: FAQ[];
}

export default function ServiceFAQ({ faqs }: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-neutral-200 dark:border-dark-border rounded-lg overflow-hidden bg-white dark:bg-dark-bg-secondary transition-all"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary transition-colors"
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white pr-4">
              {faq.question}
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-primary dark:text-primary-light flex-shrink-0 transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div
              id={`faq-answer-${index}`}
              className="px-6 pb-6 text-lrp-text-secondary dark:text-dark-text-secondary leading-relaxed"
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
