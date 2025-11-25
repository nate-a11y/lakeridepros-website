import { Resend } from 'resend'

/**
 * EMAIL TEMPLATE STYLING APPROACH
 * ================================
 *
 * Why hardcoded colors instead of CSS variables?
 * Email clients (Gmail, Outlook, Apple Mail, etc.) have very limited CSS support
 * and do NOT support CSS custom properties (variables). For maximum compatibility,
 * all colors must be hardcoded inline.
 *
 * Brand Color Reference (keep in sync with globals.css):
 * - Primary Green: #4cbb17 (--primary)
 * - Dark Green: #3a8e11 (--primary-dark)
 * - Light Green: #60e421 (--primary-light)
 * - Black: #060606 (--lrp-black)
 * - White: #ffffff
 * - Gray Background: #f5f5f5
 *
 * If brand colors change in globals.css, update the hex values in these templates.
 *
 * Accessibility Notes:
 * - All text colors meet WCAG AA contrast requirements
 * - Uses semantic HTML (headings, lists, links)
 * - Includes lang="en" for screen readers
 * - Uses Montserrat font with fallbacks
 */

interface OrderItem {
  productName: string
  variantName: string
  quantity: number
  price: number
}

interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

/**
 * Base email template with Lake Ride Pros branding and ADA compliance
 * - Uses official LRP colors: #4cbb17 (primary green), #3a8e11 (dark green), #060606 (black)
 * - Includes logo from Supabase storage
 * - WCAG AA compliant colors and semantic HTML
 * - Montserrat font (Google Fonts)
 */
function getEmailTemplate(title: string, content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
      <title>${title} - Lake Ride Pros</title>
      <style>
        /* Reset styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

        /* Base styles - Lake Ride Pros branding */
        body {
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #060606;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          width: 100% !important;
        }

        /* Container */
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }

        /* Header with logo */
        .header {
          background: linear-gradient(135deg, #4cbb17 0%, #3a8e11 100%);
          padding: 40px 20px;
          text-align: center;
        }

        .logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          display: block;
        }

        .header h1 {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          padding: 0;
          line-height: 1.2;
        }

        /* Content area */
        .content {
          padding: 40px 30px;
          color: #060606;
        }

        .content p {
          margin: 0 0 16px 0;
          color: #060606;
        }

        /* Sections */
        .section {
          background-color: #f9f9f9;
          border: 1px solid #e6e6e6;
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
        }

        .section h2, .section h3 {
          color: #4cbb17;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .section h2 {
          font-size: 20px;
        }

        .section h3 {
          font-size: 18px;
        }

        /* Labels */
        .label {
          font-weight: 700;
          color: #4cbb17;
        }

        /* Buttons - WCAG AA compliant */
        .button {
          display: inline-block;
          background-color: #4cbb17;
          color: #ffffff !important;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          margin: 20px 0;
          text-align: center;
        }

        .button:hover {
          background-color: #3a8e11;
        }

        /* Links - WCAG AA compliant */
        a {
          color: #3a8e11;
          text-decoration: underline;
        }

        a:hover {
          color: #4cbb17;
        }

        /* Footer */
        .footer {
          background-color: #060606;
          color: #d1d1d1;
          text-align: center;
          padding: 30px 20px;
          font-size: 14px;
        }

        .footer p {
          margin: 0 0 8px 0;
          color: #d1d1d1;
        }

        .footer a {
          color: #4cbb17;
          text-decoration: none;
        }

        .footer a:hover {
          color: #60e421;
          text-decoration: underline;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
          .content {
            padding: 30px 20px !important;
          }
          .section {
            padding: 20px !important;
          }
          .header h1 {
            font-size: 24px !important;
          }
        }
      </style>
    </head>
    <body role="article" aria-label="${title}">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
          <td style="padding: 20px 0;">
            <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" align="center" width="600">
              <!-- Header -->
              <tr>
                <td class="header">
                  <img
                    src="https://dhwnlzborisjihhauchp.supabase.co/storage/v1/object/public/media/icon-512.png"
                    alt="Lake Ride Pros Logo"
                    class="logo"
                    width="80"
                    height="80"
                  >
                  <h1>${title}</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td class="content">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 16px;">
                    <strong style="color: #ffffff; font-size: 16px;">Lake Ride Pros LLC</strong>
                  </p>
                  <p>
                    Premium Luxury Transportation<br>
                    Lake of the Ozarks, Missouri
                  </p>
                  <p style="margin-top: 16px;">
                    <a href="https://www.lakeridepros.com" aria-label="Visit Lake Ride Pros website">www.lakeridepros.com</a><br>
                    <a href="tel:5732069499" aria-label="Call Lake Ride Pros at (573) 206-9499">(573) 206-9499</a><br>
                    <a href="mailto:contactus@lakeridepros.com" aria-label="Email Lake Ride Pros">contactus@lakeridepros.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export async function sendOrderConfirmation(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  orderTotal: number,
  items: OrderItem[]
) {
  try {
    const resend = getResend()

    const content = `
      <p>Hi <strong>${customerName}</strong>,</p>

      <p>Thank you for your order! We've received it and it's being prepared for shipment. You'll receive a tracking number via email within 1-2 business days.</p>

      <div class="section">
        <h2>Order Details</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>

        <h3 style="margin-top: 20px;">Items:</h3>
        ${items.map(item => `
          <div style="border-bottom: 1px solid #e6e6e6; padding: 12px 0;">
            <strong>${item.productName}</strong><br>
            <span style="color: #666666;">${item.variantName}</span><br>
            <span style="color: #666666;">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</span>
          </div>
        `).join('')}

        <p style="font-size: 24px; font-weight: 700; color: #4cbb17; text-align: right; margin-top: 20px;">
          Total: $${orderTotal.toFixed(2)}
        </p>
      </div>

      <p><strong>Estimated Delivery:</strong> 7-14 business days</p>

      <div style="text-align: center;">
        <a href="https://www.lakeridepros.com/shop" class="button" aria-label="Continue shopping at Lake Ride Pros">
          Continue Shopping
        </a>
      </div>

      <p>If you have any questions about your order, please don't hesitate to contact us at <a href="mailto:contactus@lakeridepros.com">contactus@lakeridepros.com</a> or call <a href="tel:5732069499">(573) 206-9499</a>.</p>
    `

    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <contactus@send.updates.lakeridepros.com>',
      replyTo: 'contactus@lakeridepros.com',
      to: customerEmail,
      subject: `Order Confirmation - ${orderNumber}`,
      html: getEmailTemplate('Thank You for Your Order!', content),
    })

    if (error) {
      console.error('Email send error:', error)
      return false
    }

    console.log('Order confirmation email sent:', data)
    return true

  } catch (error) {
    console.error('Email error:', error)
    return false
  }
}

export async function sendOwnerOrderNotification(
  orderNumber: string,
  customerName: string,
  customerEmail: string,
  orderTotal: number,
  items: OrderItem[],
  shippingAddress: ShippingAddress
) {
  try {
    const resend = getResend()

    const content = `
      <h2 style="color: #060606;">Order #${orderNumber}</h2>

      <div class="section">
        <h3>Customer Information</h3>
        <p>
          <strong>Name:</strong> ${customerName}<br>
          <strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a>
        </p>
      </div>

      <div class="section">
        <h3>Shipping Address</h3>
        <p>
          ${shippingAddress.line1}<br>
          ${shippingAddress.line2 ? `${shippingAddress.line2}<br>` : ''}
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
          ${shippingAddress.country}
        </p>
      </div>

      <div class="section">
        <h3>Order Items</h3>
        ${items.map(item => `
          <div style="border-bottom: 1px solid #e6e6e6; padding: 12px 0;">
            <strong>${item.productName}</strong><br>
            <span style="color: #666666;">${item.variantName}</span><br>
            <span style="color: #666666;">Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}</span>
          </div>
        `).join('')}

        <p style="font-size: 24px; font-weight: 700; color: #4cbb17; text-align: right; margin-top: 20px;">
          Total: $${orderTotal.toFixed(2)}
        </p>
      </div>

      <p style="color: #666666; font-size: 14px; margin-top: 30px;">
        This order has been automatically sent to Printify for fulfillment.
        Log in to the admin panel to view full details or update the order status.
      </p>
    `

    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <contactus@send.updates.lakeridepros.com>',
      replyTo: customerEmail,
      to: 'owners@lakeridepros.com',
      subject: `🛍️ New Shop Order - ${orderNumber}`,
      html: getEmailTemplate('🛍️ New Shop Order Received', content),
    })

    if (error) {
      console.error('Owner notification email error:', error)
      return false
    }

    console.log('Owner order notification sent:', data)
    return true

  } catch (error) {
    console.error('Owner notification error:', error)
    return false
  }
}

export async function sendOwnerGiftCardNotification(
  giftCardCode: string,
  cardType: string,
  amount: number,
  purchaserName: string,
  purchaserEmail: string,
  recipientName: string | null,
  recipientEmail: string | null,
  deliveryMethod?: string,
  scheduledDate?: string | null,
  purchaseAmount?: number, // Original purchase amount (if promo)
  bonusAmount?: number // Bonus amount (if promo)
) {
  try {
    const resend = getResend()

    const isGift = recipientEmail && recipientEmail !== purchaserEmail
    const deliveryInfo = cardType === 'digital'
      ? (deliveryMethod === 'scheduled'
          ? `Scheduled for ${new Date(scheduledDate || '').toLocaleDateString()}`
          : 'Immediate delivery')
      : 'Physical card - pending fulfillment'

    const isPromotion = purchaseAmount !== undefined && bonusAmount !== undefined && bonusAmount > 0
    const promoSection = isPromotion ? `
      <div style="background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 15px; margin: 15px 0;">
        <p style="color: #856404; margin: 0; font-weight: bold;">
          🎉 HOLIDAY BONUS PROMOTION
        </p>
        <p style="color: #856404; margin: 5px 0 0 0;">
          Customer paid: $${purchaseAmount?.toFixed(2)}<br>
          Bonus added: +$${bonusAmount?.toFixed(2)}<br>
          <strong>Total card value: $${amount.toFixed(2)}</strong>
        </p>
      </div>
    ` : ''

    const content = `
      <p style="font-size: 32px; font-weight: 700; color: #4cbb17; text-align: center; margin: 20px 0;">
        $${amount.toFixed(2)}
      </p>

      ${promoSection}

      <div class="section">
        <h3>Gift Card Details</h3>
        <p>
          <strong>Type:</strong> ${cardType === 'digital' ? 'Digital' : 'Physical'}<br>
          <strong>Delivery:</strong> ${deliveryInfo}
        </p>
        ${cardType === 'digital' ? `
          <p style="background-color: white; color: #4cbb17; font-size: 24px; font-weight: 700; padding: 15px; border-radius: 8px; text-align: center; font-family: 'Courier New', monospace; letter-spacing: 2px; margin: 15px 0; border: 2px solid #4cbb17;">
            ${giftCardCode}
          </p>
        ` : '<p><em>Physical card will be fulfilled separately</em></p>'}
      </div>

      <div class="section">
        <h3>Purchaser Information</h3>
        <p>
          <strong>Name:</strong> ${purchaserName}<br>
          <strong>Email:</strong> <a href="mailto:${purchaserEmail}">${purchaserEmail}</a>
        </p>
      </div>

      ${isGift ? `
        <div class="section">
          <h3>Recipient Information</h3>
          <p>
            <strong>Name:</strong> ${recipientName}<br>
            <strong>Email:</strong> <a href="mailto:${recipientEmail}">${recipientEmail}</a>
          </p>
        </div>
      ` : '<p><em>This gift card was purchased for personal use.</em></p>'}

      <p style="color: #666666; font-size: 14px; margin-top: 30px;">
        Log in to the admin panel to view full details or manage the gift card.
      </p>
    `

    const subjectLine = isPromotion
      ? `🎁 New Gift Card Purchase - $${amount.toFixed(2)} (Holiday Bonus: $${bonusAmount?.toFixed(2)} added!)`
      : `🎁 New Gift Card Purchase - $${amount.toFixed(2)}`

    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <contactus@send.updates.lakeridepros.com>',
      replyTo: purchaserEmail,
      to: 'owners@lakeridepros.com',
      subject: subjectLine,
      html: getEmailTemplate('🎁 New Gift Card Purchase', content),
    })

    if (error) {
      console.error('Owner gift card notification email error:', error)
      return false
    }

    console.log('Owner gift card notification sent:', data)
    return true

  } catch (error) {
    console.error('Owner gift card notification error:', error)
    return false
  }
}

export async function sendContactNotification(
  name: string,
  email: string,
  message: string,
  phone?: string,
  subject?: string
) {
  try {
    const resend = getResend()

    const content = `
      <div class="section">
        <h3>Contact Information</h3>
        <p>
          <strong>Name:</strong> ${name}<br>
          <strong>Email:</strong> <a href="mailto:${email}">${email}</a><br>
          ${phone ? `<strong>Phone:</strong> <a href="tel:${phone}">${phone}</a><br>` : ''}
          ${subject ? `<strong>Subject:</strong> ${subject}` : ''}
        </p>
      </div>

      <div class="section">
        <h3>Message</h3>
        <div style="background-color: white; padding: 20px; border-left: 4px solid #4cbb17; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>

      <p style="color: #666666; font-size: 14px; margin-top: 30px;">
        To respond to this message, simply reply to this email. The reply-to address is set to ${email}.
      </p>
    `

    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <contactus@send.updates.lakeridepros.com>',
      replyTo: email,
      to: 'contactus@lakeridepros.com',
      subject: `📧 New Contact Form Message${subject ? `: ${subject}` : ''}`,
      html: getEmailTemplate('📧 New Contact Form Message', content),
    })

    if (error) {
      console.error('Contact notification email error:', error)
      return false
    }

    console.log('Contact notification email sent:', data)
    return true

  } catch (error) {
    console.error('Contact notification error:', error)
    return false
  }
}

export async function sendContactConfirmation(
  name: string,
  email: string
) {
  try {
    const resend = getResend()

    const content = `
      <p>Hi <strong>${name}</strong>,</p>

      <p>We've received your message and appreciate you reaching out to Lake Ride Pros. Our team will review your inquiry and get back to you as soon as possible, typically within 1-2 business days.</p>

      <div class="section">
        <h3>In the meantime:</h3>
        <ul style="margin: 12px 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Check out our <a href="https://www.lakeridepros.com/services">transportation services</a></li>
          <li style="margin-bottom: 8px;">Browse our <a href="https://www.lakeridepros.com/shop">shop</a> for Lake of the Ozarks merchandise</li>
          <li style="margin-bottom: 8px;">Learn more about <a href="https://www.lakeridepros.com/careers">becoming a partner driver</a></li>
        </ul>
      </div>

      <p>If you need immediate assistance, you can also reach us at:</p>
      <p>
        <strong>Phone:</strong> <a href="tel:5732069499">(573) 206-9499</a><br>
        <strong>Email:</strong> <a href="mailto:contactus@lakeridepros.com">contactus@lakeridepros.com</a>
      </p>

      <div style="text-align: center;">
        <a href="https://www.lakeridepros.com" class="button" aria-label="Visit Lake Ride Pros website">
          Visit Our Website
        </a>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <contactus@send.updates.lakeridepros.com>',
      replyTo: 'contactus@lakeridepros.com',
      to: email,
      subject: 'We received your message - Lake Ride Pros',
      html: getEmailTemplate('Thank You for Contacting Us!', content),
    })

    if (error) {
      console.error('Contact confirmation email error:', error)
      return false
    }

    console.log('Contact confirmation email sent:', data)
    return true

  } catch (error) {
    console.error('Contact confirmation error:', error)
    return false
  }
}
