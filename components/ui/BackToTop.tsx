"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function BackToTop() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const opacity = useTransform(scrollYProgress, [0.15, 0.2], [0, 1]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.button
      onClick={scrollToTop}
      style={{ opacity }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary-light hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-lg"
      aria-label="Back to top"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </motion.button>
  );
}
