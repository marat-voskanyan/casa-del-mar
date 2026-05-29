# Casa del Mar — Fixes Batch 2

Read CLAUDE.md for full project context.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — Fix Custom Map Marker Positions

The markers on the Benidorm luxury map are not 
in their correct geographic positions.

### Correct coordinates for each marker:

1. Playa de Levante (east beach)
   lat: 38.5428, lng: -0.1121
   Label: "Playa de Levante — 1.9km"

2. Playa de Poniente (west beach)
   lat: 38.5367, lng: -0.1420
   Label: "Playa de Poniente — 3km"

3. La Cala District
   lat: 38.5355, lng: -0.1467
   Label: "La Cala — Modern Apartments"

4. Old Town (Casco Antiguo)
   lat: 38.5408, lng: -0.1189
   Label: "Casco Antiguo — Old Town"

5. Sierra Cortina
   lat: 38.5578, lng: -0.0889
   Label: "Sierra Cortina — Prestigious Area"

6. Altea Hills
   lat: 38.6089, lng: -0.0467
   Label: "Altea Hills — Elite Community"

7. Finestrat
   lat: 38.5681, lng: -0.1889
   Label: "Finestrat — New Developments"

### Also fix beach polylines:

Levante beach line (east coast):
[[38.5398, -0.1193], [38.5428, -0.1121], [38.5458, -0.1060]]

Poniente beach line (west coast):
[[38.5398, -0.1193], [38.5367, -0.1420], [38.5330, -0.1520]]

### Map center and zoom:
Center: [38.5401, -0.1228]
Initial zoom: 12
Fly-to zoom after animation: 13

### Find and update the BenidormMap component:
File: components/BenidormMap.tsx
Replace all existing coordinates with the correct ones above.

---

## TASK 2 — Make REF Codes More Visible

The property REF codes are too small and hard to see
especially on mobile. Make them more prominent.

### Current style (too small):
Small gray text below the price

### New style for REF code:

On property cards:
- Show REF as a small badge/pill
- Style: gold border, gold text, small font
- Position: below the price OR top right corner of card
- Format: "REF: 3282" 
- Font: Montserrat, 10px, letter-spacing 0.1em, uppercase
- Background: transparent
- Border: 1px solid rgba(201, 168, 76, 0.5)
- Padding: 2px 8px
- Border radius: 2px

```tsx
<div className="inline-block border border-[#C9A84C]/50 
  text-[#C9A84C] text-[10px] tracking-widest 
  uppercase px-2 py-0.5 mt-1">
  REF: {property.ref}
</div>
```

On property detail page:
- Show REF more prominently in the specs section
- Larger than on cards: 12px
- Full gold color: #C9A84C
- Show as: "Reference: 3282"
- Position: in the specs grid alongside beds/baths/size

### Mobile specific:
- REF badge must be clearly visible on 375px width
- Minimum tap-friendly size
- Does not overlap with other elements

### Update these components:
- Property card component (used on Spain, Cyprus, homepage)
- Property detail page specs section

---

## TASK 3 — Admin Dashboard — Add Photo and REF

In the admin dashboard properties table, add:
- A small thumbnail photo of the property
- The REF code prominently visible

### Current table columns:
(whatever exists currently)

### New table columns:
| Photo | REF | Name | Location | Price | Status | Country | Actions |

### Photo column:
- Size: 56px x 40px thumbnail
- object-fit: cover
- Border radius: 2px
- If no image: show a gray placeholder with house icon
- Clicking photo opens property edit page

```tsx
<td className="w-16 p-2">
  {property.images?.[0] ? (
    <img
      src={property.images[0]}
      alt={property.name}
      className="w-14 h-10 object-cover rounded-sm cursor-pointer"
      onClick={() => router.push(`/admin/properties/${property.id}/edit`)}
    />
  ) : (
    <div className="w-14 h-10 bg-gray-100 rounded-sm 
      flex items-center justify-center">
      <span className="text-gray-300 text-lg">🏠</span>
    </div>
  )}
</td>
```

### REF column:
- Show REF code in gold color
- Font: monospace or Montserrat
- Font size: 12px
- Color: #C9A84C
- If no REF: show "—"

```tsx
<td className="p-2">
  <span className="text-[#C9A84C] text-xs font-mono tracking-wide">
    {property.ref || '—'}
  </span>
</td>
```

### Mobile admin dashboard:
On mobile the table should show:
- Photo (small, 48x36px)
- REF + Name stacked
- Price
- Status badge
- Edit button
Hide less important columns on mobile using hidden sm:table-cell

---

## TASK 4 — Fix Stats: Change to 6+ Years

Find the stats section on the homepage and change:
"15+ Years Experience" → "6+ Years Experience"

Search the entire codebase for:
- "15+" or "15 Years" or "15+ Years"
- Update in all 3 languages:
  EN: "6+ Years Experience"
  RU: "6+ лет опыта"
  AM: "6+ տարվա փորձ"

Also check CLAUDE.md and update if it mentions 15+ years.

---

## TASK 5 — Replace "500+ Happy Clients" Stat

Remove "500+ Happy Clients" and replace with a more 
accurate and relevant stat for Casa del Mar.

### Options — choose the most appropriate one:

Option A — Countries where we operate:
"Spain & Cyprus" with label "Destinations"

Option B — Properties available:
Show the actual count of properties in the database
with label "Properties Available"
This is dynamic — counts real properties from DB

Option C — Free consultation stat:
"Free" with label "Consultation"
Highlights the no-cost service

Option D — Years in market:
Already have 6+ Years, so skip this

### Recommended: Use Option B (dynamic property count)
- Query the database for total property count
- Show the real number
- Label: "Properties"
- This is honest, accurate and updates automatically

### Implementation:
In the homepage stats section:
- Fetch total property count from database
- Display as the 3rd or 4th stat
- Format: show the number + "+" if over 10

### Stats bar final layout:
1. "2" — Countries
2. "6+" — Years Experience  
3. "[X]" — Properties (dynamic from DB)
4. "Free" — Consultation

### Update in all 3 languages:
EN: "Properties" / "Consultation"
RU: "Объектов" / "Консультация"
AM: "Անշ. Գույք" / "Խորհrrdatv."

---

## Final Step

After all 5 tasks complete:
```bash
npm run build
git add .
git commit -m "Map fixed, REF visible, admin photos, stats corrected"
git push
vercel --prod
```

---

## Checklist:
- [ ] Benidorm map markers in correct positions
- [ ] Levante marker at correct coordinates
- [ ] Poniente marker at correct coordinates
- [ ] La Cala marker at correct coordinates
- [ ] Old Town marker at correct coordinates
- [ ] Sierra Cortina marker at correct coordinates
- [ ] Altea Hills marker at correct coordinates
- [ ] Finestrat marker at correct coordinates
- [ ] Beach polylines corrected
- [ ] REF code shows as gold badge on property cards
- [ ] REF visible on mobile property cards
- [ ] REF prominent on property detail page
- [ ] Admin dashboard has photo thumbnail column
- [ ] Admin dashboard has REF column in gold
- [ ] Photo placeholder shows when no image
- [ ] Mobile admin table still usable
- [ ] Stats changed from 15+ to 6+ Years
- [ ] 6+ Years updated in EN RU AM
- [ ] Happy Clients replaced with Properties count
- [ ] Properties count is dynamic from database
- [ ] All 4 stats make sense and are accurate
- [ ] Stats updated in all 3 languages
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
