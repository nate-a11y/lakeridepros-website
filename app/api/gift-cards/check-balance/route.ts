import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

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

    // Query gift card from Sanity
    const giftCard = await writeClient.fetch(
      groq`*[_type == "giftCard" && code == $code][0]`,
      { code: normalizedCode }
    )

    // Check if gift card exists
    if (!giftCard) {
      return NextResponse.json(
        { error: 'Gift card not found. Please check your code and try again.' },
        { status: 404 }
      )
    }

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
      purchasedDate: giftCard._createdAt,
      expirationDate: 'Never', // Gift cards never expire
      status: giftCard.status,
    })

  } catch (error: unknown) {
    console.error('Gift card balance check error:', error)
    return NextResponse.json(
      { error: 'An error occurred while checking the gift card balance. Please try again.' },
      { status: 500 }
    )
  }
}
