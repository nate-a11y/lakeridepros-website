'use client'

import { Upload } from '@payloadcms/ui'
import { useCallback, type ComponentProps } from 'react'

// Infer props from the Upload component
type UploadProps = ComponentProps<typeof Upload>

/**
 * Compresses an image file using browser Canvas API
 * Target: < 4MB to stay within Vercel's 5MB serverless limit
 */
async function compressImage(file: File): Promise<File> {
  // Only compress images
  if (!file.type.startsWith('image/')) {
    return file
  }

  // Skip if already small enough (under 2MB)
  if (file.size < 2 * 1024 * 1024) {
    console.log(`[CompressedUpload] ${file.name} is already small (${(file.size / 1024 / 1024).toFixed(2)}MB), skipping compression`)
    return file
  }

  return new Promise((resolve) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      // Calculate new dimensions (max 2048px)
      const maxDimension = 2048
      let { width, height } = img

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension
          width = maxDimension
        } else {
          width = (width / height) * maxDimension
          height = maxDimension
        }
      }

      canvas.width = width
      canvas.height = height

      if (!ctx) {
        console.warn('[CompressedUpload] Could not get canvas context, using original')
        resolve(file)
        return
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }

          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })

          console.log(
            `[CompressedUpload] Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
          )

          // If still too large, try lower quality
          if (compressedFile.size > 4 * 1024 * 1024) {
            canvas.toBlob(
              (lowerBlob) => {
                if (!lowerBlob) {
                  resolve(compressedFile)
                  return
                }
                const lowerFile = new File([lowerBlob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })
                console.log(
                  `[CompressedUpload] Re-compressed: ${(lowerFile.size / 1024 / 1024).toFixed(2)}MB`
                )
                resolve(lowerFile)
              },
              'image/jpeg',
              0.6
            )
          } else {
            resolve(compressedFile)
          }
        },
        'image/jpeg',
        0.8
      )
    }

    img.onerror = () => {
      console.warn('[CompressedUpload] Failed to load image, using original')
      resolve(file)
    }

    // Load image
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

/**
 * Custom Upload component that compresses images before upload
 * to stay within Vercel's 5MB serverless function limit.
 */
export function CompressedUpload(props: UploadProps) {
  const { onChange, ...rest } = props

  // Wrap the onChange handler to compress files before passing to Payload
  const handleChange = useCallback(
    async (incomingValue: File | File[] | FileList) => {
      // Handle array of files (bulk upload)
      if (Array.isArray(incomingValue)) {
        const compressedFiles = await Promise.all(
          incomingValue.map(file =>
            file instanceof File && file.type.startsWith('image/')
              ? compressImage(file)
              : file
          )
        )
        onChange?.(compressedFiles as unknown as File)
        return
      }

      // Handle FileList (multiple files from input)
      if (incomingValue instanceof FileList) {
        const files = Array.from(incomingValue)
        const compressedFiles = await Promise.all(
          files.map(file =>
            file.type.startsWith('image/')
              ? compressImage(file)
              : file
          )
        )
        onChange?.(compressedFiles as unknown as File)
        return
      }

      // Handle single file
      if (incomingValue instanceof File && incomingValue.type.startsWith('image/')) {
        const compressed = await compressImage(incomingValue)
        onChange?.(compressed)
        return
      }

      // For other values (non-images, small files), pass through
      onChange?.(incomingValue)
    },
    [onChange]
  )

  return <Upload {...rest} onChange={handleChange} />
}

export default CompressedUpload
