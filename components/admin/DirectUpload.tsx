'use client'

import { useState, useCallback, useRef } from 'react'
import { useDocumentInfo, useForm } from '@payloadcms/ui'

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

/**
 * Custom Upload component that bypasses Vercel's 4.5MB limit
 * by uploading directly to Supabase.
 */
export function DirectUpload() {
  const { id } = useDocumentInfo()
  const { submit } = useForm()

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processUpload = useCallback(async (file: File) => {
    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      // Preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Step 1: Compress
      setProgress(10)
      const { file: compressedFile, width, height } = await compressImage(file)

      // Step 2: Get presigned URL
      setProgress(25)
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

      // Step 3: Upload to Supabase
      setProgress(50)
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': compressedFile.type },
        body: compressedFile,
      })

      if (!uploadRes.ok) {
        throw new Error('Failed to upload to storage')
      }

      setProgress(75)

      // Step 4: Create media record
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
          alt: file.name.replace(/\.[^.]+$/, ''),
        }),
      })

      if (!mediaRes.ok) {
        const err = await mediaRes.text()
        throw new Error(`Failed to create media: ${err}`)
      }

      const mediaData = await mediaRes.json()
      setProgress(100)
      setUploadedUrl(publicUrl)

      console.log('[DirectUpload] Success:', mediaData.doc.id)

      // Redirect to the new media item
      if (mediaData.doc?.id) {
        window.location.href = `/admin/collections/media/${mediaData.doc.id}`
      }
    } catch (err) {
      console.error('[DirectUpload] Error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processUpload(file)
  }, [processUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processUpload(file)
  }, [processUpload])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // If we're editing an existing document, show message
  if (id) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
        <p>This media item already exists.</p>
        <p>To upload a new image, create a new media item.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
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
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
        />

        {preview ? (
          <div>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '4px',
                marginBottom: '1rem',
              }}
            />
          </div>
        ) : (
          <div>
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
          </div>
        )}

        {uploading ? (
          <div>
            <p style={{ marginBottom: '0.5rem', color: '#374151' }}>
              Uploading... {progress}%
            </p>
            <div style={{
              width: '100%',
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
          </div>
        ) : (
          <div>
            <p style={{ color: '#374151', marginBottom: '0.5rem' }}>
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Images will be compressed and converted to WebP
            </p>
          </div>
        )}
      </div>

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

      {uploadedUrl && !uploading && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '4px',
          color: '#16a34a',
        }}>
          Upload complete! Redirecting...
        </div>
      )}
    </div>
  )
}

export default DirectUpload
