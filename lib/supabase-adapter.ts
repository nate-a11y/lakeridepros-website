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
      const supabase = getSupabaseClient()

      // Build the file path with prefix if provided
      const filePath = prefix ? `${prefix}/${file.filename}` : file.filename

      // Upload the buffer to Supabase
      const { data: uploadData, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, data, {
          contentType: file.mimeType,
          upsert: true,
        })

      if (error) {
        throw new Error(`Supabase upload failed: ${error.message}`)
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return urlData.publicUrl
    },
    handleDelete: async ({ filename }) => {
      const supabase = getSupabaseClient()

      // Build the file path with prefix if provided
      const filePath = prefix ? `${prefix}/${filename}` : filename

      const { error } = await supabase.storage.from(bucket).remove([filePath])

      if (error) {
        throw new Error(`Supabase delete failed: ${error.message}`)
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
    },
  }
}
