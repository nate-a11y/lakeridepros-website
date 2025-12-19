'use client'

/**
 * Step 10: Upload Documents (License Front & Back)
 * Complies with 49 CFR 391.21 - Document verification
 */

import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { useApplication } from '../context/ApplicationContext'
import { uploadLicenseImage } from '@/lib/supabase/driver-application'
import { Upload, X, FileText } from 'lucide-react'

const documentsSchema = z.object({
  license_front_url: z.string().min(1, 'License front image is required'),
  license_back_url: z.string().min(1, 'License back image is required')
})

type DocumentsFormData = z.infer<typeof documentsSchema>

interface Step10DocumentsProps {
  onNext: () => void
  onPrevious: () => void
}

export default function Step10Documents({ onNext, onPrevious }: Step10DocumentsProps) {
  const { applicationData, updateApplicationData, applicationId } = useApplication()
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState<{ front: boolean; back: boolean }>({ front: false, back: false })
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [loadingExisting, setLoadingExisting] = useState(false)

  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  const { setValue, handleSubmit, formState: { errors } } = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      license_front_url: applicationData.license_front_url || '',
      license_back_url: applicationData.license_back_url || ''
    }
  })

  // Load existing images with fresh signed URLs
  useEffect(() => {
    const loadExistingImages = async () => {
      setLoadingExisting(true)

      // Load front image
      if (applicationData.license_front_url) {
        try {
          const response = await fetch('/api/driver-application/get-signed-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath: applicationData.license_front_url })
          })

          if (response.ok) {
            const { url } = await response.json()
            setFrontPreview(url)
            setValue('license_front_url', url)
          }
        } catch (error) {
          console.error('Error loading front image:', error)
        }
      }

      // Load back image
      if (applicationData.license_back_url) {
        try {
          const response = await fetch('/api/driver-application/get-signed-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath: applicationData.license_back_url })
          })

          if (response.ok) {
            const { url } = await response.json()
            setBackPreview(url)
            setValue('license_back_url', url)
          }
        } catch (error) {
          console.error('Error loading back image:', error)
        }
      }

      setLoadingExisting(false)
    }

    loadExistingImages()
  }, [applicationData.license_front_url, applicationData.license_back_url, setValue])

  const handleFileUpload = async (file: File, side: 'front' | 'back') => {
    if (!applicationId) {
      setUploadError('Please complete previous steps first')
      return
    }

    setUploading(prev => ({ ...prev, [side]: true }))
    setUploadError(null)

    try {
      const { url, error } = await uploadLicenseImage(applicationId, file, side)

      if (error) {
        setUploadError(error.message)
        return
      }

      if (url) {
        if (side === 'front') {
          setFrontPreview(url)
          setValue('license_front_url', url)
        } else {
          setBackPreview(url)
          setValue('license_back_url', url)
        }
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(prev => ({ ...prev, [side]: false }))
    }
  }

  const handleDrop = (e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file, side)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, side)
    }
  }

  const removeImage = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontPreview(null)
      setValue('license_front_url', '')
      if (frontInputRef.current) frontInputRef.current.value = ''
    } else {
      setBackPreview(null)
      setValue('license_back_url', '')
      if (backInputRef.current) backInputRef.current.value = ''
    }
  }

  const onSubmit = (data: DocumentsFormData) => {
    updateApplicationData({
      license_front_url: data.license_front_url,
      license_back_url: data.license_back_url
    })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">Upload Driver's License</h2>
      <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
        Upload clear images of the front and back of your current driver's license.
        Accepted formats: JPG, PNG, PDF (max 10MB each).
      </p>

      {uploadError && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6 text-red-700">
          {uploadError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* License Front */}
        <div>
          <label htmlFor="license-front-upload" className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            License Front *
          </label>

          {!frontPreview ? (
            <div
              id="license-front-upload"
              onDrop={(e) => handleDrop(e, 'front')}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => frontInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && frontInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload license front image"
            >
              {uploading.front || loadingExisting ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                    {uploading.front ? 'Uploading...' : 'Loading...'}
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                  <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                    JPG, PNG or PDF (max 10MB)
                  </p>
                </>
              )}
              <input
                ref={frontInputRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => handleFileSelect(e, 'front')}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-lg p-4 bg-neutral-50 dark:hover:bg-dark-bg-secondary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {frontPreview.endsWith('.pdf') ? (
                    <FileText className="w-12 h-12 text-red-600" />
                  ) : (
                    <Image src={frontPreview} alt="License front" width={96} height={64} className="object-cover rounded" unoptimized />
                  )}
                  <div>
                    <p className="font-medium">License Front</p>
                    <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">Uploaded successfully</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage('front')}
                  className="text-red-600 hover:text-red-700 p-2"
                  aria-label="Remove license front image"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
          {errors.license_front_url && (
            <p className="text-red-600 text-sm mt-2">{errors.license_front_url.message}</p>
          )}
        </div>

        {/* License Back */}
        <div>
          <label htmlFor="license-back-upload" className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            License Back *
          </label>

          {!backPreview ? (
            <div
              id="license-back-upload"
              onDrop={(e) => handleDrop(e, 'back')}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => backInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && backInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload license back image"
            >
              {uploading.back || loadingExisting ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                    {uploading.back ? 'Uploading...' : 'Loading...'}
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                  <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                    JPG, PNG or PDF (max 10MB)
                  </p>
                </>
              )}
              <input
                ref={backInputRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => handleFileSelect(e, 'back')}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  rounded-lg p-4 bg-neutral-50 dark:hover:bg-dark-bg-secondary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {backPreview.endsWith('.pdf') ? (
                    <FileText className="w-12 h-12 text-red-600" />
                  ) : (
                    <Image src={backPreview} alt="License back" width={96} height={64} className="object-cover rounded" unoptimized />
                  )}
                  <div>
                    <p className="font-medium">License Back</p>
                    <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">Uploaded successfully</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage('back')}
                  className="text-red-600 hover:text-red-700 p-2"
                  aria-label="Remove license back image"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
          {errors.license_back_url && (
            <p className="text-red-600 text-sm mt-2">{errors.license_back_url.message}</p>
          )}
        </div>

        <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-lg p-4">
          <p className="text-sm text-neutral-900 dark:text-white">
            <strong>Important:</strong> Ensure your license images are clear and all text is readable.
            Blurry or unreadable images may delay processing of your application.
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-3 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-lrp-black transition-colors  font-semibold rounded-lg transition-colors hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary"
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={uploading.front || uploading.back}
            className="px-6 py-3 bg-primary text-lrp-black font-semibold rounded-lg transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  )
}
