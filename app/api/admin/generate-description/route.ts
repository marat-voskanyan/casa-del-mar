import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT  = 20
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

// ── Build structured features text ──────────────────────────────────────────
function buildFeaturesText(features: Record<string, unknown>): string {
  const lines: string[] = []
  if (Array.isArray(features.view)            && features.view.length)
    lines.push(`View: ${(features.view as string[]).join(', ')}`)
  if (features.distanceToSea)
    lines.push(`Distance to sea: ${features.distanceToSea}`)
  if (Array.isArray(features.facilities)      && features.facilities.length)
    lines.push(`Complex facilities: ${(features.facilities as string[]).join(', ')}`)
  if (features.condition)
    lines.push(`Condition: ${features.condition}`)
  if (features.floorType)
    lines.push(`Floor position: ${features.floorType}`)
  if (Array.isArray(features.specialFeatures) && features.specialFeatures.length)
    lines.push(`Special features: ${(features.specialFeatures as string[]).join(', ')}`)
  if (Array.isArray(features.investment)      && features.investment.length)
    lines.push(`Investment notes: ${(features.investment as string[]).join(', ')}`)
  return lines.length > 0
    ? `\nSelected property features:\n${lines.map(l => `- ${l}`).join('\n')}\n\nInclude ALL of these features naturally in the description and bullet points.`
    : ''
}

// ── Style-specific system prompts ────────────────────────────────────────────
function getSystemPrompt(style: string): string {
  switch (style) {
    case 'casa-del-mar':
      return `You are a real estate copywriter for Casa del Mar. Write property descriptions in this exact structure:

1. Opening sentence: [property type] with [X] bedrooms and [X] bathrooms in [location area]
2. Second sentence: overall character, style and purpose
3. Third sentence: the most unique or special feature of this specific property
4. Fourth sentence: one key lifestyle benefit (terrace, views, pool access, beach proximity etc)
5. Then write the section header exactly as:
   - Russian: "Преимущества квартиры:"
   - English: "Property highlights:"
   - Armenian: "Գույքի առավելությունները՝"
6. Bullet list with * of 4-6 specific factual features from the selected features provided

Rules:
- Professional and factual tone only
- No superlatives like "stunning", "breathtaking", "exclusive"
- Be specific — use exact numbers (m², floor, distance to beach)
- Each bullet is one clear fact
- Armenian must use proper Unicode only, no Latin letters
- 80-120 words per description
- Always respond with valid JSON only`

    case 'luxury':
      return `You are a luxury real estate copywriter for Casa del Mar, a premium agency in Yerevan, Armenia. Write aspirational descriptions for high-end buyers. Use elegant, evocative language that paints a lifestyle picture. Mention exclusivity, prime location, and prestige. Highlight investment value. 80-100 words each. Always respond with valid JSON only.`

    case 'investment':
      return `You are a real estate investment analyst copywriter for Casa del Mar. Focus entirely on ROI, rental yields, occupancy rates, and capital appreciation. Use data-driven language. Mention Benidorm's year-round tourism, La Cala's modern 2008-2015 construction, Alicante airport proximity. Target serious investors. 80-100 words each. Always respond with valid JSON only.`

    case 'family':
      return `You are a family-focused real estate copywriter for Casa del Mar. Emphasize safety, space, community, schools, beaches for children, pool, parks, and practical living. Warm and reassuring tone. Mention local amenities, transport, and family-friendly complex features. 80-100 words each. Always respond with valid JSON only.`

    case 'short':
      return `You are a real estate copywriter for Casa del Mar. Write concise, punchy property descriptions. 40-60 words maximum. Key facts only — location, size, price, main feature, one benefit. No filler words. Always respond with valid JSON only.`

    case 'detailed':
      return `You are a thorough real estate copywriter for Casa del Mar. Write comprehensive property descriptions covering: construction year, floor number, exact measurements, all amenities, legal status, community fees if known, transport links, nearby services, investment metrics, and lifestyle benefits. 150-180 words each. Always respond with valid JSON only.`

    default:
      return `You are a luxury real estate copywriter for Casa del Mar, a premium real estate agency in Yerevan, Armenia selling properties in Spain and Cyprus. Always respond with valid JSON only. No markdown, no explanation.`
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check API key first
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Add GROQ_API_KEY to Vercel environment variables.' },
        { status: 503 }
      )
    }

    // 2. Auth check — try multiple cookie names for resilience
    const token =
      request.cookies.get('admin_token')?.value ||
      request.cookies.get('token')?.value ||
      request.cookies.get('session')?.value

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json(
        { error: 'Session expired. Please log out and log in again.' },
        { status: 401 }
      )
    }

    // 3. Rate limiting
    const now      = Date.now()
    const rateData = rateLimitMap.get('admin') || { count: 0, resetTime: now + RATE_WINDOW }
    if (now > rateData.resetTime) {
      rateData.count     = 0
      rateData.resetTime = now + RATE_WINDOW
    }
    if (rateData.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Rate limit reached. Try again in an hour.' },
        { status: 429 }
      )
    }
    rateData.count++
    rateLimitMap.set('admin', rateData)

    // 4. Parse request body
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { name, location, price, bedrooms, bathrooms, floor, size, parking, status, features, style } = body as Record<string, unknown>

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Property name and location are required.' },
        { status: 400 }
      )
    }

    // 5. Build features text from structured selections
    const featuresText = buildFeaturesText((features as Record<string, unknown>) || {})

    // 6. Build prompt
    const prompt = `Property details:
- Name: ${name}
- Location: ${location}
- Price: €${Number(price || 0).toLocaleString()}
- Bedrooms: ${bedrooms || 'N/A'}
- Bathrooms: ${bathrooms || 'N/A'}
- Floor: ${floor ? `Floor ${floor}` : 'N/A'}
- Size: ${size ? `${size}m²` : 'N/A'}
- Parking: ${parking ? 'Yes' : 'No'}
- Status: ${status || 'available'}${featuresText}

Write THREE descriptions — one in English, one in Russian, one in Armenian.

Return ONLY this JSON with no other text, no markdown:
{"en":"...","ru":"...","hy":"..."}`

    // 7. Call Groq API with style-specific system prompt
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await client.chat.completions.create({
      model:      'llama-3.3-70b-versatile',
      max_tokens: 1200,
      messages: [
        {
          role:    'system',
          content: getSystemPrompt((style as string) || 'casa-del-mar'),
        },
        {
          role:    'user',
          content: prompt,
        },
      ],
    })

    const responseText = completion.choices[0]?.message?.content || ''

    // 8. Robust JSON extraction
    const jsonStart = responseText.indexOf('{')
    const jsonEnd   = responseText.lastIndexOf('}')

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No JSON found in Groq response:', responseText)
      throw new Error('AI response did not contain valid JSON. Please try again.')
    }

    const descriptions = JSON.parse(responseText.slice(jsonStart, jsonEnd + 1))

    if (!descriptions.en || !descriptions.ru || !descriptions.hy) {
      throw new Error('AI response missing required language fields (en/ru/hy)')
    }

    return NextResponse.json({
      success:   true,
      descriptions,
      remaining: RATE_LIMIT - rateData.count,
    })

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI generation failed:', msg)
    return NextResponse.json(
      { error: `Generation failed: ${msg}` },
      { status: 500 }
    )
  }
}
