import { client } from '@/sanity/lib/client'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'

interface CartItem {
  productId: string
  variantId: string
  quantity: number
}

interface ShippingAddress {
  line1: string
  line2?: string | null
  city: string
  state: string
  postalCode: string
  country: string
}

interface CreatePrintifyOrderInput {
  orderNumber: string
  cartItems: CartItem[]
  shippingAddress: ShippingAddress
  customerEmail: string
  customerName: string
  customerPhone?: string | null
}

interface SanityProductVariant {
  sku?: string
  printifyVariantId?: string
}

interface SanityProductForPrintify {
  _id: string
  printifyProductId?: string
  variants?: SanityProductVariant[]
}

interface PrintifyOrderResponse {
  id: string
  status?: string
}

function getPrintifyConfig() {
  const token = process.env.PRINTIFY_API_TOKEN
  const shopId = process.env.PRINTIFY_SHOP_ID

  if (!token || !shopId) {
    throw new Error('Printify is not configured. Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID.')
  }

  return { token, shopId }
}

function splitCustomerName(customerName: string) {
  const parts = customerName.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || 'Customer',
    lastName: parts.slice(1).join(' '),
  }
}

async function fetchPrintifyProduct(item: CartItem) {
  const productData = await client.fetch<SanityProductForPrintify | null>(
    `*[_type == "product" && _id == $id][0] {
      _id,
      printifyProductId,
      variants[] {
        sku,
        printifyVariantId
      }
    }`,
    { id: item.productId }
  )

  if (!productData) {
    throw new Error(`Failed to fetch product ${item.productId}`)
  }

  if (!productData.printifyProductId) {
    throw new Error(`Printify product ID not found for product ${item.productId}`)
  }

  const variant = productData.variants?.find((v) => v.sku === item.variantId)

  if (!variant?.printifyVariantId) {
    throw new Error(`Printify variant ID not found for SKU: ${item.variantId}`)
  }

  return {
    productId: productData.printifyProductId,
    variantId: Number.parseInt(variant.printifyVariantId, 10),
  }
}

export async function createPrintifyOrder({
  orderNumber,
  cartItems,
  shippingAddress,
  customerEmail,
  customerName,
  customerPhone,
}: CreatePrintifyOrderInput): Promise<PrintifyOrderResponse> {
  const { token, shopId } = getPrintifyConfig()
  const { firstName, lastName } = splitCustomerName(customerName)

  const lineItems = await Promise.all(
    cartItems.map(async (item, index) => {
      const product = await fetchPrintifyProduct(item)

      return {
        product_id: product.productId,
        variant_id: product.variantId,
        quantity: item.quantity,
        external_id: `${orderNumber}-${index + 1}`,
      }
    })
  )

  const printifyOrderData = {
    external_id: orderNumber,
    label: orderNumber,
    line_items: lineItems,
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name: firstName,
      last_name: lastName,
      email: customerEmail,
      phone: customerPhone || '',
      country: shippingAddress.country,
      region: shippingAddress.state,
      address1: shippingAddress.line1,
      address2: shippingAddress.line2 || '',
      city: shippingAddress.city,
      zip: shippingAddress.postalCode,
    },
  }

  const response = await fetch(
    `${PRINTIFY_API_URL}/shops/${shopId}/orders.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'LakeRideProsWebsite/1.0',
      },
      body: JSON.stringify(printifyOrderData),
    }
  )

  if (!response.ok) {
    const errorData = await response.text()
    console.error('Printify API error:', errorData)
    throw new Error(`Printify API error: ${response.status}`)
  }

  const printifyOrder = await response.json() as PrintifyOrderResponse

  if (!printifyOrder.id) {
    throw new Error('Printify order response did not include an order id')
  }

  if (process.env.NODE_ENV === 'production') {
    await sendPrintifyOrderToProduction(printifyOrder.id)
  }

  return printifyOrder
}

async function sendPrintifyOrderToProduction(orderId: string) {
  const { token, shopId } = getPrintifyConfig()

  const response = await fetch(
    `${PRINTIFY_API_URL}/shops/${shopId}/orders/${orderId}/send_to_production.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'LakeRideProsWebsite/1.0',
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.text()
    console.error('Failed to send order to production:', errorData)
    throw new Error(`Printify send-to-production error: ${response.status}`)
  }
}
