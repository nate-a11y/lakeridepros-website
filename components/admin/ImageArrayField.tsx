'use client'

import { useState, useCallback, useEffect } from 'react'
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

interface ImageItem {
  image: string
  id?: string
}

interface ImageArrayFieldProps {
  path: string
  label?: string
}

/**
 * Enhanced image array field with bulk upload capability
 * Allows uploading multiple images at once and adding them to the array
 */
export function ImageArrayField({
  path,
  label = 'Images',
}: ImageArrayFieldProps) {
  const { value, setValue } = useField<ImageItem[]>({ path })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [mediaDocs, setMediaDocs] = useState<Map<string, MediaDoc>>(new Map())
  const [loading, setLoading] = useState(false)

  // Fetch media documents for all items
  useEffect(() => {
    const fetchAllMedia = async () => {
      if (!value || value.length === 0) {
        setMediaDocs(new Map())
        return
      }

      const ids = value.map(item => item.image).filter(Boolean)
      if (ids.length === 0) return

      setLoading(true)
      try {
        // Fetch all media in one request
        const res = await fetch(`/api/media?where[id][in]=${ids.join(',')}`)
        if (res.ok) {
          const data = await res.json()
          const newMap = new Map<string, MediaDoc>()
          data.docs?.forEach((doc: MediaDoc) => {
            newMap.set(doc.id, doc)
          })
          setMediaDocs(newMap)
        }
      } catch (err) {
        console.error('Failed to fetch media:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllMedia()
  }, [value])

  const handleUploadComplete = useCallback((files: UploadedFile[]) => {
    // Add all uploaded files to the array
    const newItems = files.map(file => ({
      image: file.id,
    }))

    setValue([...(value || []), ...newItems])
    setIsModalOpen(false)
  }, [value, setValue])

  const handleSelectExisting = useCallback((ids: string[]) => {
    const newItems = ids.map(id => ({ image: id }))
    setValue([...(value || []), ...newItems])
    setIsDrawerOpen(false)
  }, [value, setValue])

  const handleRemove = useCallback((index: number) => {
    const newValue = [...(value || [])]
    newValue.splice(index, 1)
    setValue(newValue)
  }, [value, setValue])

  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return
    const newValue = [...(value || [])]
    const temp = newValue[index]
    newValue[index] = newValue[index - 1]
    newValue[index - 1] = temp
    setValue(newValue)
  }, [value, setValue])

  const handleMoveDown = useCallback((index: number) => {
    if (!value || index === value.length - 1) return
    const newValue = [...value]
    const temp = newValue[index]
    newValue[index] = newValue[index + 1]
    newValue[index + 1] = temp
    setValue(newValue)
  }, [value, setValue])

  const items = value || []

  return (
    <div className="field-type array">
      <div className="flex items-center justify-between mb-4">
        <label className="field-label text-lg font-medium text-neutral-900 dark:text-neutral-100">
          {label}
          {items.length > 0 && (
            <span className="ml-2 text-sm font-normal text-neutral-500">
              ({items.length} image{items.length !== 1 ? 's' : ''})
            </span>
          )}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17,8 12,3 7,8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Bulk Upload
          </button>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm rounded font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            Add Existing
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-neutral-500">Loading images...</div>
      ) : items.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg text-center">
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
          <p className="text-neutral-600 dark:text-neutral-400 mb-2">
            No images added yet
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            Use the buttons above to upload or select images
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item, index) => {
            const doc = mediaDocs.get(item.image)
            return (
              <div
                key={item.id || index}
                className="group relative aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700"
              >
                {doc?.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={doc.url}
                    alt={doc.alt || ''}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      className="p-1.5 bg-white rounded-full shadow hover:bg-neutral-100 transition-colors"
                      title="Move up"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                  )}
                  {index < items.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      className="p-1.5 bg-white rounded-full shadow hover:bg-neutral-100 transition-colors"
                      title="Move down"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1.5 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors"
                    title="Remove"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Index badge */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-black/50 text-white text-xs rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Media Selection Drawer */}
      {isDrawerOpen && (
        <MultiMediaSelectDrawer
          selectedIds={items.map(i => i.image)}
          onSelect={handleSelectExisting}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  )
}

/**
 * Drawer component for selecting multiple existing media items
 */
function MultiMediaSelectDrawer({
  selectedIds,
  onSelect,
  onClose
}: {
  selectedIds: string[]
  onSelect: (ids: string[]) => void
  onClose: () => void
}) {
  const [media, setMedia] = useState<MediaDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Fetch media on mount
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/media?limit=100&sort=-createdAt')
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
  }, [])

  const filteredMedia = search
    ? media.filter(m =>
        m.alt?.toLowerCase().includes(search.toLowerCase()) ||
        m.filename?.toLowerCase().includes(search.toLowerCase())
      )
    : media

  // Exclude already selected images
  const availableMedia = filteredMedia.filter(m => !selectedIds.includes(m.id))

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleConfirm = () => {
    onSelect(Array.from(selected))
  }

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClose()
          }
        }}
        aria-label="Close image selector"
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-neutral-900 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Select Images
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
          {selected.size > 0 && (
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              {selected.size} image{selected.size !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-neutral-500">Loading...</div>
          ) : availableMedia.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              {search ? 'No images found' : 'No more images available'}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {availableMedia.map((item) => {
                const isSelected = selected.has(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    {item.url && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.url}
                        alt={item.alt || ''}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selected.size === 0}
            className={`flex-1 py-2 rounded font-medium transition-colors ${
              selected.size === 0
                ? 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Add {selected.size > 0 ? `${selected.size} Image${selected.size !== 1 ? 's' : ''}` : 'Images'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageArrayField
