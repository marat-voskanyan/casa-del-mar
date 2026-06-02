# Casa del Mar — Office Section on Contact Page

Read CLAUDE.md for full project context.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

\---

## IMPORTANT — Do NOT change these texts

The texts below must be used EXACTLY as written.
Do not translate, modify, or auto-correct any of them.
Copy character by character.

### English text (use exactly):

"Our office is located in the heart of Yerevan, at 37 Mashtots Avenue — one of the city's most central streets. We welcome clients for in-person free consultations Monday to Friday, 11:00–18:00. Whether you are just starting your property search or ready to make a purchase, our team is here to guide you every step of the way."

### Russian text (use exactly):

"Наш офис расположен в самом сердце Еревана, по адресу проспект Маштоца, 37 — на одной из самых центральных улиц города. Мы рады принимать клиентов на бесплатные консультации с понедельника по пятницу, с 11:00 до 18:00. Независимо от того, только ли вы начинаете поиск недвижимости или уже готовы к покупке, наша команда готова сопровождать вас на каждом этапе пути."

### Armenian text (use exactly — DO NOT MODIFY):

"Մեր գրասենյակը գտնվում է Երևանի սրտում՝ Մաշտոցի պողոտա 37 հասցեում՝ քաղաքի ամենակենտրոնական փողոցներից մեկում։ Մենք սիրով ընդունում ենք հաճախորդներին անվճար անձնական խորհրդատվությունների համար երկուշաբթիից ուրբաթ՝ ժամը 11:00-ից մինչև 18:00։ Անկախ նրանից՝ դուք նոր եք սկսում անշարժ գույքի որոնումը, թե արդեն պատրաստ եք գնման, մեր թիմը պատրաստ է ուղեկցել ձեզ յուրաքանչյուր փուլում։"

\---

## TASK 1 — Office Section Layout

Add a new section to the Contact page.
Position: between the contact form section and the footer.

### Section structure:

```
┌─────────────────────────────────────────────┐
│           OUR OFFICE  (gold eyebrow)         │
│        Visit Us in Yerevan  (serif title)    │
│                                              │
│  \[Outdoor.jpeg]  \[Inside.jpeg]  │  Text     │
│   (animates on scroll)          │  content  │
│                                 │           │
│                                 │  📍 Addr  │
│                                 │  🕐 Hours │
├─────────────────────────────────────────────┤
│              LUXURY MAP                      │
│         (Zoom in animation)                  │
└─────────────────────────────────────────────┘
```

### Section background: #0D1F2D (deep navy)

### Padding: py-20 px-8 desktop, py-14 px-4 mobile

\---

## TASK 2 — Office Photo Animation

Two photos are in public/images/:

* Outdoor.jpeg — exterior of the office building
* Inside.jpeg — interior of the office

### Photo display with scroll animation:

Show Outdoor.jpeg first (fully visible).
When user scrolls down Inside.jpeg fades/slides in
on top of Outdoor.jpeg creating a transition effect.

Implementation using Intersection Observer:

```tsx
'use client'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

function OfficePhotos() {
  const insideRef = useRef<HTMLDivElement>(null)
  const \[insideVisible, setInsideVisible] = useState(false)
  const \[scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!insideRef.current) return
      const rect = insideRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // Calculate how much the section has been scrolled
      const progress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight \* 0.6)
      ))
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, \[])

  return (
    <div className="relative" ref={insideRef}>
      {/\* Photo container - stacked \*/}
      <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
        
        {/\* Outdoor photo - always visible (bottom layer) \*/}
        <div className="absolute inset-0">
          <Image
            src="/images/Outdoor.jpeg"
            alt="Casa del Mar office exterior, 37 Mashtots Ave Yerevan"
            fill
            className="object-cover"
            quality={85}
          />
        </div>

        {/\* Inside photo - fades in on scroll (top layer) \*/}
        <div
          className="absolute inset-0 transition-none"
          style={{
            opacity: scrollProgress,
            transform: `scale(${1 + (1 - scrollProgress) \* 0.03})`,
          }}
        >
          <Image
            src="/images/Inside.jpeg"
            alt="Casa del Mar office interior, Yerevan"
            fill
            className="object-cover"
            quality={85}
          />
        </div>

        {/\* Gradient overlay for text readability \*/}
        <div className="absolute inset-0 bg-gradient-to-t 
          from-\[#0D1F2D]/60 to-transparent pointer-events-none" 
        />
      </div>
    </div>
  )
}
```

### Desktop layout — two photos side by side:

On desktop show both photos side by side (each 50% width)
with the outdoor→indoor transition happening on both simultaneously.

OR show them as two separate images:

* Left: Outdoor.jpeg (static, always shown)
* Right: Inside.jpeg (revealed on scroll with animation)

The right Inside photo starts with opacity: 0 and
a subtle overlay, then as user scrolls it reveals fully.

### Mobile layout:

Stack photos vertically:

* Outdoor photo: full width, 220px height
* Inside photo below: full width, 220px height
* No scroll animation on mobile (just show both static)

\---

## TASK 3 — Text Content

Right column (desktop) / below photos (mobile):

### Eyebrow:

EN: "OUR OFFICE"
RU: "НАШ ОФИС"
AM: "ՄԵՐ ԳՐԱՍԵՆՅԱԿԸ" →


### Title:

EN: "Visit Us in Yerevan"
RU: "Посетите нас в Ереване"
AM: Claude Code translate to Armenian Unicode

### Paragraph: USE EXACTLY AS PROVIDED ABOVE

Do not change a single character.
Store as raw string constant.

### Info items below paragraph:

Address item:

* Icon: 📍 or gold location SVG
* Label: EN "Address" / RU "Адрес" / AM "Հասցե"
* Value: "37 Mashtots Ave, Yerevan, Armenia"
* Make it a clickable link to Google Maps:
https://maps.google.com/?q=40.186472,44.512972

Working hours item:

* Icon: 🕐 or gold clock SVG
* Label: EN "Working Hours" / RU "Часы работы" / AM "Աշխատանքային ժամեր"
* EN value: "Mon–Fri: 11:00 – 18:00"
* RU value: "Пн–Пт: 11:00 – 18:00"
* AM value: "Երկ–Ուրբ: 11:00 – 18:00" →

### Styling:

* Eyebrow: gold #C9A84C, 10px, tracked 0.3em, uppercase
* Gold decorative line (40px) above title
* Title: Playfair Display, 1.8rem, white
* Paragraph: 14px, rgba(255,255,255,0.75), line-height 1.9
* Info icons: gold color
* Info label: 10px, uppercase, tracked, gold 60% opacity
* Info value: 14px, white

\---

## TASK 4 — Luxury Office Location Map

Add a Leaflet map below the photos and text section
showing the exact office location.

### Office coordinates:

Latitude: 40.186472  (from 40°11'11.3"N)
Longitude: 44.512972  (from 44°30'46.7"E)

Convert DMS to decimal:
40°11'11.3"N = 40 + 11/60 + 11.3/3600 = 40.186472
44°30'46.7"E = 44 + 30/60 + 46.7/3600 = 44.512972

### Map tiles — use CartoDB Positron (light luxury):

https://{s}.basemaps.cartocdn.com/light\_all/{z}/{x}/{y}{r}.png

### Map settings:

* Center: \[40.186472, 44.512972]
* Initial zoom: 12 (city level view)
* Fly-in target zoom: 16 (street level)
* scrollWheelZoom: false
* zoomControl: false (custom controls)

### Custom gold marker for office:

```javascript
const officeIcon = L.divIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center">
      <div style="
        background: #0D1F2D;
        border: 2px solid #C9A84C;
        border-radius: 6px;
        padding: 6px 12px;
        color: #C9A84C;
        font-family: Montserrat, sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.08em;
        white-space: nowrap;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      ">Casa del Mar</div>
      <div style="width:2px;height:10px;background:#C9A84C"></div>
      <div style="
        width:10px;height:10px;
        background:#C9A84C;
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
      "></div>
    </div>
  `,
  iconSize: \[120, 52],
  iconAnchor: \[60, 52],
})

L.marker(\[40.186472, 44.512972], { icon: officeIcon })
  .addTo(map)
  .bindPopup(`
    <b style="color:#C9A84C">Casa del Mar</b><br>
    37 Mashtots Ave<br>
    Yerevan, Armenia
  `)
```

### Zoom animation on scroll:

When map scrolls into viewport trigger fly-in:

* Start: zoom 12 (shows Yerevan city)
* End: zoom 16 (shows the street clearly)
* Duration: 2.5 seconds
* Only triggers once per visit

```javascript
let animated = false
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting \&\& !animated) {
      animated = true
      setTimeout(() => {
        map.flyTo(\[40.186472, 44.512972], 16, {
          animate: true,
          duration: 2.5,
        })
      }, 400)
    }
  })
}, { threshold: 0.4 })
observer.observe(mapContainer)
```

### Custom zoom controls:

```javascript
// Remove default Leaflet zoom
map.zoomControl.remove()

// Add to custom div
// + button: map.zoomIn()
// - button: map.zoomOut()
// Style: navy bg, gold border, gold text
```

### Map popup styling:

```css
.leaflet-popup-content-wrapper {
  background: #0D1F2D !important;
  color: rgba(255,255,255,0.85) !important;
  border: 1px solid rgba(201,168,76,0.5) !important;
  border-radius: 4px !important;
  box-shadow: 0 8px 30px rgba(0,0,0,0.4) !important;
  font-family: Montserrat, sans-serif !important;
  font-size: 12px !important;
}
.leaflet-popup-tip {
  background: #C9A84C !important;
}
.leaflet-control-attribution {
  display: none !important;
}
```

### Map size:

* Desktop: full width, 400px height
* Mobile: full width, 280px height
* Border: 1px solid rgba(201,168,76,0.3)
* Gold top border: 2px solid #C9A84C

### Section header above map:

```tsx
<div className="text-center mb-6">
  <div className="flex items-center justify-center gap-3 mb-3">
    <div className="w-8 h-px bg-\[#C9A84C]/40"></div>
    <span className="text-\[10px] tracking-\[0.3em] uppercase 
      text-\[#C9A84C] font-montserrat">
      {t('office.map\_eye')} {/\* Find Us \*/}
    </span>
    <div className="w-8 h-px bg-\[#C9A84C]/40"></div>
  </div>
</div>
```

Add translations:
EN: map\_eye: "Find Us"
RU: map\_eye: "Найти нас"
AM: map\_eye: "Գտեք մեզ"

### Component file:

Create: components/OfficeMap.tsx
Use dynamic import in contact page:

```tsx
const OfficeMap = dynamic(
  () => import('@/components/OfficeMap'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        width: '100%',
        height: '400px',
        background: '#F2EBD9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          color: '#C9A84C',
          fontFamily: 'Montserrat',
          fontSize: '11px',
          letterSpacing: '0.2em',
        }}>
          LOADING MAP...
        </span>
      </div>
    )
  }
)
```

\---

## TASK 5 — Add i18n Keys

Add these translation keys to lib/i18n.ts:

```typescript
// Office section
office: {
  eyebrow: {
    en: "OUR OFFICE",
    ru: "НАШ ОФИС",
    hy: "ՄԵՐ ԳРАСЕНYАКЫ" // Claude Code: write in proper Armenian Unicode
  },
  title: {
    en: "Visit Us in Yerevan",
    ru: "Посетите нас в Ереване",
    hy: "Այցելեք մեզ Երևանում"
  },
  // Store exact paragraph texts - DO NOT MODIFY
  paragraph: {
    en: "Our office is located in the heart of Yerevan, at 37 Mashtots Avenue — one of the city's most central streets. We welcome clients for in-person free consultations Monday to Friday, 11:00–18:00. Whether you are just starting your property search or ready to make a purchase, our team is here to guide you every step of the way.",
    ru: "Наш офис расположен в самом сердце Еревана, по адресу проспект Маштоца, 37 — на одной из самых центральных улиц города. Мы рады принимать клиентов на бесплатные консультации с понедельника по пятницу, с 11:00 до 18:00. Независимо от того, только ли вы начинаете поиск недвижимости или уже готовы к покупке, наша команда готова сопровождать вас на каждом этапе пути.",
    hy: "Մեր գրասենյակը գտնվում է Երևանի սրտում՝ Մաշտոցի պողոտա 37 հասցեում՝ քաղաքի ամենակենտրոնական փողոցներից մեկում։ Մենք սիրով ընդունում ենք հաճախորդներին անվճար անձնական խորհրդատվությունների համար երկուշաբթիից ուրբաթ՝ ժամը 11:00-ից մինչև 18:00։ Անկախ նրանից՝ դուք նոր եք սկսում անշարժ գույքի որոնումը, թե արդեն պատրաստ եք գնման, մեր թիմը պատրաստ է ուղեկցել ձեզ յուրաքանչյուր փուլում։"
  },
  address\_label: {
    en: "Address",
    ru: "Адрес",
    hy: "Հասցե" 
  },
  hours\_label: {
    en: "Working Hours",
    ru: "Часы работы", 
    hy: "Աշխատանքային ժամեր" 
  },
  hours\_value: {
    en: "Mon–Fri: 11:00 – 18:00",
    ru: "Пн–Пт: 11:00 – 18:00",
    hy: "Երկ–Ուրբ: 11:00 – 18:00"
  },
  map\_eye: {
    en: "Find Us",
    ru: "Найти нас",
    hy: "Գտեք մեզ" 
  }
}
```



\---

## Final Step

```bash
npm run build
git add .
git commit -m "Office section - photos, scroll animation, luxury map"
git push
vercel --prod
```

\---

## Checklist:

* \[ ] Office section added between contact form and footer
* \[ ] Outdoor.jpeg shown by default
* \[ ] Inside.jpeg fades in smoothly on scroll
* \[ ] Scroll animation smooth, not jerky
* \[ ] Both photos static on mobile (no animation)
* \[ ] English paragraph text exact as provided
* \[ ] Russian paragraph text exact as provided
* \[ ] Armenian paragraph text exact as provided (zero changes)
* \[ ] Address links to Google Maps
* \[ ] Working hours Mon-Fri 11:00-18:00
* \[ ] OfficeMap component created
* \[ ] Map centered on office: 40.186472, 44.512972
* \[ ] CartoDB Positron light tiles
* \[ ] Custom gold Casa del Mar marker
* \[ ] Zoom from city level (12) to street level (16)
* \[ ] Animation triggers on scroll into view
* \[ ] Custom gold zoom buttons
* \[ ] Popup styled navy/gold
* \[ ] Attribution hidden
* \[ ] Map 400px desktop, 280px mobile
* \[ ] Gold top border on map
* \[ ] "Find Us" section header above map
* \[ ] All i18n keys added
* \[ ] Dynamic import for map (ssr: false)
* \[ ] npm run build passes with zero errors
* \[ ] Deployed to Vercel

