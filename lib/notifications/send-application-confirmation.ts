/**
 * Send Application Confirmation Email
 * Sends confirmation email to applicant after successful submission
 * COMPLIANCE: 49 CFR 391.21 - Applicant communication requirement
 */

import { logNotification } from './notification-logger'

const SEND_EMAIL_URL = `${process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email-website`

export interface ApplicationConfirmationData {
  applicationId: string
  firstName: string
  lastName: string
  email: string
  submittedAt: string
}

/**
 * Send application confirmation email
 */
export async function sendApplicationConfirmation(
  data: ApplicationConfirmationData
): Promise<{ success: boolean; error?: string }> {
  const templateName = 'application-confirmation'

  try {
    // Create tracking URL with prefilled application ID
    const trackingUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://lakeridepros.com'}/careers/application-status?id=${data.applicationId}`

    // Format submitted date
    const submittedDate = new Date(data.submittedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Email HTML template with Lake Ride Pros branding
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #060606 0%, #1a1a1a 100%); border-radius: 8px;">
          <img src="https://dhwnlzborisjihhauchp.supabase.co/storage/v1/object/public/media/icon-512.png" alt="Lake Ride Pros" style="width: 80px; height: 80px; margin-bottom: 15px;" />
          <h1 style="color: #4cbb17; margin: 0 0 10px 0; font-size: 28px;">Lake Ride Pros</h1>
          <p style="color: #ffffff; font-size: 14px; margin: 0;">Premier Transportation at Lake of the Ozarks</p>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin-bottom: 10px;">Thank you for your application, ${data.firstName}!</h2>
          <p style="color: #666666; font-size: 16px;">We have received your driver employment application.</p>
        </div>

        <div style="background-color: rgba(76, 187, 23, 0.1); border-left: 4px solid #4cbb17; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Application ID:</strong></p>
          <p style="font-family: monospace; font-size: 16px; color: #3a8e11; margin: 0;">${data.applicationId}</p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Submitted:</strong> ${submittedDate}</p>
          <p style="margin: 0;"><strong>Status:</strong> <span style="color: #4cbb17; font-weight: bold;">Under Review</span></p>
        </div>

        <h2 style="color: #1f2937; font-size: 20px; margin-top: 30px;">What happens next?</h2>
        <ol style="line-height: 1.8; color: #374151;">
          <li>Your application will be reviewed within <strong>3-5 business days</strong></li>
          <li>We will verify your driving record and conduct necessary background checks</li>
          <li>You will receive an email when your status changes</li>
          <li>If approved, we will contact you regarding next steps and interview scheduling</li>
        </ol>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${trackingUrl}" style="background: #4cbb17; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Track Your Application Status
          </a>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Need Help?</h3>
          <p style="margin: 5px 0;">
            <strong>Email:</strong> <a href="mailto:owners@lakeridepros.com" style="color: #4cbb17;">owners@lakeridepros.com</a>
          </p>
          <p style="margin: 5px 0;">
            <strong>Phone:</strong> <a href="tel:+15732069499" style="color: #4cbb17;">(573) 206-9499</a>
          </p>
          <p style="margin: 15px 0 5px 0; color: #666666; font-size: 14px;">
            Our hiring team is available Monday-Friday, 9 AM - 5 PM CST
          </p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #666666; font-size: 12px; line-height: 1.6; margin: 0;">
            <strong>Lake Ride Pros</strong> is an equal opportunity employer committed to diversity and inclusion.
            All employment decisions are made without regard to race, color, religion, sex, national origin,
            age, disability, veteran status, or any other legally protected status.
          </p>
          <p style="color: #9ca3af; font-size: 11px; margin-top: 15px;">
            This application complies with 49 CFR 391.21 federal regulations.
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
          subject: 'Application Received - Lake Ride Pros Driver Position',
          message: `Your driver application has been received! Application ID: ${data.applicationId}`,
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
      subject: 'Application Received - Lake Ride Pros Driver Position',
      status: 'sent',
      metadata: {
        firstName: data.firstName,
        lastName: data.lastName,
        submittedAt: data.submittedAt
      },
      external_id: result.messageId
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending application confirmation:', error)

    // Log failed notification
    await logNotification({
      application_id: data.applicationId,
      notification_type: 'email',
      template_name: templateName,
      recipient: data.email,
      subject: 'Application Received - Lake Ride Pros Driver Position',
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    }
  }
}
