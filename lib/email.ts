import { Resend } from 'resend'

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendOrderConfirmation(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  orderTotal: number,
  items: any[]
) {
  try {
    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <hello@updates.lakeridepros.com>',
      replyTo: 'contactus@lakeridepros.com',
      to: customerEmail,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4cbb17; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px 20px; }
            .order-details { background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { border-bottom: 1px solid #ddd; padding: 15px 0; }
            .item:last-child { border-bottom: none; }
            .total { font-size: 24px; font-weight: bold; color: #4cbb17; text-align: right; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background-color: #4cbb17; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Order!</h1>
            </div>

            <div class="content">
              <p>Hi ${customerName},</p>

              <p>We've received your order and it's being prepared for shipment. You'll receive a tracking number via email within 1-2 business days.</p>

              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order Number:</strong> ${orderNumber}</p>

                <h3>Items:</h3>
                ${items.map(item => `
                  <div class="item">
                    <strong>${item.productName}</strong><br>
                    ${item.variantName}<br>
                    Quantity: ${item.quantity} × $${item.price.toFixed(2)}
                  </div>
                `).join('')}

                <div class="total">
                  Total: $${orderTotal.toFixed(2)}
                </div>
              </div>

              <p><strong>Estimated Delivery:</strong> 7-14 business days</p>

              <center>
                <a href="https://www.lakeridepros.com/shop" class="button">
                  Continue Shopping
                </a>
              </center>

              <p>If you have any questions about your order, please contact us at <a href="mailto:contactus@lakeridepros.com">contactus@lakeridepros.com</a> or call (573) 206-9499.</p>
            </div>

            <div class="footer">
              <p>Lake Ride Pros LLC<br>
              Lake of the Ozarks, Missouri<br>
              <a href="https://www.lakeridepros.com">www.lakeridepros.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
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
  items: any[],
  shippingAddress: any
) {
  try {
    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <hello@updates.lakeridepros.com>',
      replyTo: customerEmail,
      to: 'owners@lakeridepros.com',
      subject: `🛍️ New Shop Order - ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4cbb17; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px 20px; }
            .section { background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { border-bottom: 1px solid #ddd; padding: 15px 0; }
            .item:last-child { border-bottom: none; }
            .total { font-size: 24px; font-weight: bold; color: #4cbb17; text-align: right; margin-top: 20px; }
            .label { font-weight: bold; color: #4cbb17; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛍️ New Shop Order Received</h1>
            </div>

            <div class="content">
              <h2>Order #${orderNumber}</h2>

              <div class="section">
                <h3 class="label">Customer Information</h3>
                <p><strong>Name:</strong> ${customerName}<br>
                <strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
              </div>

              <div class="section">
                <h3 class="label">Shipping Address</h3>
                <p>
                  ${shippingAddress.line1}<br>
                  ${shippingAddress.line2 ? `${shippingAddress.line2}<br>` : ''}
                  ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
                  ${shippingAddress.country}
                </p>
              </div>

              <div class="section">
                <h3 class="label">Order Items</h3>
                ${items.map(item => `
                  <div class="item">
                    <strong>${item.productName}</strong><br>
                    ${item.variantName}<br>
                    Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}
                  </div>
                `).join('')}

                <div class="total">
                  Total: $${orderTotal.toFixed(2)}
                </div>
              </div>

              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                This order has been automatically sent to Printify for fulfillment.
                Log in to the admin panel to view full details or update the order status.
              </p>
            </div>

            <div class="footer">
              <p>Lake Ride Pros LLC - Owner Notification</p>
            </div>
          </div>
        </body>
        </html>
      `,
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
  scheduledDate?: string | null
) {
  try {
    const resend = getResend()

    const isGift = recipientEmail && recipientEmail !== purchaserEmail
    const deliveryInfo = cardType === 'digital'
      ? (deliveryMethod === 'scheduled'
          ? `Scheduled for ${new Date(scheduledDate || '').toLocaleDateString()}`
          : 'Immediate delivery')
      : 'Physical card - pending fulfillment'

    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <hello@updates.lakeridepros.com>',
      replyTo: purchaserEmail,
      to: 'owners@lakeridepros.com',
      subject: `🎁 New Gift Card Purchase - $${amount.toFixed(2)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4cbb17 0%, #3a8e11 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px 20px; }
            .section { background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .label { font-weight: bold; color: #4cbb17; }
            .amount { font-size: 32px; font-weight: bold; color: #4cbb17; text-align: center; margin: 20px 0; }
            .code { background-color: white; color: #4cbb17; font-size: 24px; font-weight: bold; padding: 15px; border-radius: 8px; text-align: center; font-family: 'Courier New', monospace; letter-spacing: 2px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 New Gift Card Purchase</h1>
            </div>

            <div class="content">
              <div class="amount">$${amount.toFixed(2)}</div>

              <div class="section">
                <h3 class="label">Gift Card Details</h3>
                <p>
                  <strong>Type:</strong> ${cardType === 'digital' ? 'Digital' : 'Physical'}<br>
                  <strong>Delivery:</strong> ${deliveryInfo}
                </p>
                ${cardType === 'digital' ? `
                  <div class="code">${giftCardCode}</div>
                ` : '<p><em>Physical card will be fulfilled separately</em></p>'}
              </div>

              <div class="section">
                <h3 class="label">Purchaser Information</h3>
                <p>
                  <strong>Name:</strong> ${purchaserName}<br>
                  <strong>Email:</strong> <a href="mailto:${purchaserEmail}">${purchaserEmail}</a>
                </p>
              </div>

              ${isGift ? `
                <div class="section">
                  <h3 class="label">Recipient Information</h3>
                  <p>
                    <strong>Name:</strong> ${recipientName}<br>
                    <strong>Email:</strong> <a href="mailto:${recipientEmail}">${recipientEmail}</a>
                  </p>
                </div>
              ` : '<p><em>This gift card was purchased for personal use.</em></p>'}

              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Log in to the admin panel to view full details or manage the gift card.
              </p>
            </div>

            <div class="footer">
              <p>Lake Ride Pros LLC - Owner Notification</p>
            </div>
          </div>
        </body>
        </html>
      `,
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
