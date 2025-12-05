'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'

/**
 * Compresses an image file using browser Canvas API
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

/**
 * Dedicated bulk upload page for the admin panel
 */
export function BulkUploadView() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithMetadata[]>([])
  const [uploading, setUploading] = useState(false)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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

    const results: UploadedFile[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const fileWithMeta = selectedFiles[i]
      setCurrentFile(fileWithMeta.file.name)
      setProgress(Math.round((i / selectedFiles.length) * 100))

      try {
        const result = await processUpload(fileWithMeta)
        if (result) {
          results.push(result)
          setUploadedFiles(prev => [...prev, result])
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

  const handleClearUploaded = useCallback(() => {
    setUploadedFiles([])
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
          <Link href="/admin" className="hover:text-neutral-700 dark:hover:text-neutral-200">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/admin/collections/media" className="hover:text-neutral-700 dark:hover:text-neutral-200">
            Media
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-neutral-100">Bulk Upload</span>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Bulk Upload Images
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Upload multiple images at once. Images are automatically compressed to WebP format for optimal performance.
        </p>
      </div>

      {/* Recently Uploaded */}
      {uploadedFiles.length > 0 && (
        <div className="mb-8 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              Recently Uploaded ({uploadedFiles.length})
            </h3>
            <button
              onClick={handleClearUploaded}
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              Clear list
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {uploadedFiles.map((f) => (
              <Link
                key={f.id}
                href={`/admin/collections/media/${f.id}`}
                className="p-2 bg-white dark:bg-neutral-800 rounded border border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 transition-colors"
              >
                <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate">{f.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      {selectedFiles.length === 0 ? (
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
          className={`border-2 border-dashed rounded-xl py-20 px-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : 'border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800/50 hover:border-neutral-400 dark:hover:border-neutral-500'
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
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto mb-6 stroke-neutral-400 dark:stroke-neutral-500"
            strokeWidth="1.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17,8 12,3 7,8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>

          <p className="text-xl text-neutral-700 dark:text-neutral-200 mb-2">
            <strong>Click to select images</strong> or drag and drop
          </p>
          <p className="text-neutral-500 dark:text-neutral-400">
            PNG, JPG, WEBP up to 10MB each • Auto-compressed to WebP
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          {/* File list header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <p className="font-medium text-neutral-900 dark:text-neutral-100">
              {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Add more
              </button>
              <button
                onClick={() => {
                  selectedFiles.forEach(f => URL.revokeObjectURL(f.preview))
                  setSelectedFiles([])
                }}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Clear all
              </button>
            </div>
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

          {/* File list */}
          <div className="max-h-[60vh] overflow-y-auto">
            {selectedFiles.map((fileWithMeta, index) => (
              <div
                key={index}
                className="p-4 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0"
              >
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileWithMeta.preview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-3">
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
                        disabled={uploading}
                        className="p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                        aria-label={`Remove ${fileWithMeta.file.name}`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={`alt-${index}`} className="block text-xs font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                          Alt Text <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`alt-${index}`}
                          type="text"
                          value={fileWithMeta.alt}
                          onChange={(e) => updateFileMetadata(index, 'alt', e.target.value)}
                          placeholder="Describe this image for accessibility"
                          disabled={uploading}
                          className={`w-full p-2 rounded text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border ${
                            fileWithMeta.alt.trim()
                              ? 'border-neutral-300 dark:border-neutral-600'
                              : 'border-red-300 dark:border-red-500'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                        />
                      </div>

                      <div>
                        <label htmlFor={`caption-${index}`} className="block text-xs font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                          Caption
                        </label>
                        <input
                          id={`caption-${index}`}
                          type="text"
                          value={fileWithMeta.caption}
                          onChange={(e) => updateFileMetadata(index, 'caption', e.target.value)}
                          placeholder="Optional caption"
                          disabled={uploading}
                          className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upload button */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700">
            {uploading && (
              <div className="mb-4">
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

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0 || selectedFiles.some(f => !f.alt.trim())}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                uploading || selectedFiles.length === 0 || selectedFiles.some(f => !f.alt.trim())
                  ? 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploading
                ? 'Uploading...'
                : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BulkUploadView
