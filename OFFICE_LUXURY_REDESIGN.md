# Casa del Mar — Office Section Luxury Editorial Redesign

Read CLAUDE.md for full project context.
Read the installed skills: ui-ux-pro-max, ui-animation, scroll-experience.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.
Mobile version must stay EXACTLY as it currently is.
Only change desktop (768px and above).

---

## IMPORTANT — Text Rules
- All paragraph texts are stored in i18n.ts
- Use them EXACTLY as stored — zero modifications
- For Armenian translations: generate them yourself
  using your Armenian language knowledge
- Write ALL Armenian in proper Unicode (U+0531-U+058A)
- Zero Latin letters in Armenian text (except NIE, brands)

---

## TASK 1 — Redesign Office Section (Desktop Only)

### Design Direction:
Luxury editorial magazine style.
Like Architectural Digest meets Aman Resorts.
NOT typical website layout — something unique and beautiful.

### Colors:
- Deep navy: #0D1F2D
- Sand: #F2EBD9
- Gold: #C9A84C
- White: #FFFFFF

### Fonts:
- Playfair Display — headings and quote
- Montserrat — labels and eyebrow
- Noto Serif Armenian — Armenian text

---

## Layout Structure (Desktop — min-width: 768px)

### Full-bleed split section:
```
┌─────────────────────────────────────────────────────┐
│                    │                                 │
│                    │  [Inside photo card]            │
│  OUTDOOR PHOTO     │  floating, rotated -2deg        │
│  full height       │  overlapping the split          │
│  edge to edge      │                                 │
│                    │  Eyebrow                        │
│  "Where Your       │  Title                          │
│  Journey Begins"   │  Paragraph text                 │
│  (serif quote)     │                                 │
│                    │  📍 Address                     │
│                    │  🕐 Hours                       │
│                    │                                 │
└─────────────────────────────────────────────────────┘
```

### Left half — Outdoor photo:
- Width: 50% of section
- Height: 100% of section (full height)
- Image: /images/outdoor-new.png
- object-fit: cover
- object-position: center
- overflow: hidden
- NO padding, edge to edge

Large serif quote overlaid on photo:
- Position: bottom left of photo
- Padding: 3rem from edges
- Text in large thin Playfair Display:
  EN: "Where Your Journey Begins"
  RU: "Где начинается ваш путь"
  AM: Claude Code write in Armenian Unicode
- Font size: clamp(1.6rem, 3vw, 2.4rem)
- Font weight: 300 (thin/light)
- Color: rgba(255,255,255,0.9)
- Text shadow: 0 2px 20px rgba(0,0,0,0.5)
- Below quote: thin gold line 50px wide

Dark gradient on left photo (for quote readability):
```css
background: linear-gradient(
  to top,
  rgba(13,31,45,0.75) 0%,
  rgba(13,31,45,0.2) 40%,
  transparent 70%
);
```

Ken Burns animation on outdoor photo:
```css
@keyframes kenBurns {
  0% { transform: scale(1); }
  50% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
.outdoor-photo-img {
  animation: kenBurns 22s ease-in-out infinite;
  will-change: transform;
}
```

### Right half — Content:
- Width: 50%
- Background: #0D1F2D
- Padding: 4rem

#### Inside photo card (floating, overlapping):
- Width: 65% of right column
- Aspect ratio: 4/3
- Position: relative, margin-top: -80px (pulls up to overlap split)
- margin-left: -60px (overlaps the center split line)
- Image: /images/inside-new.png
- object-fit: cover
- Transform: rotate(-2deg)
- Border: 2px solid #C9A84C
- Box shadow (layered luxury):
  ```css
  box-shadow:
    0 0 0 1px rgba(201,168,76,0.2),
    0 20px 60px rgba(0,0,0,0.5),
    0 8px 20px rgba(0,0,0,0.3),
    inset 0 0 30px rgba(201,168,76,0.05);
  ```
- Glassmorphism frame effect:
  ```css
  /* Wrap image in a container with glass effect */
  .inside-card-frame {
    position: relative;
    border-radius: 2px;
  }
  .inside-card-frame::after {
    content: '';
    position: absolute;
    inset: -1px;
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 2px;
    backdrop-filter: blur(0px);
    pointer-events: none;
  }
  ```

Floating animation on inside photo:
```css
@keyframes floatCard {
  0%, 100% { transform: rotate(-2deg) translateY(0px); }
  50% { transform: rotate(-2deg) translateY(-10px); }
}
.inside-card {
  animation: floatCard 5s ease-in-out infinite;
  will-change: transform;
}
```

Gold corner accent on inside card:
Small gold L-shaped corner lines at top-left and 
bottom-right of the card for decoration:
```css
.inside-card::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  width: 24px;
  height: 24px;
  border-top: 2px solid #C9A84C;
  border-left: 2px solid #C9A84C;
  z-index: 1;
}
.inside-card::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-bottom: 2px solid #C9A84C;
  border-right: 2px solid #C9A84C;
  z-index: 1;
}
```

#### Text content below card:
Margin-top: 2.5rem from the card

Eyebrow:
- Font: Montserrat, 10px, tracking-[0.3em], uppercase
- Color: #C9A84C
- EN: "OUR OFFICE"
- RU: "НАШ ОФИС"
- AM: Claude Code write in Armenian Unicode

Gold decorative line:
- Width: 40px, height: 1px
- Background: #C9A84C
- Margin: 0.75rem 0

Title:
- Font: Playfair Display, clamp(1.6rem, 2.5vw, 2.2rem)
- Weight: 300
- Color: white
- EN: "Visit Us in Yerevan"
- RU: "Посетите нас в Ереване"
- AM: Claude Code write in Armenian Unicode

Paragraph:
- Font size: 14px
- Color: rgba(255,255,255,0.72)
- Line height: 1.9
- Max width: 420px
- Use EXACTLY the text from i18n.ts — do NOT modify

Info items (address and hours):
Display as two rows with gold icon + label + value:

```tsx
<div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  
  {/* Address */}
  <a href="https://maps.google.com/?q=40.186472,44.512972"
     target="_blank" rel="noopener noreferrer"
     style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              textDecoration: 'none', color: 'inherit' }}>
    <span style={{ color: '#C9A84C', fontSize: '16px', flexShrink: 0 }}>📍</span>
    <div>
      <p style={{ fontSize: '10px', color: 'rgba(201,168,76,0.7)', 
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  fontFamily: 'Montserrat', marginBottom: '2px' }}>
        {t('address_label')}
      </p>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
        37 Mashtots Ave, Yerevan, Armenia
      </p>
    </div>
  </a>

  {/* Hours */}
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
    <span style={{ color: '#C9A84C', fontSize: '16px', flexShrink: 0 }}>🕐</span>
    <div>
      <p style={{ fontSize: '10px', color: 'rgba(201,168,76,0.7)',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  fontFamily: 'Montserrat', marginBottom: '2px' }}>
        {t('hours_label')}
      </p>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
        {t('hours_value')}
      </p>
    </div>
  </div>
  
</div>
```

---

## TASK 2 — Scroll Reveal Animations

When section scrolls into viewport trigger animations.
Use Intersection Observer — NOT scroll progress.
Triggers once per page visit.

Left half (photo): fade in from left
```css
.office-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.9s ease, transform 0.9s ease;
}
.office-left.visible {
  opacity: 1;
  transform: translateX(0);
}
```

Right half (content): fade in from right with delay
```css
.office-right {
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s;
}
.office-right.visible {
  opacity: 1;
  transform: translateX(0);
}
```

Gold lines: draw in animation
```css
@keyframes drawLine {
  from { width: 0; }
  to { width: 40px; }
}
.gold-line.visible {
  animation: drawLine 0.6s ease 0.5s both;
}
```

---

## TASK 3 — Section Wrapper Styling

The full section:
```tsx
<section style={{
  position: 'relative',
  display: 'flex',           // side by side columns
  minHeight: '680px',
  overflow: 'hidden',
  background: '#0D1F2D',
}}>
```

Add a subtle gold top border to the section:
```css
border-top: 1px solid rgba(201,168,76,0.2);
```

---

## TASK 4 — Armenian Translations

Claude Code: write all Armenian text for this section
using proper Armenian Unicode characters only.
Zero Latin letters (except brand names).

Translate these strings to Armenian:
- "Where Your Journey Begins" (quote on photo)
- "OUR OFFICE" (eyebrow)
- "Visit Us in Yerevan" (title)
- "Address" (label)
- "Working Hours" (label)
- "Mon–Fri: 11:00 – 18:00" (value)
- "Find Us" (map section eyebrow)

Use your Armenian language knowledge.
Every character must be Armenian Unicode U+0531-U+058A.

---

## TASK 5 — Keep Map Section Unchanged

The OfficeMap component below this section stays 
exactly as it currently is. Do not touch it.

---

## TASK 6 — Performance

- Ken Burns: use will-change: transform
- Floating animation: use will-change: transform
- Preload both images in page head
- Respect prefers-reduced-motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .outdoor-photo-img { animation: none; }
    .inside-card { animation: none; }
  }
  ```

---

## Final Step

```bash
npm run build
git add .
git commit -m "Office section luxury editorial redesign - desktop"
git push
vercel --prod
```

---

## Checklist:
- [ ] Left half: outdoor photo full height, edge to edge
- [ ] Ken Burns zoom animation on outdoor photo (22s)
- [ ] Dark gradient overlay on outdoor photo
- [ ] Large serif quote on outdoor photo
- [ ] Quote in all 3 languages with Armenian Unicode
- [ ] Right half: navy background
- [ ] Inside photo card: -2deg rotation, gold border
- [ ] Inside photo overlaps the center split line
- [ ] Glassmorphism frame on inside card
- [ ] Gold corner accents on inside card
- [ ] Floating animation on inside card (5s)
- [ ] Eyebrow in all 3 languages with Armenian Unicode
- [ ] Gold decorative line
- [ ] Title in all 3 languages with Armenian Unicode
- [ ] Paragraph text: EXACTLY as in i18n.ts
- [ ] Address links to Google Maps
- [ ] Hours displayed correctly
- [ ] Scroll reveal: left fades from left
- [ ] Scroll reveal: right fades from right
- [ ] Gold line draws in on scroll
- [ ] Gold top border on section
- [ ] Map section completely unchanged
- [ ] Mobile version completely unchanged
- [ ] prefers-reduced-motion respected
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
