import { NextRequest, NextResponse } from 'next/server'

/**
 * AI-powered SEO content generator using OpenAI
 *
 * POST /api/seo/generate
 * Body: { title, excerpt, description, collectionSlug, type: 'title' | 'description' }
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    )
  }

  try {
    const { title, excerpt, description, collectionSlug, type } = await request.json()

    const content = excerpt || description || title || ''

    const systemPrompt = `You are an SEO expert for Lake Ride Pros, a premium chauffeur and transportation service at Lake of the Ozarks, Missouri. Generate optimized SEO content that:
- Includes location keywords (Lake of the Ozarks, Lake Ozark, Osage Beach)
- Uses action-oriented language
- Highlights luxury, reliability, and professionalism
- Is compelling and click-worthy`

    const userPrompt = type === 'title'
      ? `Generate an SEO-optimized page title (50-60 characters) for this ${collectionSlug} content:
Title: ${title}
Content: ${content}

Return ONLY the title text, no quotes or explanation.`
      : `Generate an SEO-optimized meta description (120-150 characters) for this ${collectionSlug} content:
Title: ${title}
Content: ${content}

Return ONLY the description text, no quotes or explanation.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[SEO Generate] OpenAI error:', error)
      return NextResponse.json({ error: 'OpenAI API error' }, { status: 500 })
    }

    const data = await response.json()
    const generated = data.choices?.[0]?.message?.content?.trim() || ''

    return NextResponse.json({
      generated,
      type,
      model: 'gpt-4o-mini'
    })
  } catch (error) {
    console.error('[SEO Generate] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate SEO content' },
      { status: 500 }
    )
  }
}
