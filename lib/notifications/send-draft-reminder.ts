/**
 * Send Draft Reminder Email
 * Reminds applicants to complete their abandoned draft applications
 */

import { logNotification } from './notification-logger'
import { generateResumeUrl } from '@/lib/resume-link'

const SEND_EMAIL_URL = `${process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`

export interface DraftReminderData {
  applicationId: string
  firstName?: string
  lastName?: string
  email: string
  lastUpdated: string
  currentStep: number
  totalSteps: number
}

/**
 * Send draft reminder email
 */
export async function sendDraftReminder(
  data: DraftReminderData
): Promise<{ success: boolean; error?: string }> {
  const templateName = 'draft-reminder'

  try {
    // Generate secure resume URL
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lakeridepros.com'
    const resumeUrl = generateResumeUrl(data.applicationId, data.email, baseUrl)

    // Calculate progress percentage
    const progressPercentage = Math.round((data.currentStep / data.totalSteps) * 100)

    // Format last updated date
    const lastUpdatedDate = new Date(data.lastUpdated).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const applicantName = data.firstName && data.lastName
      ? `${data.firstName} ${data.lastName}`
      : data.firstName || 'there'

    // Email HTML template with Lake Ride Pros branding
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #060606 0%, #1a1a1a 100%); border-radius: 8px;">
          <img src="https://dhwnlzborisjihhauchp.supabase.co/storage/v1/object/public/media/icon-512.png" alt="Lake Ride Pros" style="width: 60px; height: 60px; margin-bottom: 15px;" />
          <h1 style="color: #4cbb17; margin: 0 0 10px 0; font-size: 24px;">Lake Ride Pros</h1>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin-bottom: 10px;">Complete Your Driver Application</h2>
          <p style="color: #666666; font-size: 16px;">Hi ${applicantName},</p>
        </div>

        <p style="color: #374151; line-height: 1.6;">
          We noticed you started a driver employment application with <strong>Lake Ride Pros</strong>
          but haven't finished it yet. Good news – your progress has been saved!
        </p>

        <div style="background-color: rgba(76, 187, 23, 0.1); border-left: 4px solid #4cbb17; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #3a8e11;">
            Your Application Progress
          </p>
          <div style="background-color: rgba(76, 187, 23, 0.2); border-radius: 10px; height: 24px; margin: 10px 0;">
            <div style="background-color: #4cbb17; border-radius: 10px; height: 100%; width: ${progressPercentage}%; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 12px; font-weight: bold;">${progressPercentage}%</span>
            </div>
          </div>
          <p style="margin: 10px 0 0 0; color: #3a8e11; font-size: 14px;">
            Step ${data.currentStep} of ${data.totalSteps} completed
          </p>
        </div>

        <p style="color: #374151; line-height: 1.6;">
          You can continue right where you left off by clicking the button below.
          Your application will be loaded with all your saved information.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resumeUrl}" style="background: #4cbb17; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
            Resume My Application
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 10px;">
            This link will expire in 3 days for security
          </p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Application Details:</strong></p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
            <strong>Application ID:</strong> <code style="background: white; padding: 2px 6px; border-radius: 3px;">${data.applicationId}</code>
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
            <strong>Email:</strong> <a href="mailto:owners@lakeridepros.com" style="color: #4cbb17;">owners@lakeridepros.com</a>
          </p>
          <p style="margin: 5px 0;">
            <strong>Phone:</strong> <a href="tel:+15735522628" style="color: #4cbb17;">(573) 552-2628</a>
          </p>
          <p style="margin: 15px 0 5px 0; color: #666666; font-size: 14px;">
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

    // Send email via Supabase Edge Function
    const response = await fetch(SEND_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        operation: 'sendNotificationEmail',
        params: {
          to: data.email,
          subject: 'Complete Your Driver Application - Lake Ride Pros',
          message: `Complete your driver application with Lake Ride Pros. Application ID: ${data.applicationId}`,
          html: htmlContent,
          replyTo: 'contactus@lakeridepros.com'
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Email send failed: ${errorText}`)
    }

    const result = await response.json()

    // Log successful notification
    await logNotification({
      application_id: data.applicationId,
      notification_type: 'email',
      template_name: templateName,
      recipient: data.email,
      subject: 'Complete Your Driver Application - Lake Ride Pros',
      status: 'sent',
      metadata: {
        firstName: data.firstName,
        lastName: data.lastName,
        currentStep: data.currentStep,
        totalSteps: data.totalSteps,
        progressPercentage
      },
      external_id: result.messageId || result.id
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending draft reminder:', error)

    // Log failed notification
    await logNotification({
      application_id: data.applicationId,
      notification_type: 'email',
      template_name: templateName,
      recipient: data.email,
      subject: 'Complete Your Driver Application - Lake Ride Pros',
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    }
  }
}
