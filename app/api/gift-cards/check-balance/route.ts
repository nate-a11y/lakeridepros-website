import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Gift card code is required' },
        { status: 400 }
      )
    }

    // Normalize the code (uppercase, trim)
    const normalizedCode = code.trim().toUpperCase()

    // Use Payload Local API to query gift cards
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'gift-cards',
      where: {
        code: {
          equals: normalizedCode,
        },
      },
      overrideAccess: true, // Allow public balance checks
      limit: 1,
    })

    // Check if gift card exists
    if (!result.docs || result.docs.length === 0) {
      return NextResponse.json(
        { error: 'Gift card not found. Please check your code and try again.' },
        { status: 404 }
      )
    }

    const giftCard = result.docs[0]

    // Check if gift card is active
    if (giftCard.status !== 'active') {
      return NextResponse.json(
        { error: 'This gift card is no longer active.' },
        { status: 400 }
      )
    }

    // Return gift card data
    return NextResponse.json({
      code: giftCard.code,
      balance: giftCard.currentBalance || 0,
      originalAmount: giftCard.initialAmount || giftCard.currentBalance,
      purchasedDate: giftCard.createdAt,
      expirationDate: 'Never', // Gift cards never expire
      status: giftCard.status,
    })

  } catch (error: any) {
    console.error('Gift card balance check error:', error)
    return NextResponse.json(
      { error: 'An error occurred while checking the gift card balance. Please try again.' },
      { status: 500 }
    )
  }
}
