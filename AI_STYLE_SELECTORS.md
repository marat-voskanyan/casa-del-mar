# Casa del Mar — AI Style & Feature Selectors

Read CLAUDE.md for full project context.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — Casa del Mar Writing Style

Add a new default writing style called "Casa del Mar Style"
to the AI description generator.

### The style is based on this exact example:

```
Двухэтажная квартира с 3 спальнями и 2 ванными комнатами 
в районе La Cala. Просторный и стильный объект с 
дизайнерским ремонтом, созданный для комфортной жизни. 
Квартира отличается современной планировкой на двух уровнях, 
что обеспечивает больше пространства и приватности. 
Большая терраса станет идеальным местом для отдыха 
на свежем воздухе.

Преимущества квартиры:
* двухэтажная планировка
* 3 спальни и 2 ванные комнаты
* дизайнерский ремонт
* просторная терраса
* парковочное место включено в цену
```

### Style analysis:
- Sentence 1: property type + key specs + location
- Sentence 2: overall character and purpose
- Sentence 3: one standout unique feature explained
- Sentence 4: one key lifestyle benefit
- Then a bullet list with header:
  RU: "Преимущества квартиры:"
  EN: "Property highlights:"
  AM: "Գույքի առավելությունները՝"
- Bullets: 4-6 specific factual features
- Tone: clear, professional, factual — not over-salesy
- Length: 80-120 words per language
- No marketing fluff — real facts only

### System prompt for this style:
```
Write property descriptions in this exact structure:

1. Opening sentence: [property type] with [X] bedrooms 
   and [X] bathrooms in [location area]
2. Second sentence: overall character, style and purpose
3. Third sentence: the most unique or special feature 
   of this specific property
4. Fourth sentence: one key lifestyle benefit 
   (terrace, views, pool access, beach proximity etc)
5. Then write the section header:
   - Russian: "Преимущества квартиры:"
   - English: "Property highlights:"
   - Armenian: "Գույքի առավելությունները՝"
6. Bullet list with * of 4-6 specific factual features
   (use the selected features provided)

Rules:
- Professional and factual tone only
- No superlatives like "stunning", "breathtaking", "exclusive"
- Be specific — use exact numbers (m², floor number, distance)
- Each bullet point is one clear fact
- Armenian must use proper Unicode only, no Latin letters
- 80-120 words per description
```

### Add to style selector UI:
- Name: "Casa del Mar" 
- Tag: "(Default)"
- Make it the FIRST option and pre-selected by default
- Keep all existing styles after it:
  Casa del Mar (Default) | Luxury | Investment | Family | Short | Detailed

### Update Generate button label:
Show selected style name in button:
"✨ Generate — Casa del Mar Style"
"✨ Generate — Luxury Style"
etc.

---

## TASK 2 — Property Feature Selectors

Add clickable feature selectors to the Description tab
in the admin property form. Admin selects features 
BEFORE clicking Generate — AI uses them for accuracy.

### UI placement:
- Add above the writing style selector
- Add above the Generate button
- Label the whole section: "Property Features" 
  with a small subtitle: "Select to improve AI accuracy"

### Selector groups:

#### Group 1 — View
Single or multiple select
Pills: Sea View | Partial Sea View | Pool View | 
       Garden View | Mountain View | City View

#### Group 2 — Distance to Sea
Single select only (radio-style)
Pills: Beachfront | 50m | 100m | 200m | 
       300m | 500m | 1km+ | Not specified

#### Group 3 — Complex Facilities
Multiple select
Pills: Swimming Pool | Tennis Court | Gym | Spa |
       Underground Parking | 24h Security | 
       Concierge | Garden | BBQ Area | Kids Playground

#### Group 4 — Condition
Single select only
Pills: Brand New | Modern Renovated | 
       Good Condition | Original Condition | Needs Renovation

#### Group 5 — Floor Type
Single select only
Pills: Ground Floor + Garden | Low Floor (1-3) | 
       Mid Floor (4-8) | High Floor (9-15) | 
       Penthouse | Duplex | Top Floor

#### Group 6 — Special Features
Multiple select
Pills: Terrace | Large Balcony | Air Conditioning |
       Fitted Kitchen | Furnished | Storage Room |
       Lift/Elevator | Smart Home | Sea Facing Bedroom

#### Group 7 — Investment
Multiple select
Pills: High Rental Yield | Tourist Area | 
       Year-Round Rental | Currently Rented |
       Rental License | Near Airport | New Development

### UI styling:
```css
/* Group container */
.feature-group {
  margin-bottom: 16px;
}

/* Group label */
.feature-group-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6B7280;
  margin-bottom: 8px;
  font-weight: 500;
}

/* Pill unselected */
.feature-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  border: 1px solid #D1D5DB;
  background: white;
  color: #6B7280;
  font-size: 12px;
  cursor: pointer;
  margin: 3px;
  transition: all 0.15s ease;
  user-select: none;
}

/* Pill selected */
.feature-pill.selected {
  background: #C9A84C;
  border-color: #C9A84C;
  color: #0D1F2D;
  font-weight: 500;
}

/* Pill hover */
.feature-pill:hover {
  border-color: #C9A84C;
  color: #C9A84C;
}
```

### React state for selectors:
```typescript
const [selectedView, setSelectedView] = useState<string[]>([])
const [selectedDistance, setSelectedDistance] = useState<string>('')
const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
const [selectedCondition, setSelectedCondition] = useState<string>('')
const [selectedFloorType, setSelectedFloorType] = useState<string>('')
const [selectedSpecialFeatures, setSelectedSpecialFeatures] = useState<string[]>([])
const [selectedInvestment, setSelectedInvestment] = useState<string[]>([])

// Toggle for multiple select
const toggleMultiple = (
  value: string, 
  current: string[], 
  setter: (v: string[]) => void
) => {
  if (current.includes(value)) {
    setter(current.filter(v => v !== value))
  } else {
    setter([...current, value])
  }
}

// Toggle for single select
const toggleSingle = (
  value: string,
  current: string,
  setter: (v: string) => void
) => {
  setter(current === value ? '' : value)
}
```

### Pass to API route:
```typescript
// In handleGenerateDescriptions function
const featureData = {
  view: selectedView,
  distanceToSea: selectedDistance,
  facilities: selectedFacilities,
  condition: selectedCondition,
  floorType: selectedFloorType,
  specialFeatures: selectedSpecialFeatures,
  investment: selectedInvestment,
}

// Add to POST body
body: JSON.stringify({
  name: formData.name,
  location: formData.location,
  price: formData.price,
  bedrooms: formData.bedrooms,
  bathrooms: formData.bathrooms,
  floor: formData.floor,
  size: formData.size,
  parking: formData.parking,
  status: formData.status,
  features: featureData,  // ADD THIS
  style: selectedStyle,
})
```

### Update API route prompt:
```typescript
// Build features string from selected options
const buildFeaturesText = (features: any) => {
  const lines = []
  
  if (features.view?.length) 
    lines.push(`View: ${features.view.join(', ')}`)
  if (features.distanceToSea) 
    lines.push(`Distance to sea: ${features.distanceToSea}`)
  if (features.facilities?.length) 
    lines.push(`Complex facilities: ${features.facilities.join(', ')}`)
  if (features.condition) 
    lines.push(`Condition: ${features.condition}`)
  if (features.floorType) 
    lines.push(`Floor position: ${features.floorType}`)
  if (features.specialFeatures?.length) 
    lines.push(`Special features: ${features.specialFeatures.join(', ')}`)
  if (features.investment?.length) 
    lines.push(`Investment notes: ${features.investment.join(', ')}`)
  
  return lines.length > 0 
    ? `\nSelected property features:\n${lines.map(l => `- ${l}`).join('\n')}\n\nInclude ALL of these features naturally in the description and bullet points.`
    : ''
}

// Add to prompt
const featuresText = buildFeaturesText(body.features || {})
const prompt = `...existing prompt...${featuresText}`
```

---

## TASK 3 — Reset / Clear All Button

Add a "Clear all" button to reset all selected feature pills.

### Placement:
- Right side of the "Property Features" section header
- Small, subtle — not competing with Generate button

### Design:
```tsx
<div className="flex items-center justify-between mb-3">
  <div>
    <h3 className="text-sm font-semibold text-gray-700">
      Property Features
    </h3>
    <p className="text-xs text-gray-400">
      Select to improve AI accuracy
    </p>
  </div>
  <button
    type="button"
    onClick={handleClearAll}
    className="text-xs text-gray-400 hover:text-red-500 
               transition-colors underline"
  >
    Clear all
  </button>
</div>
```

### Clear all function:
```typescript
const handleClearAll = () => {
  setSelectedView([])
  setSelectedDistance('')
  setSelectedFacilities([])
  setSelectedCondition('')
  setSelectedFloorType('')
  setSelectedSpecialFeatures([])
  setSelectedInvestment([])
}
```

### Also add individual group clear:
Each group has a tiny "×" or "clear" link on the right
that clears only that group:
```tsx
<div className="flex items-center justify-between mb-1">
  <span className="feature-group-label">View</span>
  {selectedView.length > 0 && (
    <button 
      type="button"
      onClick={() => setSelectedView([])}
      className="text-xs text-gray-300 hover:text-gray-500"
    >
      clear
    </button>
  )}
</div>
```

### State persistence across tabs:
Make sure all selected feature states are defined at 
the top level of the property form component (not inside 
the Description tab render) so they persist when admin 
switches between Basic, Details, Description, Images tabs.

---

## Final Step

After all 3 tasks are complete:
```bash
npm run build
git add .
git commit -m "Casa del Mar style, feature selectors, clear button added"
git push
vercel --prod
```

---

## Checklist:
- [ ] Casa del Mar style added as first/default option
- [ ] Style uses correct 4-sentence + bullet structure
- [ ] Bullet list header correct in EN, RU, AM
- [ ] Professional factual tone, no marketing fluff
- [ ] Generate button shows current style name
- [ ] 7 feature selector groups added
- [ ] View selector (multiple)
- [ ] Distance to sea selector (single)
- [ ] Complex facilities selector (multiple)
- [ ] Condition selector (single)
- [ ] Floor type selector (single)
- [ ] Special features selector (multiple)
- [ ] Investment selector (multiple)
- [ ] Gold pills when selected
- [ ] "Clear all" button resets everything
- [ ] Per-group clear button
- [ ] Feature selections passed to API route
- [ ] AI prompt includes all selected features
- [ ] State persists when switching form tabs
- [ ] Works on mobile
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
