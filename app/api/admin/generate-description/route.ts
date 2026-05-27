import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

// Simple in-memory rate limiter — resets per server instance
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT  = 10
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

export async function POST(request: NextRequest) {
  // Verify admin JWT cookie
  const token = cookies().get('admin_token')?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limiting
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured. See AI_SETUP.md for instructions.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { name, location, price, bedrooms, bathrooms, floor, size, parking, status, features } = body

    if (!name || !location || !price || !bedrooms) {
      return NextResponse.json(
        { error: 'Please fill in name, location, price and bedrooms first.' },
        { status: 400 }
      )
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const prompt = `You are a luxury real estate copywriter for Casa del Mar, a premium international real estate agency based in Yerevan, Armenia. Write compelling property descriptions for Spanish and Cypriot properties targeting Armenian and Russian-speaking buyers.

Property details:
- Name: ${name}
- Location: ${location}
- Price: €${Number(price).toLocaleString()}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms || 'not specified'}
- Floor: ${floor ? `Floor ${floor}` : 'not specified'}
- Size: ${size ? `${size}m²` : 'not specified'}
- Parking: ${parking ? 'Yes' : 'No'}
- Status: ${status || 'available'}
- Special features: ${features && features.length > 0 ? features.join(', ') : 'none listed'}

Write THREE property descriptions:

1. ENGLISH (80-100 words): Luxury tone. Highlight the location, views, lifestyle benefits, and investment potential. Mention specific area details if you know them (e.g. La Cala is modern, built 2008-2015, has pool and tennis). End with a subtle investment angle.

2. RUSSIAN (80-100 words): Same luxury tone in natural Russian. Do not just translate — write naturally for Russian-speaking buyers. Mention proximity to beach, infrastructure, rental potential.

3. ARMENIAN (80-100 words): Write in proper Armenian Unicode characters only. Natural, professional Armenian. Do not use Latin transliteration. Target Armenian buyers looking for European investment property.

Return ONLY a valid JSON object with no other text, markdown, or explanation:
{"en":"English description here","ru":"Russian description here","hy":"Armenian description here"}`

    const message = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages:   [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleanJson    = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const descriptions = JSON.parse(cleanJson)

    return NextResponse.json({
      success:     true,
      descriptions,
      remaining:   RATE_LIMIT - rateData.count,
    })

  } catch (error) {
    console.error('AI description generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate description. Please try again.' },
      { status: 500 }
    )
  }
}
