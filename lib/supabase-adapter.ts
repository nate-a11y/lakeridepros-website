import { createClient } from '@supabase/supabase-js'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''
const bucket = 'media'

export const supabaseAdapter = (): Adapter => {
  const supabase = createClient(supabaseUrl, supabaseKey)

  return {
    name: 'supabase',
    async handleUpload({ data, file }) {
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
    async handleDelete({ filename }) {
      const { error } = await supabase.storage.from(bucket).remove([filename])

      if (error) {
        throw new Error(`Delete failed: ${error.message}`)
      }
    },
    async generateURL({ filename }) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
      return data.publicUrl
    },
  }
}
