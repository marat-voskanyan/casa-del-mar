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

// ── Strict JSON-only system prompt prefix (applies to all styles) ────────────
const JSON_STRICT = `You are a real estate copywriter. You MUST respond with ONLY a valid JSON object. No markdown. No code blocks. No explanation. No text before or after the JSON. Start your response with { and end with }. The JSON must have exactly these keys: en, ru, hy.`

// ── Style-specific writing instructions ─────────────────────────────────────
function getStyleInstructions(style: string): string {
  switch (style) {
    case 'casa-del-mar':
      return `Write property descriptions in this exact structure:
1. Opening sentence: [property type] with [X] bedrooms and [X] bathrooms in [location area]
2. Second sentence: overall character, style and purpose
3. Third sentence: the most unique or special feature of this property
4. Fourth sentence: one key lifestyle benefit (terrace, views, pool access, beach proximity)
5. Section header (write EXACTLY):
   - English: "Property highlights:"
   - Russian: "Преимущества квартиры:"
   - Armenian: "Գույքի առավելությունները՝"
6. Bullet list with * of 4-6 specific factual features
Rules: professional and factual tone, no superlatives, use exact numbers, 80-120 words each, Armenian Unicode only.`

    case 'luxury':
      return `Write aspirational luxury descriptions for high-end buyers. Use elegant evocative language. Mention exclusivity, prime location, prestige, and investment value. 80-100 words each. Armenian Unicode only.`

    case 'investment':
      return `Focus on ROI, rental yields, occupancy rates, and capital appreciation. Use data-driven language. Mention Benidorm's year-round tourism, La Cala's 2008-2015 construction, Alicante airport proximity. 80-100 words each. Armenian Unicode only.`

    case 'family':
      return `Emphasize safety, space, community, schools, beaches, pool, parks, and practical living. Warm reassuring tone. Mention local amenities and family-friendly features. 80-100 words each. Armenian Unicode only.`

    case 'short':
      return `Write concise punchy descriptions. 40-60 words maximum. Key facts only: location, size, main feature, one benefit. No filler. Armenian Unicode only.`

    case 'detailed':
      return `Write comprehensive descriptions covering: construction year, floor, measurements, all amenities, transport links, nearby services, investment metrics, and lifestyle benefits. 150-180 words each. Armenian Unicode only.`

    default:
      return `Write professional luxury property descriptions. 80-100 words each. Armenian Unicode only.`
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

    // 5. Build features text and style instructions
    const featuresText      = buildFeaturesText((features as Record<string, unknown>) || {})
    const styleInstructions = getStyleInstructions((style as string) || 'casa-del-mar')

    // 6. Build prompt — ends with strict JSON reminder
    const prompt = `${styleInstructions}

Property details:
- Name: ${name}
- Location: ${location}
- Price: €${Number(price || 0).toLocaleString()}
- Bedrooms: ${bedrooms || 'N/A'}
- Bathrooms: ${bathrooms || 'N/A'}
- Floor: ${floor ? `Floor ${floor}` : 'N/A'}
- Size: ${size ? `${size}m²` : 'N/A'}
- Parking: ${parking ? 'Yes' : 'No'}
- Status: ${status || 'available'}${featuresText}

Write three descriptions using the instructions above.

IMPORTANT: Return ONLY the JSON object. Start with { and end with }. No markdown, no backticks, no explanation.
{"en":"...","ru":"...","hy":"..."}`

    // 7. Call Groq API — llama3-8b-8192 follows JSON instructions more reliably
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await client.chat.completions.create({
      model:           'llama-3.1-8b-instant',
      max_tokens:      1400,
      temperature:     0.7,
      // response_format forces JSON output at API level (supported on this model)
      response_format: { type: 'json_object' },
      messages: [
        {
          role:    'system',
          content: JSON_STRICT,
        },
        {
          role:    'user',
          content: prompt,
        },
      ],
    })

    const rawText = completion.choices[0]?.message?.content || ''

    // 8. Strip markdown code blocks if present, then extract JSON
    let cleaned = rawText
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim()

    const jsonStart = cleaned.indexOf('{')
    const jsonEnd   = cleaned.lastIndexOf('}')

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      console.error('No JSON found in Groq response:', rawText)
      return NextResponse.json(
        { error: 'AI did not return valid JSON. Please try again.' },
        { status: 500 }
      )
    }

    const jsonStr = cleaned.slice(jsonStart, jsonEnd + 1)

    let descriptions: { en: string; ru: string; hy: string }
    try {
      descriptions = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Attempted to parse:', jsonStr)
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      )
    }

    // 9. Validate required keys
    if (!descriptions.en || !descriptions.ru || !descriptions.hy) {
      console.error('Missing language keys in response:', Object.keys(descriptions))
      return NextResponse.json(
        { error: 'AI response missing language fields (en/ru/hy). Please try again.' },
        { status: 500 }
      )
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
