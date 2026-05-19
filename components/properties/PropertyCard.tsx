'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Property, Locale } from '@/types'
import { getT, formatPrice } from '@/lib/i18n'

interface Props {
  property: Property
  locale: Locale
  onQuickView?: (property: Property) => void
}

const STATUS_DOT: Record<string, string> = {
  available: 'dot-available',
  sold:      'dot-sold',
  reserved:  'dot-reserved',
}
const STATUS_BADGE: Record<string, string> = {
  available: 'badge-available',
  sold:      'badge-sold',
  reserved:  'badge-reserved',
}

function HeartButton({ id }: { id: number }) {
  const key = `fav_${id}`
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    try { setLiked(localStorage.getItem(key) === '1') } catch {}
  }, [key])

  const toggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(v => {
      const next = !v
      try { next ? localStorage.setItem(key, '1') : localStorage.removeItem(key) } catch {}
      return next
    })
  }, [key])

  return (
    <button
      onClick={toggle}
      aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-200"
    >
      <svg
        className={`w-4 h-4 transition-colors duration-200 ${liked ? 'text-red-400 fill-red-400' : 'text-white fill-none'}`}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  )
}

export default function PropertyCard({ property, locale, onQuickView }: Props) {
  const t = getT(locale)
  const image = property.images?.[0] || null

  return (
    <article className="group relative bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-400 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-navy-100 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-700 flex items-center justify-center">
            <svg className="w-16 h-16 text-white/10" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 badge ${STATUS_BADGE[property.status] ?? 'badge-available'}`}>
          <span className={STATUS_DOT[property.status] ?? 'dot-available'} />
          {t.property.status[property.status]}
        </div>

        {/* Heart */}
        <HeartButton id={property.id} />

        {/* Image count */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
            <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="font-accent text-[10px] text-white/80">{property.images.length}</span>
          </div>
        )}

        {/* Price overlay on image */}
        <div className="absolute bottom-3 left-3">
          <p className="font-serif text-xl text-white font-light drop-shadow">
            {formatPrice(property.price)}
          </p>
        </div>

        {/* Quick view — appears on hover */}
        {onQuickView && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={e => { e.preventDefault(); onQuickView(property) }}
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-accent text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-white/20 transition-all duration-200"
            >
              {t.property.quickView}
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-serif text-lg text-navy leading-tight group-hover:text-gold transition-colors duration-200">
            {property.name}
          </h3>
        </div>

        <p className="font-sans text-xs text-navy/45 tracking-wide mb-4 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gold/60 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {property.location}
        </p>

        {/* Feature row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-sans text-navy/55">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gold/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
              </svg>
              {property.bedrooms} {t.property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gold/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {property.bathrooms} {t.property.bathrooms}
            </span>
          )}
          {property.size_sqm != null && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gold/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              {property.size_sqm} {t.property.sqm}
            </span>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-5">
        <Link
          href={`/${locale}/properties/${property.id}`}
          className="flex items-center justify-between w-full border border-sand-300 px-4 py-2.5 hover:border-gold hover:bg-gold/5 transition-all duration-200 group/cta"
        >
          <span className="font-accent text-[10px] tracking-[0.2em] uppercase text-navy/60 group-hover/cta:text-gold transition-colors">
            {t.property.viewDetails}
          </span>
          <svg className="w-4 h-4 text-gold group-hover/cta:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
