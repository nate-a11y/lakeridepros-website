'use client'

import { useState, useCallback, Component, type ReactNode } from 'react'
import { useField } from '@payloadcms/ui'
import { BulkUploadModal } from './BulkUploadModal'

interface UploadedFile {
  name: string
  id: string
}

interface ImageItem {
  image: string
  id?: string
}

/**
 * Error boundary prevents the bulk upload component from crashing the
 * entire admin page. If the component throws (e.g. missing form context),
 * a graceful fallback is shown instead of Payload's "Failed to load".
 */
class BulkUploadErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[BulkUploadForArray] Component error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mb-4 p-4 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Bulk upload temporarily unavailable. Use the &quot;+ Add Image&quot; button below to add images individually.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

/**
 * Inner component that uses Payload's useField hook to access the sibling
 * 'images' array field. After bulk uploading, images are automatically
 * added to the array — no manual "+ Add Image" step needed.
 */
function BulkUploadForArrayInner() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addedCount, setAddedCount] = useState(0)

  // Access the sibling 'images' array field so we can auto-add uploaded images
  const { value: imagesValue, setValue: setImagesValue } = useField<ImageItem[]>({ path: 'images' })

  const handleUploadComplete = useCallback((uploadedFiles: UploadedFile[]) => {
    // Create new array items for each uploaded file
    const newItems: ImageItem[] = uploadedFiles.map(file => ({
      image: file.id,
    }))

    // Append to existing images array
    setImagesValue([...(imagesValue || []), ...newItems])
    setAddedCount(uploadedFiles.length)
    setIsModalOpen(false)
  }, [imagesValue, setImagesValue])

  const handleDismiss = useCallback(() => {
    setAddedCount(0)
  }, [])

  return (
    <>
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              Quick Add Images
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Upload multiple images at once with automatic compression
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17,8 12,3 7,8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Bulk Upload
          </button>
        </div>

        {/* Success message after images are added to the gallery */}
        {addedCount > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                {addedCount} image{addedCount !== 1 ? 's' : ''} uploaded and added to the gallery
              </p>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Remember to save the document to keep these changes
            </p>
          </div>
        )}
      </div>

      <BulkUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </>
  )
}

/**
 * UI component that adds bulk upload capability to an array field.
 * Place this as a UI field before the 'images' array in your collection.
 *
 * Uploads images to the Media collection, then automatically adds them
 * to the sibling 'images' array field. Wrapped in an error boundary so
 * a failure here never breaks the admin page.
 */
export function BulkUploadForArray() {
  return (
    <BulkUploadErrorBoundary>
      <BulkUploadForArrayInner />
    </BulkUploadErrorBoundary>
  )
}

export default BulkUploadForArray
