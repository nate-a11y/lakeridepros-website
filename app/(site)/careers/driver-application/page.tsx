'use client'

/**
 * Driver Employment Application Form
 * Multi-step form complying with 49 CFR 391.21 federal regulations
 * Features: Auto-save, progress tracking, signature capture, document upload
 */

import React from 'react'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Driver Employment Application
          </h1>
          <p className="text-gray-600">
            Complies with 49 CFR 391.21 Federal Regulations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} totalSteps={11} />
        </div>

        {/* Auto-save Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Saving draft...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Auto-save enabled</span>
                </>
              )}
            </div>

            <button
              onClick={saveNow}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save & Continue Later
            </button>
          </div>

          {saveError && (
            <div className="mt-2 text-sm text-red-600">
              Error saving: {saveError}
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 mt-8">
          {renderStep()}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your application is automatically saved every 30 seconds.
            You can safely close this page and resume later.
          </p>
          <p className="mt-2">
            Questions? Contact us at{' '}
            <a href="mailto:owners@lakeridepros.com" className="text-blue-600 hover:text-blue-700">
              owners@lakeridepros.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function DriverApplicationPage() {
  return (
    <ApplicationProvider>
      <DriverApplicationForm />
    </ApplicationProvider>
  )
}
