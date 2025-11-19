'use client';

import { ShieldCheck, MapPin, Award } from 'lucide-react';

interface Reason {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
}

const reasons: Reason[] = [
  {
    title: "We Don't Cancel",
    description: "Booked a ride? Your vehicle is reserved. No driver no-shows. No last-minute cancellations. We show up or we don't charge.",
    icon: <ShieldCheck className="w-8 h-8" />,
    accentColor: 'from-green-500 to-emerald-600',
  },
  {
    title: 'We Know The Lake',
    description: "Our drivers live here. They know which marinas flood in spring, which venues have tight turnarounds, and which shortcuts save 15 minutes.",
    icon: <MapPin className="w-8 h-8" />,
    accentColor: 'from-blue-500 to-cyan-600',
  },
  {
    title: "We're Actually Licensed",
    description: "Full commercial insurance. DOT-compliant drivers. Background checks. Not your buddy with a van—a real transportation company.",
    icon: <Award className="w-8 h-8" />,
    accentColor: 'from-amber-500 to-orange-600',
  },
];

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="py-16 bg-white dark:bg-dark-bg-primary transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="why-choose-us-heading"
            className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
          >
            Why Lake Ride Pros?
          </h2>
          <p className="text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            We're not Uber. We're not a national chain. We're Lake Ozarks locals who've built our reputation one ride at a time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card */}
              <div className="relative h-full bg-neutral-50 dark:bg-dark-bg-secondary p-8 rounded-2xl transition-all duration-500 hover:shadow-xl overflow-hidden">
                {/* Gradient accent on hover */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${reason.accentColor} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />

                {/* Icon with floating effect */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.accentColor} text-white shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
                    {reason.icon}
                  </div>

                  {/* Decorative dots */}
                  <div className="absolute -top-2 -right-8 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-current text-primary" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-xl mb-3 text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                  {reason.title}
                </h3>
                <p className="text-lrp-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {reason.description}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-neutral-200 dark:bg-neutral-700">
                  <div className={`h-full bg-gradient-to-r ${reason.accentColor} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
