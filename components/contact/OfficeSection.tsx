'use client'
import { useRef, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'
import { OfficeScrollExperience } from '@/components/OfficeScrollExperience'

const OfficeMap = dynamic(() => import('@/components/OfficeMap'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '400px', background: '#F2EBD9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#C9A84C', fontFamily: 'Montserrat', fontSize: '11px', letterSpacing: '0.2em' }}>LOADING MAP...</span>
    </div>
  ),
})

interface Props { locale: Locale }

export default function OfficeSection({ locale }: Props) {
  const t = getT(locale)
  const o = t.office

  // ── Intersection Observer: scroll reveal + pause looping anim off-screen ──
  const sectionRef  = useRef<HTMLElement>(null)
  const leftRef     = useRef<HTMLDivElement>(null)
  const rightRef    = useRef<HTMLDivElement>(null)
  const goldLineRef = useRef<HTMLDivElement>(null)
  const outdoorImgRef = useRef<HTMLImageElement | null>(null)
  const insideCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section  = sectionRef.current
    const left     = leftRef.current
    const right    = rightRef.current
    const goldLine = goldLineRef.current
    if (!section) return

    // Reveal on enter
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            left?.classList.add('visible')
            right?.classList.add('visible')
            goldLine?.classList.add('visible')
            revealObserver.unobserve(section)
          }
        })
      },
      { threshold: 0.12 }
    )
    revealObserver.observe(section)

    // Pause looping animations when out of view (performance)
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const state = entry.isIntersecting ? 'running' : 'paused'
          if (outdoorImgRef.current) outdoorImgRef.current.style.animationPlayState = state
          if (insideCardRef.current) insideCardRef.current.style.animationPlayState = state
        })
      },
      { threshold: 0 }
    )
    animObserver.observe(section)

    return () => {
      revealObserver.disconnect()
      animObserver.disconnect()
    }
  }, [])

  return (
    <>
      {/* ── Cinematic scroll experience — unchanged ── */}
      <section style={{ background: '#0D1F2D' }}>
        <OfficeScrollExperience />
      </section>

      {/* ══════════════════════════════════════════
          DESKTOP EDITORIAL SPLIT (768px +)
          Luxury full-bleed two-column layout
          ══════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="hidden md:flex"
        style={{
          position: 'relative',
          minHeight: '680px',
          overflow: 'hidden',
          background: '#0D1F2D',
          borderTop: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        {/* LEFT HALF — outdoor photo, edge-to-edge, Ken Burns */}
        <div
          ref={leftRef}
          className="office-left"
          style={{ width: '50%', position: 'relative', flexShrink: 0, overflow: 'hidden' }}
        >
          <Image
            ref={outdoorImgRef as any}
            src="/images/outdoor-new.png"
            alt="Casa del Mar office entrance 37 Mashtots Ave Yerevan Armenia"
            fill
            priority
            quality={90}
            className="outdoor-photo-img"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />

          {/* Dark gradient for quote readability */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(13,31,45,0.75) 0%, rgba(13,31,45,0.2) 40%, transparent 70%)',
          }} />

          {/* Serif quote overlay */}
          <div style={{
            position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem',
            zIndex: 2,
          }}>
            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}>
              {o.officeQuote}
            </p>
            {/* Gold accent line — draws in on scroll */}
            <div
              ref={goldLineRef}
              className="gold-draw-line"
              style={{ width: '50px', height: '1px', background: '#C9A84C' }}
            />
          </div>
        </div>

        {/* RIGHT HALF — navy, inside card + text */}
        <div
          ref={rightRef}
          className="office-right"
          style={{
            flex: 1,
            background: '#0D1F2D',
            padding: '6rem 4rem 4rem',
            position: 'relative',
            zIndex: 1,
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Inside photo card — floating, overlapping split line */}
          <div
            ref={insideCardRef}
            className="inside-card inside-card-wrap"
            style={{
              width: '65%',
              aspectRatio: '4/3',
              position: 'relative',
              marginTop: '-80px',
              marginLeft: '-80px',
              flexShrink: 0,
              zIndex: 2,
            }}
          >
            <div
              className="inside-card-frame"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                border: '2px solid #C9A84C',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: [
                  '0 0 0 1px rgba(201,168,76,0.2)',
                  '0 20px 60px rgba(0,0,0,0.5)',
                  '0 8px 20px rgba(0,0,0,0.3)',
                  'inset 0 0 30px rgba(201,168,76,0.05)',
                ].join(', '),
              }}
            >
              <Image
                src="/images/inside-new.png"
                alt="Casa del Mar office interior Yerevan Armenia"
                fill
                quality={90}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </div>

          {/* Text content below card */}
          <div style={{ marginTop: '2.5rem' }}>

            {/* Eyebrow */}
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '0.75rem',
            }}>
              {o.eyebrow}
            </p>

            {/* Gold decorative line */}
            <div style={{ width: '40px', height: '1px', background: '#C9A84C', marginBottom: '0.75rem' }} />

            {/* Title */}
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              fontWeight: 300,
              color: '#ffffff',
              marginBottom: '1.5rem',
              lineHeight: 1.2,
            }}>
              {o.title}
            </h2>

            {/* Paragraph — EXACTLY from i18n, zero modifications */}
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.9,
              maxWidth: '420px',
              marginBottom: '2rem',
            }}>
              {o.paragraph}
            </p>

            {/* Address + Hours info items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Address — links to Google Maps */}
              <a
                href="https://maps.google.com/?q=40.186472,44.512972"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}
              >
                <span style={{ color: '#C9A84C', fontSize: '16px', flexShrink: 0, lineHeight: 1 }}>📍</span>
                <div>
                  <p style={{ fontSize: '10px', color: 'rgba(201,168,76,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', marginBottom: '2px' }}>
                    {o.addressLabel}
                  </p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                    37 Mashtots Ave, Yerevan, Armenia
                  </p>
                </div>
              </a>

              {/* Hours */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ color: '#C9A84C', fontSize: '16px', flexShrink: 0, lineHeight: 1 }}>🕐</span>
                <div>
                  <p style={{ fontSize: '10px', color: 'rgba(201,168,76,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', marginBottom: '2px' }}>
                    {o.hoursLabel}
                  </p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                    {o.hoursValue}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MOBILE SECTION — EXACTLY as before
          (hidden on desktop, 768px+)
          ══════════════════════════════════════════ */}
      <section
        className="md:hidden py-14 px-4"
        style={{ background: '#0D1F2D' }}
      >
        <div className="max-w-7xl mx-auto">

          {/* Eyebrow + title */}
          <div className="text-center mb-10">
            <p className="uppercase font-accent mb-4" style={{ color: '#C9A84C', fontSize: 10, letterSpacing: '0.3em' }}>
              {o.eyebrow}
            </p>
            <div className="w-10 h-px mx-auto mb-4" style={{ background: '#C9A84C' }} />
            <h2 className="font-serif font-light text-white" style={{ fontSize: '1.8rem' }}>
              {o.title}
            </h2>
          </div>

          {/* Text content */}
          <div className="max-w-2xl mx-auto mb-12">
            <p className="leading-relaxed mb-8" style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.9 }}>
              {o.paragraph}
            </p>

            {/* Address */}
            <div className="flex gap-3 items-start mb-5">
              <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#C9A84C' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <div>
                <p className="uppercase font-accent mb-1" style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(201,168,76,0.6)' }}>
                  {o.addressLabel}
                </p>
                <a href="https://maps.google.com/?q=40.186472,44.512972" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" style={{ fontSize: 14, color: '#ffffff' }}>
                  37 Mashtots Ave, Yerevan, Armenia
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-3 items-start">
              <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#C9A84C' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="uppercase font-accent mb-1" style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(201,168,76,0.6)' }}>
                  {o.hoursLabel}
                </p>
                <p style={{ fontSize: 14, color: '#ffffff' }}>{o.hoursValue}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Map section — unchanged, always visible ── */}
      <section style={{ background: '#0D1F2D', padding: '2rem 2rem 4rem' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-px" style={{ background: 'rgba(201,168,76,0.4)' }} />
              <span className="uppercase font-accent" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#C9A84C' }}>
                {o.mapEye}
              </span>
              <div className="w-8 h-px" style={{ background: 'rgba(201,168,76,0.4)' }} />
            </div>
          </div>
          <OfficeMap />
        </div>
      </section>
    </>
  )
}
