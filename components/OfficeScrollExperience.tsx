'use client'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

// ── Reduced-motion / mobile static fallback ───────────────────────────────────
function StaticOfficePhotos() {
  const [showInside, setShowInside] = useState(false)
  return (
    <div
      style={{
        position: 'relative', width: '100%',
        height: '70vw', maxHeight: '420px',
        overflow: 'hidden', cursor: 'pointer',
      }}
      onClick={() => setShowInside(p => !p)}
    >
      <Image
        src="/images/outdoor-new.png"
        alt="Casa del Mar office entrance Yerevan Armenia"
        fill
        style={{ objectFit: 'cover', opacity: showInside ? 0 : 1, transition: 'opacity 0.9s ease' }}
        priority quality={85}
      />
      <Image
        src="/images/inside-new.png"
        alt="Casa del Mar office interior Yerevan Armenia"
        fill
        style={{ objectFit: 'cover', opacity: showInside ? 1 : 0, transition: 'opacity 0.9s ease' }}
        quality={85}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(13,31,45,0.7) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '1rem', left: '50%',
        transform: 'translateX(-50%)',
        color: '#C9A84C', fontSize: '10px',
        fontFamily: 'Montserrat, sans-serif',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        whiteSpace: 'nowrap', pointerEvents: 'none',
      }}>
        {showInside ? '← TAP TO GO OUTSIDE' : 'TAP TO ENTER →'}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function OfficeScrollExperience() {
  // DOM refs for GSAP targets
  const containerRef      = useRef<HTMLDivElement>(null)
  const outdoorWrapRef    = useRef<HTMLDivElement>(null)
  const outdoorImgWrapRef = useRef<HTMLDivElement>(null)
  const insideWrapRef     = useRef<HTMLDivElement>(null)
  const insideImgWrapRef  = useRef<HTMLDivElement>(null)
  const flashRef          = useRef<HTMLDivElement>(null)

  const [isMobile,      setIsMobile]      = useState(false)
  const [showInside,    setShowInside]    = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // ── Framer Motion scroll progress — drives text labels ─────────────────────
  const { scrollYProgress } = useScroll({
    target:  containerRef,
    offset:  ['start start', 'end end'],
  })

  // Outdoor label: visible at start, fades out by 33%
  const outdoorLabelOpacity = useTransform(scrollYProgress, [0,    0.33], [1, 0])
  const outdoorLabelY       = useTransform(scrollYProgress, [0,    0.33], [0, 15])

  // Inside label: appears between 72% and 92%
  const insideLabelOpacity  = useTransform(scrollYProgress, [0.72, 0.92], [0, 1])
  const insideLabelY        = useTransform(scrollYProgress, [0.72, 0.92], [15, 0])

  // Scroll hint: visible at start, gone by 16%
  const hintOpacity         = useTransform(scrollYProgress, [0, 0.05, 0.16], [1, 1, 0])

  // ── Detect mobile + reduced-motion (client-only) ───────────────────────────
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── GSAP ScrollTrigger — cinematic photo animation (desktop only) ──────────
  useEffect(() => {
    if (isMobile || reducedMotion) return
    if (
      !containerRef.current || !outdoorWrapRef.current ||
      !outdoorImgWrapRef.current || !insideWrapRef.current ||
      !insideImgWrapRef.current  || !flashRef.current
    ) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !containerRef.current) return

      gsap.registerPlugin(ScrollTrigger)

      // ── Set known initial states so no flash on first render ────────────────
      gsap.set(outdoorImgWrapRef.current, { scale: 1 })
      gsap.set(insideWrapRef.current,     { opacity: 0 })
      gsap.set(insideImgWrapRef.current,  { scale: 1.35 })
      gsap.set(flashRef.current,          { opacity: 0 })

      // ── ScrollTrigger timeline — scrub links directly to scroll ─────────────
      // Duration units here are fractions of the full scroll distance (0→1)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:      containerRef.current,
          start:        'top top',
          end:          'bottom bottom',
          scrub:        1.5,   // slight lag for cinematic feel
        },
      })

      // Phase 1 (0 → 1.0): Outdoor zooms toward entrance door
      tl.to(outdoorImgWrapRef.current, {
        scale:    1.45,
        ease:     'none',
        duration: 1,
      }, 0)

      // Phase 2a (0.50 → 0.75): Outdoor fades out
      tl.to(outdoorWrapRef.current, {
        opacity:  0,
        ease:     'none',
        duration: 0.25,
      }, 0.5)

      // Phase 2b (0.35 → 0.485): Dark flash rises
      tl.to(flashRef.current, {
        opacity:  0.45,
        ease:     'power1.in',
        duration: 0.135,
      }, 0.35)

      // Phase 2c (0.485 → 0.62): Flash fades out
      tl.to(flashRef.current, {
        opacity:  0,
        ease:     'power1.out',
        duration: 0.135,
      }, 0.485)

      // Phase 3a (0.35 → 0.63): Inside crossfades in
      tl.to(insideWrapRef.current, {
        opacity:  1,
        ease:     'none',
        duration: 0.28,
      }, 0.35)

      // Phase 3b (0.35 → 1.0): Inside zooms from 1.35 → 1.0 (settles naturally)
      tl.to(insideImgWrapRef.current, {
        scale:    1,
        ease:     'none',
        duration: 0.65,
      }, 0.35)

      cleanup = () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [isMobile, reducedMotion])

  // ── Fallbacks ──────────────────────────────────────────────────────────────
  if (reducedMotion) return <StaticOfficePhotos />

  if (isMobile) {
    return (
      <div
        style={{
          position: 'relative', width: '100%',
          height: '70vw', maxHeight: '420px',
          overflow: 'hidden', cursor: 'pointer',
        }}
        onClick={() => setShowInside(p => !p)}
      >
        <Image
          src="/images/outdoor-new.png"
          alt="Casa del Mar office entrance Yerevan Armenia"
          fill
          style={{ objectFit: 'cover', opacity: showInside ? 0 : 1, transition: 'opacity 0.9s ease' }}
          priority quality={85}
        />
        <Image
          src="/images/inside-new.png"
          alt="Casa del Mar office interior Yerevan Armenia"
          fill
          style={{ objectFit: 'cover', opacity: showInside ? 1 : 0, transition: 'opacity 0.9s ease' }}
          quality={85}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,31,45,0.7) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '1rem', left: '50%',
          transform: 'translateX(-50%)',
          color: '#C9A84C', fontSize: '10px',
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          {showInside ? '← TAP TO GO OUTSIDE' : 'TAP TO ENTER →'}
        </div>
      </div>
    )
  }

  // ── Desktop: GSAP drives photos, Framer Motion drives text ────────────────
  return (
    <div ref={containerRef} style={{ height: '260vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0,
        height: '100vh', overflow: 'hidden',
        background: '#0D1F2D',
      }}>

        {/* ── OUTDOOR PHOTO ── opacity animated by GSAP on outdoorWrapRef */}
        <div
          ref={outdoorWrapRef}
          style={{ position: 'absolute', inset: 0, willChange: 'opacity' }}
        >
          {/* scale animated by GSAP on outdoorImgWrapRef — transformOrigin aims at door */}
          <div
            ref={outdoorImgWrapRef}
            style={{
              position: 'absolute', inset: 0,
              willChange: 'transform',
              transformOrigin: 'center 55%',
            }}
          >
            <Image
              src="/images/outdoor-new.png"
              alt="Casa del Mar office entrance Yerevan Armenia"
              fill priority quality={90}
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
            />
          </div>
        </div>

        {/* ── INSIDE PHOTO ── opacity animated by GSAP on insideWrapRef */}
        <div
          ref={insideWrapRef}
          style={{ position: 'absolute', inset: 0, opacity: 0, willChange: 'opacity' }}
        >
          {/* scale animated by GSAP on insideImgWrapRef — zooms to natural size */}
          <div
            ref={insideImgWrapRef}
            style={{
              position: 'absolute', inset: 0,
              willChange: 'transform',
              transformOrigin: 'center center',
            }}
          >
            <Image
              src="/images/inside-new.png"
              alt="Casa del Mar office interior Yerevan Armenia"
              fill loading="eager" quality={90}
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
            />
          </div>
        </div>

        {/* ── TRANSITION FLASH — opacity animated by GSAP ── */}
        <div
          ref={flashRef}
          style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0, pointerEvents: 'none' }}
        />

        {/* ── BOTTOM GRADIENT ── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,31,45,0.75) 0%, transparent 45%)',
          pointerEvents: 'none', zIndex: 5,
        }} />

        {/* ── OUTDOOR LABEL — Framer Motion scroll-linked opacity + Y ── */}
        <motion.div style={{
          position: 'absolute', bottom: '3rem', left: '3rem', zIndex: 10,
          opacity: outdoorLabelOpacity,
          y:       outdoorLabelY,
        }}>
          <p style={{
            color: '#C9A84C', fontFamily: 'Montserrat, sans-serif',
            fontSize: '10px', letterSpacing: '0.3em',
            textTransform: 'uppercase', marginBottom: '8px',
          }}>
            37 Mashtots Ave · Yerevan, Armenia
          </p>
          <h2 style={{
            color: 'white', fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 300, lineHeight: 1.1,
          }}>
            Our Office
          </h2>
        </motion.div>

        {/* ── INSIDE LABEL — Framer Motion scroll-linked opacity + Y ── */}
        <motion.div style={{
          position: 'absolute', bottom: '3rem', left: '3rem', zIndex: 10,
          opacity: insideLabelOpacity,
          y:       insideLabelY,
        }}>
          <p style={{
            color: '#C9A84C', fontFamily: 'Montserrat, sans-serif',
            fontSize: '10px', letterSpacing: '0.3em',
            textTransform: 'uppercase', marginBottom: '8px',
          }}>
            Welcome Inside
          </p>
          <h2 style={{
            color: 'white', fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 300, lineHeight: 1.1,
          }}>
            Casa del Mar
          </h2>
        </motion.div>

        {/* ── SCROLL HINT — Framer Motion fades out after 16% scroll ── */}
        <motion.div style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          x: '-50%', opacity: hintOpacity, zIndex: 20,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '8px',
          pointerEvents: 'none',
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '10px', letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Scroll to enter
          </p>
          <div style={{
            width: '1px', height: '40px',
            background: 'linear-gradient(to bottom, #C9A84C, transparent)',
            animation: 'officePulse 1.6s ease-in-out infinite',
          }} />
        </motion.div>

      </div>
    </div>
  )
}
