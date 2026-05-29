import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getPropertyById, updateProperty, deleteProperty } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import type { SQLInputValue } from '@/lib/db'

function revalidateListingPages(propertyId?: number, propertyRef?: string | null) {
  for (const locale of ['en', 'ru', 'hy']) {
    revalidatePath(`/${locale}/spain`)
    revalidatePath(`/${locale}/cyprus`)
    revalidatePath(`/${locale}`)
    if (propertyRef) revalidatePath(`/${locale}/properties/${propertyRef}`)
    if (propertyId)  revalidatePath(`/${locale}/properties/${propertyId}`)
  }
}

function revalidateAllPropertyPages() {
  // Revalidate all property detail pages so similar sections refresh immediately
  for (const locale of ['en', 'ru', 'hy']) {
    revalidatePath(`/${locale}/properties/[id]`, 'layout')
  }
}

export const runtime = 'nodejs'

async function auth() {
  const token = cookies().get('admin_token')?.value
  return token ? verifyToken(token) : null
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const property = await getPropertyById(Number(params.id))
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ property })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!(await auth())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

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

    await updateProperty(Number(params.id), data)
    revalidateListingPages(Number(params.id), body.ref as string | null)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await auth())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    // Fetch ref before deleting so we can revalidate the ref-based URL too
    let ref: string | null = null
    try {
      const prop = await getPropertyById(Number(params.id))
      ref = prop?.ref ?? null
    } catch { /* */ }
    await deleteProperty(Number(params.id))
    revalidateListingPages(Number(params.id), ref)
    revalidateAllPropertyPages()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
