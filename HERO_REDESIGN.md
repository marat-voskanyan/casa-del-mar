# Casa del Mar — Hero Section Luxury Redesign

Read CLAUDE.md for full project context.
Complete this task automatically without asking questions.
Run `npm run build` only once at the very end.

---

## The Problem
The homepage hero section looks flat and corporate.
It is just a solid dark blue color with no depth,
no imagery, and no luxury feeling.

## The Goal
Transform the hero into a cinematic, luxury, 
aspirational section that feels like Aman Resorts 
or Sotheby's International Realty.

---

## TASK 1 — Real Photo Background

Add the real Benidorm aerial photo as full-screen 
background of the hero section.

### Photo to use:
Primary: `/images/benidorm-aerial-1.jpg`
Fallback: `/images/benidorm-skyline-1.jpg`

### Implementation:
- Use Next.js `<Image>` component with `fill` prop
- `object-fit: cover` — fills entire hero
- `object-position: center` — centered
- `priority={true}` — loads immediately, no delay
- Position: absolute, behind all text content
- z-index: 0 for image, z-index: 10 for text content

```tsx
<div className="relative min-h-[100svh] overflow-hidden">
  {/* Background image */}
  <Image
    src="/images/benidorm-aerial-1.jpg"
    alt="Benidorm aerial view, Costa Blanca Spain"
    fill
    priority={true}
    quality={90}
    className="object-cover object-center"
  />
  
  {/* Gradient overlay */}
  <div className="absolute inset-0 z-[1]" style={{
    background: `linear-gradient(
      to bottom,
      rgba(13, 31, 45, 0.70) 0%,
      rgba(13, 31, 45, 0.45) 40%,
      rgba(13, 31, 45, 0.55) 70%,
      rgba(13, 31, 45, 0.80) 100%
    )`
  }} />
  
  {/* Content */}
  <div className="relative z-[10]">
    {/* existing hero content here */}
  </div>
</div>
```

---

## TASK 2 — Parallax Scroll Effect

Add a subtle parallax effect to the background image
so it moves slower than the page scroll — creates depth.

### Implementation using CSS transform:
```tsx
'use client'
import { useEffect, useRef } from 'react'

// In hero component:
const imgRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  const handleScroll = () => {
    if (imgRef.current) {
      const scrolled = window.scrollY
      imgRef.current.style.transform = 
        `translateY(${scrolled * 0.4}px)`
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// Wrap the Image in a div with ref={imgRef}
```

---

## TASK 3 — Luxury Gradient Overlay

The gradient overlay must create warmth and depth.
Not just dark — it should have a slight warm tone.

### Gradient layers (apply as multiple overlays):

Layer 1 — Main darkness overlay:
```css
background: linear-gradient(
  to bottom,
  rgba(13, 31, 45, 0.65) 0%,
  rgba(13, 31, 45, 0.40) 35%,
  rgba(13, 31, 45, 0.50) 65%,
  rgba(13, 31, 45, 0.82) 100%
);
```

Layer 2 — Warm gold vignette (subtle):
```css
background: radial-gradient(
  ellipse at center,
  transparent 30%,
  rgba(10, 20, 35, 0.45) 100%
);
```

Layer 3 — Bottom fade for text readability:
```css
background: linear-gradient(
  to top,
  rgba(13, 31, 45, 0.90) 0%,
  transparent 40%
);
```

---

## TASK 4 — Typography Improvements

Make the headline more dramatic and luxury.

### Headline:
- Font: Playfair Display (already installed)
- Size: clamp(3rem, 8vw, 7rem) — bigger and more dramatic
- Font weight: 300 (light serif for elegance)
- Letter spacing: -0.02em (slightly tight for luxury feel)
- Color: pure white #FFFFFF
- Line height: 1.05
- Add text shadow: 0 2px 20px rgba(0,0,0,0.3)

### Eyebrow text above headline:
- Keep "CASA DEL MAR · INTERNATIONAL REAL ESTATE"
- Add a thin gold line (1px) on each side — decorative
- Color: #C9A84C (gold)
- Letter spacing: 0.3em
- Font size: 11px
- Font family: Montserrat

### Subtitle:
- "Exclusive coastal properties in Spain and Cyprus"
- Color: rgba(255, 255, 255, 0.80)
- Font size: clamp(1rem, 2.5vw, 1.3rem)
- Font weight: 300
- Letter spacing: 0.05em

### Gold divider line:
- Keep the thin gold line between headline and subtitle
- Width: 60px
- Height: 1px
- Color: #C9A84C
- Center aligned
- Margin: 1.5rem auto

---

## TASK 5 — CTA Buttons Redesign

Make both buttons feel premium and consistent.

### Button 1 — "BROWSE SPAIN" (primary):
```css
background: #C9A84C;
color: #0D1F2D;
border: 2px solid #C9A84C;
padding: 16px 40px;
font-family: Montserrat;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.2em;
text-transform: uppercase;
transition: all 0.3s ease;

hover:
background: transparent;
color: #C9A84C;
border-color: #C9A84C;
```

### Button 2 — "BROWSE CYPRUS" (ghost):
```css
background: transparent;
color: #FFFFFF;
border: 2px solid rgba(255, 255, 255, 0.6);
padding: 16px 40px;
font-family: Montserrat;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.2em;
text-transform: uppercase;
transition: all 0.3s ease;

hover:
background: rgba(255, 255, 255, 0.1);
border-color: #C9A84C;
color: #C9A84C;
```

### Button layout:
- Side by side on desktop (flex row, gap 1rem)
- Stacked vertically on mobile (flex column, full width)
- Both buttons same height: 56px
- Slight upward movement on hover: translateY(-2px)
- Box shadow on hover: 0 8px 25px rgba(201, 168, 76, 0.3)

---

## TASK 6 — Animated Scroll Indicator

Replace the plain "SCROLL" text with an elegant 
animated scroll indicator.

### Design:
- Thin vertical line, 40px tall, gold color
- Small animated dot/arrow that bounces down
- Text "SCROLL" below in Montserrat, 9px, gold, tracked wide
- Positioned at bottom center of hero
- Fade in animation: appears 1.5s after page loads

### Animation:
```css
@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(8px); opacity: 0.5; }
}

.scroll-indicator {
  animation: scrollBounce 2s ease-in-out infinite;
}
```

### Click behavior:
Clicking the scroll indicator smoothly scrolls to 
the next section (stats bar or destinations section)

---

## TASK 7 — Floating Particles (Subtle Luxury Effect)

Add very subtle floating gold particles in the 
background for a luxury atmospheric feel.

### Specifications:
- 20-30 small particles maximum
- Size: 1-3px each (very tiny dots)
- Color: rgba(201, 168, 76, 0.3) — gold, very transparent
- Movement: slow, random floating upward
- Animation duration: 15-25s each (very slow)
- No performance impact — use CSS animation only
- Must not distract from the text or photo

### Implementation:
```tsx
// Generate particles with random positions
const particles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 10 + 15,
  delay: Math.random() * 10,
}))

// Render as absolutely positioned divs
// Use CSS keyframe animation for floating
```

### CSS animation:
```css
@keyframes float {
  0% { transform: translateY(0px) opacity(0); }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px); opacity: 0; }
}
```

---

## TASK 8 — Stats Bar Redesign

The stats bar below the hero needs to feel more luxury.

### Current: plain colored bar with numbers
### New design:

- Background: rgba(255, 255, 255, 0.04) with backdrop-blur
- Or: solid deep navy #0D1F2D with gold top border (2px)
- Stats displayed in a row with elegant dividers between them
- Numbers: large Playfair Display font, gold color #C9A84C
- Labels: small Montserrat uppercase, white 60% opacity
- Dividers: 1px solid rgba(201, 168, 76, 0.2) between stats
- Animated counter: numbers count up when scrolled into view
  Use Intersection Observer to trigger count animation
  Duration: 2 seconds, ease-out

### Counter animation example:
```tsx
const [count, setCount] = useState(0)
const target = 6 // years

useEffect(() => {
  if (isInView) {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }
}, [isInView])
```

---

## TASK 9 — Mobile Hero

Make sure the redesigned hero looks perfect on mobile.

### Mobile specific rules:
- Photo still fills full screen on mobile
- Gradient slightly darker on mobile for text readability
- Headline: clamp(2.2rem, 10vw, 4rem) on mobile
- Buttons: full width, stacked vertically
- Particles: reduce to 10 on mobile for performance
- Parallax: disable on mobile (causes performance issues)
  Use: if (window.innerWidth > 768) { enableParallax() }
- Scroll indicator: visible and tappable on mobile

---

## TASK 10 — Performance

Make sure the hero loads fast despite the background photo.

### Requirements:
- Image: `priority={true}` — loads before anything else
- Add `sizes="100vw"` to Image component
- Use `quality={85}` — good quality without huge file
- Add blur placeholder while image loads:
  `placeholder="blur"` with a data URL blur image
- The gradient overlay shows immediately while photo loads
  so there is no flash of white/empty space

---

## Final Step

After all tasks are complete:
```bash
npm run build
git add .
git commit -m "Hero section luxury redesign - real photo, parallax, particles"
git push
vercel --prod
```

---

## Checklist:
- [ ] Real Benidorm aerial photo as hero background
- [ ] Dark gradient overlay applied correctly
- [ ] Parallax scroll effect working
- [ ] Typography enlarged and more dramatic
- [ ] Gold divider line between headline and subtitle
- [ ] Both CTA buttons redesigned with gold theme
- [ ] Animated scroll indicator at bottom
- [ ] Subtle gold floating particles
- [ ] Stats bar redesigned with count-up animation
- [ ] Everything perfect on mobile
- [ ] Image loads fast with priority
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
- [ ] Live site looks cinematic and luxury
