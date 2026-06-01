'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'
import PhotoLightbox from './PhotoLightbox'

interface Props {
  images: string[]
  name:   string
  locale: Locale
}

// ── Expand icon (shown on hover over images) ──────────────────────────────────
function ExpandIcon() {
  return (
    <div className="absolute bottom-3 right-3 z-10
      w-8 h-8 flex items-center justify-center
      bg-black/40 border border-white/20
      opacity-0 group-hover:opacity-100
      transition-opacity duration-300">
      <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    </div>
  )
}

export default function PropertyGallery({ images, name, locale }: Props) {
  const t = getT(locale)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [mobileIndex,   setMobileIndex]   = useState(0)
  const touchStartX = useRef<number | null>(null)

  const open  = (i: number) => setLightboxIndex(i)
  const close = ()          => setLightboxIndex(null)

  const mobilePrev = () => setMobileIndex(i => (i - 1 + images.length) % images.length)
  const mobileNext = () => setMobileIndex(i => (i + 1) % images.length)

  if (!images.length) return null

  const primary        = images[0]
  const secondaries    = images.slice(1, 5)
  const remainingCount = images.length - 5

  return (
    <>
      {/* ── Gallery grid ── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-navy">{t.property.gallery}</h2>
          {images.length > 1 && (
            <button
              onClick={() => open(0)}
              className="font-accent text-[10px] tracking-[0.2em] uppercase text-gold
                hover:text-gold-600 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              {t.property.gallery} ({images.length})
            </button>
          )}
        </div>
        <div className="gold-divider mb-6" />

        {/* ── Mobile: single image with swipe ── */}
        <div
          className="md:hidden relative aspect-[4/3] overflow-hidden group cursor-zoom-in"
          onClick={() => open(mobileIndex)}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return
            const diff = touchStartX.current - e.changedTouches[0].clientX
            if (Math.abs(diff) > 50) {
              e.stopPropagation()
              diff > 0 ? mobileNext() : mobilePrev()
            }
            touchStartX.current = null
          }}
        >
          <Image
            src={images[mobileIndex]}
            alt={name}
            fill
            className="object-cover"
            sizes="100vw"
            priority={mobileIndex === 0}
          />
          {/* Counter */}
          <div className="absolute bottom-3 left-3 bg-black/50 text-white
            font-accent text-[10px] tracking-wider px-2.5 py-1 rounded-full">
            {mobileIndex + 1} / {images.length}
          </div>
          {/* Expand icon */}
          <ExpandIcon />
          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); mobilePrev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                  bg-black/40 flex items-center justify-center text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); mobileNext() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                  bg-black/40 flex items-center justify-center text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* ── Desktop: photo grid ── */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[520px]">
          {/* Primary — 2 cols, 2 rows */}
          <button
            className="col-span-2 row-span-2 relative overflow-hidden group
              cursor-zoom-in rounded-l-xl"
            onClick={() => open(0)}
          >
            <Image
              src={primary}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="50vw"
              priority
            />
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-300" />
            <ExpandIcon />
          </button>

          {/* Secondaries */}
          {Array.from({ length: 4 }).map((_, i) => {
            const img    = secondaries[i]
            const isLast = i === 3
            const hasMore = isLast && remainingCount > 0
            return (
              <button
                key={i}
                className={`relative overflow-hidden group cursor-zoom-in
                  ${i === 1 ? 'rounded-tr-xl' : ''}
                  ${i === 3 ? 'rounded-br-xl' : ''}`}
                onClick={() => open(img ? i + 1 : 0)}
                disabled={!img && !hasMore}
              >
                {img ? (
                  <>
                    <Image
                      src={img}
                      alt={`${name} ${i + 2}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="25vw"
                    />
                    {hasMore ? (
                      <div className="absolute inset-0 bg-navy/55 flex items-center justify-center">
                        <span className="font-serif text-2xl text-white">+{remainingCount + 1}</span>
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/15 transition-colors duration-300" />
                        <ExpandIcon />
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-navy-100" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Full-screen lightbox via portal ── */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          images={images}
          initialIndex={lightboxIndex}
          name={name}
          onClose={close}
        />
      )}
    </>
  )
}
