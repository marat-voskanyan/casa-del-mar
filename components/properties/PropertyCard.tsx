'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Property, Locale } from '@/types'
import { getT, formatPrice } from '@/lib/i18n'
import { BENIDORM_IMAGES, IMAGE_ALT } from '@/lib/images'

interface Props {
  property: Property
  locale: Locale
  onQuickView?: (property: Property) => void
}

const STATUS_LABEL: Record<string, string> = {
  available: 'badge-available',
  sold:      'badge-sold',
  reserved:  'badge-reserved',
}
const STATUS_DOT: Record<string, string> = {
  available: 'dot-available',
  sold:      'dot-sold',
  reserved:  'dot-reserved',
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
      className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center
        bg-black/20 backdrop-blur-md border border-white/15 hover:bg-white/25
        transition-all duration-500"
    >
      <svg
        className={`w-4 h-4 transition-all duration-300 ${liked ? 'text-red-400 fill-red-400 scale-110' : 'text-white/80 fill-none'}`}
        stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  )
}

export default function PropertyCard({ property, locale, onQuickView }: Props) {
  const t = getT(locale)
  const image = property.images?.[0] || null
  const propertySlug = property.ref || String(property.id)
  const href = `/${locale}/properties/${propertySlug}`
  const displayName = locale === 'ru' ? (property.name_ru || property.name)
                    : locale === 'hy' ? (property.name_hy || property.name)
                    : property.name

  return (
    <Link href={href} className="block cursor-pointer group">
      <article className="relative bg-white overflow-hidden transition-all duration-700 ease-out
        hover:shadow-[0_32px_64px_-12px_rgba(13,31,45,0.18)]">

        {/* Gold left accent — grows in on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] z-20
          bg-[#C9A84C] origin-bottom
          scale-y-0 group-hover:scale-y-100
          transition-transform duration-700 ease-out" />

        {/* ── Image ── */}
        <div className="relative aspect-[3/2] overflow-hidden bg-navy/10">
          {image ? (
            <Image
              src={image}
              alt={property.name}
              fill
              className="object-cover transition-transform duration-[1200ms] ease-out
                group-hover:scale-[1.08]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <>
              <Image
                src={BENIDORM_IMAGES.property_fallback}
                alt={IMAGE_ALT.property_fallback}
                fill loading="lazy" quality={70}
                className="object-cover opacity-50"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-navy/50" />
            </>
          )}

          {/* Gradient — deepens on hover for text readability */}
          <div className="absolute inset-0 transition-opacity duration-700
            bg-gradient-to-t from-[#0D1F2D]/80 via-[#0D1F2D]/20 to-transparent
            group-hover:opacity-90" />

          {/* Status */}
          <div className={`absolute top-4 left-4 badge ${STATUS_LABEL[property.status] ?? 'badge-available'}`}>
            <span className={STATUS_DOT[property.status] ?? 'dot-available'} />
            {t.property.status[property.status]}
          </div>

          <HeartButton id={property.id} />

          {/* Photo count */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5
              bg-black/35 backdrop-blur-sm px-2.5 py-1">
              <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="font-accent text-[10px] text-white/70 tracking-wider">{property.images.length}</span>
            </div>
          )}

          {/* Price — bottom left, revealed with card */}
          <div className="absolute bottom-4 left-5">
            <p className="font-serif text-[22px] text-white font-light leading-none
              drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]
              transition-all duration-500 group-hover:text-[#C9A84C]">
              {formatPrice(property.price)}
            </p>
          </div>

          {/* Quick view */}
          {onQuickView && (
            <div className="absolute inset-0 flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onQuickView(property) }}
                className="border border-white/50 bg-white/10 backdrop-blur-sm
                  text-white font-accent text-[10px] tracking-[0.25em] uppercase
                  px-6 py-3 hover:bg-white/20 hover:border-white transition-all duration-300"
              >
                {t.property.quickView}
              </button>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-serif text-[17px] text-navy leading-snug
              group-hover:text-[#C9A84C] transition-colors duration-500">
              {displayName}
            </h3>
            {property.ref && (
              <span className="shrink-0 font-accent text-[9px] tracking-[0.15em] uppercase
                text-[#C9A84C]/70 border border-[#C9A84C]/30 px-2 py-0.5 mt-0.5">
                {property.ref}
              </span>
            )}
          </div>

          <p className="font-accent text-[10px] tracking-[0.15em] uppercase text-navy/40 mb-4 flex items-center gap-1.5">
            <svg className="w-3 h-3 text-[#C9A84C]/50 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {property.location}
          </p>

          {/* Specs row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-accent tracking-wide text-navy/50 uppercase">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-[#C9A84C]/50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
                {property.bedrooms} {t.property.bedrooms}
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-[#C9A84C]/50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {property.bathrooms} {t.property.bathrooms}
              </span>
            )}
            {property.size_sqm != null && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-[#C9A84C]/50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                {property.size_sqm} {t.property.sqm}
              </span>
            )}
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="px-5 pb-5 pt-3">
          <div className="flex items-center justify-between
            border-t border-sand-200 pt-3
            group-hover:border-[#C9A84C]/30 transition-colors duration-500">
            <span className="font-accent text-[10px] tracking-[0.22em] uppercase
              text-navy/50 group-hover:text-[#C9A84C] transition-colors duration-500">
              {t.property.viewDetails}
            </span>
            <svg className="w-4 h-4 text-[#C9A84C]/60
              group-hover:text-[#C9A84C] group-hover:translate-x-1
              transition-all duration-500"
              fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  )
}
