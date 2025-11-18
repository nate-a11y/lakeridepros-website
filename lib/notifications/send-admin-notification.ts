/**
 * Send Admin Notification Email
 * Notifies admin when a new driver application is submitted
 */

import { logNotification } from './notification-logger'

const SEND_EMAIL_URL = 'https://dhwnlzborisjihhauchp.supabase.co/functions/v1/send-email'

export interface AdminNotificationData {
  applicationId: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  submittedAt: string
  currentLicenseState?: string
  currentLicenseNumber?: string
  yearsExperience?: number
  hasCDL?: boolean
}

/**
 * Send admin notification email
 */
export async function sendAdminNotification(
  data: AdminNotificationData
): Promise<{ success: boolean; error?: string }> {
  const templateName = 'admin-notification'
  const adminEmail = 'owners@lakeridepros.com'

  try {
    const applicantName = data.firstName && data.lastName
      ? `${data.firstName} ${data.lastName}`
      : data.firstName || data.lastName || 'Unknown Applicant'

    // Format submission date
    const submittedDate = new Date(data.submittedAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    // Link to LRP Driver Portal
    const portalUrl = 'https://lakeridepros.xyz/applications'

    // Email HTML template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🚗 New Driver Application Received</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Lake Ride Pros Driver Application System</p>
        </div>

        <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Application Summary</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb; font-weight: bold; width: 180px;">Applicant Name:</td>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb;">${applicantName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb;">
                <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a>
              </td>
            </tr>
            ${data.phone ? `
            <tr>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb;">
                <a href="tel:${data.phone}" style="color: #2563eb;">${data.phone}</a>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb; font-weight: bold;">Application ID:</td>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb;">
                <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${data.applicationId}</code>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb; font-weight: bold;">Submitted:</td>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb;">${submittedDate}</td>
            </tr>
          </table>

          ${data.currentLicenseState || data.currentLicenseNumber || data.yearsExperience !== undefined || data.hasCDL !== undefined ? `
          <h3 style="color: #1f2937; margin-top: 30px; font-size: 18px;">Quick Details</h3>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            ${data.currentLicenseState ? `
            <tr>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb; font-weight: bold; width: 180px;">License State:</td>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb;">${data.currentLicenseState}</td>
            </tr>
            ` : ''}
            ${data.currentLicenseNumber ? `
            <tr>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb; font-weight: bold;">License Number:</td>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb;">${data.currentLicenseNumber}</td>
            </tr>
            ` : ''}
            ${data.yearsExperience !== undefined ? `
            <tr>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb; font-weight: bold;">Years Experience:</td>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb;">${data.yearsExperience} years</td>
            </tr>
            ` : ''}
            ${data.hasCDL !== undefined ? `
            <tr>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb; font-weight: bold;">CDL License:</td>
              <td style="padding: 12px; background-color: white; border: 1px solid #e5e7eb;">
                <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; ${data.hasCDL ? 'background-color: #dcfce7; color: #166534;' : 'background-color: #f3f4f6; color: #6b7280;'}">
                  ${data.hasCDL ? 'Yes' : 'No'}
                </span>
              </td>
            </tr>
            ` : ''}
          </table>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${portalUrl}" style="background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
              View in LRP Driver Portal
            </a>
          </div>

          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #1e40af; font-weight: bold;">📋 Next Steps:</p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #1e40af;">
              <li>Review the complete application details</li>
              <li>Verify license information and documentation</li>
              <li>Check employment history and references</li>
              <li>Schedule interview if qualified</li>
              <li>Update application status accordingly</li>
            </ul>
          </div>

          <div style="background-color: white; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0; border-radius: 6px;">
            <h4 style="margin-top: 0; color: #1f2937;">Compliance Note</h4>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              This application has been submitted in compliance with <strong>49 CFR 391.21</strong>
              federal regulations for commercial motor vehicle driver applications. All required
              information has been collected and verified.
            </p>
          </div>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            This is an automated notification from the Lake Ride Pros Driver Application System.
          </p>
          <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
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
          to: adminEmail,
          subject: `New Driver Application - ${applicantName}`,
          message: `New driver application received from ${applicantName}. Application ID: ${data.applicationId}`,
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
      recipient: adminEmail,
      subject: `New Driver Application - ${applicantName}`,
      status: 'sent',
      metadata: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        currentLicenseState: data.currentLicenseState,
        yearsExperience: data.yearsExperience,
        hasCDL: data.hasCDL
      },
      external_id: result.messageId
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending admin notification:', error)

    // Log failed notification
    await logNotification({
      application_id: data.applicationId,
      notification_type: 'email',
      template_name: templateName,
      recipient: adminEmail,
      subject: `New Driver Application - ${data.firstName} ${data.lastName}`,
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    }
  }
}
