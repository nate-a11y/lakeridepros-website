import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

function formatScheduledDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  }
  return date.toLocaleString('en-US', options)
}

export async function POST(request: NextRequest) {
  try {
    const { purchaserName, purchaserEmail, amount, scheduledDate, recipientName, recipientEmail, message } = await request.json()

    if (!purchaserName || !purchaserEmail || !amount || !scheduledDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const resend = getResend()

    const greenTheme = '#4cbb17'
    const formattedDate = formatScheduledDate(scheduledDate)
    const isGift = recipientName && recipientEmail && recipientEmail !== purchaserEmail

    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <hello@updates.lakeridepros.com>',
      replyTo: 'contactus@lakeridepros.com',
      to: purchaserEmail,
      subject: isGift
        ? `Your Gift Card is Scheduled for Delivery to ${recipientName}`
        : 'Your Lake Ride Pros Gift Card is Scheduled',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Scheduled Gift Card Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 0;">
                        <div style="background: linear-gradient(135deg, ${greenTheme} 0%, #3a9c13 100%); padding: 40px; text-align: center;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                            📅 Scheduled Delivery Confirmed!
                          </h1>
                          <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                            Your Gift Card Will Be Sent Automatically
                          </p>
                        </div>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                          Hi ${purchaserName},
                        </p>

                        <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                          ${isGift
                            ? `Great news! Your gift card for <strong>${recipientName}</strong> has been scheduled and will be delivered automatically via email on your chosen date.`
                            : `Great news! Your gift card has been scheduled and will be delivered automatically via email on your chosen date.`
                          }
                        </p>

                        <!-- Scheduled Delivery Info -->
                        <div style="background: linear-gradient(135deg, ${greenTheme} 0%, #3a9c13 100%); padding: 30px; margin: 30px 0; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(76, 187, 23, 0.2);">
                          <div style="color: #ffffff; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; opacity: 0.9;">
                            Scheduled Delivery
                          </div>
                          <div style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 10px 0;">
                            📬 ${formattedDate}
                          </div>
                          <div style="color: #ffffff; font-size: 14px; margin-top: 15px; opacity: 0.95;">
                            Gift Card Value: <strong style="font-size: 20px;">$${amount.toFixed(2)}</strong>
                          </div>
                        </div>

                        ${isGift ? `
                        <!-- Recipient Info -->
                        <div style="background-color: #f8f9fa; border-left: 4px solid ${greenTheme}; padding: 20px; margin: 30px 0; border-radius: 4px;">
                          <h2 style="margin: 0 0 15px; color: #333333; font-size: 20px; font-weight: bold;">
                            🎁 Gift Recipient
                          </h2>
                          <div style="color: #333333; font-size: 15px; line-height: 1.8;">
                            <div><strong>Name:</strong> ${recipientName}</div>
                            <div><strong>Email:</strong> ${recipientEmail}</div>
                            ${message ? `
                            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                              <strong>Your Message:</strong>
                              <div style="margin-top: 8px; font-style: italic; color: #666666;">"${message}"</div>
                            </div>
                            ` : ''}
                          </div>
                        </div>
                        ` : ''}

                        <!-- What Happens Next -->
                        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; margin: 30px 0; border-radius: 4px;">
                          <h3 style="margin: 0 0 12px; color: #155724; font-size: 18px; font-weight: bold;">
                            ⚡ What Happens Next?
                          </h3>
                          <ul style="margin: 0; padding-left: 20px; color: #155724; font-size: 14px; line-height: 1.8;">
                            <li>Your gift card is safely stored in our system</li>
                            <li>${isGift
                              ? `On the scheduled date, ${recipientName} will receive an email with the gift card code`
                              : 'On the scheduled date, you will receive an email with your gift card code'
                            }</li>
                            <li>The email will include the unique redemption code and instructions</li>
                            <li>The gift card can be used immediately upon receipt</li>
                            <li>No action needed from you - it's fully automated! 🎉</li>
                          </ul>
                        </div>

                        ${isGift ? `
                        <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 4px;">
                          <h3 style="margin: 0 0 12px; color: #856404; font-size: 16px; font-weight: bold;">
                            💡 Pro Tip
                          </h3>
                          <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                            Want to make it extra special? Consider giving ${recipientName} a heads up that they have a surprise coming on ${formattedDate}!
                          </p>
                        </div>
                        ` : ''}

                        <p style="margin: 30px 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          If you need to make any changes or have questions, please contact us at
                          <a href="mailto:contactus@lakeridepros.com" style="color: ${greenTheme}; text-decoration: none;">contactus@lakeridepros.com</a>.
                        </p>

                        <p style="margin: 20px 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          Thank you for choosing Lake Ride Pros!
                        </p>

                        <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e0e0e0; text-align: center;">
                          <p style="margin: 0; color: #666666; font-size: 14px;">
                            Lake Ride Pros - Premium Water Sports Equipment & Services
                          </p>
                          <p style="margin: 10px 0 0; color: #6b7280; font-size: 12px;">
                            <a href="https://www.lakeridepros.com" style="color: ${greenTheme}; text-decoration: none;">www.lakeridepros.com</a>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send scheduled gift card confirmation email:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Scheduled gift card confirmation email error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
