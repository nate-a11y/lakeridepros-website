"use client";

import AnimatedCounter from "./ui/AnimatedCounter";
import ScrollReveal from "./ui/ScrollReveal";

const stats = [
  { target: 5, suffix: "+", label: "Years of Service", prefix: "" },
  { target: 10000, suffix: "+", label: "Rides Completed", prefix: "" },
  { target: 250, suffix: "+", label: "5-Star Reviews", prefix: "" },
  { target: 10, suffix: "+", label: "Luxury Vehicles", prefix: "" },
];

export default function StatsBar() {
  return (
    <section
      aria-label="Company statistics"
      className="py-12 bg-neutral-900 dark:bg-dark-bg-secondary border-y border-neutral-800 dark:border-dark-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedCounter
                key={stat.label}
                target={stat.target}
                suffix={stat.suffix}
                prefix={stat.prefix}
                label={stat.label}
                duration={2 + index * 0.3}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
