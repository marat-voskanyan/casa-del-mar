'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'
import { getYearsExperience } from '@/lib/years'

interface Props {
  locale: Locale
  page?: 'home' | 'spain' | 'cyprus'
  /** Optional background photo shown behind the gradient (non-home pages) */
  bgImage?: string
  bgAlt?:   string
}

// ── Count-up stat item with IntersectionObserver ──────────────────────────────
function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount]       = useState(0)
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !triggered) setTriggered(true) },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [triggered])

  useEffect(() => {
    if (!triggered) return
    const duration = 2000
    const steps    = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) { setCount(value); clearInterval(timer) }
      else                  { setCount(Math.floor(current)) }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [triggered, value])

  return (
    <div ref={ref} className="py-5 text-center">
      <p className="font-serif text-2xl md:text-3xl text-gold font-light tracking-wide">
        {count}{suffix}
      </p>
      <p className="font-accent text-[10px] tracking-[0.2em] text-white/45 uppercase mt-1">
        {label}
      </p>
    </div>
  )
}

// ── Free stat — no count-up animation, just shows "Free" ─────────────────────
function FreeStatItem({ label }: { label: string }) {
  return (
    <div className="py-5 text-center">
      <p className="font-serif text-2xl md:text-3xl text-gold font-light tracking-wide">Free</p>
      <p className="font-accent text-[10px] tracking-[0.2em] text-white/45 uppercase mt-1">{label}</p>
    </div>
  )
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function Hero({ locale, page = 'home', bgImage, bgAlt }: Props) {
  const t      = getT(locale)
  const hero   = t.hero[page]
  const isHome = page === 'home'

  // Parallax ref — only active on desktop
  const imgWrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isHome) return
    const handleScroll = () => {
      if (imgWrapRef.current && window.innerWidth > 768) {
        imgWrapRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  // Particles — generated client-side to avoid hydration mismatch
  const [particles, setParticles] = useState<
    Array<{ id: number; left: string; top: string; size: number; duration: number; delay: number }>
  >([])
  useEffect(() => {
    if (!isHome) return
    const n = window.innerWidth > 768 ? 25 : 10
    setParticles(
      Array.from({ length: n }, (_, i) => ({
        id:       i,
        left:     `${Math.random() * 100}%`,
        top:      `${Math.random() * 100}%`,
        size:     Math.random() * 2 + 1,
        duration: Math.random() * 10 + 15,
        delay:    Math.random() * 10,
      }))
    )
  }, [isHome])

  function scrollToNext() {
    const next = document.getElementById('stats-bar')
    if (next) next.scrollIntoView({ behavior: 'smooth' })
    else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section className={`relative flex items-center overflow-hidden ${isHome ? 'min-h-[100svh]' : 'min-h-[60vh]'}`}>

      {/* ── HOME: real Benidorm aerial photo with parallax ── */}
      {isHome && (
        <div ref={imgWrapRef} className="absolute inset-0 z-0" style={{ top: '-10%', bottom: '-10%' }}>
          <Image
            src="/images/view-from-apartment.jpg"
            alt="Sea view from apartment in Benidorm, Costa Blanca Spain"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      )}

      {/* ── INNER PAGES: provided bg photo ── */}
      {!isHome && bgImage && (
        <Image
          src={bgImage}
          alt={bgAlt ?? ''}
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* ── HOME: 3-layer luxury gradient ── */}
      {isHome && (
        <>
          {/* Layer 1 — main cinematic darkness */}
          <div className="absolute inset-0 z-[1]" style={{
            background: 'linear-gradient(to bottom, rgba(13,31,45,0.65) 0%, rgba(13,31,45,0.38) 35%, rgba(13,31,45,0.48) 65%, rgba(13,31,45,0.85) 100%)'
          }} />
          {/* Layer 2 — warm edge vignette */}
          <div className="absolute inset-0 z-[1]" style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,20,35,0.50) 100%)'
          }} />
          {/* Layer 3 — bottom fade for stats bar readability */}
          <div className="absolute inset-0 z-[1]" style={{
            background: 'linear-gradient(to top, rgba(13,31,45,0.92) 0%, transparent 38%)'
          }} />
        </>
      )}

      {/* ── INNER PAGES: gradient overlay ── */}
      {!isHome && (
        <>
          <div className={`absolute inset-0 z-[1] ${bgImage ? 'bg-navy/65' : 'hero-bg'}`} />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
        </>
      )}

      {/* ── HOME: subtle floating gold particles ── */}
      {isHome && particles.length > 0 && (
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
          {particles.map(p => (
            <span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left:     p.left,
                top:      p.top,
                width:    `${p.size}px`,
                height:   `${p.size}px`,
                background: 'rgba(201,168,76,0.30)',
                animation: `heroParticleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Gold vertical accent line */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-px z-[3] bg-gradient-to-b from-transparent via-gold/40 to-transparent" />

      {/* ── CONTENT ── */}
      <div className={`container-site relative z-[10] flex flex-col items-center text-center ${isHome ? 'pt-40 pb-36' : 'pt-32 pb-20'}`}>

        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in">
          <div className="w-10 h-px bg-gold/70" />
          <span className="font-accent text-[11px] tracking-[0.30em] uppercase text-gold/90">
            Casa del Mar · International Real Estate
          </span>
          <div className="w-10 h-px bg-gold/70" />
        </div>

        {/* Headline — bigger, more dramatic */}
        <h1
          className="font-serif font-light text-white leading-[1.05] mb-6 opacity-0 animate-fade-up whitespace-pre-line max-w-5xl"
          style={{
            fontSize:    'clamp(2.2rem, 8vw, 7rem)',
            letterSpacing: '-0.02em',
            textShadow:  '0 2px 20px rgba(0,0,0,0.35)',
          }}
        >
          {hero.title}
        </h1>

        {/* Gold divider */}
        <div
          className="bg-gold opacity-0 animate-fade-up-d1"
          style={{ width: '60px', height: '1px', margin: '1.5rem auto' }}
        />

        {/* Subtitle */}
        <p
          className="font-sans font-light text-white/80 max-w-2xl leading-relaxed mb-10 opacity-0 animate-fade-up-d1 px-2 sm:px-0"
          style={{
            fontSize:      'clamp(1rem, 2.5vw, 1.3rem)',
            letterSpacing: '0.05em',
          }}
        >
          {hero.subtitle}
        </p>

        {/* ── CTAs — home only ── */}
        {isHome && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8 opacity-0 animate-fade-up-d2 w-full sm:w-auto px-4 sm:px-0">

            {/* Primary — gold fill */}
            <Link
              href={`/${locale}/spain`}
              className="flex items-center justify-center w-full sm:w-auto h-14 px-10 font-accent text-[12px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(201,168,76,0.35)]"
              style={{ background: '#C9A84C', color: '#0D1F2D', border: '2px solid #C9A84C' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'transparent'; el.style.color = '#C9A84C' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#C9A84C'; el.style.color = '#0D1F2D' }}
            >
              {(hero as typeof t.hero.home).cta}
            </Link>

            {/* Ghost — white outline */}
            <Link
              href={`/${locale}/cyprus`}
              className="flex items-center justify-center w-full sm:w-auto h-14 px-10 font-accent text-[12px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(201,168,76,0.25)]"
              style={{ background: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.60)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(255,255,255,0.08)'; el.style.borderColor = '#C9A84C'; el.style.color = '#C9A84C' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'transparent'; el.style.borderColor = 'rgba(255,255,255,0.60)'; el.style.color = '#FFFFFF' }}
            >
              {(hero as typeof t.hero.home).ctaContact}
            </Link>
          </div>
        )}

        {/* ── Animated scroll indicator — home only ── */}
        {isHome && (
          <button
            onClick={scrollToNext}
            aria-label="Scroll to next section"
            className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-0 animate-fade-up-d3 cursor-pointer group"
          >
            <div className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent" />
            <div
              className="w-1.5 h-1.5 rounded-full bg-gold/70 group-hover:bg-gold transition-colors"
              style={{ animation: 'heroScrollBounce 2s ease-in-out infinite' }}
            />
            <span className="font-accent text-[9px] tracking-[0.35em] uppercase text-gold/50 group-hover:text-gold/80 transition-colors mt-0.5">
              Scroll
            </span>
          </button>
        )}
      </div>

      {/* ── Stats bar — home only ── */}
      {isHome && (
        <div
          id="stats-bar"
          className="absolute bottom-0 left-0 right-0 border-t border-gold/15 z-[10]"
          style={{ background: 'rgba(13,31,45,0.88)', backdropFilter: 'blur(14px)' }}
        >
          <div className="container-site">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gold/10">
              {[
                { value: 2,                      suffix: '',  label: t.home.stats.countries },
                { value: getYearsExperience(),   suffix: '+', label: t.home.stats.years },
                { value: 200,                    suffix: '+', label: t.home.stats.clients },
                { value: 0,                      suffix: '',  label: t.home.stats.properties, freeLabel: true },
              ].map(stat => (
                stat.freeLabel
                  ? <FreeStatItem key={stat.label} label={stat.label} />
                  : <StatItem key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
