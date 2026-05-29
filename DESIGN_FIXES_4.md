# Casa del Mar — Design Fixes Batch 4

Read CLAUDE.md for full project context.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — Luxury Benidorm Popup in Spain Section

The "About Benidorm" collapsible popup/section on the
Spain listing page looks plain. Redesign it to feel
premium and luxury with smooth animations.

### Current state:
A basic collapsible section that expands with plain text.

### New design:

#### Trigger button redesign:
```tsx
// Replace plain button with luxury styled trigger
<button
  onClick={() => setIsOpen(!isOpen)}
  className="group w-full flex items-center justify-between
    px-8 py-5 bg-[#0D1F2D] border border-[#C9A84C]/30
    hover:border-[#C9A84C] transition-all duration-300"
>
  <div className="flex items-center gap-4">
    {/* Gold decorative line */}
    <div className="w-8 h-px bg-[#C9A84C]"></div>
    <span className="font-montserrat text-xs tracking-[0.25em] 
      uppercase text-[#C9A84C]">
      About Benidorm
    </span>
  </div>
  {/* Animated chevron */}
  <svg
    className={`w-4 h-4 text-[#C9A84C] transition-transform 
      duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" 
      strokeWidth={1.5} d="M19 9l-7 7-7-7" />
  </svg>
</button>
```

#### Content panel redesign:
When expanded show a luxury dark panel with:
- Background: #0D1F2D (deep navy)
- Border: 1px solid rgba(201,168,107,0.2)
- Gold top accent line: 2px solid #C9A84C

Content layout (two columns on desktop, single on mobile):

Left column:
- Section eyebrow in gold: "COSTA BLANCA · SPAIN"
- Large serif title: "Benidorm"
- Short paragraph about the city (2-3 sentences)
- "Learn More" link → /benidorm page

Right column — 4 fact cards in a 2x2 grid:
```
🌞 320+ Sunny Days
🏖️ 2 Famous Beaches
✈️ 60km to Airport
🌡️ 20°C Average
```
Each card: small gold icon, number in gold serif font,
label in small white text below.

#### Animations:

Panel slide animation (smooth expand/collapse):
```tsx
// Use max-height animation for smooth expand
<div
  className={`overflow-hidden transition-all duration-700 ease-in-out`}
  style={{
    maxHeight: isOpen ? '600px' : '0px',
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'max-height 0.7s ease-in-out, opacity 0.5s ease, transform 0.5s ease'
  }}
>
```

Content items stagger animation:
When panel opens each element fades in with a delay:
- Title: delay 100ms
- Paragraph: delay 200ms
- Fact cards: delay 300ms, 350ms, 400ms, 450ms

```tsx
// Add to each element when isOpen becomes true
const [animate, setAnimate] = useState(false)
useEffect(() => {
  if (isOpen) {
    setTimeout(() => setAnimate(true), 50)
  } else {
    setAnimate(false)
  }
}, [isOpen])

// Apply to elements:
style={{
  opacity: animate ? 1 : 0,
  transform: animate ? 'translateY(0)' : 'translateY(20px)',
  transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s'
}}
```

Gold shimmer on the trigger button border on hover:
```css
@keyframes borderShimmer {
  0% { border-color: rgba(201,168,107,0.3); }
  50% { border-color: rgba(201,168,107,0.8); }
  100% { border-color: rgba(201,168,107,0.3); }
}
.about-benidorm-trigger:hover {
  animation: borderShimmer 1.5s ease infinite;
}
```

---

## TASK 2 — Benidorm Map — Brighter but Still Luxury

The current dark CartoDB map is too dark.
Change to a brighter map style that still looks premium.

### Change map tiles to Stadia Alidade Smooth:
This tile set is clean, bright, minimal and luxury-looking.

```javascript
// Replace current dark tiles with:
L.tileLayer(
  'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
  {
    attribution: '© Stadia Maps © OpenMapTiles © OpenStreetMap',
    maxZoom: 20,
  }
).addTo(map)
```

Stadia Alidade Smooth features:
- Clean light beige/cream background
- Minimal labels
- Elegant typography
- Still looks premium and modern
- Much better for showing Benidorm's coastline

### If Stadia requires API key, use this free alternative:
CartoDB Positron (light and clean):
```javascript
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 20,
  }
).addTo(map)
```

### Update map container styling for light tiles:
Since map is now light, update the container:
```css
/* Map container */
.benidorm-map-container {
  border: 1px solid rgba(201, 168, 76, 0.4);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* Loading placeholder - change to light */
.map-loading {
  background: #F2EBD9;  /* sand color */
  color: #C9A84C;
}
```

### Add gold marker back (one central marker):
Since the map is now lighter, add one elegant marker
for the center of Benidorm to orient the viewer:

```javascript
const benidormMarker = L.divIcon({
  className: '',
  html: `<div style="
    width: 16px;
    height: 16px;
    background: #C9A84C;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3),
                0 0 0 4px rgba(201,168,76,0.2);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

L.marker([38.5401, -0.1228], { icon: benidormMarker })
  .addTo(map)
  .bindPopup('<b style="color:#C9A84C">Benidorm</b><br>Costa Blanca, Spain')
```

### Update zoom animation:
With lighter tiles the zoom from wide to close looks better.
Keep the same coordinates but adjust:
- Start zoom: 10
- End zoom: 13 (slightly less zoomed for better overview)
- Duration: 2.5 seconds

---

## TASK 3 — Property URLs: Use REF Instead of ID

Currently property detail pages use numeric database IDs:
/en/property/1
/en/property/42

Change to use the REF code instead:
/en/property/3282
/en/property/6411

This is cleaner, more professional, and REF codes
are meaningful to users and agents.

### Step 1 — Update the dynamic route:

Rename the route folder:
FROM: app/[locale]/property/[id]/page.tsx
TO:   app/[locale]/property/[ref]/page.tsx

Update the page component:
```typescript
// Change params type
interface Props {
  params: { locale: string; ref: string }
}

export default async function PropertyPage({ params }: Props) {
  const { locale, ref } = params
  
  // Fetch property by REF code instead of ID
  const property = await getPropertyByRef(ref)
  
  if (!property) {
    notFound()
  }
  // ...
}
```

### Step 2 — Add getPropertyByRef to database functions:

In lib/db.ts or similar, add:
```typescript
export function getPropertyByRef(ref: string) {
  // Query by ref column
  const stmt = db.prepare('SELECT * FROM properties WHERE ref = ?')
  return stmt.get(ref) as Property | undefined
}
```

Or in Turso:
```typescript
export async function getPropertyByRef(ref: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM properties WHERE ref = ? LIMIT 1',
    args: [ref]
  })
  return result.rows[0] as Property | undefined
}
```

### Step 3 — Update all property links:

Find every place that creates a link to a property page.
Change from using property.id to property.ref:

```typescript
// OLD:
href={`/${locale}/property/${property.id}`}

// NEW:
href={`/${locale}/property/${property.ref}`}
```

Files to update:
- components/PropertyCard.tsx
- Any page that renders property cards
- Similar properties section
- Featured properties on homepage
- Admin panel property links (if any)

### Step 4 — Handle missing REF codes:

Some properties might not have a REF code.
Add a fallback to ID if REF is empty:

```typescript
// In property card link:
const propertySlug = property.ref || String(property.id)
href={`/${locale}/property/${propertySlug}`}

// In getPropertyByRef:
export async function getPropertyByRef(ref: string) {
  // Try by ref first
  let result = await db.execute({
    sql: 'SELECT * FROM properties WHERE ref = ? LIMIT 1',
    args: [ref]
  })
  
  // If not found, try by ID (for backward compatibility)
  if (!result.rows[0]) {
    result = await db.execute({
      sql: 'SELECT * FROM properties WHERE id = ? LIMIT 1',
      args: [ref]
    })
  }
  
  return result.rows[0] as Property | undefined
}
```

### Step 5 — Update meta/SEO:

On the property detail page update the canonical URL
and OG URL to use the REF-based URL:
```typescript
export async function generateMetadata({ params }: Props) {
  const property = await getPropertyByRef(params.ref)
  return {
    title: `${property?.name} REF: ${property?.ref} | Casa del Mar`,
    alternates: {
      canonical: `/${params.locale}/property/${property?.ref}`
    }
  }
}
```

### Step 6 — Update revalidatePath calls:

In admin API routes that call revalidatePath,
update to use ref-based paths:
```typescript
// After saving property:
revalidatePath(`/en/property/${property.ref}`)
revalidatePath(`/ru/property/${property.ref}`)
revalidatePath(`/hy/property/${property.ref}`)
```

---

## Final Step

npm run build
git add .
git commit -m "Luxury Benidorm popup, brighter map, REF-based URLs"
git push
vercel --prod

---

## Checklist:
- [ ] About Benidorm trigger button redesigned (gold, navy)
- [ ] Panel expands with smooth 700ms animation
- [ ] Content items stagger in with delays
- [ ] Two column layout inside panel
- [ ] 4 fact cards visible
- [ ] Learn More link to /benidorm page
- [ ] Gold shimmer on trigger hover
- [ ] Map changed to lighter Stadia/CartoDB Positron tiles
- [ ] Map still looks premium and luxury
- [ ] Single gold Benidorm marker added
- [ ] Map loading placeholder updated for light theme
- [ ] Property URLs use REF: /en/property/3282
- [ ] getPropertyByRef function added to db.ts
- [ ] All property card links updated to use ref
- [ ] Fallback to ID if no REF exists
- [ ] Meta titles include REF code
- [ ] revalidatePath uses ref-based paths
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
