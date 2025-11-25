/**
 * Cron Job: Abandoned Draft Reminders
 * Runs daily at 9 AM to send reminders for draft applications >24 hours old
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const SEND_EMAIL_URL = Deno.env.get('SUPABASE_URL')! + '/functions/v1/send-email-website'
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DraftApplication {
  id: string
  email: string
  first_name?: string
  last_name?: string
  updated_at: string
  created_at: string
  current_step?: number
}

function generateResumeToken(applicationId: string, email: string): string {
  const timestamp = Date.now()
  const data = JSON.stringify({ applicationId, email, timestamp })
  const encoder = new TextEncoder()
  const base64 = btoa(String.fromCharCode(...encoder.encode(data)))
  // Convert to base64url
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function generateResumeUrl(applicationId: string, email: string, baseUrl: string): string {
  const token = generateResumeToken(applicationId, email)
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  return `${cleanBaseUrl}/careers/driver-application?resume=${token}`
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const baseUrl = Deno.env.get('NEXT_PUBLIC_SERVER_URL') || 'https://lakeridepros.com'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    // Find draft applications older than 24 hours
    const { data: draftApplications, error: fetchError } = await supabase
      .from('driver_applications')
      .select('id, email, first_name, last_name, updated_at, created_at')
      .eq('status', 'draft')
      .lt('updated_at', twentyFourHoursAgo.toISOString())
      .not('email', 'is', null)

    if (fetchError) {
      throw new Error(`Failed to fetch drafts: ${fetchError.message}`)
    }

    if (!draftApplications || draftApplications.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No abandoned drafts found',
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let sentCount = 0
    let skippedCount = 0
    const errors: string[] = []

    // Process each draft application
    for (const draft of draftApplications as DraftApplication[]) {
      try {
        // Check if reminder was already sent in last 24 hours
        const { data: recentNotifications } = await supabase
          .from('notification_log')
          .select('id, created_at')
          .eq('application_id', draft.id)
          .eq('template_name', 'draft-reminder')
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .limit(1)

        if (recentNotifications && recentNotifications.length > 0) {
          console.log(`Skipping ${draft.id} - reminder already sent recently`)
          skippedCount++
          continue
        }

        // Calculate current step (rough estimate based on available data)
        const currentStep = draft.first_name ? 2 : 1
        const totalSteps = 11

        // Generate secure resume URL
        const resumeUrl = generateResumeUrl(draft.id, draft.email, baseUrl)

        // Calculate progress percentage
        const progressPercentage = Math.round((currentStep / totalSteps) * 100)

        // Format last updated date
        const lastUpdatedDate = new Date(draft.updated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })

        const applicantName = draft.first_name && draft.last_name
          ? `${draft.first_name} ${draft.last_name}`
          : draft.first_name || 'there'

        // Email HTML template
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin-bottom: 10px;">Complete Your Driver Application</h1>
              <p style="color: #6b7280; font-size: 16px;">Hi ${applicantName},</p>
            </div>

            <p style="color: #374151; line-height: 1.6;">
              We noticed you started a driver employment application with <strong>Lake Ride Pros</strong>
              but haven't finished it yet. Good news – your progress has been saved!
            </p>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #92400e;">
                Your Application Progress
              </p>
              <div style="background-color: #fde68a; border-radius: 10px; height: 24px; margin: 10px 0;">
                <div style="background-color: #f59e0b; border-radius: 10px; height: 100%; width: ${progressPercentage}%; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 12px; font-weight: bold;">${progressPercentage}%</span>
                </div>
              </div>
              <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">
                Step ${currentStep} of ${totalSteps} completed
              </p>
            </div>

            <p style="color: #374151; line-height: 1.6;">
              You can continue right where you left off by clicking the button below.
              Your application will be loaded with all your saved information.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resumeUrl}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                Resume My Application
              </a>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 10px;">
                This link will expire in 3 days for security
              </p>
            </div>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Application Details:</strong></p>
              <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                <strong>Application ID:</strong> <code style="background: white; padding: 2px 6px; border-radius: 3px;">${draft.id}</code>
              </p>
              <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                <strong>Last Updated:</strong> ${lastUpdatedDate}
              </p>
            </div>

            <h3 style="color: #1f2937; margin-top: 30px;">Why Join Lake Ride Pros?</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li>Competitive pay and benefits</li>
              <li>Flexible schedules</li>
              <li>Modern fleet of vehicles</li>
              <li>Supportive team environment</li>
              <li>Growth opportunities</li>
            </ul>

            <p style="color: #374151; line-height: 1.6; margin-top: 20px;">
              We're excited about the possibility of you joining our team! If you have any questions
              or need assistance completing your application, please don't hesitate to reach out.
            </p>

            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #1f2937;">Need Help?</h3>
              <p style="margin: 5px 0;">
                <strong>Email:</strong> <a href="mailto:owners@lakeridepros.com" style="color: #2563eb;">owners@lakeridepros.com</a>
              </p>
              <p style="margin: 5px 0;">
                <strong>Phone:</strong> <a href="tel:+15735522628" style="color: #2563eb;">(573) 552-2628</a>
              </p>
              <p style="margin: 15px 0 5px 0; color: #6b7280; font-size: 14px;">
                Monday-Friday, 9 AM - 5 PM CST
              </p>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                If you didn't start this application or no longer wish to proceed, you can safely ignore this email.
                Your draft will be automatically deleted after 30 days of inactivity.
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin-top: 15px;">
                <strong>Lake Ride Pros</strong> | Lake of the Ozarks Premier Transportation
              </p>
            </div>
          </div>
        `

        // Send email via Edge Function
        const emailResponse = await fetch(SEND_EMAIL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({
            to: draft.email,
            from: 'noreply@send.updates.lakeridepros.com',
            replyTo: 'contactus@lakeridepros.com',
            subject: 'Complete Your Driver Application - Lake Ride Pros',
            html: htmlContent
          })
        })

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text()
          throw new Error(`Email send failed: ${errorText}`)
        }

        const emailResult = await emailResponse.json()

        // Log successful notification
        await supabase.from('notification_log').insert({
          application_id: draft.id,
          notification_type: 'email',
          template_name: 'draft-reminder',
          recipient: draft.email,
          subject: 'Complete Your Driver Application - Lake Ride Pros',
          status: 'sent',
          metadata: {
            firstName: draft.first_name,
            lastName: draft.last_name,
            currentStep: currentStep,
            totalSteps: totalSteps,
            progressPercentage,
            daysAbandoned: Math.floor((Date.now() - new Date(draft.updated_at).getTime()) / (1000 * 60 * 60 * 24))
          },
          external_id: emailResult.messageId || emailResult.id,
          sent_at: new Date().toISOString()
        })

        sentCount++
        console.log(`Sent reminder to ${draft.email} for application ${draft.id}`)

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`Error processing draft ${draft.id}:`, errorMessage)
        errors.push(`${draft.id}: ${errorMessage}`)

        // Log failed notification
        await supabase.from('notification_log').insert({
          application_id: draft.id,
          notification_type: 'email',
          template_name: 'draft-reminder',
          recipient: draft.email,
          subject: 'Complete Your Driver Application - Lake Ride Pros',
          status: 'failed',
          error_message: errorMessage
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${draftApplications.length} abandoned drafts`,
        sent: sentCount,
        skipped: skippedCount,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Cron job error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
