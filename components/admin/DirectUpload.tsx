'use client'

import { useState, useCallback } from 'react'
import { useField } from '@payloadcms/ui'

/**
 * Compresses an image file using browser Canvas API
 * Converts to WebP format and resizes to max 1024px
 */
async function compressImage(file: File): Promise<{ file: File; width: number; height: number }> {
  // Only compress images
  if (!file.type.startsWith('image/')) {
    return { file, width: 0, height: 0 }
  }

  return new Promise((resolve) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      // Calculate new dimensions (max 1024px to match server config)
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
        console.warn('[DirectUpload] Could not get canvas context')
        resolve({ file, width: img.width, height: img.height })
        return
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)

      // Try WebP first, fall back to JPEG
      const tryFormat = (format: string, quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ file, width, height })
              return
            }

            // Change extension to match format
            const ext = format === 'image/webp' ? '.webp' : '.jpg'
            const newName = file.name.replace(/\.[^.]+$/, ext)

            const compressedFile = new File([blob], newName, {
              type: format,
              lastModified: Date.now(),
            })

            console.log(
              `[DirectUpload] Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB (${width}x${height})`
            )

            resolve({ file: compressedFile, width, height })
          },
          format,
          quality
        )
      }

      // Use WebP at 80% quality (matches server config)
      tryFormat('image/webp', 0.8)
    }

    img.onerror = () => {
      console.warn('[DirectUpload] Failed to load image')
      resolve({ file, width: 0, height: 0 })
    }

    // Load image
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve({ file, width: 0, height: 0 })
    reader.readAsDataURL(file)
  })
}

interface DirectUploadProps {
  path: string
}

/**
 * Custom upload component that uploads directly to Supabase,
 * bypassing Vercel's 4.5MB serverless function limit.
 */
export function DirectUpload({ path }: DirectUploadProps) {
  const { value, setValue } = useField<string>({ path })
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      // Step 1: Compress the image
      setProgress(10)
      const { file: compressedFile, width, height } = await compressImage(file)

      // Step 2: Get presigned URL
      setProgress(20)
      const presignedRes = await fetch('/api/upload/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: compressedFile.name,
          contentType: compressedFile.type,
        }),
      })

      if (!presignedRes.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { signedUrl, path: filePath, publicUrl } = await presignedRes.json()

      // Step 3: Upload directly to Supabase
      setProgress(40)
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': compressedFile.type,
        },
        body: compressedFile,
      })

      if (!uploadRes.ok) {
        throw new Error('Failed to upload to storage')
      }

      setProgress(80)

      // Step 4: Create media record in Payload (small JSON, not file upload)
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
        const errorText = await mediaRes.text()
        throw new Error(`Failed to create media record: ${errorText}`)
      }

      const mediaData = await mediaRes.json()
      setProgress(100)

      // Set the field value to the new media ID
      setValue(mediaData.doc.id)

      console.log('[DirectUpload] Upload complete:', mediaData.doc.id)
    } catch (err) {
      console.error('[DirectUpload] Error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [setValue])

  return (
    <div className="direct-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />

      {uploading && (
        <div className="upload-progress">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
          <span>{progress}%</span>
        </div>
      )}

      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      {value && !uploading && (
        <div className="upload-success">
          Uploaded: {value}
        </div>
      )}

      <style jsx>{`
        .direct-upload {
          padding: 1rem;
          border: 2px dashed #ccc;
          border-radius: 8px;
        }
        .upload-progress {
          margin-top: 0.5rem;
          background: #eee;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        .progress-bar {
          height: 20px;
          background: #3b82f6;
          transition: width 0.3s;
        }
        .progress-bar + span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
        }
        .upload-error {
          color: #ef4444;
          margin-top: 0.5rem;
        }
        .upload-success {
          color: #22c55e;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  )
}

export default DirectUpload
