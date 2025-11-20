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
      <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
        <p>This media item already exists.</p>
        <p>To upload new images, create a new media item.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem' }}>
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
          style={{
            border: `2px dashed ${dragActive ? '#3b82f6' : '#d1d5db'}`,
            borderRadius: '8px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: dragActive ? '#eff6ff' : '#f9fafb',
            transition: 'all 0.2s',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />

          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            style={{ margin: '0 auto 1rem' }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17,8 12,3 7,8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>

          <p style={{ color: '#374151', marginBottom: '0.5rem' }}>
            <strong>Click to upload</strong> or drag and drop
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Select multiple images for bulk upload
          </p>
        </div>
      ) : (
        // Metadata collection form
        <div>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
              Add Image Details ({selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''})
            </h3>
            <button
              onClick={() => setSelectedFiles([])}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Cancel
            </button>
          </div>

          <div style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '1rem' }}>
            {selectedFiles.map((fileWithMeta, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#fff',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileWithMeta.preview}
                    alt="Preview"
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.875rem', color: '#374151' }}>
                        {fileWithMeta.file.name}
                      </strong>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                        ({(fileWithMeta.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label htmlFor={`alt-${index}`} style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#374151' }}>
                        Alt Text <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        id={`alt-${index}`}
                        type="text"
                        value={fileWithMeta.alt}
                        onChange={(e) => updateFileMetadata(index, 'alt', e.target.value)}
                        placeholder="Describe this image for accessibility"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: `1px solid ${fileWithMeta.alt.trim() ? '#d1d5db' : '#fca5a5'}`,
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                        }}
                      />
                      {!fileWithMeta.alt.trim() && (
                        <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>
                          Required for accessibility
                        </span>
                      )}
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                      <label htmlFor={`caption-${index}`} style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#374151' }}>
                        Caption (optional)
                      </label>
                      <input
                        id={`caption-${index}`}
                        type="text"
                        value={fileWithMeta.caption}
                        onChange={(e) => updateFileMetadata(index, 'caption', e.target.value)}
                        placeholder="Optional caption"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                        }}
                      />
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
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
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: uploading || selectedFiles.some(f => !f.alt.trim()) ? '#d1d5db' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: uploading || selectedFiles.some(f => !f.alt.trim()) ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {uploading ? `Uploading ${currentFile}... (${progress}%)` : `Upload ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`}
          </button>

          {uploading && (
            <div style={{
              marginTop: '0.5rem',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#3b82f6',
                transition: 'width 0.3s',
              }} />
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          color: '#dc2626',
        }}>
          {error}
        </div>
      )}

      {uploadedFiles.length > 0 && !uploading && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '4px',
        }}>
          <p style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ✓ Uploaded {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#166534' }}>
            {uploadedFiles.map((f) => (
              <li key={f.id}>
                <a
                  href={`/admin/collections/media/${f.id}`}
                  style={{ color: '#166534', textDecoration: 'underline' }}
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
