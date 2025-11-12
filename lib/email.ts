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
