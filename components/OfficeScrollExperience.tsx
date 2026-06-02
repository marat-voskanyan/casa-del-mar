'use client'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

function StaticOfficePhotos() {
  const [showInside, setShowInside] = useState(false)
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '70vw',
        maxHeight: '420px',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={() => setShowInside(prev => !prev)}
    >
      <Image
        src="/images/outdoor-new.png"
        alt="Casa del Mar office entrance Yerevan Armenia"
        fill
        style={{ objectFit: 'cover', opacity: showInside ? 0 : 1, transition: 'opacity 0.9s ease' }}
        priority
        quality={85}
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

export function OfficeScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showInside, setShowInside] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile || reducedMotion) return
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const containerHeight = containerRef.current.offsetHeight
      const windowHeight = window.innerHeight
      const scrolled = windowHeight - rect.top
      const total = containerHeight + windowHeight
      const p = Math.max(0, Math.min(1, scrolled / total))
      setProgress(p)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, reducedMotion])

  // Reduced motion fallback
  if (reducedMotion) {
    return <StaticOfficePhotos />
  }

  // Animation values based on scroll progress
  const outdoorScale = 1 + progress * 0.45
  const outdoorOpacity = progress < 0.5
    ? 1
    : Math.max(0, 1 - ((progress - 0.5) / 0.25))

  const insideOpacity = progress < 0.35
    ? 0
    : Math.min(1, (progress - 0.35) / 0.28)
  const insideScale = Math.max(1, 1.35 - progress * 0.35)

  // Dark flash during transition
  const flashOpacity = progress > 0.35 && progress < 0.62
    ? Math.sin(((progress - 0.35) / 0.27) * Math.PI) * 0.45
    : 0

  // Label opacities
  const outdoorLabelOpacity = Math.max(0, 1 - progress * 3)
  const insideLabelOpacity = progress > 0.72
    ? Math.min(1, (progress - 0.72) / 0.2)
    : 0

  // Scroll hint
  const hintOpacity = progress < 0.08 ? 1 : Math.max(0, 1 - (progress - 0.08) / 0.08)

  // MOBILE VERSION — tap to switch
  if (isMobile) {
    return (
      <div
        style={{
          position: 'relative', width: '100%',
          height: '70vw', maxHeight: '420px',
          overflow: 'hidden', cursor: 'pointer',
        }}
        onClick={() => setShowInside(prev => !prev)}
      >
        <Image
          src="/images/outdoor-new.png"
          alt="Casa del Mar office entrance Yerevan Armenia"
          fill
          style={{ objectFit: 'cover', opacity: showInside ? 0 : 1, transition: 'opacity 0.9s ease' }}
          priority
          quality={85}
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

  // DESKTOP VERSION — cinematic scroll
  return (
    <div ref={containerRef} style={{ height: '260vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0,
        height: '100vh', overflow: 'hidden',
        background: '#0D1F2D',
      }}>

        {/* OUTDOOR PHOTO */}
        <div style={{ position: 'absolute', inset: 0, opacity: outdoorOpacity, willChange: 'opacity' }}>
          <Image
            src="/images/outdoor-new.png"
            alt="Casa del Mar office entrance Yerevan Armenia"
            fill
            priority
            quality={90}
            className="office-scroll-outdoor"
            style={{
              objectFit: 'cover',
              objectPosition: 'center center',
              transform: `scale(${outdoorScale})`,
              transformOrigin: 'center 55%',
              willChange: 'transform',
            }}
          />
        </div>

        {/* INSIDE PHOTO */}
        <div style={{ position: 'absolute', inset: 0, opacity: insideOpacity, willChange: 'opacity' }}>
          <Image
            src="/images/inside-new.png"
            alt="Casa del Mar office interior Yerevan Armenia"
            fill
            loading="eager"
            quality={90}
            className="office-scroll-inside"
            style={{
              objectFit: 'cover',
              objectPosition: 'center center',
              transform: `scale(${insideScale})`,
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          />
        </div>

        {/* TRANSITION FLASH */}
        <div style={{
          position: 'absolute', inset: 0,
          background: '#000', opacity: flashOpacity,
          pointerEvents: 'none',
        }} />

        {/* BOTTOM GRADIENT */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,31,45,0.75) 0%, transparent 45%)',
          pointerEvents: 'none', zIndex: 5,
        }} />

        {/* OUTDOOR LABEL */}
        <div style={{
          position: 'absolute', bottom: '3rem', left: '3rem',
          zIndex: 10, opacity: outdoorLabelOpacity,
          transform: `translateY(${progress * 15}px)`,
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
        </div>

        {/* INSIDE LABEL */}
        <div style={{
          position: 'absolute', bottom: '3rem', left: '3rem',
          zIndex: 10, opacity: insideLabelOpacity,
          transform: `translateY(${(1 - progress) * 15}px)`,
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
        </div>

        {/* SCROLL HINT */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          opacity: hintOpacity, zIndex: 20,
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
        </div>

      </div>
    </div>
  )
}
