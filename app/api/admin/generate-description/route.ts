import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import Groq from 'groq-sdk'
import * as deepl from 'deepl-node'

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
    ? `\n\nSelected property features:\n${lines.map(l => `- ${l}`).join('\n')}\n\nInclude ALL of these features in the description and bullet points.`
    : ''
}

// ── Style-specific writing instructions ──────────────────────────────────────
function getStylePrompt(style: string): string {
  switch (style) {
    case 'casa-del-mar':
      return `Write in this exact structure:
1. Opening: property type with X bed and X bath in location
2. Overall character and purpose
3. Most unique feature
4. One key lifestyle benefit
5. Section header: Property highlights:
6. Bullet list with * of 4-6 specific facts
Tone: professional and factual. No superlatives. 80-120 words.`

    case 'luxury':
      return `Premium aspirational tone. Focus on lifestyle and exclusivity. 80-100 words.`

    case 'investment':
      return `Professional investment tone. Mention rental yields 6-10%, ROI potential. Use numbers. 80-100 words.`

    case 'family':
      return `Warm practical tone. Focus on family lifestyle, space, safety, pool, beach proximity. 80-100 words.`

    case 'short':
      return `Maximum 2-3 short punchy sentences. Bold and direct. Under 50 words.`

    case 'detailed':
      return `Comprehensive description covering every feature and angle. 120-150 words.`

    default:
      return `Write in this exact structure:
1. Opening: property type with X bed and X bath in location
2. Overall character and purpose
3. Most unique feature
4. One key lifestyle benefit
5. Section header: Property highlights:
6. Bullet list with * of 4-6 specific facts
Tone: professional and factual. No superlatives. 80-120 words.`
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check API keys
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured. Add it to Vercel environment variables.' },
        { status: 503 }
      )
    }
    if (!process.env.DEEPL_API_KEY) {
      return NextResponse.json(
        { error: 'DEEPL_API_KEY not configured. Add it to Vercel environment variables.' },
        { status: 503 }
      )
    }

    // 2. Auth check
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

    const featuresText = buildFeaturesText((features as Record<string, unknown>) || {})
    const stylePrompt  = getStylePrompt((style as string) || 'casa-del-mar')

    const propertyDetails = `Property:
- Name: ${name}
- Location: ${location}
- Price: €${Number(price || 0).toLocaleString()}
- Bedrooms: ${bedrooms || 'N/A'}
- Bathrooms: ${bathrooms || 'N/A'}
- Floor: ${floor ? `Floor ${floor}` : 'N/A'}
- Size: ${size ? `${size}m²` : 'N/A'}
- Parking: ${parking ? 'Yes' : 'No'}
- Status: ${status || 'available'}${featuresText}`

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    // ── STEP 1: Generate English with Groq ─────────────────────────────────────
    const englishCompletion = await groq.chat.completions.create({
      model:      'llama-3.1-8b-instant',
      max_tokens: 600,
      temperature: 0.7,
      messages: [
        {
          role:    'system',
          content: 'You are a real estate copywriter. Write only the requested description text. No JSON. No labels. No extra text. No explanations.',
        },
        {
          role:    'user',
          content: `${stylePrompt}\n\n${propertyDetails}\n\nWrite the English property description now:`,
        },
      ],
    })

    const englishText = (englishCompletion.choices[0]?.message?.content || '').trim()

    if (!englishText) {
      throw new Error('Groq returned empty English text. Please try again.')
    }

    // ── STEP 2: Translate English → Russian with DeepL ─────────────────────────
    const translator   = new deepl.Translator(process.env.DEEPL_API_KEY)
    const deeplResult  = await translator.translateText(englishText, 'en', 'ru')
    let russianText    = deeplResult.text
    // Fix bullet header for Casa del Mar style
    russianText = russianText
      .replace(/Property highlights:/gi, 'Преимущества квартиры:')
      .replace(/Property Highlights:/gi, 'Преимущества квартиры:')

    // ── STEP 3: Translate English → Armenian with Groq ─────────────────────────
    // Helper: count bullet points in a text
    const countBullets = (text: string) => (text.match(/^\s*\*/gm) || []).length

    const armenianSystemPrompt = `You are an expert Armenian translator. You MUST use proper Armenian Unicode characters only. Never use Latin letters or transliteration. Translate ONLY. Return ONLY the Armenian text. If text has "Property highlights:" translate as "Գույքի առավելությունները:" Keep bullet points with *`

    const armenianUserPrompt = (text: string) =>
      `Translate the COMPLETE text. Do not stop until you have translated every single sentence and every single bullet point. Complete translation only.\n\nTranslate this to Armenian using only Armenian Unicode:\n\n${text}`

    const doArmenianCall = async () => groq.chat.completions.create({
      model:       'llama-3.3-70b-versatile',
      max_tokens:  1500,
      temperature: 0.1,
      messages: [
        { role: 'system', content: armenianSystemPrompt },
        { role: 'user',   content: armenianUserPrompt(englishText) },
      ],
    })

    let armenianCompletion = await doArmenianCall()
    let armenianText       = (armenianCompletion.choices[0]?.message?.content || '').trim()

    // Fix bullet header if model didn't translate it
    const fixArmenianHeaders = (t: string) =>
      t.replace(/Property highlights:/gi, 'Գույքի առավելությունները:')
       .replace(/Property Highlights:/gi,  'Գույքի առավելությունները:')

    armenianText = fixArmenianHeaders(armenianText)

    // Bullet count check — retry once if translation looks incomplete
    const enBullets = countBullets(englishText)
    const hyBullets = countBullets(armenianText)

    if (enBullets > 0 && hyBullets < enBullets) {
      console.warn(`Armenian bullet mismatch: EN has ${enBullets}, HY has ${hyBullets}. Retrying...`)
      const retryCompletion = await doArmenianCall()
      const retryText       = fixArmenianHeaders((retryCompletion.choices[0]?.message?.content || '').trim())
      const retryBullets    = countBullets(retryText)
      if (retryBullets >= hyBullets) {
        // Retry is better or equal — use it
        armenianText = retryText
      }
      if (countBullets(armenianText) < enBullets) {
        console.warn(`Armenian still incomplete after retry: EN=${enBullets}, HY=${countBullets(armenianText)}`)
      }
    }

    if (!armenianText) {
      throw new Error('Groq returned empty Armenian text. Please try again.')
    }

    return NextResponse.json({
      success: true,
      descriptions: {
        en: englishText,
        ru: russianText,
        hy: armenianText,
      },
      steps: {
        english:  'Generated by Groq Llama',
        russian:  'Translated by DeepL',
        armenian: 'Translated by Groq (DeepL does not support Armenian)',
      },
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
