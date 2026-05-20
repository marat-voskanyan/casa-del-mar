# Casa del Mar — Mobile, Loading & Benidorm Tasks

Read CLAUDE.md, TASKS.md and ARMENIAN_TASKS.md for full context.
Complete ALL tasks below automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — Perfect Mobile Experience (iPhone & Android)

Make every single page pixel-perfect on mobile.
Test mentally at these sizes: 375px (iPhone SE), 390px (iPhone 14 Pro),
360px (Samsung Galaxy), 414px (iPhone Plus), 768px (iPad).

### Global mobile rules:
- No horizontal scroll on ANY page at any screen width
- All touch targets minimum 48x48px (buttons, links, icons)
- Font size minimum 16px on all inputs (prevents iOS auto-zoom)
- Tap highlight color: transparent (no ugly gray flash on tap)
- Smooth scrolling everywhere: scroll-behavior: smooth
- Remove any hover-only interactions that don't work on touch
- Add touch-action: manipulation to all buttons
- Images: always object-fit: cover, never overflow container
- Use CSS clamp() for font sizes that scale between mobile and desktop

### Navigation — Mobile hamburger menu:
- Hamburger icon (☰) on mobile, full nav on desktop (breakpoint: 768px)
- Tapping hamburger opens full-screen overlay menu (not a sidebar)
- Menu covers full screen with deep navy background #0D1F2D
- Menu items: large, centered, 60px height each, easy to tap
- Language switcher (EN / RU / HY) visible in mobile menu
- Close button (✕) top right corner, 48x48px tap target
- Menu slides in from right with smooth 300ms transition
- Menu closes when: link tapped, close button tapped, 
  background tapped, back button pressed
- Active page highlighted in gold color
- Social links (Facebook, WhatsApp) at bottom of mobile menu

### Homepage mobile:
- Hero section:
  - Headline: clamp(2rem, 8vw, 5.5rem) — scales smoothly
  - Subheadline: clamp(1rem, 4vw, 1.4rem)
  - Two CTA buttons: stack vertically on mobile, full width
  - Buttons: 52px height, easy to tap
  - Hero min-height: 100svh (uses safe viewport height for iOS)
- Stats bar:
  - 2x2 grid on mobile (not 1 column, not 4 in a row)
  - Each stat centered with large number and small label
- Destination cards:
  - Single column on mobile
  - Each card: 280px height minimum
  - Text always readable (gradient overlay strong enough)
- Featured properties:
  - Single column on mobile
  - Cards full width
- Services grid:
  - Single column on mobile
  - Each service card: icon + title + description, well spaced
- About section:
  - Image on top, text below on mobile
  - Image height: 250px on mobile
- Contact strip:
  - Stack vertically on mobile
  - Phone and email links tappable (tel: and mailto: links)
- Footer:
  - Stack all columns vertically
  - Links spaced generously for tap targets

### Spain / Cyprus listing pages mobile:
- Filter bar:
  - Scrolls horizontally (overflow-x: auto, no wrap)
  - -webkit-overflow-scrolling: touch for smooth iOS scroll
  - Pill buttons: 40px height, adequate padding
  - Show scroll hint (fade on right edge)
- Property cards:
  - Single column on mobile (full width)
  - Image: 56% of card height
  - Price prominent (large serif font)
  - All specs visible without truncation
  - Card tap opens detail page (whole card is tappable)

### Property detail page mobile:
- Image gallery:
  - Full width, edge to edge (no side padding)
  - Swipe left/right gesture to navigate images (touch events)
  - Thumbnail strip: horizontal scroll, 72px height thumbnails
  - Image counter "3 / 12" overlay on main image (top right)
  - Fullscreen button (⛶) on main image
  - Lightbox: full screen, swipe to navigate, tap outside to close
- Specs grid:
  - 2x2 or 2x3 grid on mobile (not single column)
  - Icons + numbers clearly visible
- Description:
  - Full readable text, good line height
- Map:
  - Full width on mobile
  - Height: 280px on mobile (not too tall)
  - Touch/pinch zoom works correctly
  - Map does not capture scroll (only zooms when two fingers)
    Add: map.scrollWheelZoom.disable() on mobile
    Enable zoom only on pinch gesture
- Sticky bottom bar on mobile:
  - Fixed to bottom of screen
  - Shows: price (left) + "Enquire Now" button (right)
  - Height: 64px
  - Background: deep navy #0D1F2D
  - Gold border top: 1px solid #C9A84C
  - Button: gold background, navy text
  - Disappears when contact form is in view
- Similar properties:
  - Horizontal scroll carousel on mobile
  - Cards: 280px wide, scroll snapping

### Contact page mobile:
- Two columns → single column on mobile
- Form inputs: full width, 52px height
- Submit button: full width, 52px height
- Map iframe: full width, 220px height on mobile
- Social links: large tap targets

### Admin panel mobile (all pages):
- Login page:
  - Centered card, full width on small screens
  - Logo visible at top
  - Inputs: full width, 52px height, 16px font
  - Login button: full width, 52px height
- Dashboard:
  - Stats cards: 2x2 grid on mobile
  - Properties table: horizontal scroll on mobile
    Add: overflow-x: auto wrapper around table
  - Add/Edit buttons: full width on mobile
  - Table rows: show essential info only on mobile
    (name, price, status, actions)
  - Sidebar: hidden on mobile, hamburger menu instead
  - Mobile top bar: logo + hamburger + "Add Property" button
- Property form:
  - Tabs: horizontal scroll if they overflow
  - All inputs: full width, 52px height
  - Textareas: full width, min 150px height
  - Image upload grid: 2 columns on mobile (not 4-5)
  - Map: 250px height on mobile, touch-friendly
  - Submit button: fixed to bottom on mobile, full width
  - Tab content: good padding, not too cramped

---

## TASK 2 — Fix Sections Not Loading on First Visit

Properties, images and sections sometimes don't appear until 
the page is refreshed. This is a critical bug. Find and fix 
all causes.

### Likely causes to investigate and fix:

1. **Hydration mismatch:**
   - Components that use window/document without checking 
     if they are on client side
   - Fix: add 'use client' directive where needed
   - Fix: use useEffect for any browser-only code
   - Fix: use dynamic imports with ssr: false for 
     Leaflet maps and any window-dependent components

2. **Data fetching not triggering on client:**
   - Pages that fetch data but the fetch happens before 
     hydration completes
   - Fix: add loading states with skeleton UI
   - Fix: use SWR or React Query for client-side fetching
     OR ensure server components fetch correctly
   - Fix: add error boundaries so failed fetches show 
     a retry button instead of blank sections

3. **Image loading:**
   - Images that fail silently on first load
   - Fix: add onError handler to all img tags with fallback
   - Fix: use loading="eager" for above-fold images,
     loading="lazy" for below-fold
   - Fix: add explicit width and height to all images
   - Fix: use Next.js Image component with priority={true} 
     for hero and first property images

4. **Leaflet map not initializing:**
   - Map appears blank on first load
   - Fix: ensure dynamic import with ssr: false
   - Fix: add a loading placeholder while map initializes
   - Fix: use useEffect with cleanup to properly 
     initialize and destroy map instance
   - Fix: check for container element before initializing

5. **React hydration errors:**
   - Run the app and check browser console for any 
     "Hydration failed" errors
   - Fix each one found

6. **API calls returning empty on first render:**
   - Check if useEffect dependencies are correct
   - Add proper loading and error states to all data fetches
   - Add retry logic for failed API calls

### What to implement:
- Add skeleton loading screens for:
  - Property grid (show 6 skeleton cards while loading)
  - Property detail page (skeleton for image + specs)
  - Homepage featured properties section
- Add error states with retry buttons for all data fetches
- Add console.error logging for any fetch failures
- Test that navigating between pages always loads content
  without needing a refresh

---

## TASK 3 — Benidorm Page — Make It Attractive & Interesting

Completely redesign the Benidorm page to be visually stunning
and informative. This is a key marketing page.

### IMPORTANT CORRECTIONS TO BENIDORM GEOGRAPHY:
⚠️ CRITICAL — Fix this wrong information currently on the page:

WRONG (remove this): "La Cala is between Levante and Poniente beaches"
CORRECT: La Cala is located next to Poniente beach on the 
western side. It is NOT between the two beaches.

CORRECT geography of Benidorm (use this):
- Playa de Levante — the eastern beach, the longest and most lively
- Old Town (Casco Antiguo) — on the headland between the beaches
- Playa de Poniente — the western beach, calmer and more residential
- La Cala — located to the WEST, next to and beyond Poniente beach.
  La Cala is a newer residential and commercial district that 
  extends westward from Poniente beach.

### La Cala specific facts (ADD THESE — very important for buyers):
- Construction of La Cala began in 2005
- All buildings in La Cala were constructed between 2008 and 2015
- This means ALL apartments in La Cala are relatively modern 
  (10-20 years old) — no old Soviet-era style buildings
- Every residential complex in La Cala has:
  ✓ Swimming pool (communal)
  ✓ Tennis court(s)
  ✓ Modern construction standards
  ✓ Underground or designated parking in most buildings
- La Cala has excellent infrastructure:
  ✓ Supermarkets (Mercadona, Lidl, other European chains)
  ✓ Restaurants and cafes
  ✓ Pharmacies and medical centres
  ✓ Public transport connections
  ✓ Direct access to Poniente beach (5-10 min walk)
- La Cala is the area where MOST of Casa del Mar's Spain 
  properties are located — make this clear on the page

### Page redesign — make it visually stunning:

#### Hero Section:
- Full viewport height hero
- Background: layered gradient over Benidorm skyline image
  Use: https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600
- Animated text entrance (fade up, staggered 0.2s delays)
- Large serif headline: "Benidorm"
- Subtitle: "The Manhattan of the Mediterranean"
- Small eyebrow text above: "Costa Blanca · Spain"
- Three stat pills below headline:
  "320+ Sunny Days" | "2 World-Famous Beaches" | "60km from Airport"
- Scroll indicator arrow at bottom (animated bounce)

#### Quick Facts Strip:
- Full width, dark navy background
- 5 facts in a horizontal row (scrollable on mobile):
  🌞 320+ Sunny Days
  🏖️ 2 Famous Beaches  
  ✈️ 60km to Airport
  🌡️ 20°C Average
  🏙️ Resort City Since 1960s

#### About Benidorm — redesigned:
- Two column: large image left (40%), text right (60%)
- Image: Benidorm skyline or aerial view
- Add a pull quote in gold: 
  "Once a small fishing village, now one of Spain's most 
  visited cities — with the skyline to prove it."
- Text covers: history, transformation, modern city life
- Smooth reveal animation as user scrolls to this section

#### The Beaches Section — redesigned:
- Full width section with sand background color
- Two cards side by side (stack on mobile):
  
  Card — Playa de Levante:
  - Background image of Levante beach
  - Overlay gradient
  - Beach name in large serif white text
  - Key stats: 1.9km | East-facing | Most lively
  - 3 bullet points about this beach
  - "Most popular with tourists and investors"

  Card — Playa de Poniente:
  - Background image of Poniente beach  
  - Overlay gradient
  - Beach name in large serif white text
  - Key stats: 3km | West-facing | Sunsets
  - 3 bullet points about this beach
  - "Preferred by families and long-term residents"

#### La Cala Section — NEW, very prominent:
This is the most important section for Casa del Mar buyers.
Make it stand out with a special design.

- Section background: deep navy #0D1F2D
- Gold accent line at top: 3px solid #C9A84C
- Eyebrow text in gold: "Where Most Our Properties Are Located"
- Large serif headline: "La Cala District"
- Subheadline: "Benidorm's Newest & Most Modern Residential Area"

- Two column layout:
  Left (60%): information and features
  Right (40%): image of La Cala buildings/complex with pool

- Key information paragraph:
  "La Cala is Benidorm's most modern residential district, 
  located on the western side of the city next to Poniente 
  beach. Unlike older parts of Benidorm, La Cala was developed 
  entirely from scratch — construction began in 2005 and all 
  buildings were completed between 2008 and 2015. This means 
  every apartment in La Cala benefits from modern construction 
  standards, contemporary design, and excellent facilities."

- Features grid (2x2 or 2x3):
  🏊 Every Complex Has a Pool
  🎾 Tennis Courts in Every Complex
  🚗 Modern Parking Facilities
  🏗️ Built 2008–2015 (Modern Construction)
  🏖️ Walking Distance to Poniente Beach
  🛒 Full Shopping & Services Nearby

- Timeline visual:
  2005 — La Cala development begins
  2008 — First residential buildings completed
  2010 — Main commercial area opens
  2012 — La Cala fully established as premier district
  2015 — Final buildings completed — district fully developed
  Today — Most sought-after area for international buyers

- CTA button: "View La Cala Properties" → Spain page filtered

#### Districts Section — redesigned:
- Title: "Discover Benidorm's Districts"
- Grid of district cards (3 columns desktop, 1 mobile):
  Each card:
  - District name (large)
  - One-line tagline in gold italic
  - 3-4 bullet points
  - "View Properties" link

  Districts:
  1. La Cala — "Benidorm's Modern Heart"
     • Built 2008–2015, all modern
     • Pool & tennis in every complex
     • Next to Poniente beach
     • Most Casa del Mar properties here

  2. Levante — "The Lively East"
     • Longest beach (1.9km)
     • Highest tourist density
     • Best short-term rental yields
     • Most vibrant nightlife & dining

  3. Poniente — "The Peaceful West"
     • 3km of golden sand
     • Stunning sunset views
     • Preferred by families
     • More residential atmosphere

  4. Vila Park — "Established & Reliable"
     • Popular residential complex
     • Good facilities
     • Well-established community
     • Excellent value

  5. Sierra Cortina — "Hillside Prestige"
     • Elevated position with views
     • Quiet and prestigious
     • Mountain & sea panoramas
     • Premium properties

  6. Altea Hills — "Elite Living"
     • 15km north of Benidorm
     • Exclusive gated community
     • Luxury villas & penthouses
     • Most prestigious Costa Blanca address

  7. Finestrat — "New & Growing"
     • 5km from Benidorm
     • Brand new developments
     • Mountain backdrop
     • Best value for new-builds

#### Climate Section — redesigned:
- Title: "Sunshine All Year Round"
- Subtitle: "320+ sunny days per year — more than anywhere else in mainland Europe"
- Visual month cards in a horizontal row (scrollable on mobile):
  Each card shows: month name (3 letters) + temperature + sun icon
  Color coded: blue for cooler months, gold/orange for hot months
  Jan 17° | Feb 18° | Mar 20° | Apr 22° | May 25° | Jun 29°
  Jul 32° | Aug 32° | Sep 29° | Oct 25° | Nov 20° | Dec 17°
- Below cards: "Even in January, Benidorm enjoys mild 17°C temperatures 
  — perfect for year-round visits and rental income."

#### Why Invest Section — redesigned:
- Dark background with subtle pattern
- Title: "Why Investors Choose Benidorm"
- 6 cards in 3x2 grid (2x3 on tablet, 1x6 on mobile):
  Each card: large icon (emoji or SVG), title, description

  1. 📈 High Rental Yields
     "6–10% annual rental yield — among the highest in Spain. 
     Year-round tourism ensures consistent occupancy rates."

  2. ✈️ Easy International Access
     "Alicante airport is just 60km away with direct flights 
     from across Europe. Your guests can arrive easily."

  3. 🏗️ Modern Properties
     "La Cala apartments built 2008–2015 feature modern 
     finishes, pools, tennis courts and parking as standard."

  4. 🌍 International Community
     "A large established expat community means easy 
     integration, English widely spoken, familiar lifestyle."

  5. 📋 Simple Buying Process
     "Casa del Mar handles everything — NIE, legal documents, 
     bank accounts, residency. We speak your language."

  6. 🏖️ Year-Round Tourism
     "Unlike many Spanish resorts, Benidorm attracts visitors 
     12 months a year — maximizing your rental income."

#### Getting There Section:
- Clean cards with icons:
  ✈️ By Air — Alicante (ALC) 60km, 45 min
  🚗 By Car — From Alicante city 50km via AP-7
  🚌 By Bus — ALSA direct services from major Spanish cities

#### Final CTA Section:
- Full width, dark navy
- Gold decorative line above headline
- Large serif headline: "Find Your Property in Benidorm"
- Subheadline: "Browse our collection of modern La Cala apartments 
  and properties across Benidorm's finest locations"
- Two large buttons side by side:
  "Browse All Properties" → /spain
  "Get Free Consultation" → /contact
- Below buttons: contact details (phone + email) directly visible

### Animations for Benidorm page:
- Hero text: fade up with stagger
- Stats strip: count up animation when scrolled into view
- Section titles: fade in from left when scrolled to
- Cards: fade up with 0.1s stagger between each card
- La Cala timeline: items appear one by one as user scrolls
- Climate cards: slide in from bottom
- Use Intersection Observer for all scroll animations
- Keep animations subtle — 0.4s duration, ease-out

### Benidorm page SEO:
- Title: "Benidorm Property Guide — Apartments from €180,000 | Casa del Mar"
- Description: "Complete guide to buying property in Benidorm, Spain.
  La Cala modern apartments (2008–2015) with pools & tennis courts.
  Levante, Poniente, Sierra Cortina. Free consultation from Yerevan."
- Add JSON-LD for the location page

---

## FINAL STEP

After all 3 tasks are complete:
1. Run: npm run build
2. Fix any TypeScript or build errors  
3. Run: git add .
4. Run: git commit -m "Mobile perfect, loading fixed, Benidorm redesigned with La Cala info"
5. Run: git push
6. Run: vercel --prod
7. Verify live site on mobile

---

## Checklist:
- [ ] Mobile navigation hamburger menu works perfectly
- [ ] Homepage fully responsive on iPhone and Android
- [ ] Spain/Cyprus pages perfect on mobile
- [ ] Property detail swipe gestures work on mobile
- [ ] Sticky bottom bar on property detail mobile
- [ ] Admin panel fully usable on mobile
- [ ] Sections load on first visit without refresh needed
- [ ] Skeleton loading screens added
- [ ] Image loading fixed with fallbacks
- [ ] Leaflet map loads correctly without refresh
- [ ] La Cala geography CORRECTED (next to Poniente, not between beaches)
- [ ] La Cala construction dates added (2005 start, 2008-2015 buildings)
- [ ] La Cala pool and tennis court info added
- [ ] La Cala gets dedicated prominent section on Benidorm page
- [ ] Benidorm page redesigned with animations
- [ ] Climate section with month-by-month temperatures
- [ ] Districts section with all 7 areas
- [ ] Why invest section redesigned
- [ ] Final CTA section added
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
