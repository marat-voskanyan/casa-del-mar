import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT  = 10
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

export async function POST(request: NextRequest) {
  try {
    // 1. Check API key first — most common failure
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Add ANTHROPIC_API_KEY to Vercel environment variables.' },
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
        { error: 'Rate limit reached (10/hour). Try again in an hour.' },
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

    const { name, location, price, bedrooms, bathrooms, floor, size, parking, status, features } = body as Record<string, unknown>

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Property name and location are required.' },
        { status: 400 }
      )
    }

    // 5. Call Anthropic API
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const prompt = `You are a luxury real estate copywriter for Casa del Mar, a premium international real estate agency based in Yerevan, Armenia. Write compelling property descriptions for Spanish and Cypriot properties targeting Armenian and Russian-speaking buyers.

Property details:
- Name: ${name}
- Location: ${location}
- Price: €${Number(price || 0).toLocaleString()}
- Bedrooms: ${bedrooms || 'N/A'}
- Bathrooms: ${bathrooms || 'N/A'}
- Floor: ${floor ? `Floor ${floor}` : 'N/A'}
- Size: ${size ? `${size}m²` : 'N/A'}
- Parking: ${parking ? 'Yes' : 'No'}
- Status: ${status || 'available'}
- Special features: ${Array.isArray(features) && (features as string[]).length > 0 ? (features as string[]).join(', ') : 'none listed'}

Write THREE property descriptions (80-100 words each):

1. ENGLISH: Luxury tone. Highlight location, views, lifestyle and investment potential. Mention specific area details (e.g. La Cala is modern, built 2008-2015, has pool and tennis). End with investment angle.

2. RUSSIAN: Natural Russian, luxury tone. Do not just translate — write for Russian-speaking buyers. Mention beach proximity, infrastructure, rental potential.

3. ARMENIAN: Proper Armenian Unicode characters ONLY. No Latin letters. Professional tone for Armenian buyers seeking European investment property.

Return ONLY a valid JSON object — no markdown, no explanation, no extra text:
{"en":"English description here","ru":"Russian description here","hy":"Armenian description here"}`

    const message = await client.messages.create({
      model:    'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    // 6. Extract text from response
    const rawText = message.content
      .filter(b => b.type === 'text')
      .map(b => b.type === 'text' ? b.text : '')
      .join('')

    // 7. Robust JSON extraction — three fallback methods
    let descriptions: { en: string; ru: string; hy: string }
    try {
      // Method 1: direct parse
      descriptions = JSON.parse(rawText)
    } catch {
      try {
        // Method 2: extract from markdown code block
        const codeMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (codeMatch) {
          descriptions = JSON.parse(codeMatch[1].trim())
        } else {
          // Method 3: find first { to last }
          const start = rawText.indexOf('{')
          const end   = rawText.lastIndexOf('}')
          if (start === -1 || end === -1) throw new Error('No JSON found in response')
          descriptions = JSON.parse(rawText.slice(start, end + 1))
        }
      } catch (parseErr) {
        console.error('JSON parse failed. Raw response:', rawText)
        throw new Error('Failed to parse AI response. Please try again.')
      }
    }

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
