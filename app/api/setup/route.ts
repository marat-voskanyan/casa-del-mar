import { NextResponse } from 'next/server'
import { getAdminCount, createAdminUser } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const count = await getAdminCount()
    return NextResponse.json({ needsSetup: count === 0 })
  } catch (err) {
    console.error('Setup check error:', err)
    return NextResponse.json({ needsSetup: true })
  }
}

export async function POST(request: Request) {
  try {
    const count = await getAdminCount()
    if (count > 0) {
      return NextResponse.json({ error: 'Admin already configured' }, { status: 409 })
    }

    const { username, password } = await request.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const hash = await hashPassword(password)
    await createAdminUser(username.trim(), hash)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Setup error:', err)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}
