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
  const [visible,   setVisible]   = useState(false)   // fade-in gate
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [sliding,   setSliding]   = useState(false)
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

  // ── Keyboard navigation ────────────────────────────────────────────────────
  const go = useCallback((dir: 'left' | 'right') => {
    if (sliding) return
    setDirection(dir)
    setSliding(true)
    setTimeout(() => {
      setCurrent(c => dir === 'right'
        ? (c + 1) % images.length
        : (c - 1 + images.length) % images.length
      )
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go('right') }
      if (e.key === 'ArrowLeft')                    { e.preventDefault(); go('left') }
      if (e.key === 'Escape')                        handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, handleClose])

  // ── Auto-scroll thumbnail strip ────────────────────────────────────────────
  useEffect(() => {
    const strip = thumbsRef.current
    if (!strip) return
    const thumb = strip.children[current] as HTMLElement
    if (!thumb) return
    const offset = thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2
    strip.scrollTo({ left: offset, behavior: 'smooth' })
  }, [current])

  if (!mounted) return null

  // ── Image slide style ──────────────────────────────────────────────────────
  const imgStyle: React.CSSProperties = {
    transition: 'transform 220ms ease-in-out, opacity 220ms ease-in-out',
    transform:  sliding
      ? direction === 'right' ? 'translateX(-6%) scale(0.97)' : 'translateX(6%) scale(0.97)'
      : 'translateX(0) scale(1)',
    opacity: sliding ? 0.3 : 1,
  }

  const lightbox = (
    <div
      className="fixed inset-0 z-[9999] flex flex-col select-none"
      style={{
        background:           'rgba(0,0,0,0.95)',
        backdropFilter:       'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        opacity:    visible ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
      onClick={handleClose}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Counter pill */}
        <div className="font-accent text-[11px] tracking-[0.2em] text-white/70
          bg-black/50 rounded-full px-3 py-1">
          {current + 1} / {images.length}
        </div>

        {/* Property name */}
        <p className="font-serif text-sm text-white/50 hidden sm:block max-w-xs truncate">
          {name}
        </p>

        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="w-11 h-11 flex items-center justify-center
            bg-white/10 hover:bg-white/20 border border-white/15
            transition-colors duration-200 text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Main image ── */}
      <div
        className="flex-1 flex items-center justify-center relative px-14 sm:px-20 min-h-0"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative w-full h-full"
          style={{
            maxWidth:  '95vw',
            maxHeight: '80vh',
            ...imgStyle,
          }}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return
            const diff = touchStartX.current - e.changedTouches[0].clientX
            if (Math.abs(diff) > 40) diff > 0 ? go('right') : go('left')
            touchStartX.current = null
          }}
        >
          <Image
            key={current}
            src={images[current]}
            alt={`${name} — ${current + 1}`}
            fill
            className="object-contain"
            sizes="95vw"
            priority
          />
        </div>

        {/* ── Prev arrow ── */}
        {images.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); go('left') }}
            aria-label="Previous"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2
              w-11 h-11 sm:w-12 sm:h-12 rounded-full
              bg-black/40 hover:bg-[#C9A84C]/20
              border border-white/15 hover:border-[#C9A84C]/50
              flex items-center justify-center text-white
              transition-all duration-200 z-10"
          >
            <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* ── Next arrow ── */}
        {images.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); go('right') }}
            aria-label="Next"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2
              w-11 h-11 sm:w-12 sm:h-12 rounded-full
              bg-black/40 hover:bg-[#C9A84C]/20
              border border-white/15 hover:border-[#C9A84C]/50
              flex items-center justify-center text-white
              transition-all duration-200 z-10"
          >
            <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div
          className="shrink-0 pb-4 pt-3 px-4"
          onClick={e => e.stopPropagation()}
        >
          <div
            ref={thumbsRef}
            className="flex gap-2 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 'right' : 'left')
                  setCurrent(i)
                }}
                className="shrink-0 relative overflow-hidden transition-all duration-200"
                style={{
                  width:   '72px',
                  height:  '72px',
                  border:  i === current ? '2px solid #C9A84C' : '2px solid transparent',
                  opacity: i === current ? 1 : 0.45,
                }}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="72px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return createPortal(lightbox, document.body)
}
