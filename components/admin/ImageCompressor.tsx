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
 */
export function ImageCompressor() {
  useEffect(() => {
    // Override the native file input to compress images before upload
    const handleChange = async (event: Event) => {
      const input = event.target as HTMLInputElement

      // Only handle file inputs with files
      if (input.type !== 'file' || !input.files?.length) {
        return
      }

      // Check if this is an image upload
      const files = Array.from(input.files)
      const hasImages = files.some(f => f.type.startsWith('image/'))

      if (!hasImages) {
        return
      }

      // Prevent the default change event from propagating
      event.stopImmediatePropagation()

      // Compress all image files
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.type.startsWith('image/')) {
            return compressImage(file)
          }
          return file
        })
      )

      // Create a new FileList-like object with compressed files
      const dataTransfer = new DataTransfer()
      compressedFiles.forEach(file => dataTransfer.items.add(file))

      // Replace the input's files with compressed versions
      input.files = dataTransfer.files

      // Dispatch a new change event with the compressed files
      const newEvent = new Event('change', { bubbles: true })
      input.dispatchEvent(newEvent)
    }

    // Add listener to capture file input changes
    document.addEventListener('change', handleChange, true)

    console.log('[ImageCompressor] Client-side image compression enabled')

    return () => {
      document.removeEventListener('change', handleChange, true)
    }
  }, [])

  // This component doesn't render anything
  return null
}

export default ImageCompressor
