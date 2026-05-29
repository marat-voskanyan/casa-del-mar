import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import Groq from 'groq-sdk'
import * as deepl from 'deepl-node'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  // Auth check
  const token =
    request.cookies.get('admin_token')?.value ||
    request.cookies.get('token')?.value

  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.DEEPL_API_KEY || !process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'Translation API keys not configured.' },
      { status: 503 }
    )
  }

  let body: { name: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name } = body
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Property name is required.' }, { status: 400 })
  }

  // Step 1: Translate EN → RU with DeepL
  const translator  = new deepl.Translator(process.env.DEEPL_API_KEY)
  const ruResult    = await translator.translateText(name, 'en', 'ru')
  const russianName = ruResult.text

  // Step 2: Translate EN → Armenian with Groq
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const amCompletion = await groq.chat.completions.create({
    model:       'llama-3.3-70b-versatile',
    max_tokens:  80,
    temperature: 0.1,
    messages: [
      {
        role:    'system',
        content: 'You are an Armenian translator. Translate property names to Armenian Unicode only. Use ONLY Armenian Unicode characters (U+0531–U+058A). No Latin letters. No Cyrillic. Return ONLY the Armenian translation — nothing else.',
      },
      {
        role:    'user',
        content: `Translate to Armenian Unicode: ${name}`,
      },
    ],
  })

  const armenianName = (amCompletion.choices[0]?.message?.content || '').trim()

  return NextResponse.json({ ru: russianName, hy: armenianName })
}
