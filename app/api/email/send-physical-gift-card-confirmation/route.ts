import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const { purchaserName, purchaserEmail, amount, shippingAddress } = await request.json()

    if (!purchaserName || !purchaserEmail || !amount || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const resend = getResend()

    const greenTheme = '#4cbb17'

    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <hello@updates.lakeridepros.com>',
      replyTo: 'contactus@lakeridepros.com',
      to: purchaserEmail,
      subject: 'Your Lake Ride Pros Physical Gift Card Order Confirmation',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Physical Gift Card Order Confirmation</title>
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
                            🎉 Order Confirmed!
                          </h1>
                          <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                            Your Physical Gift Card is Being Prepared
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
                          Thank you for your order! We've received your payment and are preparing your physical Lake Ride Pros gift card for shipment.
                        </p>

                        <!-- Order Details -->
                        <div style="background-color: #f8f9fa; border-left: 4px solid ${greenTheme}; padding: 20px; margin: 30px 0; border-radius: 4px;">
                          <h2 style="margin: 0 0 15px; color: #333333; font-size: 20px; font-weight: bold;">
                            Order Details
                          </h2>
                          <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                                <strong>Gift Card Amount:</strong>
                              </td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right;">
                                $${amount.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                                <strong>USPS Shipping:</strong>
                              </td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right;">
                                $5.00
                              </td>
                            </tr>
                            <tr style="border-top: 2px solid #dee2e6;">
                              <td style="padding: 12px 0 0; color: #333333; font-size: 16px;">
                                <strong>Total Paid:</strong>
                              </td>
                              <td style="padding: 12px 0 0; color: ${greenTheme}; font-size: 18px; font-weight: bold; text-align: right;">
                                $${(amount + 5).toFixed(2)}
                              </td>
                            </tr>
                          </table>
                        </div>

                        <!-- Shipping Address -->
                        <div style="background-color: #f8f9fa; border-left: 4px solid ${greenTheme}; padding: 20px; margin: 30px 0; border-radius: 4px;">
                          <h2 style="margin: 0 0 15px; color: #333333; font-size: 20px; font-weight: bold;">
                            📦 Shipping Address
                          </h2>
                          <div style="color: #333333; font-size: 15px; line-height: 1.8;">
                            <div><strong>${shippingAddress.name}</strong></div>
                            <div>${shippingAddress.street1}</div>
                            ${shippingAddress.street2 ? `<div>${shippingAddress.street2}</div>` : ''}
                            <div>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}</div>
                            <div>${shippingAddress.country || 'United States'}</div>
                          </div>
                        </div>

                        <!-- What's Next -->
                        <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 4px;">
                          <h3 style="margin: 0 0 12px; color: #856404; font-size: 18px; font-weight: bold;">
                            📬 What Happens Next?
                          </h3>
                          <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px; line-height: 1.8;">
                            <li>Your physical gift card will be shipped via USPS within 1-2 business days</li>
                            <li>The unique gift card code will be included inside the card</li>
                            <li>You'll receive a shipping confirmation email with USPS tracking information</li>
                            <li>Estimated delivery: 3-5 business days after shipment</li>
                          </ul>
                        </div>

                        <p style="margin: 30px 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          If you have any questions about your order, please don't hesitate to reach out to us at
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
      console.error('Failed to send physical gift card confirmation email:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Physical gift card confirmation email error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
