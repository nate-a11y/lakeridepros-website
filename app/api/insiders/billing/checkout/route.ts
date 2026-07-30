import { NextResponse } from 'next/server'
import {
  createNewInsiderCheckout,
  isInsiderBillingInterval,
  isInsiderMembershipType,
} from '@/lib/chargebee/checkout'
import { getTrustedSiteOrigin } from '@/lib/chargebee/site-origin'

export const runtime = 'nodejs'

function offerRedirect(request: Request, status: string) {
  return NextResponse.redirect(
    new URL(
      `/insider-membership-benefits?checkout=${status}#join`,
      getTrustedSiteOrigin(request),
    ),
    303,
  )
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null)
  const membershipType = formData?.get('membership_type')
  const billingInterval = formData?.get('billing_interval')

  if (
    !isInsiderMembershipType(membershipType) ||
    !isInsiderBillingInterval(billingInterval)
  ) {
    return NextResponse.json(
      { error: 'Select a valid membership and billing option.' },
      { status: 400 },
    )
  }

  if (process.env.INSIDERS_CHARGEBEE_CHECKOUT_MODE !== 'live') {
    return offerRedirect(request, 'unavailable')
  }

  try {
    const siteOrigin = getTrustedSiteOrigin(request)
    const checkout = await createNewInsiderCheckout({
      membershipType,
      billingInterval,
      redirectUrl: new URL(
        '/insider-membership-benefits?checkout=success#join',
        siteOrigin,
      ).toString(),
      cancelUrl: new URL(
        '/insider-membership-benefits?checkout=cancelled#join',
        siteOrigin,
      ).toString(),
    })

    return NextResponse.redirect(checkout.url, 303)
  } catch (error) {
    console.error('Unable to create Chargebee hosted checkout', error)
    return offerRedirect(request, 'error')
  }
}
