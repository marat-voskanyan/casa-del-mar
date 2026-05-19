'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

interface Props {
  images: string[]
  name: string
  locale: Locale
}

export default function PropertyGallery({ images, name, locale }: Props) {
  const t = getT(locale)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isOpen = lightboxIndex !== null

  const open = (i: number) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)

  const prev = useCallback(() => {
    setLightboxIndex(i => (i == null ? 0 : (i - 1 + images.length) % images.length))
  }, [images.length])

  const next = useCallback(() => {
    setLightboxIndex(i => (i == null ? 0 : (i + 1) % images.length))
  }, [images.length])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isOpen, prev, next])

  if (!images.length) return null

  const primary = images[0]
  const secondaries = images.slice(1, 5)
  const remainingCount = images.length - 5

  return (
    <>
      {/* Gallery grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-navy">{t.property.gallery}</h2>
          {images.length > 1 && (
            <button
              onClick={() => open(0)}
              className="font-accent text-[10px] tracking-[0.2em] uppercase text-gold hover:text-gold-600 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              {t.property.gallery} ({images.length})
            </button>
          )}
        </div>
        <div className="gold-divider mb-6" />

        {/* Main image + grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] md:h-[520px]">
          {/* Primary — takes 2 columns + 2 rows */}
          <button
            className="col-span-2 row-span-2 relative overflow-hidden group rounded-l-xl"
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
          </button>

          {/* Secondaries */}
          {Array.from({ length: 4 }).map((_, i) => {
            const img = secondaries[i]
            const isLast = i === 3
            const hasMore = isLast && remainingCount > 0
            return (
              <button
                key={i}
                className={`relative overflow-hidden group ${i === 1 ? 'rounded-tr-xl' : ''} ${i === 3 ? 'rounded-br-xl' : ''}`}
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
                    {hasMore && (
                      <div className="absolute inset-0 bg-navy/55 flex items-center justify-center">
                        <span className="font-serif text-2xl text-white">+{remainingCount + 1}</span>
                      </div>
                    )}
                    {!hasMore && (
                      <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/15 transition-colors duration-300" />
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

      {/* Lightbox */}
      {isOpen && lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={close}>
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4" onClick={e => e.stopPropagation()}>

            {/* Close */}
            <button
              onClick={close}
              aria-label={t.gallery.close}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 font-accent text-xs text-white/60 tracking-widest z-10">
              {lightboxIndex + 1} {t.gallery.of} {images.length}
            </div>

            {/* Main image */}
            <div className="relative w-full max-w-5xl flex-1 min-h-0 my-16">
              <Image
                src={images[lightboxIndex]}
                alt={`${name} — ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Prev arrow */}
            {images.length > 1 && (
              <button
                onClick={prev}
                aria-label={t.gallery.prev}
                className="lightbox-arrow left-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}

            {/* Next arrow */}
            {images.length > 1 && (
              <button
                onClick={next}
                aria-label={t.gallery.next}
                className="lightbox-arrow right-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-full px-16 shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`relative w-16 h-12 shrink-0 overflow-hidden rounded transition-all duration-200 ${
                      i === lightboxIndex
                        ? 'ring-2 ring-gold opacity-100'
                        : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
