'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

interface Props {
  images:       string[]
  initialIndex: number
  name:         string
  onClose:      () => void
}

export default function PhotoLightbox({ images, initialIndex, name, onClose }: Props) {
  const [current,   setCurrent]   = useState(initialIndex)
  const [mounted,   setMounted]   = useState(false)
  const [visible,   setVisible]   = useState(false)
  const [sliding,   setSliding]   = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const thumbsRef   = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const closing     = useRef(false)

  // ── Mount + fade in ────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    return () => { document.body.style.overflow = '' }
  }, [])

  // ── Navigate with slide animation ─────────────────────────────────────────
  const go = useCallback((dir: 'left' | 'right') => {
    if (sliding) return
    setDirection(dir)
    setSliding(true)
    setTimeout(() => {
      setCurrent(c => dir === 'right'
        ? (c + 1) % images.length
        : (c - 1 + images.length) % images.length)
      setSliding(false)
      setDirection(null)
    }, 220)
  }, [images.length, sliding])

  const handleClose = useCallback(() => {
    if (closing.current) return
    closing.current = true
    setVisible(false)
    setTimeout(onClose, 160)
  }, [onClose])

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go('right') }
      if (e.key === 'ArrowLeft')                    { e.preventDefault(); go('left')  }
      if (e.key === 'Escape')                        handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, handleClose])

  // ── Auto-scroll thumbnails ─────────────────────────────────────────────────
  useEffect(() => {
    const strip = thumbsRef.current
    if (!strip) return
    const thumb = strip.children[current] as HTMLElement | undefined
    if (!thumb) return
    strip.scrollTo({ left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: 'smooth' })
  }, [current])

  if (!mounted) return null

  // ── Slide style for main image ─────────────────────────────────────────────
  const imgStyle: React.CSSProperties = {
    transition: 'transform 220ms ease-in-out, opacity 220ms ease-in-out',
    transform:  sliding
      ? direction === 'right' ? 'translateX(-5%) scale(0.97)' : 'translateX(5%) scale(0.97)'
      : 'translateX(0) scale(1)',
    opacity: sliding ? 0.25 : 1,
    width: '100%', height: '100%',
  }

  const lightbox = (
    <div
      style={{
        position: 'fixed', inset: 0,
        width: '100vw', height: '100dvh',
        zIndex: 99999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease',
        paddingTop:    'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      onClick={handleClose}
    >
      {/* ── Fixed UI: counter + close ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        {/* Counter — top centre */}
        <div
          style={{
            position: 'absolute', top: '16px', left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.5)', borderRadius: '999px',
            padding: '4px 14px',
            fontFamily: 'Montserrat,sans-serif', fontSize: '12px',
            fontWeight: 500, letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.85)',
            pointerEvents: 'none',
          }}
        >
          {current + 1} / {images.length}
        </div>

        {/* Close — top right */}
        <button
          onClick={e => { e.stopPropagation(); handleClose() }}
          aria-label="Close"
          style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'white', transition: 'background 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.20)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)' }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Main image area ── */}
      <div
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100vw', overflow: 'hidden', position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return
          const diff = touchStartX.current - e.changedTouches[0].clientX
          if (Math.abs(diff) > 40) diff > 0 ? go('right') : go('left')
          touchStartX.current = null
        }}
      >
        {/* Image with slide */}
        <div style={{ ...imgStyle, position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
          <Image
            key={current}
            src={images[current]}
            alt={`${name} — ${current + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Prev arrow — fixed left */}
        {images.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); go('left') }}
            aria-label="Previous"
            style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#C9A84C', zIndex: 10,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.20)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)' }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* Next arrow — fixed right */}
        {images.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); go('right') }}
            aria-label="Next"
            style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#C9A84C', zIndex: 10,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.20)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)' }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Thumbnail strip — bottom ── */}
      {images.length > 1 && (
        <div
          style={{
            flexShrink: 0, height: '80px',
            background: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div
            ref={thumbsRef}
            style={{
              display: 'flex', gap: '6px',
              overflowX: 'auto', overflowY: 'hidden',
              padding: '0 16px',
              height: '100%', alignItems: 'center',
              scrollbarWidth: 'none', msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            } as React.CSSProperties}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 'right' : 'left'); setCurrent(i) }}
                style={{
                  flexShrink: 0,
                  width: '62px', height: '62px',
                  border: i === current ? '2px solid #C9A84C' : '2px solid rgba(255,255,255,0.12)',
                  opacity: i === current ? 1 : 0.45,
                  overflow: 'hidden', position: 'relative',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, border-color 0.2s',
                  background: 'transparent',
                }}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="62px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return createPortal(lightbox, document.body)
}
