# Casa del Mar — Four Tasks

Read CLAUDE.md and FIX_AI_GENERATOR.md for full context.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — Fix AI Description Generator

Read FIX_AI_GENERATOR.md and follow every step to fix
the AI generator. The button shows "Failed to generate 
description" even though ANTHROPIC_API_KEY is set in Vercel.

Summary of what to check and fix:
1. Check Vercel logs for exact error: vercel logs --follow
2. Find the correct cookie name used by the login route
   and make sure generate route uses the same name
3. Verify @anthropic-ai/sdk is in package.json
4. Add API key existence check with clear error message
5. Make JSON parsing robust with multiple fallback methods
6. If all else fails, rewrite the route completely using 
   the clean version in FIX_AI_GENERATOR.md Step 10
7. Test locally with npm run dev before deploying

---

## TASK 2 — Featured Properties Auto-Update

The Featured Properties section on the homepage must
automatically show the 6 most recently added properties.

### What to do:
- Find the homepage featured properties section
- Replace any hardcoded or static property list with
  a dynamic database query
- Query: SELECT * FROM properties ORDER BY created_at DESC LIMIT 6
- If fewer than 6 properties exist show all of them
- Section title stays the same: "Featured Properties"
- Every time admin adds a new property in the admin panel
  it automatically appears here — no manual steps needed

### Make sure:
- The homepage has export const dynamic = 'force-dynamic'
  so it always fetches fresh data
- The featured grid re-renders with new data on each visit
- Loading state shows skeleton cards while fetching
- Empty state shows a message if no properties exist yet

---

## TASK 3 — Fix Armenian Text on Beach Cards

The Armenian text on the Benidorm page beach section
uses abbreviations and shortened words that are hard 
to read. Replace with proper full Armenian text.

### Find this section in:
app/[locale]/benidorm/page.tsx (or similar)

### Replace Armenian (hy) text for beach cards:

#### Playa de Levante card — replace ALL hy text with:
- Card title: Արևելյան լողափ
- Subtitle/distance: 1.9 կմ ոսկե ավազ
- Stat 1: Արևելյան կողմ, առավոտյան արև
- Stat 2: Կենդանի մթնոլորտ, ջրային սպորտ
- Stat 3: Ամենաբարձր զբոսաշրջային խտությունը
- Stat 4: Լավագույն կարճաժամկետ վարձակալության եկամուտ
- Bottom label: Ամենատարածված տուրիստների ու ներդրողների մոտ

#### Playa de Poniente card — replace ALL hy text with:
- Card title: Արևմտյան լողափ
- Subtitle/distance: 3 կմ ոսկե ավազ
- Stat 1: Արևմտյան կողմ, շքեղ մայրամուտ
- Stat 2: Հանգիստ, բնակելի մթնոլորտ
- Stat 3: Ընտանիքների ու երկարաժամկետ բնակիչների կողմից նախընտրված
- Stat 4: La Cala թաղամասը — կողք-կողքի
- Bottom label: Նախընտրելի ընտանիքների ու երկարաժամկետ բնակիչների համար

### Rules:
- Only change hy language strings
- Do NOT change en or ru text
- All text must use proper Armenian Unicode
- No abbreviations — full readable words
- No Latin letters mixed in

---

## TASK 4 — Luxury Custom Map for Benidorm Page

Replace the existing Google Maps iframe at the bottom
of the Benidorm page with a stunning custom Leaflet map
with luxury dark styling and gold accents.

### Install if not already installed:
```bash
npm install leaflet @types/leaflet
```

### Create component file:
`components/BenidormMap.tsx`

### Map configuration:

#### Dark luxury map tiles (choose one that loads):
Primary option — CartoDB Dark Matter:
```
https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
Attribution: © OpenStreetMap contributors © CARTO
```

Fallback — Stadia Dark:
```
https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png
```

#### Center and zoom:
- Center: [38.5401, -0.1228] (Benidorm)
- Initial zoom: 11 (wide view first)
- After fly-in animation: zoom 13

#### Markers — show these 7 locations:
Use custom gold dot markers (see style below)

1. Playa de Levante
   Position: [38.5430, -0.1150]
   Popup: "Playa de Levante — 1.9km Golden Beach"

2. Playa de Poniente  
   Position: [38.5370, -0.1310]
   Popup: "Playa de Poniente — 3km Golden Beach"

3. La Cala District
   Position: [38.5390, -0.1350]
   Popup: "La Cala — Modern Apartments 2008–2015"

4. Sierra Cortina
   Position: [38.5520, -0.1050]
   Popup: "Sierra Cortina — Prestigious Hillside"

5. Altea Hills
   Position: [38.6100, -0.0500]
   Popup: "Altea Hills — Elite Gated Community"

6. Finestrat
   Position: [38.5630, -0.1890]
   Popup: "Finestrat — New Developments"

7. Old Town (Casco Antiguo)
   Position: [38.5413, -0.1189]
   Popup: "Casco Antiguo — Historic Old Town"

#### Custom gold marker style:
```javascript
const createGoldMarker = () => L.divIcon({
  className: '',
  html: `<div style="
    width: 14px;
    height: 14px;
    background: #C9A84C;
    border: 2px solid rgba(255,255,255,0.8);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(201,168,76,0.7),
                0 0 4px rgba(201,168,76,1);
    cursor: pointer;
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
})
```

#### Beach highlight lines:
Draw gold polylines along both beaches:
```javascript
// Levante beach line
L.polyline(
  [[38.5398, -0.1193], [38.5430, -0.1150], [38.5458, -0.1108]],
  { color: '#C9A84C', weight: 4, opacity: 0.75 }
).addTo(map)

// Poniente beach line  
L.polyline(
  [[38.5398, -0.1193], [38.5370, -0.1310], [38.5345, -0.1385]],
  { color: '#C9A84C', weight: 4, opacity: 0.75 }
).addTo(map)
```

#### Custom popup styling:
Add to globals.css or as a style tag in the component:
```css
.leaflet-popup-content-wrapper {
  background: #0D1F2D !important;
  color: #C9A84C !important;
  border: 1px solid rgba(201,168,76,0.5) !important;
  border-radius: 2px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
  font-family: 'Montserrat', sans-serif !important;
  font-size: 11px !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
}
.leaflet-popup-tip {
  background: #C9A84C !important;
}
.leaflet-popup-close-button {
  color: #C9A84C !important;
}
.leaflet-container {
  background: #0D1F2D !important;
}
```

#### Zoom controls styling:
Hide default zoom control and add custom gold buttons:
```javascript
// Remove default zoom
map.zoomControl.remove()

// Add custom zoom control
const customZoom = L.control({ position: 'topright' })
customZoom.onAdd = () => {
  const div = L.DomUtil.create('div', 'custom-zoom')
  div.innerHTML = `
    <button onclick="map.zoomIn()" style="
      display:block; width:32px; height:32px;
      background:#0D1F2D; border:1px solid #C9A84C;
      color:#C9A84C; font-size:18px; cursor:pointer;
      margin-bottom:2px; line-height:1;
    ">+</button>
    <button onclick="map.zoomOut()" style="
      display:block; width:32px; height:32px;
      background:#0D1F2D; border:1px solid #C9A84C;
      color:#C9A84C; font-size:18px; cursor:pointer;
      line-height:1;
    ">−</button>
  `
  return div
}
```

#### Map legend (bottom left):
```javascript
const legend = L.control({ position: 'bottomleft' })
legend.onAdd = () => {
  const div = L.DomUtil.create('div')
  div.style.cssText = `
    background: rgba(13,31,45,0.9);
    border: 1px solid rgba(201,168,76,0.3);
    padding: 10px 14px;
    font-family: Montserrat, sans-serif;
    font-size: 10px;
    color: rgba(201,168,76,0.8);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  `
  div.innerHTML = `
    <div style="margin-bottom:6px;color:#C9A84C;font-weight:600">
      BENIDORM
    </div>
    <div>● Beaches</div>
    <div>● Districts</div>
    <div style="margin-top:6px;border-top:1px solid rgba(201,168,76,0.2);padding-top:6px">
      — Beach Lines
    </div>
  `
  return div
}
legend.addTo(map)
```

#### Auto zoom-in animation on scroll:
```javascript
// Use IntersectionObserver to trigger fly-in animation
// when map scrolls into viewport
const mapContainer = document.getElementById('benidorm-map')
let animated = false

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !animated) {
      animated = true
      setTimeout(() => {
        map.flyTo([38.5401, -0.1228], 13, {
          animate: true,
          duration: 2.5,
        })
      }, 500)
    }
  })
}, { threshold: 0.3 })

if (mapContainer) observer.observe(mapContainer)
```

#### Performance settings:
```javascript
const map = L.map('benidorm-map', {
  scrollWheelZoom: false,  // prevents page scroll interference
  zoomControl: false,      // we add custom one
  attributionControl: true,
  preferCanvas: true,      // better performance
})
```

#### Map dimensions:
- Desktop: width 100%, height 520px
- Tablet: width 100%, height 420px
- Mobile: width 100%, height 320px

### Section header above the map:
Add a header section above the map component:

```tsx
<div className="text-center mb-8">
  <p className="text-xs tracking-[0.3em] uppercase text-[#C9A84C] mb-2">
    {t('benidorm.map_eye')} {/* EXPLORE BENIDORM */}
  </p>
  <h2 className="font-playfair text-3xl font-light text-[#0D1F2D]">
    {t('benidorm.map_title')} {/* Discover the City */}
  </h2>
  <p className="text-sm text-gray-500 mt-2">
    {t('benidorm.map_subtitle')}
  </p>
</div>
```

Add these translation keys to i18n:
```
EN:
  map_eye: "Explore Benidorm"
  map_title: "Discover the City"
  map_subtitle: "Explore Benidorm's key locations, beaches and districts"

RU:
  map_eye: "Исследуйте Бенидорм"
  map_title: "Откройте для себя город"
  map_subtitle: "Ключевые места, пляжи и районы Бенидорма"

AM:
  map_eye: "Ուսումնասիրել Բենիդորմը"
  map_title: "Բացահայտեք Քաղաքը"
  map_subtitle: "Բենիդորմի հիմնական վայրերը, լողափները եւ թաղամասերը"
```

### Dynamic import in benidorm page:
```tsx
import dynamic from 'next/dynamic'

const BenidormMap = dynamic(
  () => import('@/components/BenidormMap'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100%',
          height: '520px',
          background: '#0D1F2D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{
          color: '#C9A84C',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          Loading Map...
        </span>
      </div>
    ),
  }
)
```

### Replace existing map:
Find the Google Maps iframe in the Benidorm page and
replace it entirely with:
```tsx
<section className="py-0">
  <div className="max-w-none">
    {/* Section header */}
    <div className="text-center py-16 px-8 bg-[#F2EBD9]">
      <p className="text-xs tracking-[0.3em] uppercase text-[#C9A84C] mb-3">
        Explore Benidorm
      </p>
      <h2 className="font-playfair text-4xl font-light text-[#0D1F2D] mb-3">
        Discover the City
      </h2>
      <p className="text-sm text-gray-500">
        Explore Benidorm's key locations, beaches and districts
      </p>
    </div>
    {/* Luxury map */}
    <BenidormMap />
  </div>
</section>
```

---

## Final Step

After all 4 tasks are complete:
```bash
npm run build
git add .
git commit -m "AI fixed, featured auto-update, Armenian beaches, luxury map"
git push
vercel --prod
```

---

## Checklist:
- [ ] AI generator fixed and working
- [ ] Generate button creates EN + RU + AM descriptions
- [ ] Featured properties shows 6 newest from database
- [ ] Featured section updates automatically when new property added
- [ ] Armenian beach text — Levante card fully corrected
- [ ] Armenian beach text — Poniente card fully corrected
- [ ] No abbreviations in Armenian beach text
- [ ] BenidormMap component created
- [ ] Dark CartoDB map tiles loading
- [ ] 7 gold markers showing on map
- [ ] Beach polylines in gold
- [ ] Custom gold popup styling
- [ ] Custom zoom buttons (gold style)
- [ ] Map legend bottom left
- [ ] Fly-in zoom animation on scroll into view
- [ ] scrollWheelZoom disabled
- [ ] Map loads lazily (not on page load)
- [ ] Loading placeholder while map tiles load
- [ ] Map looks great on mobile (320px height)
- [ ] Section header above map with translations
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
