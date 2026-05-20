'use client'

import { useState, useMemo } from 'react'
import type { Property, Locale } from '@/types'
import { getT } from '@/lib/i18n'
import PropertyCard from './PropertyCard'

interface Props {
  properties: Property[]
  locale: Locale
  country: 'spain' | 'cyprus'
  flag: string
  subtitle: string
}

type SortKey = 'newest' | 'priceAsc' | 'priceDesc'
type StatusFilter = 'all' | 'available' | 'reserved' | 'sold'
type BedsFilter = 'any' | '1' | '2' | '3+'

const MAX_PRICE_OPTIONS = [
  { value: 0,        label: 'Any' },
  { value: 150000,   label: '€150k' },
  { value: 250000,   label: '€250k' },
  { value: 350000,   label: '€350k' },
  { value: 500000,   label: '€500k' },
  { value: 750000,   label: '€750k' },
  { value: 1000000,  label: '€1M+' },
]

export default function PropertiesGrid({ properties, locale, country, flag, subtitle }: Props) {
  const t = getT(locale)
  const [status, setStatus]   = useState<StatusFilter>('all')
  const [beds,   setBeds]     = useState<BedsFilter>('any')
  const [maxPrice, setMaxPrice] = useState(0)
  const [sort,   setSort]     = useState<SortKey>('newest')

  const filtered = useMemo(() => {
    let list = properties.filter(p => {
      if (status !== 'all' && p.status !== status) return false
      if (beds !== 'any') {
        const b = p.bedrooms ?? 0
        if (beds === '1' && b < 1) return false
        if (beds === '2' && b < 2) return false
        if (beds === '3+' && b < 3) return false
      }
      if (maxPrice > 0 && p.price > maxPrice) return false
      return true
    })
    switch (sort) {
      case 'priceAsc':  return [...list].sort((a, b) => a.price - b.price)
      case 'priceDesc': return [...list].sort((a, b) => b.price - a.price)
      default:          return list
    }
  }, [properties, status, beds, maxPrice, sort])

  const statusPills: { key: StatusFilter; label: string }[] = [
    { key: 'all',       label: t.filter.all },
    { key: 'available', label: t.property.status.available },
    { key: 'reserved',  label: t.property.status.reserved },
    { key: 'sold',      label: t.property.status.sold },
  ]

  const bedOptions: { key: BedsFilter; label: string }[] = [
    { key: 'any', label: t.filter.any },
    { key: '1',   label: '1+' },
    { key: '2',   label: '2+' },
    { key: '3+',  label: '3+' },
  ]

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'newest',    label: t.filter.newest },
    { key: 'priceAsc',  label: t.filter.priceAsc },
    { key: 'priceDesc', label: t.filter.priceDesc },
  ]

  function clearAll() {
    setStatus('all')
    setBeds('any')
    setMaxPrice(0)
    setSort('newest')
  }

  const hasActiveFilters = status !== 'all' || beds !== 'any' || maxPrice > 0

  return (
    <section className="section-pad bg-sand">
      <div className="container-site">
        {/* Header */}
        <div className="mb-10 reveal">
          <p className="eyebrow text-gold mb-3">{flag}</p>
          <h2 className="section-title text-navy mb-4">{subtitle}</h2>
          <div className="gold-divider" />
        </div>

        {/* Filter bar */}
        <div className="sticky top-[80px] md:top-[88px] z-30 bg-sand/95 backdrop-blur-sm -mx-5 md:-mx-10 px-5 md:px-10 py-3 mb-10 border-b border-sand-300 shadow-sm">
          {/* Single scrollable row on mobile, flex-wrap on desktop */}
          <div className="overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2 min-w-max pb-0.5">
              {/* Status pills */}
              {statusPills.map(pill => (
                <button
                  key={pill.key}
                  onClick={() => setStatus(pill.key)}
                  className={`filter-pill whitespace-nowrap py-2 ${status === pill.key ? 'active' : ''}`}
                >
                  {pill.label}
                </button>
              ))}

              <div className="w-px h-5 bg-navy/15 mx-1 shrink-0" />

              {/* Beds */}
              <span className="font-accent text-[10px] tracking-[0.15em] uppercase text-navy/40 shrink-0">{t.filter.beds}:</span>
              {bedOptions.map(b => (
                <button
                  key={b.key}
                  onClick={() => setBeds(b.key)}
                  className={`px-3 py-2 rounded-full font-accent text-[10px] tracking-wide transition-colors whitespace-nowrap shrink-0 ${
                    beds === b.key
                      ? 'bg-navy text-white'
                      : 'bg-white/60 text-navy/60 hover:bg-white hover:text-navy border border-navy/15'
                  }`}
                >
                  {b.label}
                </button>
              ))}

              <div className="w-px h-5 bg-navy/15 mx-1 shrink-0" />

              {/* Max price */}
              <select
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="font-accent text-[11px] tracking-wide bg-white/60 border border-navy/15 rounded-full px-3 py-2 text-navy/70 focus:outline-none focus:border-gold cursor-pointer hover:bg-white transition-colors shrink-0"
              >
                {MAX_PRICE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                className="font-accent text-[11px] tracking-wide bg-transparent border border-sand-400 rounded-full px-3 py-2 text-navy/70 focus:outline-none focus:border-gold cursor-pointer shrink-0"
              >
                {sortOptions.map(o => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>

              {/* Results count */}
              <span className="font-accent text-[10px] tracking-wider text-navy/50 uppercase shrink-0 ml-1">
                {filtered.length} {t.filter.results}
              </span>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="font-accent text-[10px] tracking-wider text-gold hover:text-gold/70 uppercase transition-colors underline underline-offset-2 shrink-0"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-3xl text-navy/30 mb-3">{t.property.noProperties}</p>
            <button onClick={clearAll} className="btn-ghost mt-2">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <PropertyCard key={p.id} property={p} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
