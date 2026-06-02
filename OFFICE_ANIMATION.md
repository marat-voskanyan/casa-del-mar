# Casa del Mar — Cinematic Office Enter Animation

Read CLAUDE.md for full project context.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## The Effect
User sees the outdoor photo of the office.
As they scroll down the camera ZOOMS INTO the entrance
and transitions into the inside photo.
Like physically walking through the front door.

Phase 1 (scroll 0-35%): Outdoor photo slowly zooms in
Phase 2 (scroll 35-60%): Cross-fade with dark flash
Phase 3 (scroll 60-100%): Inside photo zooms to normal

---

## TASK 1 — Create OfficeScrollExperience Component

Create file: components/OfficeScrollExperience.tsx

```tsx
'use client'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

export function OfficeScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showInside, setShowInside] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return
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
  }, [isMobile])

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

  // Outdoor label opacity
  const outdoorLabelOpacity = Math.max(0, 1 - progress * 3)

  // Inside label opacity
  const insideLabelOpacity = progress > 0.72
    ? Math.min(1, (progress - 0.72) / 0.2)
    : 0

  // Scroll hint opacity
  const hintOpacity = progress < 0.08 ? 1 : Math.max(0, 1 - (progress - 0.08) / 0.08)

  // MOBILE VERSION — simple tap to enter
  if (isMobile) {
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
          src="/images/Outdoor.jpeg"
          alt="Casa del Mar office entrance Yerevan"
          fill
          style={{
            objectFit: 'cover',
            opacity: showInside ? 0 : 1,
            transition: 'opacity 0.9s ease',
          }}
          priority
          quality={85}
        />
        <Image
          src="/images/Inside.jpeg"
          alt="Casa del Mar office interior Yerevan"
          fill
          style={{
            objectFit: 'cover',
            opacity: showInside ? 1 : 0,
            transition: 'opacity 0.9s ease',
          }}
          quality={85}
        />
        {/* Dark gradient bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,31,45,0.7) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Tap label */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#C9A84C',
          fontSize: '10px',
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {showInside ? '← TAP TO GO OUTSIDE' : 'TAP TO ENTER →'}
        </div>
      </div>
    )
  }

  // DESKTOP VERSION — scroll animation
  return (
    <div
      ref={containerRef}
      style={{ height: '260vh', position: 'relative' }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: '#0D1F2D',
      }}>

        {/* OUTDOOR PHOTO */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: outdoorOpacity,
          willChange: 'opacity',
        }}>
          <Image
            src="/images/Outdoor.jpeg"
            alt="Casa del Mar office entrance 37 Mashtots Ave Yerevan"
            fill
            priority
            quality={90}
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
        <div style={{
          position: 'absolute', inset: 0,
          opacity: insideOpacity,
          willChange: 'opacity',
        }}>
          <Image
            src="/images/Inside.jpeg"
            alt="Casa del Mar office interior Yerevan"
            fill
            loading="eager"
            quality={90}
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
          background: '#000',
          opacity: flashOpacity,
          pointerEvents: 'none',
        }} />

        {/* BOTTOM GRADIENT */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,31,45,0.75) 0%, transparent 45%)',
          pointerEvents: 'none',
          zIndex: 5,
        }} />

        {/* OUTDOOR LABEL */}
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          left: '3rem',
          zIndex: 10,
          opacity: outdoorLabelOpacity,
          transform: `translateY(${progress * 15}px)`,
        }}>
          <p style={{
            color: '#C9A84C',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            37 Mashtots Ave · Yerevan, Armenia
          </p>
          <h2 style={{
            color: 'white',
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 300,
            lineHeight: 1.1,
          }}>
            Our Office
          </h2>
        </div>

        {/* INSIDE LABEL */}
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          left: '3rem',
          zIndex: 10,
          opacity: insideLabelOpacity,
          transform: `translateY(${(1 - progress) * 15}px)`,
        }}>
          <p style={{
            color: '#C9A84C',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Welcome Inside
          </p>
          <h2 style={{
            color: 'white',
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 300,
            lineHeight: 1.1,
          }}>
            Casa del Mar
          </h2>
        </div>

        {/* SCROLL HINT */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: hintOpacity,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Scroll to enter
          </p>
          <div style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, #C9A84C, transparent)',
            animation: 'officePulse 1.6s ease-in-out infinite',
          }} />
        </div>

      </div>
    </div>
  )
}
```

Add to globals.css:
```css
@keyframes officePulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
  50% { opacity: 1; transform: scaleY(1.1); }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .office-scroll-outdoor,
  .office-scroll-inside {
    transform: none !important;
    transition: opacity 0.3s ease !important;
  }
}
```

---

## TASK 2 — Replace Old Photo Layout on Contact Page

Find the old office photos section on the Contact page.
Remove it completely.
Replace with the new OfficeScrollExperience component:

```tsx
import { OfficeScrollExperience } from '@/components/OfficeScrollExperience'

// In contact page, before the text section:
<section>
  <OfficeScrollExperience />
</section>
```

Keep the text section (paragraph, address, hours) 
AFTER the scroll experience — unchanged.

---

## TASK 3 — Performance Optimizations

1. Preload both images in the page head:
```tsx
// In contact page or layout:
<link rel="preload" as="image" href="/images/Outdoor.jpeg" />
<link rel="preload" as="image" href="/images/Inside.jpeg" />
```

2. Add will-change CSS to animated elements:
Already included in the component above.

3. Use passive scroll listeners:
Already included: { passive: true }

4. Disable animation on low-end devices:
```tsx
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

if (prefersReducedMotion) {
  // Show static images, no animation
  return <StaticOfficePhotos />
}
```

---

## TASK 4 — Verify Images Exist

Before building check both files exist:
```bash
ls public/images/Outdoor.jpeg
ls public/images/Inside.jpeg
```

If not found check for alternate names:
```bash
ls public/images/ | grep -i outdoor
ls public/images/ | grep -i inside
```

Update the image src paths if filenames differ.

---

## Final Step

```bash
npm run build
git add .
git commit -m "Cinematic office walk-in animation - scroll to enter"
git push
vercel --prod
```

---

## Checklist:
- [ ] OfficeScrollExperience component created
- [ ] Outdoor photo zooms in as user scrolls (scale 1→1.45)
- [ ] Inside photo fades in after 35% scroll
- [ ] Dark flash during transition moment
- [ ] Outdoor label fades out as animation progresses
- [ ] Inside label fades in when transition complete
- [ ] Scroll hint arrow shows at start
- [ ] transformOrigin points toward entrance door
- [ ] Mobile version: tap to switch photos
- [ ] Mobile tap label shows correctly
- [ ] Reduced motion: static fallback
- [ ] Old photo layout removed from contact page
- [ ] Text section still intact below animation
- [ ] Both images preloaded
- [ ] will-change applied to animated elements
- [ ] officePulse CSS animation added
- [ ] No layout shift or jank on scroll
- [ ] Sticky container works correctly
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
- [ ] Tested on desktop scroll
- [ ] Tested on mobile tap
