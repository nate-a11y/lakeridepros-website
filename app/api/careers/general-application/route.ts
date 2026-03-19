import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      positions,
      fullName,
      email,
      phone,
      cityState,
      howDidYouHear,
      aboutYourself,
      workExperience,
      socialFacebook,
      socialInstagram,
      socialX,
      socialTikTok,
      turnstileToken,
      resumeBase64,
      resumeFileName,
    } = body

    // Validate required fields
    if (!fullName || !email || !phone || !positions?.length || !cityState || !aboutYourself || !workExperience) {
      return NextResponse.json(
        { error: 'Please fill out all required fields.' },
        { status: 400 }
      )
    }

    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Please complete the security verification.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Verify Turnstile token
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
    if (!turnstileSecret) {
      console.error('TURNSTILE_SECRET_KEY is not configured')
      return NextResponse.json(
        { error: 'Security verification is not configured.' },
        { status: 500 }
      )
    }

    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
      }
    )

    const turnstileResult = await turnstileResponse.json()
    if (!turnstileResult.success) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Set up Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service is not configured.' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Build email HTML
    const positionList = (positions as string[]).join(', ')
    const applicationHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /></head>
<body style="font-family: 'Montserrat', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #4cbb17; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Application: Sales/Brand Ambassador</h1>
    </div>
    <div style="padding: 24px;">
      <h2 style="color: #060606; font-size: 20px; margin-top: 0;">Applicant: ${escapeHtml(fullName)}</h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #060606; width: 40%;">Position(s)</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; color: #333333;">${escapeHtml(positionList)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #060606;">Email</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; color: #333333;"><a href="mailto:${escapeHtml(email)}" style="color: #3a8e11;">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #060606;">Phone</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; color: #333333;"><a href="tel:${escapeHtml(phone)}" style="color: #3a8e11;">${escapeHtml(phone)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #060606;">City, State</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; color: #333333;">${escapeHtml(cityState)}</td>
        </tr>
        ${howDidYouHear ? `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #060606;">How They Heard About Us</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; color: #333333;">${escapeHtml(howDidYouHear)}</td>
        </tr>
        ` : ''}
        ${socialFacebook || socialInstagram || socialX || socialTikTok ? `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #060606; vertical-align: top;">Social Media</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e5e5; color: #333333;">
            ${socialFacebook ? `Facebook: ${escapeHtml(socialFacebook)}<br/>` : ''}
            ${socialInstagram ? `Instagram: ${escapeHtml(socialInstagram)}<br/>` : ''}
            ${socialX ? `X: ${escapeHtml(socialX)}<br/>` : ''}
            ${socialTikTok ? `TikTok: ${escapeHtml(socialTikTok)}` : ''}
          </td>
        </tr>
        ` : ''}
      </table>

      <h3 style="color: #060606; font-size: 16px; margin-top: 24px;">About Themselves</h3>
      <p style="color: #333333; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(aboutYourself)}</p>

      <h3 style="color: #060606; font-size: 16px; margin-top: 24px;">Work Experience</h3>
      <p style="color: #333333; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(workExperience)}</p>

      ${resumeFileName ? '<p style="color: #3a8e11; font-size: 14px; margin-top: 24px;">Resume attached to this email.</p>' : ''}
    </div>
    <div style="background-color: #f5f5f5; padding: 16px; text-align: center;">
      <p style="color: #666666; font-size: 12px; margin: 0;">Lake Ride Pros Careers Portal</p>
    </div>
  </div>
</body>
</html>`

    // Build attachments array
    const attachments: Array<{ filename: string; content: string }> = []
    if (resumeBase64 && resumeFileName) {
      attachments.push({
        filename: resumeFileName,
        content: resumeBase64,
      })
    }

    // Send notification email to owners
    const { error: ownerEmailError } = await resend.emails.send({
      from: 'Lake Ride Pros Careers <careers@lakeridepros.com>',
      to: 'owners@lakeridepros.com',
      subject: `New Application: Sales/Brand Ambassador - ${fullName}`,
      html: applicationHtml,
      ...(attachments.length > 0 ? { attachments } : {}),
    })

    if (ownerEmailError) {
      console.error('Error sending owner notification email:', ownerEmailError)
      return NextResponse.json(
        { error: 'Failed to submit application. Please try again.' },
        { status: 500 }
      )
    }

    // Send confirmation email to applicant
    const confirmationHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /></head>
<body style="font-family: 'Montserrat', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #4cbb17; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Application Received</h1>
    </div>
    <div style="padding: 24px;">
      <p style="color: #060606; font-size: 16px; line-height: 1.6;">Hi ${escapeHtml(fullName)},</p>
      <p style="color: #333333; font-size: 16px; line-height: 1.6;">
        Thank you for applying to the <strong>${escapeHtml(positionList)}</strong> position${(positions as string[]).length > 1 ? 's' : ''} at Lake Ride Pros!
      </p>
      <p style="color: #333333; font-size: 16px; line-height: 1.6;">
        We have received your application and a member of our team will review it shortly. You can expect to hear from us within 2-3 business days.
      </p>
      <p style="color: #333333; font-size: 16px; line-height: 1.6;">
        If you have any questions in the meantime, feel free to reach out to us at
        <a href="mailto:owners@lakeridepros.com" style="color: #3a8e11;">owners@lakeridepros.com</a>.
      </p>
      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-top: 24px;">
        Best regards,<br />
        The Lake Ride Pros Team
      </p>
    </div>
    <div style="background-color: #f5f5f5; padding: 16px; text-align: center;">
      <p style="color: #666666; font-size: 12px; margin: 0;">Lake Ride Pros | Lake of the Ozarks, MO</p>
    </div>
  </div>
</body>
</html>`

    const { error: confirmationEmailError } = await resend.emails.send({
      from: 'Lake Ride Pros Careers <careers@lakeridepros.com>',
      to: email,
      subject: 'Application Received - Lake Ride Pros',
      html: confirmationHtml,
    })

    if (confirmationEmailError) {
      // Log but don't fail - the main submission succeeded
      console.error('Error sending confirmation email:', confirmationEmailError)
    }

    return NextResponse.json(
      { message: 'Application submitted successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('General application submission error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
