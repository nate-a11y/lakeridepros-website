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
    const { giftCard, recipientName, recipientEmail, purchaserName, message } = await request.json()

    const isGift = recipientEmail && recipientEmail !== giftCard.purchaserEmail

    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <hello@updates.lakeridepros.com>',
      replyTo: 'contactus@lakeridepros.com',
      to: recipientEmail,
      subject: isGift
        ? `${purchaserName} sent you a Lake Ride Pros Gift Card!`
        : 'Your Lake Ride Pros Gift Card',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              background: linear-gradient(135deg, #4cbb17 0%, #3a8e11 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0 0 10px 0;
              font-size: 32px;
            }
            .content {
              padding: 40px 30px;
            }
            .gift-card {
              background: linear-gradient(135deg, #4cbb17 0%, #3a8e11 100%);
              color: white;
              padding: 30px;
              border-radius: 15px;
              margin: 30px 0;
              text-align: center;
            }
            .gift-card-code {
              background-color: white;
              color: #4cbb17;
              font-size: 28px;
              font-weight: bold;
              padding: 20px;
              border-radius: 10px;
              letter-spacing: 2px;
              margin: 20px 0;
              font-family: 'Courier New', monospace;
            }
            .message-box {
              background-color: #f5f5f5;
              padding: 20px;
              border-radius: 10px;
              border-left: 4px solid #4cbb17;
              margin: 20px 0;
              font-style: italic;
            }
            .button {
              display: inline-block;
              background-color: #4cbb17;
              color: white !important;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .instructions {
              background-color: #f9f9f9;
              padding: 25px;
              border-radius: 10px;
              margin: 30px 0;
            }
            .instructions h3 {
              color: #4cbb17;
              margin-top: 0;
            }
            .footer {
              text-align: center;
              padding: 30px 20px;
              color: #666;
              font-size: 14px;
              background-color: #f5f5f5;
            }
            .balance {
              font-size: 36px;
              font-weight: bold;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 Gift Card</h1>
              <p style="margin: 0; font-size: 18px;">Lake Ride Pros Luxury Transportation</p>
            </div>

            <div class="content">
              ${isGift ? `
                <h2 style="color: #333;">Hello ${recipientName}!</h2>
                <p style="font-size: 16px;">
                  <strong>${purchaserName}</strong> has sent you a gift card for luxury transportation
                  services at Lake of the Ozarks!
                </p>
              ` : `
                <h2 style="color: #333;">Hello ${recipientName}!</h2>
                <p style="font-size: 16px;">
                  Thank you for your gift card purchase! Your gift card is ready to use.
                </p>
              `}

              ${message ? `
                <div class="message-box">
                  <strong>Personal Message:</strong><br>
                  "${message}"
                </div>
              ` : ''}

              <div class="gift-card">
                <p style="margin: 0 0 10px 0; font-size: 18px;">Gift Card Balance</p>
                <div class="balance">$${giftCard.currentBalance.toFixed(2)}</div>

                <p style="margin: 20px 0 10px 0; font-size: 16px;">Your Gift Card Code:</p>
                <div class="gift-card-code">
                  ${giftCard.code}
                </div>

                <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
                  Never expires • Valid for all services
                </p>
              </div>

              <div class="instructions">
                <h3>How to Redeem:</h3>
                <ol style="margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">
                    <strong>Book Your Ride:</strong> Call us at (573) 206-9499 or visit
                    <a href="https://www.lakeridepros.com" style="color: #4cbb17;">lakeridepros.com</a>
                  </li>
                  <li style="margin-bottom: 10px;">
                    <strong>Provide Your Code:</strong> Share your gift card code when booking
                  </li>
                  <li style="margin-bottom: 10px;">
                    <strong>Enjoy Your Ride:</strong> Experience luxury transportation at Lake of the Ozarks!
                  </li>
                </ol>
              </div>

              <center>
                <a href="https://www.lakeridepros.com/gift-card-balance" class="button">
                  Check Balance
                </a>
              </center>

              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Questions?</strong> Contact us at
                <a href="mailto:contactus@lakeridepros.com" style="color: #4cbb17;">contactus@lakeridepros.com</a>
                or call (573) 206-9499
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0 0 10px 0;">
                <strong>Lake Ride Pros LLC</strong>
              </p>
              <p style="margin: 0 0 10px 0;">
                Lake of the Ozarks, Missouri
              </p>
              <p style="margin: 0;">
                <a href="https://www.lakeridepros.com" style="color: #4cbb17; text-decoration: none;">
                  www.lakeridepros.com
                </a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email send error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    console.log('Gift card email sent:', data)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Email error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
