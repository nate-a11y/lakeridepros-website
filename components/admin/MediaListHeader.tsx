'use client'

import { useState } from 'react'
import { BulkUploadModal } from './BulkUploadModal'

/**
 * Custom header component for the Media collection list view
 * Adds a prominent "Bulk Upload" button
 */
export function MediaListHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleUploadComplete = () => {
    // Refresh the page to show new uploads
    window.location.reload()
  }

  return (
    <>
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Quick Upload
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Upload multiple images at once with automatic compression and metadata
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17,8 12,3 7,8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Bulk Upload Images
          </button>
        </div>
      </div>

      <BulkUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </>
  )
}

export default MediaListHeader
