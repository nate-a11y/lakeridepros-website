'use client'

/**
 * Step Indicator Component
 * Shows current step and allows navigation between completed steps
 */

import React from 'react'
import { Check } from 'lucide-react'

interface Step {
  number: number
  title: string
  description: string
}

const steps: Step[] = [
  { number: 1, title: 'Personal Info', description: 'Basic information' },
  { number: 2, title: 'Residence History', description: 'Past 3 years' },
  { number: 3, title: 'License Verification', description: 'Current license' },
  { number: 4, title: 'License History', description: 'All licenses' },
  { number: 5, title: 'Driving Experience', description: 'Experience details' },
  { number: 6, title: 'Accidents', description: 'Safety history' },
  { number: 7, title: 'Traffic Convictions', description: 'Violation history' },
  { number: 8, title: 'Employment History', description: 'Past 3-10 years' },
  { number: 9, title: 'Education', description: 'Qualifications' },
  { number: 10, title: 'Documents', description: 'Upload license' },
  { number: 11, title: 'Review & Sign', description: 'Final certification' }
]

interface StepIndicatorProps {
  currentStep: number
  onStepClick?: (step: number) => void
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Mobile view - current step only */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="text-lg font-semibold">{steps[currentStep - 1].title}</div>
        <div className="text-sm text-gray-600">{steps[currentStep - 1].description}</div>
      </div>

      {/* Desktop view - all steps */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center relative">
                <button
                  type="button"
                  onClick={() => onStepClick && step.number <= currentStep && onStepClick(step.number)}
                  disabled={step.number > currentStep || !onStepClick}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-200
                    ${
                      step.number < currentStep
                        ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                        : step.number === currentStep
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  aria-current={step.number === currentStep ? 'step' : undefined}
                  aria-label={`Step ${step.number}: ${step.title}`}
                >
                  {step.number < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </button>
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium ${
                    step.number === currentStep ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </div>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all duration-200 ${
                    step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                  style={{ marginTop: '-24px' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
