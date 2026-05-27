# Casa del Mar — Claude Code Instructions

## What this project is
A Next.js real estate website for Casa del Mar, an international real estate agency
based in Yerevan, Armenia. The site is trilingual (English, Russian, Armenian) and
has a built-in admin panel to manage property listings with SQLite database.

Project location: C:\Users\Marat\casa-del-mar

---

## Rules — always follow these
- Run `npm run build` only ONCE at the very end, not after every change
- Never touch the SQLite database schema unless explicitly asked
- Never delete existing API routes or auth logic
- If a file has a TypeScript error, fix it before moving on
- If you are unsure about something, make the most logical choice and continue
- Do not ask for confirmation — just do the work
- When scraping is needed, use fetch() + cheerio
- Use dynamic imports for any library that needs `window` (Leaflet, etc.)
- All new UI text must be added in all 3 languages: English, Russian, Armenian

---

## Business Information
Use this data everywhere — contact page, footer, about section, metadata:

- **Business name:** Casa del Mar
- **Phone 1:** +374-44-20-30-08
- **Phone 2:** +374-11-20-30-03
- **Email:** info@casadelmar.am
- **Address:** 37 Mashtots Ave, Yerevan, Armenia
- **Facebook:** https://www.facebook.com/Casadelmar.am
- **Instagram:** https://www.instagram.com/casadelmar.am/
- **WhatsApp:** https://wa.me/37444203008
- **Website:** https://www.casadelmar.am

---

## Our Services (use exactly as written)
1. Free Consultation
2. Obtaining an NIE (Foreigner Identification Number)
3. Collection of Necessary Documents
4. Formulation of Purchase and Sale Agreements for Real Estate
5. Opening and Maintenance of Accounts in European Banks
6. After-Sales Service
7. Property Rental Services
8. Business Registration Assistance
9. Formulation of Status Cards
10. Remote Viewing of Proposed Properties

---

## About Us Text
Casa del Mar is a premier international real estate agency based in Yerevan,
Armenia. We specialize in offering a diverse range of properties — homes,
apartments, and villas — in the most sought-after locations in Europe.
Our portfolio features properties in Spain and Cyprus. Whether you are looking
for a seafront apartment in Benidorm, a villa in Altea Hills, or a home on
the Mediterranean island of Cyprus, Casa del Mar is dedicated to helping you
find your dream property with unparalleled service and expertise.
Mortgage financing is also available through Armenian banks.

---

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** node:sqlite (built into Node 22+, no compilation needed)
- **Auth:** bcryptjs + jose (JWT, httpOnly cookie, 7-day session)
- **Styling:** Tailwind CSS
- **Maps:** Leaflet.js + OpenStreetMap (free, no API key)
- **Image upload:** multer or Next.js API route, saved to /public/uploads/
- **Scraping:** fetch() + cheerio
- **Fonts:** Playfair Display + Inter + Montserrat from Google Fonts
- **Language:** TypeScript

---

## Database Schema
The SQLite database is at data/casa.db and has these tables:

### properties table
- id (integer primary key)
- name (text) — property display name
- location (text) — e.g. "La Cala, Benidorm"
- country (text) — "Spain" or "Cyprus"
- price (integer) — in euros, no decimals
- bedrooms (integer)
- bathrooms (integer)
- floor (integer)
- size (integer) — m²
- parking (boolean/integer 0 or 1)
- status (text) — "new" | "available" | "sold" | "resale" | "sale"
- ref (text) — e.g. "3282"
- images (text) — JSON array of up to 20 image URL strings
- latitude (real) — for map
- longitude (real) — for map
- description_en (text)
- description_ru (text)
- description_hy (text)
- features_en (text) — JSON array of feature strings
- features_ru (text) — JSON array
- features_hy (text) — JSON array
- created_at (datetime)
- updated_at (datetime)

### admin_users table
- id (integer primary key)
- username (text unique)
- password_hash (text)
- created_at (datetime)

---

## Design System
Apply this consistently across all pages:

### Colors
- Deep navy: #0D1F2D (primary background, navbar)
- Warm sand: #F2EBD9 (section backgrounds)
- Gold accent: #C9A84C (highlights, CTAs, borders)
- Pure white: #FFFFFF
- Dark text: #1A1A2E
- Medium text: #4A5568
- Light text: #8A9BAA

### Fonts
```
Playfair Display → all headings (h1, h2, h3)
Inter → body text, labels, nav links
Montserrat → uppercase labels, badges, buttons
```
Import in layout.tsx from Google Fonts.

### Component style rules
- Buttons: rounded-none (square corners), uppercase, letter-spacing-widest
- Gold CTA button: bg-[#C9A84C] text-[#0D1F2D] font-semibold
- Ghost button: border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D1F2D]
- Cards: no border-radius, subtle shadow, hover lifts 4px
- Section padding: py-24 px-8 (desktop), py-16 px-4 (mobile)
- Max content width: max-w-7xl mx-auto

---

## Pages & What Each Should Have

### Homepage (/)
- Full-screen hero: animated gradient background (deep navy to ocean blue),
  large serif headline, subheadline, two CTA buttons (Browse Spain / Browse Cyprus)
- Stats bar: animated counters for "2 Countries", "6+ Years Experience"
- Destinations section: 2 large cards (Spain, Cyprus) with background images and hover effect
- Featured properties: 6 newest properties in a grid, "View All" button
- Our Services: icon grid with all 10 services listed
- About Us: two-column layout, text left, image right
- Contact strip: dark background, phone + email + address + CTA button
- Footer: logo, nav links, contact info, social icons, copyright

### Spain page (/en/spain, /ru/spain, /hy/spain)
- Page banner with background image
- Sticky filter bar: bedrooms (1/2/3), status (New/Available/Sold), max price
- Property grid: cards with image, name, location, price, specs
- Each card opens the property detail page on click

### Cyprus page (/en/cyprus etc)
- Same as Spain page but filtered for Cyprus
- "Why Cyprus?" info section above the grid

### Property detail page (/en/property/[id])
- Full-width image gallery: main large image + thumbnail strip
  - Arrow navigation prev/next
  - Image counter "3 / 12"
  - Fullscreen lightbox on click
  - Keyboard navigation (arrow keys + Escape)
- Property title, location, status badge
- Specs grid: bed icon, bath icon, m² icon, floor icon, parking icon
- Description text (in current language)
- Features list with arrow bullets
- Interactive map (Leaflet) showing property location
- Sticky sidebar (desktop): price, enquire button, contact details
- Similar properties carousel at bottom
- Back button to listing page

### Contact page (/en/contact etc)
- Page banner
- Two column: left = contact info (phone, email, address, social links),
  right = enquiry form (name, email, phone, interest dropdown, message, submit)
- Embedded Google Maps iframe for 37 Mashtots Ave Yerevan (use static embed)

### Admin panel (/admin)
- Protected by JWT auth
- /admin/setup — first run only, create admin account
- /admin/login — login form
- /admin/dashboard — stats cards + properties table with edit/delete
- /admin/properties/new — add property form
- /admin/properties/[id]/edit — edit property form

### Admin property form tabs:
1. **Basic** — name, location, country (Spain/Cyprus), price, status, ref number
2. **Details** — bedrooms, bathrooms, floor, size, parking checkbox, latitude, longitude
3. **Description** — three textareas: EN, RU, HY descriptions + features (one per line)
4. **Images** — 20 upload slots in a grid, drag to reorder, click to upload, X to remove

---

## Image handling
- Upload endpoint: POST /api/admin/upload
- Save to: /public/uploads/{uuid}.{ext}
- Return the public URL: /uploads/{uuid}.{ext}
- Store all image URLs as JSON array in the images column
- In the frontend, use Next.js <Image> component with loading="lazy"
- Supported formats: jpg, jpeg, png, webp
- Max file size: 10MB per image

---

## Map implementation
- Install: npm install leaflet @types/leaflet
- Always use dynamic import: const Map = dynamic(() => import('@/components/Map'), { ssr: false })
- Use OpenStreetMap tiles: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
- Default zoom level: 15
- Show marker at property coordinates
- Marker popup: property name + formatted price
- In admin form: show small map preview, update marker as lat/lng inputs change
- "Pick on map" button: opens modal map, click anywhere to set coordinates

---

## Multilingual setup
- Supported locales: en, ru, hy
- Default: en
- URL structure: /en/... /ru/... /hy/...
- Auto-detect browser language on first visit, redirect accordingly
- Save preference to localStorage key: "cdm_lang"
- Language switcher in navbar

### Translation keys needed for new features:
- gallery.counter → "3 of 12" / "3 из 12" / "3-ը 12-ից"
- gallery.fullscreen → "View fullscreen" / "Полный экран" / "Լրիվ էկրան"
- map.title → "Location" / "Расположение" / "Գտնվելու վայրը"
- map.pickup → "Pick on map" / "Выбрать на карте" / "Ընտրել քարտեզում"
- property.similar → "Similar Properties" / "Похожие объекты" / "Նմանատիպ գույք"
- property.share → "Share" / "Поделиться" / "Կիսվել"
- property.enquire → "Enquire Now" / "Оставить заявку" / "Հայտ ուղարկել"
- filter.all → "All" / "Все" / "Բոլորը"
- filter.beds → "Bedrooms" / "Спальни" / "Ննջ. սենյ."
- filter.maxprice → "Max Price" / "Макс. цена" / "Գին"
- admin.images → "Property Images" / "Фотографии" / "Նկարներ"
- admin.map → "Map Location" / "Местоположение" / "Քարտեզ"

---

## SEO
Add to every page:
- <title> tag with property name or page name + "| Casa del Mar"
- <meta name="description"> — unique per page
- <meta property="og:image"> — use first property image or logo
- JSON-LD structured data on property detail pages

---

## What to do when you start a session
1. Read this file completely
2. Check which tasks are already done by reading the existing code
3. Continue from where the previous session left off
4. Run `npm run build` only once at the very end
5. If build passes with zero errors, you are done

---

## Current status (update this section after each session)
- [ ] Business info updated across all pages
- [ ] Services section updated
- [ ] About us text updated
- [ ] Design overhaul — homepage
- [ ] Design overhaul — Spain/Cyprus listing pages
- [ ] Design overhaul — property detail page
- [ ] Design overhaul — contact page
- [ ] Design overhaul — admin panel
- [ ] Image gallery upgraded to 20 photos
- [ ] Map added to property detail page
- [ ] Map picker added to admin form
- [ ] Multilingual translations complete
- [ ] SEO meta tags added
- [ ] npm run build passes with zero errors

---

## Internal Admin Notes (admin-only, never public)

Add an `internal_notes` text column to the properties database table.

### What to build:
- Add a 5th tab to the admin property form called "Internal Notes"
- Show a large textarea for private admin notes about the property
- Example notes: "Owner contact: +34 612 xxx", "Key held at office",
  "Price negotiable", "Client interested", "Needs renovation check"
- This field must NEVER appear on the public website — admin only
- In the admin dashboard table, show a 📋 icon if a property has notes
- Clicking the icon shows the notes in a tooltip or small modal
- Style the Notes tab background light yellow (#FFFBEB) to make it
  visually clear it is private
- Show a bold red banner at top: "INTERNAL USE ONLY — Not visible to visitors"

### Database change:
Add to properties table: internal_notes (text, nullable)

---

## Benidorm Info Page & Section

Add a dedicated informational section about Benidorm to the Spain page
and create a separate /en/benidorm info page.

### Benidorm facts to include:
- Location: Costa Blanca, Alicante province, southeast Spain
- Population: ~70,000 permanent residents, millions of tourists per year
- Climate: 320+ sunny days per year, average 20°C, warm Mediterranean climate
- Beaches: Playa de Levante and Playa de Poniente — two long sandy beaches
  separated by the old town headland
- La Cala: the area between the two beaches, heart of Benidorm,
  most popular area for apartment purchases
- Infrastructure: excellent — supermarkets, hospitals, international schools,
  public transport, airport 60km away (Alicante airport)
- Why buy in Benidorm:
  1. One of Spain's most visited cities — guaranteed rental demand
  2. High rental yields — 6-10% annually for short-term rentals
  3. Year-round tourism — not just summer
  4. Modern high-rise apartments with sea views at accessible prices
  5. Large international and expat community
  6. Direct flights from Yerevan via multiple airlines
  7. Strong property value growth over last 10 years
- Areas we sell in: La Cala, Levante, Poniente, Vila Park, Sierra Cortina,
  Altea Hills, Finestrat

### What to build:
1. On the Spain listing page — add a collapsible "About Benidorm" section
   above the property grid with key facts and a photo
2. Create a new page /en/benidorm (and /ru/benidorm, /hy/benidorm) with:
   - Hero banner with Benidorm skyline image
   - Full info about Benidorm (all facts above)
   - "Why invest in Benidorm" section with 6 icon cards
   - Map showing Benidorm location in Spain
   - CTA section: "Browse our Benidorm properties" button linking to Spain page
3. Add "Benidorm Guide" link to the Spain page navigation

### Translations needed:
- benidorm.title → "About Benidorm" / "О Бенидорме" / "Բենիդորմի մասին"
- benidorm.subtitle → "Costa Blanca's Premier Resort City" / 
  "Лучший курортный город Коста Бланки" / "Կոստա Բlankayi լավագույն հանգստավայրը"
- benidorm.why → "Why Buy in Benidorm?" / "Почему Бенидорм?" / "Ինչու Բenidorm?"
- benidorm.climate → "320+ sunny days" / "320+ солнечных дней" / "320+ արevayin or"
- benidorm.rental → "6-10% rental yield" / "Доходность 6-10%" / "6-10% vacharak"
- benidorm.cta → "View Benidorm Properties" / "Смотреть объекты" / "Տesnel guytqery"

---

## Updated Checklist
- [ ] Business info updated across all pages
- [ ] Services section updated
- [x] About us text updated (EN/RU/HY — mentions Benidorm, Altea Hills, mortgage financing)
- [x] Design overhaul — homepage (hero, destinations section, contact strip, stats)
- [x] Design overhaul — Spain/Cyprus listing pages (filters: beds + max price)
- [ ] Design overhaul — property detail page
- [ ] Design overhaul — contact page
- [ ] Design overhaul — admin panel
- [ ] Image gallery upgraded to 20 photos
- [ ] Map added to property detail page
- [ ] Map picker added to admin form
- [x] Internal notes field added (admin only, never public)
- [x] Benidorm info section added to Spain page (collapsible BenidormSection)
- [x] Benidorm dedicated page created (/en/ru/hy benidorm)
- [x] Multilingual translations complete (EN/RU/HY for all new features)
- [ ] SEO meta tags added
- [x] npm run build passes with zero errors
