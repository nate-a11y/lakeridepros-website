'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Compresses an image file using browser Canvas API
 * Converts to WebP format and resizes to max 1024px
 */
async function compressImage(file: File): Promise<{ file: File; width: number; height: number }> {
  if (!file.type.startsWith('image/')) {
    return { file, width: 0, height: 0 }
  }

  if (typeof window === 'undefined') {
    return { file, width: 0, height: 0 }
  }

  return new Promise((resolve) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      const maxDimension = 1024
      let { width, height } = img

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height / width) * maxDimension)
          width = maxDimension
        } else {
          width = Math.round((width / height) * maxDimension)
          height = maxDimension
        }
      }

      canvas.width = width
      canvas.height = height

      if (!ctx) {
        resolve({ file, width: img.width, height: img.height })
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({ file, width, height })
            return
          }

          const ext = '.webp'
          const newName = file.name.replace(/\.[^.]+$/, ext)

          const compressedFile = new File([blob], newName, {
            type: 'image/webp',
            lastModified: Date.now(),
          })

          resolve({ file: compressedFile, width, height })
        },
        'image/webp',
        0.8
      )
    }

    img.onerror = () => resolve({ file, width: 0, height: 0 })

    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve({ file, width: 0, height: 0 })
    reader.readAsDataURL(file)
  })
}

interface FileWithMetadata {
  file: File
  preview: string
  alt: string
  caption: string
}

interface UploadedFile {
  name: string
  id: string
}

interface BulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete?: (files: UploadedFile[]) => void
}

export function BulkUploadModal({ isOpen, onClose, onUploadComplete }: BulkUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithMetadata[]>([])
  const [uploading, setUploading] = useState(false)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([])
      setUploadedFiles([])
      setError(null)
      setProgress(0)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !uploading) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, uploading, onClose])

  // Trap focus within modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  const processUpload = useCallback(async (fileWithMeta: FileWithMetadata): Promise<UploadedFile | null> => {
    try {
      const { file, alt, caption } = fileWithMeta

      const { file: compressedFile, width, height } = await compressImage(file)

      const presignedRes = await fetch('/api/upload/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: compressedFile.name,
          contentType: compressedFile.type,
        }),
      })

      if (!presignedRes.ok) {
        const err = await presignedRes.text()
        throw new Error(`Failed to get upload URL: ${err}`)
      }

      const { signedUrl, path: filePath, publicUrl } = await presignedRes.json()

      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': compressedFile.type },
        body: compressedFile,
      })

      if (!uploadRes.ok) {
        throw new Error('Failed to upload to storage')
      }

      const mediaRes = await fetch('/api/upload/create-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: filePath,
          mimeType: compressedFile.type,
          filesize: compressedFile.size,
          width,
          height,
          url: publicUrl,
          alt: alt.trim() || file.name.replace(/\.[^.]+$/, ''),
          caption: caption.trim() || undefined,
        }),
      })

      if (!mediaRes.ok) {
        const err = await mediaRes.text()
        throw new Error(`Failed to create media: ${err}`)
      }

      const mediaData = await mediaRes.json()
      return { name: file.name, id: mediaData.doc.id }
    } catch (err) {
      console.error('[BulkUpload] Error uploading', fileWithMeta.file.name, err)
      throw err
    }
  }, [])

  const handleFilesSelected = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))

    if (fileArray.length === 0) {
      setError('No valid image files selected')
      return
    }

    const filesWithMeta: FileWithMetadata[] = fileArray.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      alt: '',
      caption: '',
    }))

    setSelectedFiles(prev => [...prev, ...filesWithMeta])
    setError(null)
  }, [])

  const updateFileMetadata = useCallback((index: number, field: 'alt' | 'caption', value: string) => {
    setSelectedFiles(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }, [])

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return

    const missingAlt = selectedFiles.filter(f => !f.alt.trim())
    if (missingAlt.length > 0) {
      setError(`Please provide alt text for all images (${missingAlt.length} missing)`)
      return
    }

    setUploading(true)
    setError(null)
    setUploadedFiles([])

    const results: UploadedFile[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const fileWithMeta = selectedFiles[i]
      setCurrentFile(fileWithMeta.file.name)
      setProgress(Math.round((i / selectedFiles.length) * 100))

      try {
        const result = await processUpload(fileWithMeta)
        if (result) {
          results.push(result)
          setUploadedFiles([...results])
        }
      } catch (err) {
        setError(`Failed to upload ${fileWithMeta.file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
        break
      }
    }

    setProgress(100)
    setCurrentFile(null)
    setUploading(false)
    setSelectedFiles([])

    if (results.length > 0 && onUploadComplete) {
      onUploadComplete(results)
    }
  }, [selectedFiles, processUpload, onUploadComplete])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files)
    }
    // Reset input so same files can be selected again
    e.target.value = ''
  }, [handleFilesSelected])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files)
    }
  }, [handleFilesSelected])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDone = useCallback(() => {
    // Clean up previews
    selectedFiles.forEach(f => URL.revokeObjectURL(f.preview))
    onClose()
  }, [selectedFiles, onClose])

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-upload-title"
    >
      {/* Backdrop - clicking closes modal */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={!uploading ? onClose : undefined}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl max-h-[90vh] m-4 bg-white dark:bg-neutral-900 rounded-lg shadow-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 id="bulk-upload-title" className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Bulk Upload Images
          </h2>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {uploadedFiles.length > 0 && !uploading ? (
            // Success state
            <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600 dark:text-green-400">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                  Uploaded {uploadedFiles.length} image{uploadedFiles.length > 1 ? 's' : ''} successfully!
                </p>
              </div>
              <ul className="space-y-2">
                {uploadedFiles.map((f) => (
                  <li key={f.id} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-600 dark:text-green-400">
                      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <a
                      href={`/admin/collections/media/${f.id}`}
                      className="text-green-700 dark:text-green-300 hover:underline"
                    >
                      {f.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : selectedFiles.length === 0 ? (
            // Drop zone
            <div
              role="button"
              tabIndex={0}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  inputRef.current?.click()
                }
              }}
              className={`border-2 border-dashed rounded-lg py-16 px-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                  : 'border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />

              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                className="mx-auto mb-4 stroke-neutral-400 dark:stroke-neutral-500"
                strokeWidth="1.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17,8 12,3 7,8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>

              <p className="text-lg text-neutral-700 dark:text-neutral-200 mb-2">
                <strong>Click to select images</strong> or drag and drop
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                Upload multiple images at once • Images auto-compressed to WebP
              </p>
            </div>
          ) : (
            // File list with metadata
            <div>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-neutral-600 dark:text-neutral-400">
                  {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} selected
                </p>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  + Add more
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                />
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                {selectedFiles.map((fileWithMeta, index) => (
                  <div
                    key={index}
                    className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800"
                  >
                    <div className="flex gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fileWithMeta.preview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                              {fileWithMeta.file.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {(fileWithMeta.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            aria-label={`Remove ${fileWithMeta.file.name}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label htmlFor={`alt-${index}`} className="block text-xs font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                              Alt Text <span className="text-red-500">*</span>
                            </label>
                            <input
                              id={`alt-${index}`}
                              type="text"
                              value={fileWithMeta.alt}
                              onChange={(e) => updateFileMetadata(index, 'alt', e.target.value)}
                              placeholder="Describe this image"
                              className={`w-full p-2 rounded text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border ${
                                fileWithMeta.alt.trim()
                                  ? 'border-neutral-300 dark:border-neutral-600'
                                  : 'border-red-300 dark:border-red-500'
                              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                          </div>

                          <div>
                            <label htmlFor={`caption-${index}`} className="block text-xs font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                              Caption (optional)
                            </label>
                            <input
                              id={`caption-${index}`}
                              type="text"
                              value={fileWithMeta.caption}
                              onChange={(e) => updateFileMetadata(index, 'caption', e.target.value)}
                              placeholder="Optional caption"
                              className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span>Uploading {currentFile}...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-200 dark:border-neutral-700">
          {uploadedFiles.length > 0 && !uploading ? (
            <button
              onClick={handleDone}
              className="px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                disabled={uploading}
                className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0 || selectedFiles.some(f => !f.alt.trim())}
                className={`px-6 py-2 rounded font-medium transition-colors ${
                  uploading || selectedFiles.length === 0 || selectedFiles.some(f => !f.alt.trim())
                    ? 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )

  // Use portal to render at document root
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}

export default BulkUploadModal
