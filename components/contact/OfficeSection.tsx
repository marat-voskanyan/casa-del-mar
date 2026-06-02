import Image from 'next/image'
import dynamic from 'next/dynamic'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

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

  return (
    <>
      {/* ════════════════════════════════════════════════
          DESKTOP OFFICE SECTION — md and above
          Warm sand background, static, no animations
          ════════════════════════════════════════════════ */}
      <section
        className="hidden md:block"
        style={{ background: '#F2EBD9' }}
      >
        {/* ── Full-width panoramic outdoor strip ── */}
        <div style={{ position: 'relative', width: '100%', height: '340px', overflow: 'hidden' }}>
          <Image
            src="/images/outdoor-new.png"
            alt="Casa del Mar office exterior 37 Mashtots Ave Yerevan Armenia"
            fill
            priority
            quality={90}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        {/* ── Thin gold separator ── */}
        <div style={{ height: '1px', background: '#C9A84C' }} />

        {/* ── Two-column: portrait photo (40%) + text (60%) ── */}
        <div style={{ display: 'flex', alignItems: 'stretch' }}>

          {/* Left — inside photo, portrait, gold border */}
          <div style={{ width: '40%', flexShrink: 0, position: 'relative' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '133.33%', /* 3:4 portrait aspect ratio */
              border: '1px solid #C9A84C',
              overflow: 'hidden',
            }}>
              <Image
                src="/images/inside-new.png"
                alt="Casa del Mar office interior Yerevan Armenia"
                fill
                quality={90}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </div>

          {/* Right — text content on sand */}
          <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

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
              fontSize: '2.2rem',
              fontWeight: 300,
              color: '#0D1F2D',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
            }}>
              {o.title}
            </h2>

            {/* Paragraph — exactly from i18n */}
            <p style={{
              fontSize: '14px',
              color: '#0D1F2D',
              lineHeight: 1.9,
              maxWidth: '480px',
              marginBottom: '2rem',
              opacity: 0.75,
            }}>
              {o.paragraph}
            </p>

            {/* Thin divider */}
            <div style={{ height: '1px', background: 'rgba(13,31,45,0.1)', maxWidth: '480px', marginBottom: '1.5rem' }} />

            {/* Info items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Address */}
              <a
                href="https://maps.google.com/?q=40.186472,44.512972"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}
              >
                <span style={{ fontSize: '16px', flexShrink: 0, lineHeight: '1.2' }}>📍</span>
                <div>
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(13,31,45,0.5)',
                    marginBottom: '2px',
                  }}>
                    {o.addressLabel}
                  </p>
                  <p style={{ fontSize: '13px', color: '#0D1F2D' }}>
                    37 Mashtots Ave, Yerevan, Armenia
                  </p>
                </div>
              </a>

              {/* Hours */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '16px', flexShrink: 0, lineHeight: '1.2' }}>🕐</span>
                <div>
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(13,31,45,0.5)',
                    marginBottom: '2px',
                  }}>
                    {o.hoursLabel}
                  </p>
                  <p style={{ fontSize: '13px', color: '#0D1F2D' }}>
                    {o.hoursValue}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          MOBILE SECTION — exactly as before, unchanged
          ════════════════════════════════════════════════ */}
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

      {/* ── Map — always visible ── */}
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
