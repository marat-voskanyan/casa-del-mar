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
- Maps: Leaflet.js + OpenStreetMap/CartoDB tiles
- AI descriptions: Groq (llama-3.1-8b-instant)
- Translations: DeepL (EN→RU), Groq (EN→AM)
- Image upload: @vercel/blob
- Animations: framer-motion, gsap
- Styling: Tailwind CSS

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
- Contact form section
- OfficeSection component
- OfficeMap component

### app/[locale]/properties/[id]/page.tsx
Property detail page. Uses REF code in URL (not ID).
Has: PropertyGallery, PropertyMap, SimilarProperties.

### app/admin/page.tsx
Admin dashboard. Properties table with search by REF.
Shows thumbnail, REF, name, price, status, actions.
Card layout on mobile.

### app/admin/properties/new/page.tsx
New property form. Uses PropertyForm component.

### app/admin/properties/[id]/edit/page.tsx
Edit property form. Uses PropertyForm component.

---

## Components — What Each Does

### components/layout/Header.tsx
Navigation bar. Logo (white version in admin).
Desktop: full nav links + language switcher (EN/RU/AM).
Mobile: hamburger → full screen overlay menu.
Language buttons labeled: EN | RU | AM (not HY).

### components/layout/Footer.tsx
Footer. Logo, quick links, contact info, social icons.
Social: Facebook, Instagram, WhatsApp.

### components/layout/RevealObserver.tsx
Scroll reveal animations. Watches .reveal elements.
Re-runs on route change via usePathname.

### components/home/Hero.tsx
Full-screen hero. Background: view-from-apartment.jpg.
Animated text. Two CTA buttons. Stats bar (2x2 on mobile).

### components/home/Destinations.tsx
4 destination cards: Spain/Benidorm, Cyprus, Altea Hills, Finestrat.

### components/home/FeaturedProperties.tsx
Shows 6 newest properties from DB dynamically.

### components/home/AboutServices.tsx
Services grid (6 services) + About Us strip.

### components/home/ContactStrip.tsx
Dark strip with phone, email, CTA button.

### components/properties/PropertyCard.tsx
Property card used on listing pages and homepage.
Shows: image, status badge, REF badge (gold), name,
location, specs, price. Full card is clickable.
Custom gold arrow cursor on photo hover.

### components/properties/PropertyGallery.tsx
Image gallery on property detail page.
Main image + thumbnail strip. Opens PhotoLightbox.

### components/properties/PhotoLightbox.tsx
Full-screen lightbox. True fullscreen (100vw/100dvh).
Navigation: gold arrows, keyboard, swipe on mobile.
Image counter. Thumbnail strip at bottom.
Custom gold arrow cursor.

### components/properties/PropertyMap.tsx
Map on property detail page. CartoDB Positron tiles.
Custom property name marker. Ctrl+scroll to zoom.
Shows "Hold Ctrl to zoom" tooltip without Ctrl.
No POI markers. Single property marker only.

### components/properties/SimilarProperties.tsx
Shows 3 similar properties. Logic: same area +
similar price (±25%) → same area → same country.
Uses extractArea() helper in lib/db.ts.

### components/properties/PropertiesGrid.tsx
Grid of property cards with filters.

### components/spain/BenidormSection.tsx
Collapsible "About Benidorm" section on Spain page.
Luxury dark panel with gold border, animated expand.

### components/BenidormMap.tsx
Luxury map on Benidorm page. Dark/light CartoDB tiles.
NO markers (removed). Zoom from 10→14 on scroll.
Dynamic import (ssr:false).

### components/OfficeMap.tsx
Map on Contact page showing office location.
Coordinates: 40.186472, 44.512972 (Yerevan office).
Zoom from 12→16 on scroll. Gold Casa del Mar marker.
CartoDB Positron tiles. Dynamic import (ssr:false).

### components/contact/OfficeSection.tsx
Office section on Contact page. Has photos:
- /images/outdoor-new.png
- /images/inside-new.png
Text: paragraph in EN/RU/AM (exact, never modify).
Address links to Google Maps.
Hours: Mon-Fri 11:00-18:00.

### components/contact/ContactForm.tsx
Contact enquiry form. Fields: name, email, phone,
interest, budget, message.

### components/WhatsAppButton.tsx
Floating WhatsApp button. Shows on property and 
listing pages. Slide-in animation. Pulse effect.
Pre-filled message in current locale language.

### components/admin/PropertyForm.tsx
Large admin form with 5 tabs:
1. Basic - name, location, country, price, status, ref
2. Details - beds, baths, floor, size, parking, lat/lng
3. Description - EN/RU/AM textareas + AI generator
4. Images - 30 upload slots, drag to reorder
5. Notes - internal only (amber bg, red warning banner)

AI generator uses Groq+DeepL+Groq pipeline:
Step 1: Groq writes English
Step 2: DeepL translates to Russian
Step 3: Groq translates to Armenian (Unicode only)

Feature selectors before generating:
View, Distance to Sea, Facilities, Condition,
Floor Type, Special Features, Investment.

Writing styles: Casa del Mar (default), Luxury,
Investment, Family, Short, Detailed.

Map defaults to Benidorm (38.5401, -0.1228).
Quick presets: La Cala, Levante, Poniente, etc.

### components/admin/MapPicker.tsx
Map picker modal in admin form. Defaults to Benidorm.
Click on map to set coordinates.

### components/admin/AdminNav.tsx
Admin sidebar navigation.

---

## Lib Files

### lib/db.ts
All database functions using Turso (@libsql/client).
Key functions:
- getProperties(filters) - get all/filtered properties
- getPropertyById(id)
- getPropertyByRef(ref) - used for public URLs
- getSimilarProperties(property) - location+price logic
- extractArea(location) - detects 16 known areas
- createProperty, updateProperty, deleteProperty

### lib/i18n.ts
ALL translations for EN, RU, HY.
Structure: export const i18n = { en: {...}, ru: {...}, hy: {...} }
Armenian MUST use Unicode only (U+0531-U+058A).
Exception: brand names (NIE, Casa del Mar, WhatsApp etc).

### lib/images.ts
Central image constants. All image paths defined here.
Update this file when swapping images.
Key slots: hero, banners, sections, cards, fallback.

### lib/auth.ts
JWT auth functions. verifyToken, createToken.
Cookie name: check this file for exact name used.

### lib/years.ts
Auto-calculating years experience.
Founded: September 10, 2019.
getYearsDisplay() returns "6+" (auto-increments each Sept 10).

---

## Database Schema (Turso)

### properties table:
id, name, name_ru, name_hy,
location, country (Spain/Cyprus),
price (float), bedrooms, bathrooms, floor, size,
parking (0/1), status (new/available/sold/resale/sale),
ref (text, used in URLs),
images (JSON array of URLs, up to 30),
latitude, longitude,
description_en, description_ru, description_hy,
features_en, features_ru, features_hy (JSON arrays),
internal_notes (admin only, never shown public),
created_at, updated_at

### admin_users table:
id, username, password_hash, created_at

---

## API Routes

### Public:
GET  /api/properties         - get all properties (no-store cache)
GET  /api/properties/[id]    - get one property by ID

### Admin (JWT required):
POST   /api/admin/generate-description  - AI description (Groq+DeepL)
POST   /api/admin/translate-name        - translate name (DeepL+Groq)
POST   /api/upload                      - upload image to Vercel Blob

### Auth:
POST /api/auth/login         - login, sets JWT cookie
POST /api/auth/logout        - clears cookie
POST /api/setup              - first-run admin setup

### Other:
POST /api/contact            - contact form submission

---

## Environment Variables (Vercel + .env.local)
JWT_SECRET          - JWT signing secret
TURSO_DATABASE_URL  - Turso database URL
TURSO_AUTH_TOKEN    - Turso auth token
BLOB_READ_WRITE_TOKEN - Vercel Blob token
GROQ_API_KEY        - Groq AI (free, llama-3.1-8b-instant)
DEEPL_API_KEY       - DeepL translation (free, 500k chars/mo)
ANTHROPIC_API_KEY   - Claude API (if used as fallback)

---

## Images in public/images/
benidorm.jpg                benidorm-aerial-1.jpg
benidorm-lacala-1.jpg       benidorm-levante-1.jpg
benidorm-levante-2.jpg      benidorm-poniente-1.jpg
benidorm-poniente-2.jpg     benidorm-skyline-1.jpg
la-cala.jpg                 la-cala-beach.jpg
poniente-beach.jpg          poniente-beach-palmas.jpg
tallest-building.jpg        view-from-apartment.jpg
outdoor-new.png             inside-new.png
spain-main.jpg              la-cala-drone.jpg
benidorm-main.jpg           logo.png
favicon.png

---

## Business Info (use everywhere)
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

## Important Rules (always follow)
1. export const dynamic = 'force-dynamic' on all data pages
2. export const revalidate = 0 on all data pages
3. revalidatePath() after all admin DB changes
4. Armenian text: ZERO Latin letters (except brand names)
5. Armenian font: Noto Serif/Sans Armenian via :lang(hy)
6. Property URLs use REF code: /property/3282 not /property/1
7. All images: Next.js <Image> component with sizes prop
8. Maps: dynamic import with ssr:false
9. Run npm run build only ONCE at end of all changes
10. After build: git add . && git commit && git push && vercel --prod
11. Do NOT modify paragraph texts in i18n.ts (EN, RU, AM)
12. Mobile version: always test at 375px width
13. Admin internal_notes: NEVER show on public website
14. Deleted properties: must not appear in Similar Properties

---

## Stats Bar (homepage)
1. "2" — Countries / Страны / Երկիր
2. getYearsDisplay()+ — Years Experience (auto from lib/years.ts)
3. "200+" — Properties / Объектов / Անшarж гuyтк (Claude: write AM)
4. "Free" — Consultation / Консультация (Claude: write AM)

---

## DO NOT TOUCH
- lib/i18n.ts paragraph texts (EN, RU, AM office paragraphs)
- Mobile CSS (below 768px) unless specifically asked
- Admin auth routes
- Turso database credentials
