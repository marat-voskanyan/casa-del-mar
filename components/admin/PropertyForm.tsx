'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import type { Property, PropertyFormData } from '@/types'
import { LockIcon, WarningIcon, WavesIcon, PhoneIcon, TrendIcon, PersonIcon, KeyIcon, ClipboardIcon } from '@/components/icons/LuxuryIcons'

const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false })

const MAX_IMAGES = 30
const TABS = ['Basic', 'Details', 'Description', 'Images', 'Location', 'Notes'] as const
type Tab = typeof TABS[number]

const BENIDORM_LAT = 38.5401
const BENIDORM_LNG = -0.1228

const LOCATION_PRESETS = [
  { label: 'Benidorm',       lat: 38.5401, lng: -0.1228 },
  { label: 'La Cala',        lat: 38.5416, lng: -0.1197 },
  { label: 'Levante',        lat: 38.5430, lng: -0.1150 },
  { label: 'Poniente',       lat: 38.5380, lng: -0.1280 },
  { label: 'Sierra Cortina', lat: 38.5520, lng: -0.1050 },
  { label: 'Altea Hills',    lat: 38.6100, lng: -0.0500 },
  { label: 'Finestrat',      lat: 38.5630, lng: -0.1890 },
  { label: 'Larnaca CY',     lat: 34.9009, lng: 33.6231 },
  { label: 'Paphos CY',      lat: 34.7754, lng: 32.4240 },
]

const EMPTY: PropertyFormData = {
  name: '', name_ru: '', name_hy: '', location: '', price: '',
  bedrooms: '', bathrooms: '', floor: '', size_sqm: '', parking: false,
  status: 'available', country: 'spain', ref: '', description_en: '',
  description_ru: '', description_hy: '', features_en: '', features_ru: '',
  features_hy: '', internal_notes: '', images: [], latitude: '', longitude: '',
}

function toForm(p: Partial<Property>): Partial<PropertyFormData> {
  return {
    name:           p.name        || '',
    name_ru:        p.name_ru     || '',
    name_hy:        p.name_hy     || '',
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
  const [uploading, setUploading] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Name Translator ──────────────────────────────────────────────────────────
  const [isTranslatingName, setIsTranslatingName] = useState(false)

  async function handleTranslateName() {
    if (!form.name.trim()) return
    setIsTranslatingName(true)
    try {
      const res  = await fetch('/api/admin/translate-name', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: form.name }),
      })
      const data = await res.json()
      if (res.ok) {
        setForm(prev => ({ ...prev, name_ru: data.ru || prev.name_ru, name_hy: data.hy || prev.name_hy }))
      }
    } catch { /* silent */ }
    finally { setIsTranslatingName(false) }
  }

  // ── AI Description Generator ─────────────────────────────────────────────────
  const [isGenerating,          setIsGenerating]          = useState(false)
  const [generateError,         setGenerateError]         = useState('')
  const [generateSuccess,       setGenerateSuccess]       = useState(false)
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)
  const [selectedStyle,         setSelectedStyle]         = useState('casa-del-mar')
  const [generatingStep,        setGeneratingStep]        = useState('')

  const GENERATE_STEPS = [
    'Step 1/3: Writing English description…',
    'Step 2/3: Translating to Russian with DeepL…',
    'Step 3/3: Translating to Armenian…',
  ]

  // Cycle step messages while generating
  useEffect(() => {
    if (!isGenerating) { setGeneratingStep(''); return }
    let idx = 0
    setGeneratingStep(GENERATE_STEPS[0])
    const interval = setInterval(() => {
      idx = (idx + 1) % GENERATE_STEPS.length
      setGeneratingStep(GENERATE_STEPS[idx])
    }, 2000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating])

  // ── Feature selectors (state persists across tab switches) ───────────────────
  const [selectedView,           setSelectedView]           = useState<string[]>([])
  const [selectedDistance,       setSelectedDistance]       = useState('')
  const [selectedFacilities,     setSelectedFacilities]     = useState<string[]>([])
  const [selectedCondition,      setSelectedCondition]      = useState('')
  const [selectedFloorType,      setSelectedFloorType]      = useState('')
  const [selectedSpecialFeatures,setSelectedSpecialFeatures]= useState<string[]>([])
  const [selectedInvestment,     setSelectedInvestment]     = useState<string[]>([])

  const toggleMultiple = (value: string, current: string[], setter: (v: string[]) => void) => {
    setter(current.includes(value) ? current.filter(v => v !== value) : [...current, value])
  }
  const toggleSingle = (value: string, current: string, setter: (v: string) => void) => {
    setter(current === value ? '' : value)
  }
  const handleClearAll = () => {
    setSelectedView([])
    setSelectedDistance('')
    setSelectedFacilities([])
    setSelectedCondition('')
    setSelectedFloorType('')
    setSelectedSpecialFeatures([])
    setSelectedInvestment([])
  }

  const STYLES = [
    { id: 'casa-del-mar', label: 'Casa del Mar', tag: '(Default)' },
    { id: 'luxury',       label: 'Luxury',       tag: '' },
    { id: 'investment',   label: 'Investment',   tag: '' },
    { id: 'family',       label: 'Family',       tag: '' },
    { id: 'short',        label: 'Short',        tag: '' },
    { id: 'detailed',     label: 'Detailed',     tag: '' },
  ]

  async function handleGenerateDescriptions() {
    if ((form.description_en || form.description_ru || form.description_hy) && !showRegenerateConfirm) {
      setShowRegenerateConfirm(true)
      return
    }
    setIsGenerating(true)
    setGenerateError('')
    setGenerateSuccess(false)
    setShowRegenerateConfirm(false)
    try {
      const featureData = {
        view:           selectedView,
        distanceToSea:  selectedDistance,
        facilities:     selectedFacilities,
        condition:      selectedCondition,
        floorType:      selectedFloorType,
        specialFeatures:selectedSpecialFeatures,
        investment:     selectedInvestment,
      }
      const res = await fetch('/api/admin/generate-description', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:      form.name,
          location:  form.location,
          price:     form.price,
          bedrooms:  form.bedrooms,
          bathrooms: form.bathrooms,
          floor:     form.floor,
          size:      form.size_sqm,
          parking:   form.parking,
          status:    form.status,
          features:  featureData,
          style:     selectedStyle,
        }),
      })
      const data = await res.json()
      if (res.status === 401) throw new Error('Session expired. Please log out and log in again.')
      if (res.status === 429) throw new Error('Rate limit reached. Try again in an hour.')
      if (!res.ok)           throw new Error(data.error || 'Generation failed')
      setForm(prev => ({
        ...prev,
        description_en: data.descriptions.en,
        description_ru: data.descriptions.ru,
        description_hy: data.descriptions.hy,
      }))
      // Auto-translate name if not yet translated
      if ((!form.name_ru || !form.name_hy) && form.name.trim()) {
        handleTranslateName()
      }
      setGenerateSuccess(true)
      setTimeout(() => setGenerateSuccess(false), 5000)
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

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
        name_ru:        form.name_ru  || null,
        name_hy:        form.name_hy  || null,
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
        {TABS.map(t => {
          const isNotes = t === 'Notes'
          const isActive = tab === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                'px-5 py-3 text-sm font-sans font-medium border-b-2 -mb-px whitespace-nowrap transition-colors',
                isNotes
                  ? isActive
                    ? 'bg-amber-500 text-white border-amber-500 rounded-t'
                    : 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-500 hover:text-white rounded-t'
                  : isActive
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-500 hover:text-navy',
              ].join(' ')}
            >
              {isNotes ? <><LockIcon size={13} className="inline mr-1" /> Internal Notes</> : t === 'Images' ? `Images (${form.images.length}/${MAX_IMAGES})` : t}
            </button>
          )
        })}
      </div>

      {/* ─── Basic ─── */}
      {tab === 'Basic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="admin-label">Property Name (English) *</label>
            <div className="flex gap-2">
              <input
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                required
                className="admin-input flex-1"
                placeholder="Beachfront Villa Marbella"
              />
              <button
                type="button"
                onClick={handleTranslateName}
                disabled={!form.name.trim() || isTranslatingName}
                className="px-3 py-2 bg-[#C9A84C] text-[#0D1F2D] text-xs font-semibold rounded whitespace-nowrap hover:bg-[#d4b55a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Translate name to Russian and Armenian"
              >
                {isTranslatingName ? '⟳' : '🌐 Translate'}
              </button>
            </div>
            {/* Translated name fields */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">Name in Russian</label>
                <input
                  value={form.name_ru}
                  onChange={e => setField('name_ru', e.target.value)}
                  className="admin-input text-sm"
                  placeholder="Auto-translated or enter manually"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">Name in Armenian</label>
                <input
                  value={form.name_hy}
                  onChange={e => setField('name_hy', e.target.value)}
                  className="admin-input text-sm"
                  placeholder="Auto-translated or enter manually"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">Location *</label>
            <input value={form.location} onChange={e => setField('location', e.target.value)} required className="admin-input" placeholder="Marbella, Costa del Sol" />
          </div>
          <div>
            <label className="admin-label">Price (€) *</label>
            <input type="number" min="0" step="any" value={form.price} onChange={e => setField('price', e.target.value)} required className="admin-input" placeholder="450000" />
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

          {/* ── AI Generator Panel ── */}
          <div className="border border-amber-200 rounded-lg overflow-hidden">

            {/* ── Feature Selectors ── */}
            <div className="p-4 bg-white border-b border-amber-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Property Features</h3>
                  <p className="text-xs text-gray-400">Select to improve AI accuracy</p>
                </div>
                <button type="button" onClick={handleClearAll}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors underline">
                  Clear all
                </button>
              </div>

              {/* Helper pill component */}
              {([
                {
                  label: 'View', multi: true,
                  options: ['Sea View','Partial Sea View','Pool View','Garden View','Mountain View','City View'],
                  selected: selectedView, setter: setSelectedView,
                },
                {
                  label: 'Distance to Sea', multi: false,
                  options: ['Beachfront','50m','100m','200m','300m','500m','1km+','Not specified'],
                  selected: selectedDistance, setter: setSelectedDistance,
                },
                {
                  label: 'Complex Facilities', multi: true,
                  options: ['Swimming Pool','Tennis Court','Gym','Spa','Underground Parking','24h Security','Concierge','Garden','BBQ Area','Kids Playground'],
                  selected: selectedFacilities, setter: setSelectedFacilities,
                },
                {
                  label: 'Condition', multi: false,
                  options: ['Brand New','Modern Renovated','Good Condition','Original Condition','Needs Renovation'],
                  selected: selectedCondition, setter: setSelectedCondition,
                },
                {
                  label: 'Floor Type', multi: false,
                  options: ['Ground Floor + Garden','Low Floor (1-3)','Mid Floor (4-8)','High Floor (9-15)','Penthouse','Duplex','Top Floor'],
                  selected: selectedFloorType, setter: setSelectedFloorType,
                },
                {
                  label: 'Special Features', multi: true,
                  options: ['Terrace','Large Balcony','Air Conditioning','Fitted Kitchen','Furnished','Storage Room','Lift/Elevator','Smart Home','Sea Facing Bedroom'],
                  selected: selectedSpecialFeatures, setter: setSelectedSpecialFeatures,
                },
                {
                  label: 'Investment', multi: true,
                  options: ['High Rental Yield','Tourist Area','Year-Round Rental','Currently Rented','Rental License','Near Airport','New Development'],
                  selected: selectedInvestment, setter: setSelectedInvestment,
                },
              ] as Array<{
                label: string; multi: boolean; options: string[];
                selected: string | string[]; setter: ((v: string) => void) | ((v: string[]) => void);
              }>).map(group => {
                const isMulti = group.multi
                const sel = group.selected
                const hasSelection = isMulti ? (sel as string[]).length > 0 : (sel as string) !== ''
                return (
                  <div key={group.label} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium tracking-wide uppercase text-gray-400">{group.label}</span>
                      {hasSelection && (
                        <button type="button"
                          onClick={() => isMulti ? (group.setter as (v: string[]) => void)([]) : (group.setter as (v: string) => void)('')}
                          className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors">clear</button>
                      )}
                    </div>
                    <div className="flex flex-wrap">
                      {group.options.map(opt => {
                        const active = isMulti
                          ? (sel as string[]).includes(opt)
                          : (sel as string) === opt
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => isMulti
                              ? toggleMultiple(opt, sel as string[], group.setter as (v: string[]) => void)
                              : toggleSingle(opt, sel as string, group.setter as (v: string) => void)
                            }
                            className={[
                              'inline-flex items-center px-3 py-1 rounded-full border text-xs cursor-pointer m-0.5 transition-all duration-150 select-none',
                              active
                                ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0D1F2D] font-medium'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-[#C9A84C] hover:text-[#C9A84C]',
                            ].join(' ')}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Style selector + Generate button ── */}
            <div className="p-4 bg-amber-50">
              {/* Style pills */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400 mr-1">Style:</span>
                {STYLES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedStyle(s.id)}
                    className={[
                      'px-3 py-1 rounded-full border text-xs transition-all duration-150',
                      selectedStyle === s.id
                        ? 'bg-[#0D1F2D] border-[#0D1F2D] text-white font-medium'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#0D1F2D] hover:text-[#0D1F2D]',
                    ].join(' ')}
                  >
                    {s.label}{s.tag ? ` ${s.tag}` : ''}
                  </button>
                ))}
              </div>

              {/* Generate / confirm row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Generates EN + RU + AM descriptions</p>
                </div>
                {showRegenerateConfirm ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-700">Replace existing?</span>
                    <button type="button" onClick={handleGenerateDescriptions}
                      className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded hover:bg-amber-600 transition-colors">
                      Yes, replace
                    </button>
                    <button type="button" onClick={() => setShowRegenerateConfirm(false)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateDescriptions}
                    disabled={isGenerating || !form.name || !form.location}
                    title={!form.name || !form.location ? 'Fill in name and location first' : 'Generate AI descriptions'}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#0D1F2D] font-semibold text-sm rounded hover:bg-[#d4b55a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isGenerating ? (
                      <><span className="inline-block animate-spin">⟳</span> Generating…</>
                    ) : (
                      `✨ Generate — ${STYLES.find(s => s.id === selectedStyle)?.label ?? 'AI'} Style`
                    )}
                  </button>
                )}
              </div>

              {generateSuccess && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-xs">
                  ✅ Descriptions generated! Review and edit before saving.
                </div>
              )}
              {generateError && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                  ❌ {generateError}
                </div>
              )}
            </div>
          </div>

          <div className="relative space-y-5">
            {isGenerating && (
              <div className="absolute inset-0 bg-amber-50/80 rounded-lg flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-amber-500/40 border-t-amber-600 rounded-full animate-spin" />
                  <div className="text-amber-700 text-sm font-medium text-center px-4">
                    {generatingStep || '✨ AI is writing your descriptions…'}
                  </div>
                </div>
              </div>
            )}
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
          </div>{/* end relative space-y-5 wrapper */}

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
              <p className="font-sans text-xs text-gray-400 mt-1">JPG · PNG · WebP · AVIF · max 10 MB each · up to {MAX_IMAGES} photos</p>
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
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
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

          {/* Quick location presets */}
          <div>
            <p className="admin-label mb-2">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {LOCATION_PRESETS.map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setField('latitude', String(p.lat))
                    setField('longitude', String(p.lng))
                  }}
                  className="px-3 py-1 text-xs font-sans font-medium rounded-full bg-[#C9A84C]/10 text-[#8a6b1e] border border-[#C9A84C]/40 hover:bg-[#C9A84C] hover:text-white transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Latitude</label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={e => setField('latitude', e.target.value)}
                className="admin-input"
                placeholder="38.5401"
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
                placeholder="-0.1228"
              />
            </div>
          </div>

          <div className="flex gap-3">
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
            <button
              type="button"
              onClick={() => {
                setField('latitude', String(BENIDORM_LAT))
                setField('longitude', String(BENIDORM_LNG))
              }}
              className="px-4 py-2 text-sm font-sans font-medium rounded border border-[#C9A84C] text-[#8a6b1e] hover:bg-[#C9A84C] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <WavesIcon size={13} className="inline mr-1" /> Reset to Benidorm
            </button>
          </div>

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
        <div className="space-y-5">
          {/* Warning banner */}
          <div
            className="rounded-lg px-4 py-3 font-sans font-bold text-sm"
            style={{ background: '#FEE2E2', border: '2px solid #EF4444', borderRadius: '8px' }}
          >
            <WarningIcon size={16} className="inline mr-2 align-text-bottom" /> INTERNAL USE ONLY — This information is never shown to website visitors
          </div>

          {/* Quick template buttons */}
          <div>
            <p className="admin-label mb-2">Quick Templates</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Owner contact',   icon: <PhoneIcon size={12} />,    insert: 'Owner contact: ' },
                { label: 'Price note',      icon: <TrendIcon size={12} />,    insert: 'Price negotiable: ' },
                { label: 'Client interest', icon: <PersonIcon size={12} />,   insert: 'Client interested: ' },
                { label: 'Key location',    icon: <KeyIcon size={12} />,      insert: 'Key location: ' },
                { label: 'Commission',      icon: <ClipboardIcon size={12} />, insert: 'Commission: ' },
              ].map(({ label, icon, insert }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setField('internal_notes', form.internal_notes + (form.internal_notes && !form.internal_notes.endsWith('\n') ? '\n' : '') + insert)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans rounded border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-200 transition-colors"
                >
                  {icon}{label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <label className="admin-label">Internal Notes</label>
            <textarea
              value={form.internal_notes}
              onChange={e => {
                if (e.target.value.length <= 2000) setField('internal_notes', e.target.value)
              }}
              className="w-full rounded border-2 border-[#F59E0B] bg-[#FFFBEB] px-3 py-2 font-sans text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-500 resize-y"
              style={{ minHeight: '200px' }}
              placeholder={"Add private notes here...\nExamples:\n• Owner contact: +34 612 xxx xxx\n• Key held at office\n• Price negotiable — owner motivated\n• Client Ara is interested — follow up\n• Needs renovation inspection before sale\n• Commission: 3%"}
            />
            <p className="font-sans text-xs text-gray-400 mt-1 text-right">
              {form.internal_notes.length} / 2000 characters
            </p>
          </div>
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
                lat={form.latitude ? parseFloat(form.latitude) : BENIDORM_LAT}
                lng={form.longitude ? parseFloat(form.longitude) : BENIDORM_LNG}
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
