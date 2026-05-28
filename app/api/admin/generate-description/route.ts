import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT  = 20
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

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

    const { name, location, price, bedrooms, bathrooms, floor, size, parking, status, features } = body as Record<string, unknown>

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Property name and location are required.' },
        { status: 400 }
      )
    }

    // 5. Build prompt
    const prompt = `Property details:
- Name: ${name}
- Location: ${location}
- Price: €${Number(price || 0).toLocaleString()}
- Bedrooms: ${bedrooms || 'N/A'}
- Bathrooms: ${bathrooms || 'N/A'}
- Floor: ${floor ? `Floor ${floor}` : 'N/A'}
- Size: ${size ? `${size}m²` : 'N/A'}
- Parking: ${parking ? 'Yes' : 'No'}
- Status: ${status || 'available'}
- Features: ${Array.isArray(features) && (features as string[]).length > 0 ? (features as string[]).join(', ') : 'none listed'}

Write THREE property descriptions (80-100 words each):
1. ENGLISH: Luxury tone. Highlight location, views, lifestyle and investment potential. Mention area details if relevant (e.g. La Cala is modern, built 2008-2015, has pool and tennis). End with investment angle.
2. RUSSIAN: Natural Russian, luxury tone. Write for Russian-speaking buyers, not a translation. Mention beach proximity, infrastructure, rental potential.
3. ARMENIAN: Proper Armenian Unicode ONLY. No Latin letters. Professional tone for Armenian buyers seeking European investment.

Return ONLY this JSON with no other text:
{"en":"...","ru":"...","hy":"..."}`

    // 6. Call Groq API
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await client.chat.completions.create({
      model:      'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [
        {
          role:    'system',
          content: 'You are a luxury real estate copywriter for Casa del Mar, a premium real estate agency in Yerevan, Armenia selling properties in Spain and Cyprus. Always respond with valid JSON only. No markdown, no explanation.',
        },
        {
          role:    'user',
          content: prompt,
        },
      ],
    })

    const responseText = completion.choices[0]?.message?.content || ''

    // 7. Robust JSON extraction
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
