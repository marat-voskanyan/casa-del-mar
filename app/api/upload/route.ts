import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'

export const runtime = 'nodejs'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED  = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']

export async function POST(request: Request) {
  // Auth check
  const token = cookies().get('admin_token')?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Accepted formats: JPG, PNG, WebP, AVIF. Max size: 10MB' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })
    }

    const ext      = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${uuidv4()}.${ext}`

    // Prefer Vercel Blob when configured (production). Fall back to local
    // filesystem for development.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const blob = await put(`uploads/${filename}`, file, {
        access: 'public',
        contentType: file.type,
        addRandomSuffix: false,
      })
      return NextResponse.json({ url: blob.url })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(path.join(uploadsDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
