# Casa del Mar — Project Summary
# READ THIS FILE FIRST before reading any other file.
# This tells you exactly what is where so you never
# need to scan the whole project.

---

## Project Overview
Next.js 14 multilingual real estate website.
Live URL: https://casa-del-mar.vercel.app
GitHub: https://github.com/marat-voskanyan/casa-del-mar
Local: C:\Users\Marat\casa-del-mar

Languages: English (en), Russian (ru), Armenian (hy)
URL structure: /en/... /ru/... /hy/...
Database: Turso (cloud SQLite)
Images: Vercel Blob storage
Deployment: Vercel (free tier)

---

## Tech Stack
- Framework: Next.js 14 (App Router)
- Database: Turso via @libsql/client
- Auth: bcryptjs + jose (JWT, httpOnly cookie)
- Maps: Leaflet.js + CartoDB/OpenStreetMap tiles
- AI descriptions: Groq (llama-3.1-8b-instant)
- Translations: DeepL (EN→RU), Groq (EN→AM)
- Image upload: @vercel/blob
- Animations: framer-motion, gsap
- Styling: Tailwind CSS
- Icons: custom SVG from components/icons/LuxuryIcons.tsx

---

## Design System
Colors:
  Deep navy:  #0D1F2D (primary bg, navbar)
  Warm sand:  #F2EBD9 (section bg)
  Gold:       #C9A84C (accents, CTAs)
  White:      #FFFFFF
  Dark text:  #1A1A2E

Fonts:
  Playfair Display → headings
  Montserrat → labels, buttons, uppercase
  Inter → body text
  Noto Serif Armenian → Armenian headings
  Noto Sans Armenian → Armenian body

Icons: NO emojis anywhere on public site.
Use components/icons/LuxuryIcons.tsx SVG icons.
All icons: stroke-width 1.5, currentColor.

---

## Key Files — What Each Does

### app/layout.tsx
Root layout. Google Fonts import (includes Armenian fonts).
Metadata. DO NOT add lang attribute here.

### app/[locale]/layout.tsx
Locale layout. Sets <html lang={locale}>.
Has: export const dynamic = 'force-dynamic'
Has: export const revalidate = 0

### app/[locale]/page.tsx
Homepage. Imports: Hero, Destinations, FeaturedProperties,
AboutServices, ContactStrip components.

### app/[locale]/spain/page.tsx
Spain listings page. Fetches properties from DB.
Has force-dynamic. Uses PropertiesGrid component.
Has BenidormSection collapsible popup.
Filter bar: pill buttons (ALL/AVAILABLE/RESERVED/SOLD
+ bedroom pills + sort dropdown).
All filter pills must have white bg when unselected.

### app/[locale]/cyprus/page.tsx
Cyprus listings page. Same structure as Spain.

### app/[locale]/benidorm/page.tsx
Full Benidorm info page. Large file with many sections:
hero, facts strip, about, beaches, La Cala, climate,
districts, why invest, getting there, CTA.
Has BenidormMap component (dynamic import, ssr:false).

### app/[locale]/contact/page.tsx
Contact page. Has:
- Banner
- Contact form section (ContactForm component)
- OfficeSection component
- OfficeMap component

### app/[locale]/properties/[ref]/page.tsx
Property detail page. Uses REF code in URL (not ID).
Has: PropertyGallery, PropertyMap, SimilarProperties.
URL format: /en/properties/3282 (REF not database ID)

### app/admin/page.tsx
Admin dashboard. Properties table with search by REF/name.
Shows thumbnail (56x56px), REF (gold), name, price, status.
Card layout on mobile. Tap card → opens edit page.

### app/admin/properties/new/page.tsx
New property form. Uses PropertyForm component.

### app/admin/properties/[id]/edit/page.tsx
Edit property form. Uses PropertyForm component.

---

## Components — What Each Does

### components/icons/LuxuryIcons.tsx
ALL SVG icons used throughout the site.
Replaces all emojis. Icons: LocationIcon, ClockIcon,
PhoneIcon, EmailIcon, BuildingIcon, BedIcon, BathIcon,
MaximizeIcon, ParkingIcon, FloorIcon, AreaIcon, CheckIcon,
GlobeIcon, LockIcon, WarningIcon, SunIcon, PlaneIcon,
WavesIcon, ThermometerIcon, CityIcon, PoolIcon, StarIcon,
ArrowRightIcon, ClipboardIcon, TrendIcon, PersonIcon, KeyIcon.

### components/layout/Header.tsx
Navigation bar. Logo white version (brightness-0 invert).
Desktop: full nav links + language switcher (EN/RU/AM).
Note: Armenian shows as "AM" not "HY".
Mobile: hamburger → full screen overlay menu.
Contact info + social links at bottom of mobile menu.

### components/layout/Footer.tsx
Footer. Logo, quick links, contact info, social icons.
Social order: Facebook → Instagram → WhatsApp.
Instagram: https://www.instagram.com/casadelmar_armenia/

### components/layout/RevealObserver.tsx
Scroll reveal animations. Watches .reveal elements.
Re-runs on route change via usePathname.

### components/layout/SetDocumentLang.tsx
Sets document language for Armenian font rendering.

### components/home/Hero.tsx
Full-screen hero. Background: /images/view-from-apartment.jpg
Animated text entrance. Two CTA buttons (stacked on mobile).
Stats bar: 2x2 grid on mobile.

### components/home/Destinations.tsx
4 destination cards:
- Spain: /images/Spain-section-new.jpg (updated)
- Cyprus: /images/Cyprus-Main.jpg (updated)
- Altea Hills: benidorm-poniente-2.jpg
- Finestrat: benidorm-main.jpg
All cards link to respective pages.

### components/home/FeaturedProperties.tsx
Shows 6 newest properties from DB dynamically.
Always force-dynamic — never cached.

### components/home/AboutServices.tsx
Services grid (6 services) + About Us two-column strip.

### components/home/ContactStrip.tsx
Dark strip with phone, email, CTA button.

### components/properties/PropertyCard.tsx
Property card used on listing pages and homepage.
Shows: image, status badge (top-left), REF badge (gold, top-right),
name (Playfair serif), location (gold color), specs icons,
price (Playfair large). Full card clickable → property detail.
Custom gold arrow cursor (CSS data URL) on photo hover.

### components/properties/PropertyGallery.tsx
Image gallery on property detail page.
Main image + thumbnail strip. Opens PhotoLightbox on click.

### components/properties/PhotoLightbox.tsx
True fullscreen lightbox (100vw, 100dvh via createPortal).
Navigation: gold arrow buttons, keyboard arrows, swipe mobile.
Image counter top center. Thumbnail strip bottom.
Gold arrow CSS cursor on images.
Body scroll locked when open.

### components/properties/PropertyMap.tsx
Map on property detail page. CartoDB Positron (light) tiles.
Custom property name label marker (navy box, gold border).
Ctrl+scroll to zoom — shows tooltip without Ctrl.
NO nearby POI markers. Single property marker only.
Disable scroll wheel without Ctrl key.

### components/properties/SimilarProperties.tsx
Shows 3 similar properties below property detail.
Logic priority:
1. Same area + price ±25%
2. Same area any price
3. Same country + price ±25%
4. Same country fallback
Subtitle: "Same area · Similar price range"
Never shows sold or deleted properties.

### components/properties/PropertiesGrid.tsx
Grid of property cards with filters.

### components/properties/DescriptionCollapse.tsx
Collapsible description on mobile property detail.

### components/spain/BenidormSection.tsx
Collapsible "About Benidorm" popup on Spain page.
Luxury dark navy panel, gold border, animated expand.
Content: eyebrow, title, description, 4 fact stats.
Armenian text MUST be proper Unicode — no Latin.

### components/BenidormMap.tsx
Map on Benidorm page. CartoDB Positron (light) tiles.
NO markers. Zoom animation: 10→14 on scroll into view.
Dynamic import (ssr:false).

### components/OfficeMap.tsx
Map on Contact page. Office location Yerevan.
Coordinates: 40.186472, 44.512972
CartoDB Positron tiles. Gold "Casa del Mar" label marker.
Zoom animation: 12→16 on scroll. Custom gold zoom buttons.
Dynamic import (ssr:false).

### components/contact/OfficeSection.tsx
Office section on Contact page (desktop redesigned).
Photos: /images/outdoor-new.png and /images/inside-new.png
Desktop: luxury editorial layout (sand background).
Mobile: unchanged from original design.
Text paragraphs: NEVER modify (exact EN/RU/AM from i18n).
Address links to Google Maps (40.186472, 44.512972).
Hours: Mon-Fri 11:00-18:00.
NO animation — static design only.

### components/contact/ContactForm.tsx
Contact enquiry form. Fields: name, email, phone,
interest, budget, message. Submit shows success message.

### components/WhatsAppButton.tsx
Floating WhatsApp button. Shows on property detail
and Spain/Cyprus listing pages only.
Slide-in from right after 1.5s. Gold pulse animation.
Tooltip on hover. Pre-filled message in current locale.
WhatsApp: https://wa.me/37444203008

### components/admin/PropertyForm.tsx
Large admin form — 5 tabs:
1. Basic: name, name_ru, name_hy, location, country, price, status, ref
   Has "Translate" button → calls /api/admin/translate-name
2. Details: beds, baths, floor, size, parking, lat/lng
   Map defaults to Benidorm (38.5401, -0.1228)
   Quick presets: La Cala, Levante, Poniente, Sierra Cortina,
   Altea Hills, Finestrat, Larnaca CY, Paphos CY
3. Description: EN/RU/AM textareas + AI generator
   Feature selectors: View, Distance to Sea, Facilities,
   Condition, Floor Type, Special Features, Investment
   Writing styles: Casa del Mar (default), Luxury,
   Investment, Family, Short, Detailed
   AI pipeline: Groq(EN) → DeepL(RU) → Groq(AM)
4. Images: 30 upload slots, drag to reorder, AVIF supported
5. Notes: internal only, amber bg, red warning banner,
   quick templates, character counter, NEVER shown publicly

### components/admin/MapPicker.tsx
Map picker in admin. Defaults to Benidorm.
Click anywhere to set coordinates.

### components/admin/AdminNav.tsx
Admin sidebar navigation. Logo: white version.

---

## Lib Files

### lib/db.ts
All Turso database functions.
Key: getPropertyByRef(ref) — used for public URLs
Key: getSimilarProperties(property) — location+price logic
Key: extractArea(location) — detects 16 known areas:
  La Cala, Levante, Poniente, Vila Park, Sierra Cortina,
  Altea Hills, Finestrat, Larnaca, Paphos, Limassol,
  Nicosia, Oroklini, Geroskipou, Livadia, Faneromeni,
  Aphrodite Hills
All listing API routes call revalidatePath after DB changes.

### lib/i18n.ts
ALL translations. Structure: { en:{}, ru:{}, hy:{} }
Armenian: ZERO Latin letters (except NIE, Casa del Mar,
WhatsApp, Facebook, Instagram, GPS coords).
DO NOT modify office paragraph texts (EN, RU, AM).
Armenian font handled via :lang(hy) CSS in globals.css.

### lib/images.ts
Central image path constants. ALWAYS update this file
when swapping images — do not hardcode paths in components.
Current key images:
- hero: view-from-apartment.jpg
- spain banner: Spain-section-new.jpg
- cyprus destination: Cyprus-Main.jpg
- about benidorm: tallest-building.jpg
- la cala section: la-cala-drone.jpg
- benidorm aerial: benidorm-aerial-1.jpg
- office outdoor: outdoor-new.png
- office inside: inside-new.png

### lib/auth.ts
JWT functions. Check this for exact cookie name.

### lib/years.ts
Founded: September 10, 2019.
getYearsDisplay() → "6+" auto-increments each Sept 10.
Used in homepage stats bar.

---

## Database Schema (Turso)

### properties table:
id, name, name_ru, name_hy,
location, country (Spain/Cyprus),
price (float — accepts any number including decimals),
bedrooms, bathrooms, floor, size,
parking (0/1),
status (new/available/sold/resale/sale),
ref (text — used in public URLs),
images (JSON array, up to 30 URLs),
latitude, longitude,
description_en, description_ru, description_hy,
features_en, features_ru, features_hy (JSON arrays),
internal_notes (admin only — NEVER shown publicly),
created_at, updated_at

### admin_users table:
id, username, password_hash, created_at

---

## API Routes

### Public (no auth):
GET  /api/properties          → all properties, no-store cache
GET  /api/properties/[id]     → one property by ID

### Admin (JWT cookie required):
POST /api/admin/generate-description → AI descriptions
POST /api/admin/translate-name       → translate name
POST /api/upload                     → image to Vercel Blob

### Auth:
POST /api/auth/login    → sets JWT httpOnly cookie
POST /api/auth/logout   → clears cookie
POST /api/setup         → first-run setup only

### Other:
POST /api/contact       → contact form email

---

## Environment Variables
JWT_SECRET            - JWT signing secret
TURSO_DATABASE_URL    - Turso DB URL
TURSO_AUTH_TOKEN      - Turso auth token
BLOB_READ_WRITE_TOKEN - Vercel Blob token
GROQ_API_KEY          - Groq AI (free)
DEEPL_API_KEY         - DeepL (free, 500k chars/mo)
ANTHROPIC_API_KEY     - Claude API (fallback)

---

## Images in public/images/
benidorm.jpg               benidorm-aerial-1.jpg
benidorm-lacala-1.jpg      benidorm-levante-1.jpg
benidorm-levante-2.jpg     benidorm-poniente-1.jpg
benidorm-poniente-2.jpg    benidorm-skyline-1.jpg
la-cala.jpg                la-cala-beach.jpg
la-cala-drone.jpg          poniente-beach.jpg
poniente-beach-palmas.jpg  tallest-building.jpg
view-from-apartment.jpg    outdoor-new.png
inside-new.png             spain-main.jpg
Spain-section-new.jpg      Spain-section-new.jpg
Cyprus-Main.jpg            benidorm-main.jpg
logo.png                   favicon.png
Outdoor.jpeg               Inside.jpeg

---

## Business Info
Name: Casa del Mar
Phone 1: +374-44-20-30-08
Phone 2: +374-11-20-30-03
Email: info@casadelmar.am
Address: 37 Mashtots Ave, Yerevan, Armenia
Office coords: 40.186472, 44.512972
Facebook: https://www.facebook.com/Casadelmar.am
Instagram: https://www.instagram.com/casadelmar_armenia/
WhatsApp: https://wa.me/37444203008
Working hours: Mon-Fri 11:00-18:00
Founded: September 10, 2019

---

## Stats Bar (homepage — 4 stats)
1. "2"              → Countries / Страны / Երկիր
2. getYearsDisplay() → Years Exp / Лет опыта / (AM: Claude write)
3. "200+"           → Properties / Объектов / (AM: Claude write)
4. "Free"           → Consultation / Консультация / (AM: Claude write)
All hardcoded except years (dynamic from lib/years.ts).

---

## Important Rules (ALWAYS follow)
1.  export const dynamic = 'force-dynamic' on all data pages
2.  export const revalidate = 0 on all data pages
3.  revalidatePath() after ALL admin DB changes (Spain+Cyprus+homepage)
4.  Armenian: ZERO Latin letters except brand names
5.  Armenian font: :lang(hy) in globals.css → Noto fonts
6.  Property URLs: /properties/3282 (REF) not /properties/1 (ID)
7.  Images: Next.js <Image> with sizes prop, loading="lazy" below fold
8.  Maps: dynamic import with ssr:false always
9.  Run npm run build ONCE at end of all changes
10. Deploy: git add . && git commit && git push && vercel --prod
11. NEVER modify paragraph texts in i18n.ts
12. Mobile (below 768px): never change unless asked
13. Admin internal_notes: NEVER show on public website
14. Deleted/sold properties: exclude from Similar Properties
15. No emojis on public site — use components/icons/LuxuryIcons.tsx
16. Filter pills: all unselected pills must have white background
17. Price field: accepts any float number (not just integers)
18. Photo limit: 30 per property
19. Supported image formats: JPG, PNG, WebP, AVIF

---

## DO NOT TOUCH
- lib/i18n.ts office paragraph texts (EN, RU, AM)
- Mobile CSS (below 768px) unless specifically asked
- Admin auth routes and JWT logic
- Turso database credentials
- lib/years.ts founding date
