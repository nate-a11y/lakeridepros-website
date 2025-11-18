'use client'

/**
 * Application Context for Driver Application Form
 * Manages form state, auto-save, and navigation across steps
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { saveDraft, getApplicationById, type DriverApplicationData } from '@/lib/supabase/driver-application'
import { decodeResumeToken } from '@/lib/resume-link'
import { useSearchParams } from 'next/navigation'

interface ApplicationContextType {
  // Current step (1-11)
  currentStep: number
  setCurrentStep: (step: number) => void

  // Application data
  applicationData: Partial<DriverApplicationData>
  updateApplicationData: (data: Partial<DriverApplicationData>) => void

  // Application ID (from database)
  applicationId: string | null
  setApplicationId: (id: string | null) => void

  // Auto-save status
  isSaving: boolean
  lastSaved: Date | null
  saveError: string | null

  // Manual save function
  saveNow: () => Promise<void>

  // Navigation functions
  goToNextStep: () => void
  goToPreviousStep: () => void

  // Loading state
  isLoading: boolean
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined)

const STORAGE_KEY = 'driver-application-id'
const AUTO_SAVE_INTERVAL = 30000 // 30 seconds

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [applicationData, setApplicationData] = useState<Partial<DriverApplicationData>>({})
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)

  // Load application ID from localStorage or resume token on mount
  useEffect(() => {
    const loadApplication = async () => {
      try {
        // Check for resume token in URL first
        const resumeToken = searchParams.get('resume')

        if (resumeToken) {
          // Decode resume token
          const decodedToken = decodeResumeToken(resumeToken)

          if (decodedToken) {
            console.log('Loading application from resume token')

            // Try to load the draft from database
            const { data } = await getApplicationById(decodedToken.applicationId)

            if (data && data.status === 'draft' && data.email?.toLowerCase() === decodedToken.email.toLowerCase()) {
              setApplicationId(decodedToken.applicationId)
              setApplicationData(data)
              console.log('Loaded draft application from resume link:', decodedToken.applicationId)
              setIsLoading(false)
              isInitializedRef.current = true
              return
            } else {
              console.log('Resume link invalid or application not found')
            }
          } else {
            console.log('Resume token expired or invalid')
          }
        }

        // Fall back to localStorage
        const storedId = localStorage.getItem(STORAGE_KEY)
        if (storedId) {
          // Try to load the draft from database
          const { data } = await getApplicationById(storedId)

          if (data && data.status === 'draft') {
            setApplicationId(storedId)
            setApplicationData(data)
            console.log('Loaded draft application:', storedId)
          } else {
            // Draft not found or already submitted, clear localStorage
            localStorage.removeItem(STORAGE_KEY)
            console.log('Draft not found or submitted, starting new application')
          }
        }
      } catch (error) {
        console.error('Error loading application:', error)
        localStorage.removeItem(STORAGE_KEY)
      } finally {
        setIsLoading(false)
        isInitializedRef.current = true
      }
    }

    loadApplication()
  }, [searchParams])

  // Save to localStorage when applicationId changes
  useEffect(() => {
    if (applicationId) {
      localStorage.setItem(STORAGE_KEY, applicationId)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [applicationId])

  // Auto-save function
  const saveNow = useCallback(async () => {
    if (!hasUnsavedChanges && applicationId) {
      // No changes to save
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const { data, error } = await saveDraft(applicationData, applicationId || undefined)

      if (error) {
        setSaveError(error.message)
        console.error('Save error:', error)
        return
      }

      if (data && data.id) {
        if (!applicationId) {
          setApplicationId(data.id)
        }
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        console.log('Application saved:', data.id)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setSaveError(errorMessage)
      console.error('Unexpected save error:', error)
    } finally {
      setIsSaving(false)
    }
  }, [applicationData, applicationId, hasUnsavedChanges])

  // Set up auto-save timer
  useEffect(() => {
    if (!isInitializedRef.current) {
      return
    }

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    // Set up new timer if there are unsaved changes
    if (hasUnsavedChanges) {
      autoSaveTimerRef.current = setInterval(() => {
        saveNow()
      }, AUTO_SAVE_INTERVAL)
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [hasUnsavedChanges, saveNow])

  // Update application data
  const updateApplicationData = useCallback((newData: Partial<DriverApplicationData>) => {
    setApplicationData((prev) => ({
      ...prev,
      ...newData
    }))
    setHasUnsavedChanges(true)
  }, [])

  // Navigation functions
  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 11))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const value: ApplicationContextType = {
    currentStep,
    setCurrentStep,
    applicationData,
    updateApplicationData,
    applicationId,
    setApplicationId,
    isSaving,
    lastSaved,
    saveError,
    saveNow,
    goToNextStep,
    goToPreviousStep,
    isLoading
  }

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplication() {
  const context = useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider')
  }
  return context
}
