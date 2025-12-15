import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { syncPrintifyProducts } from '@/lib/inngest/functions/sync-printify'
import { postBlogToSocial, sharePostNow } from '@/lib/inngest/functions/post-to-social'

// Create the Inngest API handler with all functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncPrintifyProducts,
    postBlogToSocial,
    sharePostNow,
  ],
})
