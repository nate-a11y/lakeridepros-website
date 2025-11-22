'use client'

import { useState, useCallback, useRef } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

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

          console.log(
            `[DirectUpload] Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB (${width}x${height})`
          )

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

/**
 * Custom Upload component that bypasses Vercel's 4.5MB limit
 * by uploading directly to Supabase. Supports bulk uploads.
 */
export function DirectUpload() {
  const { id } = useDocumentInfo()

  const [selectedFiles, setSelectedFiles] = useState<FileWithMetadata[]>([])
  const [uploading, setUploading] = useState(false)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; id: string }>>([])
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processUpload = useCallback(async (fileWithMeta: FileWithMetadata): Promise<{ name: string; id: string } | null> => {
    try {
      const { file, alt, caption } = fileWithMeta

      // Compress
      const { file: compressedFile, width, height } = await compressImage(file)

      // Get presigned URL
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

      // Upload to Supabase
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': compressedFile.type },
        body: compressedFile,
      })

      if (!uploadRes.ok) {
        throw new Error('Failed to upload to storage')
      }

      // Create media record with user-provided metadata
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
          alt: alt.trim() || file.name.replace(/\.[^.]+$/, ''), // Use provided alt or fallback to filename
          caption: caption.trim() || undefined,
        }),
      })

      if (!mediaRes.ok) {
        const err = await mediaRes.text()
        throw new Error(`Failed to create media: ${err}`)
      }

      const mediaData = await mediaRes.json()
      console.log('[DirectUpload] Success:', file.name, mediaData.doc.id)

      return { name: file.name, id: mediaData.doc.id }
    } catch (err) {
      console.error('[DirectUpload] Error uploading', fileWithMeta.file.name, err)
      throw err
    }
  }, [])

  const handleFilesSelected = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))

    if (fileArray.length === 0) {
      setError('No valid image files selected')
      return
    }

    // Create metadata entries for each file with preview
    const filesWithMeta: FileWithMetadata[] = fileArray.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      alt: '', // Empty by default - user must fill
      caption: '',
    }))

    setSelectedFiles(filesWithMeta)
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

    // Check for missing alt text
    const missingAlt = selectedFiles.filter(f => !f.alt.trim())
    if (missingAlt.length > 0) {
      setError(`Please provide alt text for all images (${missingAlt.length} missing)`)
      return
    }

    setUploading(true)
    setError(null)
    setUploadedFiles([])

    const results: Array<{ name: string; id: string }> = []

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
  }, [selectedFiles, processUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files)
    }
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

  // If editing existing document
  if (id) {
    return (
      <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
        <p>This media item already exists.</p>
        <p>To upload new images, create a new media item.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      {selectedFiles.length === 0 ? (
        // File selection drop zone
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
          className={`border-2 border-dashed rounded-lg py-12 px-8 text-center cursor-pointer transition-all ${
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
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto mb-4 stroke-neutral-400 dark:stroke-neutral-500"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17,8 12,3 7,8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>

          <p className="text-neutral-700 dark:text-neutral-200 mb-2">
            <strong>Click to upload</strong> or drag and drop
          </p>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Select multiple images for bulk upload
          </p>
        </div>
      ) : (
        // Metadata collection form
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="m-0 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Add Image Details ({selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''})
            </h3>
            <button
              onClick={() => setSelectedFiles([])}
              className="py-2 px-4 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded cursor-pointer text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto mb-4">
            {selectedFiles.map((fileWithMeta, index) => (
              <div
                key={index}
                className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 mb-4 bg-white dark:bg-neutral-800"
              >
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileWithMeta.preview}
                    alt="Preview"
                    className="w-[120px] h-[120px] object-cover rounded flex-shrink-0"
                  />

                  <div className="flex-1">
                    <div className="mb-2">
                      <strong className="text-sm text-neutral-700 dark:text-neutral-200">
                        {fileWithMeta.file.name}
                      </strong>
                      <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                        ({(fileWithMeta.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>

                    <div className="mb-3">
                      <label htmlFor={`alt-${index}`} className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">
                        Alt Text <span className="text-red-600 dark:text-red-400">*</span>
                      </label>
                      <input
                        id={`alt-${index}`}
                        type="text"
                        value={fileWithMeta.alt}
                        onChange={(e) => updateFileMetadata(index, 'alt', e.target.value)}
                        placeholder="Describe this image for accessibility"
                        className={`w-full p-2 rounded text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 border ${
                          fileWithMeta.alt.trim()
                            ? 'border-neutral-300 dark:border-neutral-600'
                            : 'border-red-300 dark:border-red-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                      />
                      {!fileWithMeta.alt.trim() && (
                        <span className="text-xs text-red-600 dark:text-red-400">
                          Required for accessibility
                        </span>
                      )}
                    </div>

                    <div className="mb-2">
                      <label htmlFor={`caption-${index}`} className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">
                        Caption (optional)
                      </label>
                      <input
                        id={`caption-${index}`}
                        type="text"
                        value={fileWithMeta.caption}
                        onChange={(e) => updateFileMetadata(index, 'caption', e.target.value)}
                        placeholder="Optional caption"
                        className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      className="py-1 px-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded cursor-pointer text-xs hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.some(f => !f.alt.trim())}
            className={`w-full py-3 border-none rounded text-base font-semibold transition-colors ${
              uploading || selectedFiles.some(f => !f.alt.trim())
                ? 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                : 'bg-blue-500 dark:bg-blue-600 text-white cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700'
            }`}
          >
            {uploading ? `Uploading ${currentFile}... (${progress}%)` : `Upload ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`}
          </button>

          {uploading && (
            <div className="mt-2 h-2 bg-neutral-200 dark:bg-neutral-700 rounded overflow-hidden">
              <div
                className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {uploadedFiles.length > 0 && !uploading && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
          <p className="text-green-600 dark:text-green-400 font-bold mb-2">
            ✓ Uploaded {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
          </p>
          <ul className="m-0 pl-6 text-green-700 dark:text-green-300">
            {uploadedFiles.map((f) => (
              <li key={f.id}>
                <a
                  href={`/admin/collections/media/${f.id}`}
                  className="text-green-700 dark:text-green-300 underline hover:text-green-800 dark:hover:text-green-200"
                >
                  {f.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DirectUpload
