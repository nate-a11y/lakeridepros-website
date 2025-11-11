import { createClient } from '@supabase/supabase-js'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'

const bucket = 'media'

// Create singleton Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

const getSupabaseClient = () => {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL?.trim()
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

    if (!url || !key) {
      throw new Error(
        `Missing Supabase credentials. SUPABASE_URL: ${url ? 'set' : 'MISSING'}, SUPABASE_SERVICE_ROLE_KEY: ${key ? 'set' : 'MISSING'}`
      )
    }

    // Validate URL format
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      throw new Error(
        `Invalid SUPABASE_URL format. Got: "${url}". Expected format: https://xxxxx.supabase.co`
      )
    }

    supabaseClient = createClient(url, key)
  }
  return supabaseClient
}

export const supabaseAdapter: Adapter = ({ collection, prefix }) => {
  return {
    name: 'supabase',
    handleUpload: async ({ data, file }) => {
      try {
        const supabase = getSupabaseClient()

        // Build the file path with prefix if provided
        const filePath = prefix ? `${prefix}/${file.filename}` : file.filename

        // Convert data to proper buffer format
        let fileBuffer: Buffer | ArrayBuffer

        if (data instanceof Buffer) {
          // Already a Buffer
          fileBuffer = data
        } else if (data instanceof ArrayBuffer) {
          // Already an ArrayBuffer
          fileBuffer = data
        } else if (typeof data === 'object' && 'arrayBuffer' in data && typeof data.arrayBuffer === 'function') {
          // It's a Blob/File object, read the arrayBuffer
          fileBuffer = await data.arrayBuffer()
        } else if (typeof data === 'object' && 'buffer' in data) {
          // Check if data has a buffer property
          fileBuffer = data.buffer
        } else {
          throw new Error(`Unsupported file data type: ${typeof data}. Expected Buffer, ArrayBuffer, or Blob.`)
        }

        console.log(`[Supabase Adapter] Uploading ${file.filename}, size: ${fileBuffer.byteLength || (fileBuffer as Buffer).length} bytes`)

        // Upload the buffer to Supabase
        const { data: uploadData, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, fileBuffer, {
            contentType: file.mimeType,
            upsert: true,
          })

        if (error) {
          throw new Error(`Supabase upload failed: ${error.message}`)
        }

        console.log(`[Supabase Adapter] Successfully uploaded ${file.filename}`)

        // handleUpload should return void - URL generation is done by generateURL
      } catch (error) {
        console.error(`[Supabase Adapter] Error uploading ${file.filename}:`, error)
        throw error
      }
    },
    handleDelete: async ({ filename }) => {
      try {
        const supabase = getSupabaseClient()

        // Build the file path with prefix if provided
        const filePath = prefix ? `${prefix}/${filename}` : filename

        console.log(`[Supabase Adapter] Deleting ${filePath}`)

        const { error } = await supabase.storage.from(bucket).remove([filePath])

        if (error) {
          throw new Error(`Supabase delete failed: ${error.message}`)
        }

        console.log(`[Supabase Adapter] Successfully deleted ${filePath}`)
      } catch (error) {
        console.error(`[Supabase Adapter] Error deleting ${filename}:`, error)
        throw error
      }
    },
    generateURL: ({ filename }) => {
      const supabase = getSupabaseClient()

      // Build the file path with prefix if provided
      const filePath = prefix ? `${prefix}/${filename}` : filename

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
      return data.publicUrl
    },
    staticHandler: async (req, { params }) => {
      try {
        const supabase = getSupabaseClient()

        // Build the file path with prefix if provided
        const filePath = prefix ? `${prefix}/${params.filename}` : params.filename

        const { data, error } = await supabase.storage
          .from(bucket)
          .download(filePath)

        if (error || !data) {
          return new Response('File not found', { status: 404 })
        }

        const buffer = await data.arrayBuffer()
        return new Response(buffer, {
          headers: {
            'Content-Type': data.type || 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      } catch (error) {
        console.error(`[Supabase Adapter] Error in staticHandler for ${params.filename}:`, error)
        return new Response('Internal Server Error', { status: 500 })
      }
    },
  }
}
