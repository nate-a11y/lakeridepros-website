'use client'

/**
 * Driver Employment Application Form
 * Multi-step form complying with 49 CFR 391.21 federal regulations
 * Features: Auto-save, progress tracking, signature capture, document upload
 */

import React, { Suspense } from 'react'
import { ApplicationProvider, useApplication } from './context/ApplicationContext'
import StepIndicator from './components/StepIndicator'
import ProgressBar from './components/ProgressBar'
import Step1Personal from './steps/Step1Personal'
import Step2ResidenceHistory from './steps/Step2ResidenceHistory'
import Step3LicenseVerification from './steps/Step3LicenseVerification'
import Step4LicenseHistory from './steps/Step4LicenseHistory'
import Step5DrivingExperience from './steps/Step5DrivingExperience'
import Step6Accidents from './steps/Step6Accidents'
import Step7Convictions from './steps/Step7Convictions'
import Step8Employment from './steps/Step8Employment'
import Step9Education from './steps/Step9Education'
import Step10Documents from './steps/Step10Documents'
import Step11ReviewSign from './steps/Step11ReviewSign'
import { Save, Clock } from 'lucide-react'

function DriverApplicationForm() {
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    saveNow,
    isSaving,
    lastSaved,
    saveError,
    isLoading
  } = useApplication()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors flex items-center justify-center">
        <div className="text-center">
          <h1 className="sr-only">Driver Employment Application</h1>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" aria-label="Loading"></div>
          <p className="text-lrp-text-secondary dark:text-dark-text-secondary">Loading application...</p>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Personal onNext={goToNextStep} />
      case 2:
        return <Step2ResidenceHistory onNext={goToNextStep} onPrevious={goToPreviousStep} />
      case 3:
        return <Step3LicenseVerification onNext={goToNextStep} onPrevious={goToPreviousStep} />
      case 4:
        return <Step4LicenseHistory onNext={goToNextStep} onPrevious={goToPreviousStep} />
      case 5:
        return <Step5DrivingExperience onNext={goToNextStep} onPrevious={goToPreviousStep} />
      case 6:
        return <Step6Accidents onNext={goToNextStep} onPrevious={goToPreviousStep} />
      case 7:
        return <Step7Convictions onNext={goToNextStep} onPrevious={goToPreviousStep} />
      case 8:
        return <Step8Employment onNext={goToNextStep} onPrevious={goToPreviousStep} />
      case 9:
        return <Step9Education onNext={goToNextStep} onPrevious={goToPreviousStep} />
      case 10:
        return <Step10Documents onNext={goToNextStep} onPrevious={goToPreviousStep} />
      case 11:
        return <Step11ReviewSign onPrevious={goToPreviousStep} />
      default:
        return <Step1Personal onNext={goToNextStep} />
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8" role="banner">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Driver Employment Application
          </h1>
          <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
            Complies with 49 CFR 391.21 Federal Regulations
          </p>
        </header>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} totalSteps={11} />
        </div>

        {/* Auto-save Status */}
        <div className="bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border rounded-lg p-4 mb-6 transition-colors" role="status" aria-live="polite">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" aria-label="Saving"></div>
                  <span className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">Saving draft...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Clock className="w-5 h-5 text-primary dark:text-primary" aria-hidden="true" />
                  <span className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                  <span className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">Auto-save enabled</span>
                </>
              )}
            </div>

            <button
              onClick={saveNow}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Save application and continue later"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              Save & Continue Later
            </button>
          </div>

          {saveError && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
              Error saving: {saveError}
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        <main className="bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border rounded-lg p-6 sm:p-8 mt-8 transition-colors" role="main">
          {renderStep()}
        </main>

        {/* Footer Info */}
        <footer className="mt-8 text-center text-sm text-lrp-text-secondary dark:text-dark-text-secondary" role="contentinfo">
          <p>
            Your application is automatically saved every 30 seconds.
            You can safely close this page and resume later.
          </p>
          <p className="mt-2">
            Questions? Contact us at{' '}
            <a href="mailto:owners@lakeridepros.com" className="text-primary hover:text-primary-dark underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
              owners@lakeridepros.com
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default function DriverApplicationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors flex items-center justify-center">
        <div className="text-center">
          <h1 className="sr-only">Driver Employment Application</h1>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" aria-label="Loading"></div>
          <p className="text-lrp-text-secondary dark:text-dark-text-secondary">Loading application...</p>
        </div>
      </div>
    }>
      <ApplicationProvider>
        <DriverApplicationForm />
      </ApplicationProvider>
    </Suspense>
  )
}
