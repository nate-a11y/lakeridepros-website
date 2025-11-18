'use client'

/**
 * Progress Bar Component
 * Shows completion percentage across all steps
 */

import React from 'react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5 overflow-hidden transition-colors">
      <div
        className="bg-primary h-2.5 transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Application progress: ${percentage}% complete`}
      >
        <span className="sr-only">{percentage}% Complete</span>
      </div>
    </div>
  )
}
