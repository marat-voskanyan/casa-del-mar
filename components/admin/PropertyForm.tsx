'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import type { Property, PropertyFormData } from '@/types'

const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false })

const MAX_IMAGES = 20
const TABS = ['Basic', 'Details', 'Description', 'Images', 'Location', 'Notes'] as const
type Tab = typeof TABS[number]

const EMPTY: PropertyFormData = {
  name: '', location: '', price: '', bedrooms: '', bathrooms: '',
  floor: '', size_sqm: '', parking: false, status: 'available',
  country: 'spain', ref: '', description_en: '', description_ru: '',
  description_hy: '', features_en: '', features_ru: '', features_hy: '',
  internal_notes: '', images: [], latitude: '', longitude: '',
}

function toForm(p: Partial<Property>): Partial<PropertyFormData> {
  return {
    name:           p.name        || '',
    location:       p.location    || '',
    price:          p.price       != null ? String(p.price)     : '',
    bedrooms:       p.bedrooms    != null ? String(p.bedrooms)  : '',
    bathrooms:      p.bathrooms   != null ? String(p.bathrooms) : '',
    floor:          p.floor       != null ? String(p.floor)     : '',
    size_sqm:       p.size_sqm    != null ? String(p.size_sqm)  : '',
    parking:        Boolean(p.parking),
    status:         p.status      || 'available',
    country:        p.country     || 'spain',
    ref:            p.ref         || '',
    description_en: p.description_en || '',
    description_ru: p.description_ru || '',
    description_hy: p.description_hy || '',
    features_en:    p.features_en || '',
    features_ru:    p.features_ru || '',
    features_hy:    p.features_hy || '',
    internal_notes: p.internal_notes || '',
    images:         p.images      || [],
    latitude:       p.latitude    != null ? String(p.latitude)  : '',
    longitude:      p.longitude   != null ? String(p.longitude) : '',
  }
}

interface Props {
  initial?: Partial<Property>
  mode: 'create' | 'edit'
}

export default function PropertyForm({ initial, mode }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('Basic')
  const [form, setForm] = useState<PropertyFormData>({ ...EMPTY, ...toForm(initial || {}) })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState<number | null>(null) // slot index being uploaded
  const [dragOver, setDragOver] = useState<number | null>(null)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function setField<K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // ── Image helpers ────────────────────────────────────────────────────────────

  async function uploadFile(file: File, slotIndex: number) {
    if (!file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) { setError('File too large (max 10 MB)'); return }
    setUploading(slotIndex)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setForm(prev => {
          const imgs = [...prev.images]
          if (slotIndex < imgs.length) {
            imgs[slotIndex] = data.url
          } else {
            imgs.push(data.url)
          }
          return { ...prev, images: imgs }
        })
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch {
      setError('Upload error — check network')
    } finally {
      setUploading(null)
    }
  }

  function removeImage(i: number) {
    setForm(prev => {
      const imgs = prev.images.filter((_, idx) => idx !== i)
      return { ...prev, images: imgs }
    })
  }

  // HTML5 drag-drop reorder
  const dragSrcRef = useRef<number | null>(null)

  function onDragStart(i: number) { dragSrcRef.current = i }
  function onDrop(i: number) {
    const src = dragSrcRef.current
    if (src === null || src === i) return
    setForm(prev => {
      const imgs = [...prev.images]
      const [moved] = imgs.splice(src, 1)
      imgs.splice(i, 0, moved)
      return { ...prev, images: imgs }
    })
    dragSrcRef.current = null
    setDragOver(null)
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.location.trim() || !form.price) {
      setError('Name, location and price are required')
      setTab('Basic')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        name:           form.name.trim(),
        location:       form.location.trim(),
        price:          parseFloat(form.price)      || 0,
        bedrooms:       form.bedrooms  ? parseInt(form.bedrooms)    : null,
        bathrooms:      form.bathrooms ? parseInt(form.bathrooms)   : null,
        floor:          form.floor     ? parseInt(form.floor)       : null,
        size_sqm:       form.size_sqm  ? parseFloat(form.size_sqm)  : null,
        parking:        form.parking   ? 1 : 0,
        status:         form.status,
        country:        form.country,
        ref:            form.ref.trim() || null,
        description_en: form.description_en || null,
        description_ru: form.description_ru || null,
        description_hy: form.description_hy || null,
        features_en:    form.features_en || null,
        features_ru:    form.features_ru || null,
        features_hy:    form.features_hy || null,
        internal_notes: form.internal_notes || null,
        images:         form.images,
        latitude:       form.latitude  ? parseFloat(form.latitude)  : null,
        longitude:      form.longitude ? parseFloat(form.longitude) : null,
      }
      const url    = mode === 'edit' && initial?.id ? `/api/properties/${initial.id}` : '/api/properties'
      const method = mode === 'edit' ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Save failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  // ── Image grid slot ──────────────────────────────────────────────────────────

  function ImageSlot({ index }: { index: number }) {
    const src = form.images[index]
    const isEmpty = !src
    const isLoading = uploading === index

    return (
      <div
        className={[
          'relative aspect-[4/3] border-2 rounded-lg overflow-hidden transition-all duration-200',
          dragOver === index ? 'border-gold bg-gold/5 scale-[1.02]' : isEmpty ? 'border-dashed border-gray-200 bg-gray-50' : 'border-gray-200',
        ].join(' ')}
        draggable={!isEmpty}
        onDragStart={() => onDragStart(index)}
        onDragOver={e => { e.preventDefault(); setDragOver(index) }}
        onDragLeave={() => setDragOver(null)}
        onDrop={() => onDrop(index)}
      >
        {src ? (
          <>
            <Image src={src} alt={`Image ${index + 1}`} fill className="object-cover" sizes="200px" />
            {/* Slot number */}
            <div className="absolute top-1.5 left-1.5 bg-navy/60 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-accent font-semibold">
              {index + 1}
            </div>
            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 z-10 text-sm leading-none"
              title="Remove"
            >
              ×
            </button>
            {/* Drag handle hint */}
            <div className="absolute bottom-1.5 left-1.5 opacity-60">
              <svg className="w-3.5 h-3.5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 6a2 2 0 110-4 2 2 0 010 4zM8 14a2 2 0 110-4 2 2 0 010 4zM8 22a2 2 0 110-4 2 2 0 010 4zM16 6a2 2 0 110-4 2 2 0 010 4zM16 14a2 2 0 110-4 2 2 0 010 4zM16 22a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </div>
          </>
        ) : isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-xs gap-2">
            <div className="w-6 h-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
            <span>Uploading…</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { fileInputRef.current?.click() }}
            className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100/50 transition-colors"
          >
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-[10px] font-accent tracking-wide">Add photo</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto scrollbar-none">
        {TABS.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              'px-5 py-3 text-sm font-sans font-medium border-b-2 -mb-px whitespace-nowrap transition-colors',
              tab === t ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-navy',
            ].join(' ')}
          >
            {t === 'Images' ? `Images (${form.images.length}/${MAX_IMAGES})` : t}
          </button>
        ))}
      </div>

      {/* ─── Basic ─── */}
      {tab === 'Basic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="admin-label">Property Name *</label>
            <input value={form.name} onChange={e => setField('name', e.target.value)} required className="admin-input" placeholder="Beachfront Villa Marbella" />
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">Location *</label>
            <input value={form.location} onChange={e => setField('location', e.target.value)} required className="admin-input" placeholder="Marbella, Costa del Sol" />
          </div>
          <div>
            <label className="admin-label">Price (€) *</label>
            <input type="number" min="0" step="1000" value={form.price} onChange={e => setField('price', e.target.value)} required className="admin-input" placeholder="450000" />
          </div>
          <div>
            <label className="admin-label">Country *</label>
            <select value={form.country} onChange={e => setField('country', e.target.value)} className="admin-input">
              <option value="spain">🇪🇸 Spain</option>
              <option value="cyprus">🇨🇾 Cyprus</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Status *</label>
            <select value={form.status} onChange={e => setField('status', e.target.value)} className="admin-input">
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Ref Number</label>
            <input value={form.ref} onChange={e => setField('ref', e.target.value)} className="admin-input" placeholder="3282" />
          </div>
        </div>
      )}

      {/* ─── Details ─── */}
      {tab === 'Details' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <div>
            <label className="admin-label">Bedrooms</label>
            <input type="number" min="0" value={form.bedrooms} onChange={e => setField('bedrooms', e.target.value)} className="admin-input" placeholder="3" />
          </div>
          <div>
            <label className="admin-label">Bathrooms</label>
            <input type="number" min="0" value={form.bathrooms} onChange={e => setField('bathrooms', e.target.value)} className="admin-input" placeholder="2" />
          </div>
          <div>
            <label className="admin-label">Floor</label>
            <input type="number" min="0" value={form.floor} onChange={e => setField('floor', e.target.value)} className="admin-input" placeholder="3" />
          </div>
          <div>
            <label className="admin-label">Size (m²)</label>
            <input type="number" min="0" step="0.5" value={form.size_sqm} onChange={e => setField('size_sqm', e.target.value)} className="admin-input" placeholder="120" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.parking}
                onChange={e => setField('parking', e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="font-sans text-sm text-gray-700">Parking included</span>
            </label>
          </div>
        </div>
      )}

      {/* ─── Description ─── */}
      {tab === 'Description' && (
        <div className="space-y-8">
          <div className="space-y-5">
            <h3 className="font-sans text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">Descriptions</h3>
            {[
              { key: 'description_en' as const, label: '🇬🇧 English', placeholder: 'Describe the property in English…' },
              { key: 'description_ru' as const, label: '🇷🇺 Russian / Русский', placeholder: 'Описание объекта на русском…' },
              { key: 'description_hy' as const, label: '🇦🇲 Armenian', placeholder: 'Describe in Armenian…' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <textarea
                  value={form[key]}
                  onChange={e => setField(key, e.target.value)}
                  rows={5}
                  className="admin-input resize-none"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="font-sans text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">Features</h3>
              <p className="font-sans text-xs text-gray-400 mt-1">One feature per line — displayed as bullet points on the property page</p>
            </div>
            {[
              { key: 'features_en' as const, label: '🇬🇧 English features', placeholder: 'Sea view\nPrivate pool\nAir conditioning' },
              { key: 'features_ru' as const, label: '🇷🇺 Russian features', placeholder: 'Вид на море\nЧастный бассейн\nКондиционер' },
              { key: 'features_hy' as const, label: '🇦🇲 Armenian features', placeholder: 'Sea view in Armenian…' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <textarea
                  value={form[key]}
                  onChange={e => setField(key, e.target.value)}
                  rows={4}
                  className="admin-input resize-none font-mono text-sm"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Images ─── */}
      {tab === 'Images' && (
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-sans text-sm text-gray-600">Upload up to {MAX_IMAGES} images. Drag to reorder — first image is the cover.</p>
              <p className="font-sans text-xs text-gray-400 mt-1">JPEG · PNG · WebP · max 10 MB each</p>
            </div>
            {form.images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="admin-btn flex items-center gap-2 shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Images
              </button>
            )}
          </div>

          {/* Hidden multi-file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={async e => {
              const files = Array.from(e.target.files || [])
              const slots = MAX_IMAGES - form.images.length
              const toUpload = files.slice(0, slots)
              for (let i = 0; i < toUpload.length; i++) {
                await uploadFile(toUpload[i], form.images.length + i)
              }
              e.target.value = ''
            }}
          />

          {/* Grid — 4 per row on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: Math.min(form.images.length + 1, MAX_IMAGES) }).map((_, i) => (
              <ImageSlot key={i} index={i} />
            ))}
          </div>

          {form.images.length > 1 && (
            <p className="text-xs text-gray-400 font-sans text-center">Drag images to reorder</p>
          )}
        </div>
      )}

      {/* ─── Location ─── */}
      {tab === 'Location' && (
        <div className="space-y-5">
          <p className="font-sans text-sm text-gray-600">Set GPS coordinates to show an interactive map on the property page.</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Latitude</label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={e => setField('latitude', e.target.value)}
                className="admin-input"
                placeholder="36.8969"
              />
            </div>
            <div>
              <label className="admin-label">Longitude</label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={e => setField('longitude', e.target.value)}
                className="admin-input"
                placeholder="30.7133"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowMapPicker(true)}
            className="admin-btn-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Pick on Map
          </button>

          {/* Map preview */}
          {form.latitude && form.longitude && (
            <div className="rounded-lg overflow-hidden border border-gray-200 h-72">
              <MapPicker
                lat={parseFloat(form.latitude)}
                lng={parseFloat(form.longitude)}
                onPick={(lat, lng) => {
                  setField('latitude', String(lat))
                  setField('longitude', String(lng))
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ─── Notes ─── */}
      {tab === 'Notes' && (
        <div className="rounded-lg border border-yellow-200 bg-[#FFFBEB] p-6 space-y-5">
          <div className="bg-red-600 text-white text-sm font-sans font-bold text-center py-2.5 px-4 rounded-md tracking-wide">
            ⚠️ INTERNAL USE ONLY — Not visible to visitors
          </div>
          <p className="font-sans text-sm text-gray-600">
            Use this tab to store private notes about the property. This information is never shown on the public website.
          </p>
          <div>
            <label className="admin-label">Internal Notes</label>
            <textarea
              value={form.internal_notes}
              onChange={e => setField('internal_notes', e.target.value)}
              rows={10}
              className="admin-input resize-y bg-white/80"
              placeholder={"Owner contact: +34 612 xxx\nKey held at office\nPrice negotiable — owner motivated\nClient interested: John D.\nNeeds renovation check"}
            />
          </div>
          <p className="font-sans text-xs text-yellow-700 bg-yellow-100 border border-yellow-200 rounded px-3 py-2">
            💡 Examples: owner contact details, key location, negotiation notes, interested clients, maintenance issues.
          </p>
        </div>
      )}

      {/* ─── Footer ─── */}
      <div className="pt-8 mt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded flex-1">
            {error}
          </p>
        )}
        <div className="flex gap-3 ml-auto">
          <button type="button" onClick={() => router.back()} className="admin-btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="admin-btn px-6 py-2 flex items-center gap-2">
            {saving && <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />}
            {saving ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Create Property'}
          </button>
        </div>
      </div>

      {/* Map picker modal */}
      {showMapPicker && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-sans font-semibold text-navy">Pick Location on Map</h3>
              <button
                type="button"
                onClick={() => setShowMapPicker(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-96">
              <MapPicker
                lat={form.latitude ? parseFloat(form.latitude) : 38}
                lng={form.longitude ? parseFloat(form.longitude) : 23}
                onPick={(lat, lng) => {
                  setField('latitude', String(lat.toFixed(6)))
                  setField('longitude', String(lng.toFixed(6)))
                  setShowMapPicker(false)
                }}
              />
            </div>
            <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500 font-sans">
              Click anywhere on the map to place the marker
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
