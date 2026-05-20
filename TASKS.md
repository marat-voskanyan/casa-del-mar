# Casa del Mar — New Tasks

Read CLAUDE.md first for full project context.
Complete ALL tasks below automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — Mobile-Friendly Admin Login

The admin panel at /admin/login currently only works well on desktop.
Make it fully accessible and usable on mobile phones.

### What to do:
- Make the login form responsive — full width on mobile, centered card on desktop
- Input fields: minimum height 48px (easy to tap on phone)
- Buttons: full width on mobile, minimum height 48px
- Font size minimum 16px on all inputs (prevents iOS zoom on focus)
- Add viewport meta tag if missing
- The form should look clean and professional on a 375px wide screen (iPhone)
- Test layout at 375px, 768px, and 1280px widths

### Admin dashboard mobile:
- Sidebar navigation collapses to a hamburger menu on mobile
- Property table scrolls horizontally on small screens
- Action buttons (edit/delete) remain tappable on mobile
- Stats cards stack vertically on mobile (1 column)
- Add/Edit property form is fully usable on mobile:
  - Tabs scroll horizontally if needed
  - All inputs minimum 48px height
  - Image upload slots resize for mobile
  - Map picker works on touch screens

---

## TASK 2 — Full Website Mobile Responsiveness

Make every single page of the public website perfect on mobile.
Target screen sizes: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad)

### Homepage:
- Hero section: headline font scales down gracefully, 
  CTA buttons stack vertically on mobile
- Stats bar: 2 columns on mobile instead of 4
- Destination cards: single column stack on mobile
- Featured properties grid: single column on mobile, 2 on tablet
- Services grid: single column on mobile, 2 on tablet
- About section: image above text on mobile (not side by side)
- Contact strip: stack vertically on mobile
- Footer: stack all columns vertically on mobile

### Navigation:
- Desktop: full horizontal nav bar
- Mobile: hamburger menu (☰) that opens a full-screen slide-in menu
- Menu items large and easy to tap (min 48px height each)
- Language switcher visible in mobile menu
- Close button (✕) to dismiss menu
- Menu closes when a link is tapped

### Spain / Cyprus listing pages:
- Filter bar: scrolls horizontally on mobile (pill buttons don't wrap)
- Property cards: single column on mobile, 2 on tablet, 3 on desktop
- Cards show all key info without truncation

### Property detail page:
- Image gallery: full width, swipe left/right on mobile (touch gestures)
- Specs grid: 2 columns on mobile
- Sidebar becomes a bottom sticky bar on mobile showing price + enquire button
- Map: full width, reduced height on mobile (250px)
- Similar properties: horizontal scroll on mobile

### Contact page:
- Two columns become single column on mobile
- Form inputs full width
- Map iframe full width on mobile

### All pages:
- No horizontal scroll at any point
- Text readable without zooming (min 14px body, min 18px on mobile)
- Touch targets minimum 48x48px
- Images use object-fit: cover and never overflow
- Padding: px-4 on mobile, px-8 on tablet, px-16 on desktop

---

## TASK 3 — Remove All Reviews and Testimonials

Remove every trace of reviews and testimonials from the website.

### What to delete:
- The entire testimonials/reviews section from the homepage
- Any star ratings shown anywhere
- Any placeholder review cards or testimonial components
- The testimonials component file itself
- Any review-related translation keys from i18n files
- Any review-related database fields if they exist
- Any API routes related to reviews

### Make sure:
- Removing the section does not leave empty whitespace gaps
- The page flow still looks natural after removal
- No broken imports remain after deleting component files

---

## TASK 4 — Benidorm Dedicated Info Page

Create a rich, informative standalone page about Benidorm at:
/en/benidorm, /ru/benidorm, /hy/benidorm

### Scrape and use real information from these sources:
- https://en.wikipedia.org/wiki/Benidorm
- https://www.visitbenidorm.es
- Extract: history, geography, climate, beaches, districts, 
  population, tourism stats, transport links

### Page structure:

#### Hero Section
- Full-width banner with Benidorm skyline image
- Use this Unsplash image URL as hero background:
  https://unsplash.com/photos/city-skyline-near-body-of-water-during-daytime-KiWun4rkzk0
- Headline: "Benidorm — The Manhattan of the Mediterranean"
- Subheadline: brief one-line description
- Two CTA buttons: "View Properties" → Spain page, 
  "Contact Us" → Contact page

#### Quick Facts Bar
Horizontal strip with 5 key facts displayed as icon + number:
- 🌞 320+ Sunny Days per Year
- 🏖️ 2 Famous Beaches (Levante & Poniente)
- ✈️ 60km from Alicante Airport
- 🌡️ 20°C Average Temperature
- 🏙️ 70,000 Permanent Residents

#### About Benidorm Section
Two column layout — text left, image right:

Title: "About Benidorm"

Text (use this, expand with scraped info):
Benidorm is a city on the Costa Blanca in the province of Alicante, 
southeastern Spain. Once a small fishing village, it transformed 
into one of Spain's most iconic resort cities during the 1960s 
tourism boom. Today it is famous for its striking skyline of 
high-rise hotels and apartments — earning it the nickname 
"The Manhattan of the Mediterranean."

The city is divided into two main areas by a rocky headland:
Playa de Levante to the east (more lively, popular with younger 
visitors) and Playa de Poniente to the west (calmer, more 
residential). Between them lies La Cala — the vibrant commercial 
heart of Benidorm and the most sought-after area for property 
investment.

Despite its reputation as a tourist hotspot, Benidorm has a 
thriving year-round community of residents, expats and retirees 
from across Europe. The city offers excellent infrastructure 
including international schools, modern hospitals, supermarkets 
of every European brand, and a well-connected public transport 
network.

#### The Beaches Section
Two cards side by side:

Card 1 — Playa de Levante:
- 1.9km of golden sand
- East-facing, morning sun
- Lively atmosphere, water sports
- Closest beach to La Cala district
- Perfect for rental investment — highest tourist demand

Card 2 — Playa de Poniente:
- 3km of golden sand  
- West-facing, spectacular sunsets
- Calmer, more residential feel
- Preferred by families and long-stay visitors
- Excellent for permanent residence

#### Climate Section
Title: "Year-Round Mediterranean Climate"
Show a simple month-by-month temperature display:
- Jan: 17°C | Feb: 18°C | Mar: 20°C | Apr: 22°C
- May: 25°C | Jun: 29°C | Jul: 32°C | Aug: 32°C
- Sep: 29°C | Oct: 25°C | Nov: 20°C | Dec: 17°C
Style as a clean visual bar chart or card grid

#### Districts Section
Title: "Areas We Cover in Benidorm"
Grid of district cards, each with name and one-line description:

- **La Cala** — The heart of Benidorm. Commercial centre between 
  the two beaches. Most popular area for apartments. Walking 
  distance to both Levante and Poniente beaches.

- **Levante** — Lively eastern district. Close to the longest 
  beach. High tourist density means excellent short-term 
  rental yields.

- **Poniente** — Quieter western district. Preferred by families 
  and long-term residents. More residential atmosphere.

- **Vila Park** — Popular residential complex with good 
  facilities. Slightly inland but excellent value.

- **Sierra Cortina** — Prestigious hillside area. Quiet, safe, 
  beautiful mountain and sea views. Premium properties.

- **Altea Hills** — Elite gated community 15km north of Benidorm. 
  Luxury villas with panoramic sea views. Highest prestige address 
  on the Costa Blanca.

- **Finestrat** — Growing area 5km from Benidorm. New-build 
  developments, mountain backdrop, excellent value for money.

#### Why Invest Section
Title: "Why Buy Property in Benidorm?"
6 icon cards in a 3x2 grid:

1. 🏠 **Proven Rental Income**
   6-10% annual rental yield. One of Spain's highest tourist 
   densities guarantees year-round occupancy.

2. 📈 **Rising Property Values**
   Consistent price growth over the past decade. Strong demand 
   from international buyers continues to drive appreciation.

3. ✈️ **Easy to Reach**
   Direct flights from major European cities to Alicante airport 
   (60km). Multiple airlines serve the route year-round.

4. 🌍 **International Community**
   Large established expat communities from UK, Germany, 
   Scandinavia, and Eastern Europe. Easy to settle and integrate.

5. 🏥 **Excellent Infrastructure**
   Modern hospitals, international schools, every major European 
   supermarket brand. Everything you need for comfortable living.

6. 📋 **Simple Purchase Process**
   Casa del Mar handles everything — NIE, legal documents, 
   bank accounts, residency cards. We speak your language.

#### Getting There Section
Title: "How to Get to Benidorm"
Simple info cards:

- ✈️ By Air: Alicante Airport (ALC) — 60km, 45 min by car. 
  Direct flights from Yerevan available via connecting hubs. 
  Ryanair, Easyjet, Vueling and others serve the airport.

- 🚗 By Car: From Alicante city centre — 50km on the AP-7 motorway.
  From Valencia — 120km. From Madrid — 440km.

- 🚌 By Bus: Regular ALSA bus services from Alicante, Valencia, 
  and Madrid directly to Benidorm bus station.

#### Final CTA Section
Dark navy background, centered:
- Headline: "Ready to Find Your Property in Benidorm?"
- Subheadline: "Browse our full collection of apartments and villas"
- Two buttons: "View Benidorm Properties" (links to Spain page) 
  and "Get Free Consultation" (links to Contact page)

### Navigation:
- Add "Benidorm" link to the main navigation under Spain
- Or add it as a dropdown: Spain → [All Properties] [Benidorm Guide]
- Add link to Benidorm page from the Spain listing page banner
- Add a small "Learn about Benidorm →" link on Spain page

### Translations:

English titles are written above. Add these for Russian and Armenian:

RUSSIAN:
- "Бенидорм — Манхэттен Средиземноморья"
- "О Бенидорме"
- "Пляжи Бенидорма"
- "Климат круглый год"
- "Районы Бенидорма"
- "Почему стоит инвестировать в Бенидорм?"
- "Как добраться до Бенидорма"
- "Готовы найти недвижимость в Бенидорме?"
- "Просмотреть объекты в Бенидорме"
- "Получить бесплатную консультацию"

ARMENIAN:
- "Բենիդորմ — Միջերկրածովյան Մանհեթեն"
- "Բենիդորմի մասին"
- "Բենիդորմի լողափները"
- "Ամբողջամյա կլիմա"
- "Բենիդորմի թաղամասերը"
- "Ինչու գնել Բենիդորմում?"
- "Ինչպես հասնել Բենիդորմ"
- "Պատրա՞ստ եք գույք գնել Բենիդորմում?"
- "Տեսնել Բենիդորմի գույքերը"
- "Ստանալ անվճար խորհրդատվություն"

### SEO for Benidorm page:
- Title: "Benidorm Properties & Guide | Casa del Mar Real Estate"
- Description: "Complete guide to buying property in Benidorm, Spain. 
  Beaches, climate, districts, investment potential. Browse apartments 
  from €180,000. Free consultation."
- Add JSON-LD for the page

---

## FINAL STEP

After all 4 tasks are complete:
1. Run: git add .
2. Run: git commit -m "Mobile responsive, removed reviews, Benidorm page, mobile admin"
3. Run: git push
4. Run: npm run build
5. Fix any TypeScript or build errors
6. Run: vercel --prod
7. Update the checklist in CLAUDE.md marking completed items

---

## Updated Checklist additions:
- [ ] Admin panel mobile friendly
- [ ] Full website mobile responsive  
- [ ] Hamburger menu on mobile
- [ ] Reviews/testimonials completely removed
- [ ] Benidorm dedicated page created
- [ ] Benidorm real info scraped and added
- [ ] Benidorm page in all 3 languages
- [ ] Benidorm link in navigation
- [ ] Deployed to Vercel after changes
