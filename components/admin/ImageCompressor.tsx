'use client'

import { useEffect } from 'react'

/**
 * Compresses an image file using browser Canvas API
 * Target: < 4MB to stay within Vercel's 5MB limit with overhead
 */
async function compressImage(file: File): Promise<File> {
  // Only compress images
  if (!file.type.startsWith('image/')) {
    return file
  }

  // Skip if already small enough (under 2MB)
  if (file.size < 2 * 1024 * 1024) {
    return file
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      // Calculate new dimensions (max 2048px to reduce size before server resize to 1024)
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
        resolve(file)
        return
      }

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }

          // Create new file with same name but compressed
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })

          console.log(
            `[ImageCompressor] Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
          )

          // If compression didn't help much, try lower quality
          if (compressedFile.size > 4 * 1024 * 1024) {
            canvas.toBlob(
              (lowerBlob) => {
                if (!lowerBlob) {
                  resolve(compressedFile)
                  return
                }
                const lowerQualityFile = new File([lowerBlob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })
                console.log(
                  `[ImageCompressor] Re-compressed with lower quality: ${(lowerQualityFile.size / 1024 / 1024).toFixed(2)}MB`
                )
                resolve(lowerQualityFile)
              },
              'image/jpeg',
              0.6 // Lower quality for very large files
            )
          } else {
            resolve(compressedFile)
          }
        },
        'image/jpeg',
        0.8 // 80% quality
      )
    }

    img.onerror = () => {
      console.warn('[ImageCompressor] Failed to load image, using original')
      resolve(file)
    }

    // Load image from file
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Provider component that adds automatic image compression to all file inputs
 * in the Payload admin panel.
 *
 * Uses input event interception to compress images before Payload processes them.
 */
export function ImageCompressor() {
  useEffect(() => {
    // Store original files before compression
    const pendingCompressions = new Map<HTMLInputElement, Promise<void>>()

    // Intercept file selection and compress before Payload sees it
    const handleInputChange = async (event: Event) => {
      const input = event.target as HTMLInputElement

      // Only handle file inputs with image files
      if (input.type !== 'file' || !input.files?.length) {
        return
      }

      // Skip if already compressing this input
      if (pendingCompressions.has(input)) {
        return
      }

      const files = Array.from(input.files)
      const hasLargeImages = files.some(
        f => f.type.startsWith('image/') && f.size > 2 * 1024 * 1024
      )

      // Only compress if there are large images
      if (!hasLargeImages) {
        return
      }

      // Create compression promise
      const compressionTask = (async () => {
        try {
          // Compress all image files
          const compressedFiles = await Promise.all(
            files.map(async (file) => {
              if (file.type.startsWith('image/')) {
                return compressImage(file)
              }
              return file
            })
          )

          // Create new FileList with compressed files
          const dataTransfer = new DataTransfer()
          compressedFiles.forEach(file => dataTransfer.items.add(file))

          // Replace input files with compressed versions
          // This modifies the files that Payload will read when it processes the upload
          Object.defineProperty(input, 'files', {
            value: dataTransfer.files,
            writable: true,
            configurable: true,
          })
        } finally {
          pendingCompressions.delete(input)
        }
      })()

      pendingCompressions.set(input, compressionTask)
    }

    // Intercept form submissions to ensure compression completes first
    const handleSubmit = async (event: Event) => {
      const form = event.target as HTMLFormElement
      const fileInputs = form.querySelectorAll('input[type="file"]')

      // Wait for any pending compressions on this form's inputs
      const pendingTasks: Promise<void>[] = []
      fileInputs.forEach(input => {
        const task = pendingCompressions.get(input as HTMLInputElement)
        if (task) {
          pendingTasks.push(task)
        }
      })

      if (pendingTasks.length > 0) {
        event.preventDefault()
        await Promise.all(pendingTasks)
        // Re-submit after compression completes
        form.requestSubmit()
      }
    }

    // Listen for file input changes (capture phase to run before Payload)
    document.addEventListener('change', handleInputChange, true)
    document.addEventListener('submit', handleSubmit, true)

    return () => {
      document.removeEventListener('change', handleInputChange, true)
      document.removeEventListener('submit', handleSubmit, true)
    }
  }, [])

  // This component doesn't render anything
  return null
}

export default ImageCompressor
