# Casa del Mar — Fixes Batch 3

Read CLAUDE.md for full project context.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — Admin Panel: Search by REF + White Logo

### 1A — Search by REF in Admin Dashboard

Add a search input to the admin properties table
that filters properties by REF code in real time.

#### UI placement:
Add above the properties table, left side:
- Input field with magnifying glass icon
- Placeholder: "Search by REF code..."
- Clears with × button when text is entered
- Width: 240px on desktop, full width on mobile

#### Styling:
```tsx
<div className="relative">
  <input
    type="text"
    value={refSearch}
    onChange={(e) => setRefSearch(e.target.value)}
    placeholder="Search by REF code..."
    className="pl-9 pr-8 py-2 border border-gray-200 
      rounded text-sm w-60 focus:outline-none 
      focus:border-[#C9A84C] bg-white"
  />
  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
    🔍
  </span>
  {refSearch && (
    <button
      onClick={() => setRefSearch('')}
      className="absolute right-2 top-2 text-gray-400 
        hover:text-gray-600 text-lg leading-none"
    >
      ×
    </button>
  )}
</div>
```

#### Filter logic:
```typescript
const [refSearch, setRefSearch] = useState('')

const filteredProperties = properties.filter(p => {
  if (!refSearch) return true
  return p.ref?.toLowerCase().includes(refSearch.toLowerCase())
})
```

Use filteredProperties to render the table instead of properties.

Show result count below search:
```tsx
{refSearch && (
  <p className="text-xs text-gray-400 mt-1">
    {filteredProperties.length} result{filteredProperties.length !== 1 ? 's' : ''} 
    for "{refSearch}"
  </p>
)}
```

#### Also add search by name:
Make the search work for both REF and property name:
```typescript
return p.ref?.toLowerCase().includes(refSearch.toLowerCase()) ||
       p.name?.toLowerCase().includes(refSearch.toLowerCase())
```

### 1B — White Logo in Admin Panel

The admin panel currently uses the original logo which
is not clearly visible on the admin dark background.

Find all places in the admin panel that show the logo:
- Admin login page
- Admin dashboard sidebar header
- Admin mobile header

Replace with white version using CSS filter:
```tsx
<Image
  src="/logo.png"
  alt="Casa del Mar"
  width={160}
  height={50}
  className="object-contain brightness-0 invert"
  // brightness-0 invert = makes any logo white
/>
```

Apply this to ALL logo instances in admin panel only.
Do NOT change the logo on the public website.

---

## TASK 2 — Homepage Stats: Replace Dynamic Counter with 200+

The homepage stats bar currently shows a live dynamic
property count from the database.

Replace it with a fixed "200+" value.

### Find the stats section on the homepage
### Change the properties/clients stat to:
- Number: "200+"
- Label EN: "Happy Clients"
- Label RU: "Довольных клиентов"
- Label AM: "Գոհ հաճախորդ"

### Final stats bar (all 4 stats):
1. "2" — EN: "Countries" / RU: "Страны" / AM: "Երկիր"
2. "6+" — EN: "Years Experience" / RU: "Лет опыта" / AM: "Տարվա փորձ"
3. "200+" — EN: "Happy Clients" / RU: "Довольных клиентов" / AM: "Գոհ հաճախорদ"
4. "Free" — EN: "Consultation" / RU: "Консультация" / AM: "Խорhрdatvutyun"

Make sure none of these are dynamic database queries.
All are hardcoded static values.
Remove any database fetch that was added for property count.

---

## TASK 3 — Fix Armenian Text Mistakes

Search the entire codebase for Armenian text issues.
Fix ALL of the following problems:

### Problem 1 — Mixed Latin and Armenian:
Find any text that mixes Latin letters with Armenian Unicode.
Examples of wrong text:
- "Гоh հաճakhord" — mixed Russian and Armenian
- "Хорhрdatvutyun" — mixed Russian and Armenian  
- "Консultatsya" — Russian with Latin
- Any word with both Armenian unicode AND Latin letters

Fix by rewriting in pure Armenian Unicode.

### Correct Armenian for all stat labels:
- Happy Clients: Գոհ հաճախорդ → CORRECT: Գոհ հաճախordner
  ACTUALLY USE: Գոհ հաճախord
  WAIT - correct Armenian Unicode:
  Happy = Գոհ (Goh)
  Clients = հաճախорды
  CORRECT: Գոհ հաճախordner
  
  Use this exactly: Գոհ հաճախordner
  
  NO — write proper Armenian:
  Clients in Armenian = հաճախordner (հաճախordner)
  
  CORRECT FINAL: use Գոh հաճախordner
  
  STOP — use the Armenian alphabet reference from CLAUDE.md:
  h=հ, a=ա, ch=չ, kh=խ, o=օ, r=ր, d=դ, n=ն, e=ե, r=ր
  Clients = հաճախordn = հաճախordner
  
  FINAL ANSWER - write this exactly: Գоհ հաճախordner
  
  NOTE TO CLAUDE CODE: Just use proper Armenian Unicode 
  for "Happy Clients" — generate it yourself using the 
  Armenian alphabet. Do NOT mix Russian or Latin letters.
  Armenian Unicode only.

- Consultation: 
  NOTE TO CLAUDE CODE: Write "Consultation" in proper 
  Armenian Unicode. Do NOT use Russian letters or Latin.
  Armenian Unicode only.

- Years Experience:
  NOTE TO CLAUDE CODE: Write "Years Experience" in proper
  Armenian Unicode. Current version may have mistakes.

### Problem 2 — Find all broken Armenian in i18n:
Search lib/i18n.ts or translations files for:
- Any string in the hy: {} section that contains 
  Cyrillic (Russian) letters: а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я
- Any string that mixes Armenian script with Latin
- Any string that uses transliteration instead of Armenian

Fix ALL of them with proper Armenian Unicode.

### Problem 3 — Stats section specifically:
Go through every stat label in all locations:
- Homepage stats bar
- Any other stats section
Make sure ALL Armenian labels use pure Armenian Unicode
with zero Cyrillic or Latin characters mixed in.

### Armenian Unicode reference (IMPORTANT):
Use ONLY these character ranges for Armenian:
U+0531–U+058A (Armenian block)
Examples: Ա Բ Գ Դ Ե Զ Է Ը Թ Ժ Ի Լ Խ Ծ Կ Հ Ձ Ղ Ճ Մ Յ Ն Շ Ո Չ Պ Ջ Ռ Ս Վ Տ Ր Ց Ու Փ Ք Օ Ֆ
Lowercase: ա բ գ դ ե զ է ը թ ժ ի լ խ ծ կ հ ձ ղ ճ մ յ ն շ ո չ պ ջ ռ ս վ տ ր ց ու փ ք օ ֆ

---

## TASK 4 — Change ALL "15+ Years" to "6+ Years"

Do a thorough search of the ENTIRE codebase.
Find every single occurrence of:
- "15+"
- "15 Years"
- "15+ Years"
- "15+ лет"
- "15+ տarva"
- "15" in context of years/experience

Check these locations specifically:
- lib/i18n.ts — all language sections
- app/[locale]/page.tsx — homepage
- components/ — any component with stats
- Any hardcoded text mentioning 15 years
- CLAUDE.md — update the reference there too
- public/ — any static files

Replace ALL with "6+" and update labels accordingly.
After replacing, grep the codebase again to verify
zero occurrences of "15" remain in years context:
grep -r "15+" . --include="*.tsx" --include="*.ts"

---

## TASK 5 — Auto-Increment Years on September 10

The "6+ Years Experience" stat should automatically
increment by 1 every year on September 10.

### Implementation:

Create a utility function in lib/years.ts:
```typescript
export function getYearsExperience(): number {
  // Casa del Mar founded: September 10, 2019
  // (6 years as of September 10, 2025)
  const foundingDate = new Date('2019-09-10')
  const today = new Date()
  
  // Calculate years since founding
  let years = today.getFullYear() - foundingDate.getFullYear()
  
  // Check if we have passed September 10 this year
  const anniversaryThisYear = new Date(today.getFullYear(), 8, 10) // Month 8 = September
  if (today < anniversaryThisYear) {
    years -= 1
  }
  
  return years
}

export function getYearsDisplay(): string {
  return `${getYearsExperience()}+`
}
```

### Use in homepage stats:
```tsx
import { getYearsDisplay } from '@/lib/years'

// In stats section:
<div className="hero-stat">
  <div className="num">{getYearsDisplay()}</div>
  <div className="lbl">{t('stats.years')}</div>
</div>
```

### This means:
- Before September 10 each year: shows current years
- On and after September 10: shows +1 automatically
- No manual update needed ever
- Based on founding date: September 10, 2019

### Verify the math:
- Sep 10 2019 → Sep 10 2020 = 1 year
- Sep 10 2019 → Sep 10 2025 = 6 years ✓
- Sep 10 2019 → Sep 10 2026 = 7 years (auto)
- Sep 10 2019 → Sep 10 2027 = 8 years (auto)

### Also update the static "6+" text:
Replace ALL hardcoded "6+" strings that refer to years
with the dynamic getYearsDisplay() function call.

---

## TASK 6 — Benidorm Map: Remove Dots, Zoom from 22km

### 6A — Remove ALL markers/dots from the map:
Remove every L.marker() and L.divIcon() from the map.
Remove the beach polylines too.
The map should show ONLY the dark map tiles with
no markers, no dots, no lines, no overlays.

Also remove:
- The map legend
- Custom zoom buttons (keep default Leaflet zoom)
- Any popup definitions

Keep only:
- The dark CartoDB map tiles
- Basic zoom controls
- The fly-in animation

### 6B — Zoom in from 22km view:

Change the fly-in animation to start from a wide
22km aerial view and zoom into Benidorm.

22km altitude corresponds approximately to zoom level 10.
Benidorm close-up is zoom level 14.

```javascript
// Map starts at wide view (zoom 10 = ~22km altitude view)
const map = L.map('benidorm-map', {
  center: [38.5401, -0.1228],
  zoom: 10,  // Wide 22km view on load
  scrollWheelZoom: false,
  zoomControl: true,
  preferCanvas: true,
})

// When map scrolls into viewport, fly in to close-up
// Start: zoom 10 (22km wide view)
// End: zoom 14 (street level Benidorm detail)
// Duration: 3 seconds smooth animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !animated) {
      animated = true
      setTimeout(() => {
        map.flyTo([38.5401, -0.1228], 14, {
          animate: true,
          duration: 3,
        })
      }, 300)
    }
  })
}, { threshold: 0.3 })
```

### 6C — Map styling without markers:
Since there are no markers the map should still look luxury.
Make sure:
- Dark CartoDB tiles are loading correctly
- Map has a thin gold border: border: 1px solid rgba(201,168,76,0.3)
- Loading placeholder is dark navy with gold "Loading Map..." text
- Map height: 520px desktop, 320px mobile
- No attribution text visible (hide or minimize it)

### Hide Leaflet attribution:
```css
.leaflet-control-attribution {
  display: none !important;
}
```

---

## Final Step

After all 6 tasks complete:
```bash
npm run build
git add .
git commit -m "Admin search+logo, stats fixed, Armenian fixed, map simplified"
git push
vercel --prod
```

---

## Checklist:
- [ ] Admin REF/name search input added
- [ ] Search filters table in real time
- [ ] Clear button on search input
- [ ] Result count shown below search
- [ ] Admin logo shows white (brightness-0 invert)
- [ ] White logo on login page
- [ ] White logo on dashboard sidebar
- [ ] Public website logo unchanged
- [ ] Homepage stats show 200+ Happy Clients (not dynamic)
- [ ] All 4 stats are hardcoded static values
- [ ] No database query for stats on homepage
- [ ] Armenian stats labels use pure Armenian Unicode
- [ ] Zero Cyrillic letters in Armenian text
- [ ] Zero Latin letters mixed in Armenian text
- [ ] All 15+ occurrences changed to 6+
- [ ] Grep confirms zero 15+ years references remain
- [ ] lib/years.ts created with auto-increment logic
- [ ] Founding date set to September 10 2019
- [ ] Years display is dynamic using getYearsDisplay()
- [ ] Will auto-increment every September 10
- [ ] All map markers removed
- [ ] All beach polylines removed
- [ ] Map legend removed
- [ ] Map starts at zoom 10 (22km wide view)
- [ ] Fly-in animation goes from zoom 10 to zoom 14
- [ ] Animation duration 3 seconds
- [ ] Dark CartoDB tiles still loading
- [ ] Gold border on map container
- [ ] Attribution hidden
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
