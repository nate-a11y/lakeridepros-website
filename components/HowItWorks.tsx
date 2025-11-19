'use client';

import { Calendar, CheckCircle, Clock, Smile } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Book Online or Call',
    description: 'Reserve in 60 seconds online or call (573) 206-9499 for custom quotes',
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    number: 2,
    title: 'We Confirm & Prepare',
    description: 'Receive instant confirmation. Your vehicle is detailed and driver assigned.',
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    number: 3,
    title: 'Driver Arrives Early',
    description: 'Your driver shows up 15 minutes early—professional, courteous, ready.',
    icon: <Clock className="w-6 h-6" />,
  },
  {
    number: 4,
    title: 'Sit Back & Relax',
    description: 'Enjoy luxury transportation while we handle everything else.',
    icon: <Smile className="w-6 h-6" />,
  },
];

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
          >
            How Lake Ride Pros Works
          </h2>
          <p className="text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Book professional transportation in four simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-primary to-primary" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step Card */}
                <div className="text-center">
                  {/* Icon Circle */}
                  <div className="relative inline-flex mb-6">
                    {/* Animated ring */}
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-0 group-hover:opacity-75" style={{ animationDuration: '2s' }} />

                    {/* Main circle */}
                    <div className="relative w-20 h-20 bg-white dark:bg-dark-bg-tertiary rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border-4 border-primary">
                      <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                        {step.icon}
                      </div>
                    </div>

                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector - Mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <svg
                      className="w-6 h-6 text-primary animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
