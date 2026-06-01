# Casa del Mar — Mobile Design Overhaul

Read CLAUDE.md for full project context.
The frontend-design skill is installed — use it.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## Design Direction
Luxury coastal real estate — mobile version.
Think: Aman Resorts app meets Sotheby's mobile site.
Colors: Navy #0D1F2D, Sand #F2EBD9, Gold #C9A84C
Fonts: Playfair Display (headings), Montserrat (labels)
Target screens: 375px (iPhone SE), 390px (iPhone 14), 
                360px (Android), 414px (iPhone Plus)

---

## TASK 1 — Mobile Navigation

### Current: basic hamburger menu
### New: full-screen luxury overlay menu

Design:
- Full screen dark navy overlay (#0D1F2D)
- Menu slides in from right with 350ms cubic-bezier ease
- Background has subtle gold gradient at bottom
- Logo centered at top of menu (white version)
- Navigation links:
  - Large serif font (Playfair Display)
  - Font size: 2rem
  - Each link on its own line with generous spacing
  - Gold underline animation on tap
  - Active page highlighted in gold
  - Links stagger in with 50ms delays
- Language switcher (EN | RU | AM) below nav links
  - Pill style, gold border
- Contact info at bottom:
  - Phone number (tappable tel: link)
  - WhatsApp button (green, full width)
  - Instagram, Facebook icons
- Close button: top right, 48x48px, × in gold
- Body scroll locked when menu open
- Menu closes on: link tap, close button, back gesture

```tsx
// Animation values
const menuVariants = {
  closed: { x: '100%', opacity: 0 },
  open: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] }
  }
}

// Stagger children
const linkVariants = {
  closed: { x: 30, opacity: 0 },
  open: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
}
```

---

## TASK 2 — Mobile Hero Section

### Current: text centered on dark gradient
### New: cinematic full-height with layered design

Design:
- min-height: 100svh (safe viewport height iOS)
- Background photo full screen with parallax disabled on mobile
- Dark gradient overlay: stronger on mobile for readability
- Content layout (centered, bottom-aligned):
  - Eyebrow text: gold, 10px, tracked wide, with gold lines
  - Headline: Playfair Display, clamp(2.4rem, 9vw, 4rem)
  - Divider: thin gold line, 40px wide, centered
  - Subtitle: 14px, white 70% opacity
  - Two buttons stacked vertically, full width:
    - Primary: gold background, navy text, 54px height
    - Ghost: gold border, white text, 54px height
    - Gap between buttons: 12px
  - Bottom: animated scroll indicator (gold bouncing arrow)

Stats bar below hero:
- Dark navy background
- 2x2 grid on mobile (not 4 in a row)
- Each stat: large gold number + small white label
- Gold dividers between stats
- Count-up animation when scrolled into view

---

## TASK 3 — Mobile Property Cards

### Current: basic cards with image and text
### New: premium editorial cards

Design for property cards on Spain/Cyprus pages:

Full-width cards on mobile (no side padding on image):
```
┌─────────────────────────────┐
│                             │
│    [Property Image 65%]     │
│    [Status badge top-left]  │
│    [REF badge top-right]    │
│                             │
├─────────────────────────────┤
│  Apartment in La Cala       │  ← Playfair serif
│  La Cala · Floor 7          │  ← small gray
│                             │
│  🛏 2   🚿 1   📐 65m²       │  ← specs row
│                             │
│  €209,900          →        │  ← price + arrow
└─────────────────────────────┘
```

Styling details:
- Image: 65% of card height, full width
- No border radius on image (edge to edge)
- Status badge: top-left, gold on navy
- REF badge: top-right, subtle
- Card title: Playfair Display, 1.2rem, navy
- Location: 11px, gold color (not gray)
- Specs: inline with emoji icons, 12px
- Price: Playfair Display, 1.5rem, navy, bold
- Arrow icon: right side, gold color
- Hover/tap: slight scale on image (1.03)
- Card shadow: 0 4px 20px rgba(0,0,0,0.08)
- Border: none (use shadow instead)
- Spacing: 16px padding on content area

Card list spacing:
- Gap between cards: 16px
- Horizontal padding: 16px from screen edges
- Cards fill available width

---

## TASK 4 — Mobile Filter Bar

### Current: horizontal scroll with basic pills
### New: modern sticky filter bar

Design:
- Sticky below navbar (top: 62px)
- Background: white with subtle bottom shadow
- Horizontal scroll with momentum: -webkit-overflow-scrolling: touch
- Show scroll fade on right edge (gradient)
- Pills design:
  - Height: 36px
  - Border radius: 18px (full pill)
  - Border: 1.5px solid #E8E0D0
  - Background: white
  - Font: Montserrat, 11px, letter-spacing 0.1em
  - Selected: gold background, navy text, no border
  - Unselected: white background, navy text
  - Padding: 0 16px
- Filter categories: show as first pill "All Filters ▾"
  that opens a bottom sheet on mobile
- Active filter count badge on "All Filters" pill
- Property count: shown as last non-scrollable element

Bottom sheet for filters (modern mobile pattern):
- Slides up from bottom with handle bar
- Dark overlay behind
- Full filter options inside
- "Apply" button at bottom, gold, full width
- "Clear all" text button top right

---

## TASK 5 — Mobile Property Detail Page

### Current: stacked sections
### New: immersive mobile experience

Image gallery:
- Full width, edge to edge (zero padding)
- Swipe left/right (touch events)
- Image counter: "3 / 12" overlay, top right
  - Background: rgba(0,0,0,0.5)
  - White text, small, rounded pill
- Thumbnail strip: horizontal scroll below main image
  - 64px height thumbnails
  - Selected thumbnail: gold border
  - Smooth scroll to selected
- Fullscreen button: bottom right of main image
  - Opens fullscreen lightbox
  - Swipe to navigate in lightbox
  - Pinch to zoom in lightbox

Property info layout:
- Status badge + REF code in one row
- Property name: Playfair Display, 1.6rem
- Location: gold color, 12px
- Specs grid: 2x3 or 3x2, each spec is icon + value + label
  - Clean card style: white bg, subtle border
  - Icon: 20px, gold color
  - Value: 1.1rem, navy, Playfair
  - Label: 10px, gray, Montserrat uppercase

Description:
- Collapsible on mobile (show first 150 chars)
- "Read more" / "Read less" toggle
- Gold color for the toggle link

Map:
- Full width, 280px height on mobile
- Two finger scroll to avoid interfering with page scroll

Sticky bottom bar:
- Fixed to bottom, always visible
- Height: 70px
- Left: price in large serif font
- Right: "Enquire Now" button, gold, 44px height
- Top border: 1px gold
- Background: white with blur (backdrop-filter: blur(10px))
- Disappears when contact form section is in view
- Safe area padding for iPhone home indicator:
  padding-bottom: env(safe-area-inset-bottom)

Similar properties:
- Horizontal scroll carousel
- Cards: 260px wide, snap scrolling
- -webkit-overflow-scrolling: touch

---

## TASK 6 — Mobile Homepage Sections

### Destinations section:
- Single full-width cards stacked vertically
- Each card: 300px height
- Text overlay with gradient
- Tap ripple effect on cards

### Services section:
- 2-column grid on mobile
- Each card: icon (large, gold) + title + short desc
- Cards have subtle gold border on hover/tap
- Icon size: 2rem

### About section:
- Image full width, 240px height
- Content below with generous padding
- Quote block: gold left border, italic serif text

### Featured properties:
- Single column
- Full width cards
- "View All" button full width at bottom

---

## TASK 7 — Mobile Benidorm Page

### Hero:
- Full height with parallax disabled
- Text readable over photo
- Stat pills stack to 2x2 grid on mobile
- Scroll arrow visible

### Quick facts strip:
- Horizontal scroll on mobile
- Each fact card: 140px wide minimum
- Scroll hint visible (fade on right)

### Beach cards:
- Stack vertically on mobile
- Full width each
- Image 200px height
- Text below image

### La Cala section:
- Single column
- Timeline: vertical line with dots on left
- Each milestone: dot + year (bold) + description

### Climate section:
- Horizontal scroll for month cards
- Each month card: 80px wide
- Temperature shown clearly

### Why Invest cards:
- 2-column grid on mobile
- Each card: icon + title + 2-line description

### Map:
- Full width
- 320px height on mobile
- Touch-friendly controls

---

## TASK 8 — Mobile Contact Page

### Layout:
- Single column (contact info then form below)
- Contact info cards: full width, gold icon left
- Form: full width inputs
- Submit button: full width, 54px height, gold

### Map:
- Full width, 220px height

---

## TASK 9 — Mobile Admin Panel

### Login page:
- Centered white card on dark background
- Logo at top, 60px height
- Full width inputs, 52px height
- Full width login button

### Dashboard:
- Top bar: logo + hamburger menu
- Stats: 2x2 grid
- Properties table: card list view on mobile
  Each property = one card with:
  - Thumbnail image left (56x40px)
  - Name + REF right
  - Price below name
  - Status badge
  - Edit | Delete buttons as icon buttons
- Add Property button: floating gold button 
  bottom right (FAB pattern)
  ```tsx
  <button className="fixed bottom-6 right-6 z-50
    w-14 h-14 bg-[#C9A84C] rounded-full
    shadow-lg flex items-center justify-center
    text-[#0D1F2D] text-2xl font-bold
    active:scale-95 transition-transform">
    +
  </button>
  ```

### Property form:
- Tabs: horizontal scroll if overflow
- Full width inputs, 48px height
- Image grid: 3 columns on mobile (not 5)
- Map: 250px height, touch-friendly
- Submit: fixed bottom bar with Save button

---

## TASK 10 — Global Mobile Polish

### Touch feedback:
Add to all interactive elements:
```css
@media (hover: none) {
  button, a, .clickable {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  
  button:active, a:active {
    transform: scale(0.97);
    transition: transform 0.1s;
  }
}
```

### Safe area support (iPhone notch/home bar):
```css
.navbar {
  padding-top: max(1rem, env(safe-area-inset-top));
}

.sticky-bottom-bar {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

### Smooth scrolling:
```css
html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
```

### Font sizes — prevent iOS auto-zoom:
All input fields must have font-size: 16px minimum
to prevent iOS zooming in on focus.

### Loading states:
All data-fetching sections show skeleton screens:
- Property grid: animated gray skeleton cards
- Images: blur placeholder while loading
- Map: dark placeholder while Leaflet loads

---

## Final Step

After all tasks complete:
```bash
npm run build
git add .
git commit -m "Mobile design overhaul - modern luxury mobile experience"
git push
vercel --prod
```

Test on real devices after deploying:
- iPhone Safari
- Android Chrome
- Check every page
- Check admin panel on phone

---

## Checklist:
- [ ] Mobile menu: full screen overlay with animations
- [ ] Mobile menu: staggered link animations
- [ ] Mobile menu: contact info at bottom
- [ ] Hero: cinematic full-height on mobile
- [ ] Hero: buttons stacked vertically full width
- [ ] Stats bar: 2x2 grid on mobile
- [ ] Property cards: premium editorial design
- [ ] Property cards: full width on mobile
- [ ] Filter bar: sticky, modern pill design
- [ ] Filter bottom sheet on mobile
- [ ] Property detail: swipe gesture gallery
- [ ] Property detail: sticky bottom price bar
- [ ] Property detail: collapsible description
- [ ] Homepage sections: properly stacked
- [ ] Services: 2-column grid on mobile
- [ ] Benidorm page: all sections mobile optimized
- [ ] Contact page: single column on mobile
- [ ] Admin: card list view on mobile
- [ ] Admin: FAB add button
- [ ] Touch feedback on all interactive elements
- [ ] Safe area insets for iPhone
- [ ] No horizontal scroll on any page
- [ ] All inputs 16px+ font size
- [ ] Skeleton loading screens
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
- [ ] Tested on iPhone and Android
