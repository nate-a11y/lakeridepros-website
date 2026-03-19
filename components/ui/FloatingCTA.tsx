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
  const opacity = useTransform(
    scrollYProgress,
    [0.12, 0.15, 0.55, 0.58],
    [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [0.12, 0.15], [20, 0]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{ opacity, y }}
      className="fixed bottom-6 right-6 z-50 hidden sm:block"
    >
      <motion.a
        href="/book"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
        Book Your Ride
      </motion.a>
    </motion.div>
  );
}
