'use client'

import { useState, useCallback } from 'react'
import { BulkUploadModal } from './BulkUploadModal'

interface UploadedFile {
  name: string
  id: string
}

/**
 * UI component that adds bulk upload capability to an array field
 * Place this as a UI field before the images array in your collection
 *
 * After uploading, images are added to Media collection.
 * User can then add them to the array using the + Add button below.
 */
export function BulkUploadForArray() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>([])

  const handleUploadComplete = useCallback((uploadedFiles: UploadedFile[]) => {
    setRecentUploads(uploadedFiles)
    setIsModalOpen(false)
  }, [])

  const handleClearRecent = useCallback(() => {
    setRecentUploads([])
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

        {/* Show recently uploaded files with instructions */}
        {recentUploads.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                {recentUploads.length} image{recentUploads.length !== 1 ? 's' : ''} uploaded to Media
              </p>
              <button
                type="button"
                onClick={handleClearRecent}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
              Click &quot;+ Add Image&quot; below, then select your uploaded images
            </p>
            <div className="flex flex-wrap gap-1">
              {recentUploads.slice(0, 5).map((file) => (
                <span
                  key={file.id}
                  className="inline-flex items-center px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded"
                >
                  {file.name}
                </span>
              ))}
              {recentUploads.length > 5 && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                  +{recentUploads.length - 5} more
                </span>
              )}
            </div>
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

export default BulkUploadForArray
