'use client'

import { useState, useCallback } from 'react'
import { useField } from '@payloadcms/ui'
import { BulkUploadModal } from './BulkUploadModal'

interface UploadedFile {
  name: string
  id: string
}

interface MediaDoc {
  id: string
  alt?: string
  url?: string
  filename?: string
}

interface UploadFieldWithBulkProps {
  path: string
  label?: string
  required?: boolean
  relationTo?: string
}

/**
 * Enhanced upload field that adds bulk upload capability
 * This wraps Payload's default upload field behavior
 */
export function UploadFieldWithBulk({
  path,
  label = 'Image',
  required = false,
}: UploadFieldWithBulkProps) {
  const { value, setValue } = useField<string | null>({ path })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [mediaDoc, setMediaDoc] = useState<MediaDoc | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch media document details when value changes
  const fetchMediaDoc = useCallback(async (id: string) => {
    if (!id) {
      setMediaDoc(null)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/media/${id}`)
      if (res.ok) {
        const data = await res.json()
        setMediaDoc(data)
      }
    } catch (err) {
      console.error('Failed to fetch media:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch when value changes
  useState(() => {
    if (value) {
      fetchMediaDoc(value)
    }
  })

  const handleUploadComplete = useCallback((files: UploadedFile[]) => {
    if (files.length > 0) {
      // Use the first uploaded file
      const firstFile = files[0]
      setValue(firstFile.id)
      fetchMediaDoc(firstFile.id)
      setIsModalOpen(false)
    }
  }, [setValue, fetchMediaDoc])

  const handleSelectExisting = useCallback(() => {
    setIsDrawerOpen(true)
  }, [])

  const handleRemove = useCallback(() => {
    setValue(null)
    setMediaDoc(null)
  }, [setValue])

  const handleMediaSelect = useCallback((selectedId: string) => {
    setValue(selectedId)
    fetchMediaDoc(selectedId)
    setIsDrawerOpen(false)
  }, [setValue, fetchMediaDoc])

  return (
    <div className="field-type upload">
      <label className="field-label">
        {label}
        {required && <span className="required">*</span>}
      </label>

      {value && mediaDoc ? (
        // Selected media preview
        <div className="upload-field-selected">
          <div className="flex items-start gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            {mediaDoc.url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={mediaDoc.url}
                alt={mediaDoc.alt || 'Selected image'}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {mediaDoc.filename || mediaDoc.alt || 'Image'}
              </p>
              {mediaDoc.alt && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                  {mediaDoc.alt}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Upload New
                </button>
                <button
                  type="button"
                  onClick={handleSelectExisting}
                  className="text-sm px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                >
                  Choose Existing
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-sm px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
          Loading...
        </div>
      ) : (
        // Empty state with upload options
        <div className="p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto mb-4 stroke-neutral-400 dark:stroke-neutral-500"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>

          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            No image selected
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17,8 12,3 7,8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload New
            </button>
            <button
              type="button"
              onClick={handleSelectExisting}
              className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
            >
              Choose Existing
            </button>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Media Drawer for selecting existing */}
      {isDrawerOpen && (
        <MediaSelectDrawer
          onSelect={handleMediaSelect}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  )
}

/**
 * Drawer component for selecting existing media
 */
function MediaSelectDrawer({
  onSelect,
  onClose
}: {
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const [media, setMedia] = useState<MediaDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Fetch media on mount
  useState(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/media?limit=50&sort=-createdAt')
        if (res.ok) {
          const data = await res.json()
          setMedia(data.docs || [])
        }
      } catch (err) {
        console.error('Failed to fetch media:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMedia()
  })

  const filteredMedia = search
    ? media.filter(m =>
        m.alt?.toLowerCase().includes(search.toLowerCase()) ||
        m.filename?.toLowerCase().includes(search.toLowerCase())
      )
    : media

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-900 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Select Image
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images..."
            className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-neutral-500">Loading...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              {search ? 'No images found' : 'No images uploaded yet'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredMedia.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
                >
                  {item.url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.url}
                      alt={item.alt || ''}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </div>
                  {item.alt && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-xs text-white truncate">{item.alt}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadFieldWithBulk
