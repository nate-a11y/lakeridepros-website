import { createClient } from '@supabase/supabase-js'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'

const bucket = 'media'

export const supabaseAdapter: Adapter = ({ collection, prefix }) => {
  return {
    name: 'supabase',
    handleUpload: async ({ data, file }) => {
      const supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_KEY || ''
      )

      const { data: uploadData, error } = await supabase.storage
        .from(bucket)
        .upload(file.filename, data.file, {
          contentType: file.mimeType,
          upsert: true,
        })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(file.filename)

      return {
        ...data,
        url: urlData.publicUrl,
      }
    },
    handleDelete: async ({ filename }) => {
      const supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_KEY || ''
      )

      const { error } = await supabase.storage.from(bucket).remove([filename])

      if (error) {
        throw new Error(`Delete failed: ${error.message}`)
      }
    },
    generateURL: ({ filename }) => {
      const supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_KEY || ''
      )

      const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
      return data.publicUrl
    },
    staticHandler: async (req, { params }) => {
      const supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_KEY || ''
      )

      const { data, error } = await supabase.storage
        .from(bucket)
        .download(params.filename)

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
