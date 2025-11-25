/**
 * Send Email Edge Function (Website)
 * Handles email sending for lakeridepros-website
 * Uses Resend API for delivery
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('Missing RESEND_API_KEY environment variable')
    }

    const { operation, params } = await req.json()

    let result

    switch (operation) {
      case 'sendNotificationEmail': {
        const { to, subject, message, html, replyTo } = params

        if (!to || !subject || !message) {
          return new Response(JSON.stringify({
            error: 'Missing required fields: to, subject, message'
          }), {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          })
        }

        const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'contactus@send.updates.lakeridepros.com'
        const defaultReplyTo = replyTo || 'contactus@lakeridepros.com'

        const emailData: Record<string, unknown> = {
          from: `Lake Ride Pros <${fromEmail}>`,
          to: [to.trim()],
          subject,
          text: message,
          reply_to: defaultReplyTo
        }

        if (html) {
          emailData.html = html
        }

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Resend API error')
        }

        result = {
          success: true,
          messageId: data.id
        }
        break
      }

      case 'sendShuttleTicketEmail': {
        const { ticketId, email, attachment } = params

        if (!ticketId || !email || !attachment) {
          return new Response(JSON.stringify({
            error: 'Missing required fields: ticketId, email, attachment'
          }), {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          })
        }

        const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'contactus@send.updates.lakeridepros.com'
        const subject = `Lake Ride Pros Shuttle Ticket ${ticketId}`
        const text = `Attached is your Lake Ride Pros shuttle ticket ${ticketId}. Please present it during boarding.`

        const emailData = {
          from: `Lake Ride Pros <${fromEmail}>`,
          to: [email.trim()],
          subject,
          text,
          reply_to: 'contactus@lakeridepros.com',
          attachments: [
            {
              filename: `${ticketId}.png`,
              content: attachment
            }
          ]
        }

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Resend API error')
        }

        result = {
          success: true,
          messageId: data.id
        }
        break
      }

      case 'sendBulkTicketsEmail': {
        const { to, subject, message, attachments } = params

        if (!to || !subject || !message || !Array.isArray(attachments) || attachments.length === 0) {
          return new Response(JSON.stringify({
            error: 'Missing required fields: to, subject, message, attachments'
          }), {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          })
        }

        const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'contactus@send.updates.lakeridepros.com'

        const emailData = {
          from: `Lake Ride Pros <${fromEmail}>`,
          to: [to.trim()],
          subject,
          text: message,
          reply_to: 'contactus@lakeridepros.com',
          attachments
        }

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Resend API error')
        }

        result = {
          success: true,
          messageId: data.id,
          sent: attachments.length,
          total: attachments.length
        }
        break
      }

      default:
        return new Response(JSON.stringify({
          error: `Unknown operation: ${operation}`
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        })
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Send email error:', error)
    return new Response(JSON.stringify({
      error: (error as Error).message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
})
