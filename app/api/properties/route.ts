import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getAllProperties, createProperty } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import type { SQLInputValue } from '@/lib/db'

function revalidateListingPages() {
  for (const locale of ['en', 'ru', 'hy']) {
    revalidatePath(`/${locale}/spain`)
    revalidatePath(`/${locale}/cyprus`)
    revalidatePath(`/${locale}`)
  }
}

export const runtime = 'nodejs'

const NO_CACHE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || undefined
    const properties = await getAllProperties(country)
    return NextResponse.json({ properties }, { headers: NO_CACHE })
  } catch (err) {
    console.error('GET /api/properties error:', err)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const token = cookies().get('admin_token')?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.name || !body.location || body.price == null || !body.country) {
      return NextResponse.json({ error: 'name, location, price, country are required' }, { status: 400 })
    }

    const images = Array.isArray(body.images) ? body.images.filter(Boolean) : []

    const data: Record<string, SQLInputValue> = {
      name:           body.name,
      name_ru:        body.name_ru  || null,
      name_hy:        body.name_hy  || null,
      location:       body.location,
      price:          Number(body.price),
      bedrooms:       body.bedrooms  ?? null,
      bathrooms:      body.bathrooms ?? null,
      floor:          body.floor     ?? null,
      size_sqm:       body.size_sqm  ?? null,
      parking:        body.parking   ?? 0,
      status:         body.status    || 'available',
      country:        body.country,
      ref:            body.ref       || null,
      description_en: body.description_en || null,
      description_ru: body.description_ru || null,
      description_hy: body.description_hy || null,
      features_en:    body.features_en    || null,
      features_ru:    body.features_ru    || null,
      features_hy:    body.features_hy    || null,
      internal_notes: body.internal_notes || null,
      images:         JSON.stringify(images),
      latitude:       body.latitude  ?? null,
      longitude:      body.longitude ?? null,
    }

    const id = await createProperty(data)
    revalidateListingPages()
    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    console.error('POST /api/properties error:', err)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}
