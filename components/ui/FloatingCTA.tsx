"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export default function FloatingCTA() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  // Fade in after scrolling past the hero
  const opacity = useTransform(scrollYProgress, [0.05, 0.1], [0, 1]);
  const y = useTransform(scrollYProgress, [0.05, 0.1], [20, 0]);

  return (
    <motion.div
      style={shouldReduceMotion ? undefined : { opacity, y }}
      className="fixed bottom-6 right-6 z-[1000] hidden sm:block"
    >
      <motion.a
        href="https://customer.moovs.app/lake-ride-pros/new/info?moovs_source=widget"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-lrp-black font-bold rounded-full shadow-lg hover:shadow-xl transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        Get a Quote
      </motion.a>
    </motion.div>
  );
}
