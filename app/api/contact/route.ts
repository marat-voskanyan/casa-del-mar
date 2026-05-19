import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email and message are required' }, { status: 400 })
    }

    // Log to console — integrate your email provider here (SendGrid, Resend, etc.)
    console.log('[Contact form submission]', { name, email, phone, message, ts: new Date().toISOString() })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact error:', err)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
