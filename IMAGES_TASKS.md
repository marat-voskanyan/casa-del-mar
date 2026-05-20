# Casa del Mar — Real Benidorm Images Task

Read CLAUDE.md for full project context.
Complete this task automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK — Replace All Images With Real Benidorm Photos

Find, verify and use only free high-quality images of Benidorm, Spain.
Only use images that are clearly Benidorm or Costa Blanca.
Minimum image width: 1200px. No watermarks. No paid licenses.

---

## Approved Free Image Sources

### Source 1 — Unsplash (free, commercial use, no attribution needed)
Base URL format: https://images.unsplash.com/photo-{ID}?w=1600&q=85

### Source 2 — Pexels (free, commercial use)
Base URL format: https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg

### Source 3 — Wikimedia Commons (public domain)
Search: https://commons.wikimedia.org/wiki/Benidorm

---

## Confirmed Working Benidorm Image URLs

Verify each URL loads correctly before using it.
Use fetch() HEAD request to check — if 200 OK, use it.

### Benidorm Skyline & Aerial:
```
https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=85
https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85
https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85
```

### Benidorm Beaches:
```
https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1600&q=85
https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=85
https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=1600&q=85
```

### Spanish Coast & Mediterranean:
```
https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=1600&q=85
https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=85
https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=85
```

### Apartment Buildings with Pool (La Cala style):
```
https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=85
https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=85
https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=85
```

### Mediterranean Sea & Coastline:
```
https://images.unsplash.com/photo-1601024072789-3e6d7ca4ce65?w=1600&q=85
https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=1600&q=85
https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85
```

### Spain Architecture & Promenade:
```
https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=85
https://images.unsplash.com/photo-1559564484-84bc9e78f8a9?w=1600&q=85
https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1600&q=85
```

---

## Step 1 — Verify All URLs

Before using any image:
1. Use fetch() with HEAD method to check each URL above
2. If response is 200 OK → image is valid, add to confirmed list
3. If response is 404 or error → skip this image
4. Log which ones work and which don't
5. Only use confirmed working images

---

## Step 2 — Search for More Real Benidorm Images

Fetch these pages and extract any additional image URLs:

```
https://unsplash.com/s/photos/benidorm
https://unsplash.com/s/photos/benidorm-spain  
https://unsplash.com/s/photos/benidorm-beach
https://unsplash.com/s/photos/costa-blanca
https://unsplash.com/s/photos/costa-blanca-spain
```

From the HTML of each page extract img src URLs that contain:
- "unsplash.com" in the URL
- Photo IDs from images shown
- Build full CDN URLs: 
  https://images.unsplash.com/photo-{ID}?w=1600&q=85

Accept ONLY images whose alt text or caption mentions:
- "Benidorm"
- "Costa Blanca"  
- "Alicante"
- "Spain beach"
- "Mediterranean"

---

## Step 3 — Create Image Map

Once verified, create a constants file at:
`lib/images.ts`

With this structure:
```typescript
export const BENIDORM_IMAGES = {
  // Hero images (highest quality, 1600px wide)
  hero: {
    benidorm_skyline: "https://...",
    benidorm_beach: "https://...",
    benidorm_aerial: "https://...",
  },
  
  // Section images (1200px wide)
  sections: {
    about_benidorm: "https://...",
    levante_beach: "https://...",
    poniente_beach: "https://...",
    la_cala_apartments: "https://...",
    la_cala_pool: "https://...",
    getting_there: "https://...",
  },
  
  // Page banners (1400px wide)
  banners: {
    spain_page: "https://...",
    benidorm_page: "https://...",
    cyprus_page: "https://...",
  },
  
  // Cards (800px wide)
  cards: {
    spain_destination: "https://...",
    cyprus_destination: "https://...",
    altea_hills: "https://...",
    finestrat: "https://...",
  },
  
  // Fallback when property has no image
  property_fallback: "https://...",
}
```

Fill each key with the best verified image from Step 1 & 2.
Choose the most accurate image for each slot:
- levante_beach → must show a beach clearly
- la_cala_apartments → must show modern apartment buildings
- poniente_beach → beach with sunset/western exposure if possible
- benidorm_skyline → the famous high-rise skyline

---

## Step 4 — Replace Images Across the Website

Use the BENIDORM_IMAGES constants to replace ALL generic/placeholder
images throughout the codebase.

### Benidorm page (`app/[locale]/benidorm/page.tsx`):
| Section | Image to use |
|---------|-------------|
| Hero background | BENIDORM_IMAGES.hero.benidorm_skyline |
| About section | BENIDORM_IMAGES.sections.about_benidorm |
| Levante beach card | BENIDORM_IMAGES.sections.levante_beach |
| Poniente beach card | BENIDORM_IMAGES.sections.poniente_beach |
| La Cala section | BENIDORM_IMAGES.sections.la_cala_apartments |
| La Cala pool feature | BENIDORM_IMAGES.sections.la_cala_pool |
| Getting there | BENIDORM_IMAGES.sections.getting_there |

### Homepage (`app/[locale]/page.tsx`):
| Section | Image to use |
|---------|-------------|
| Spain destination card | BENIDORM_IMAGES.cards.spain_destination |
| Cyprus destination card | BENIDORM_IMAGES.cards.cyprus_destination |
| Altea Hills card | BENIDORM_IMAGES.cards.altea_hills |
| Finestrat card | BENIDORM_IMAGES.cards.finestrat |

### Spain listing page (`app/[locale]/spain/page.tsx`):
| Section | Image to use |
|---------|-------------|
| Page banner | BENIDORM_IMAGES.banners.spain_page |

### Cyprus listing page (`app/[locale]/cyprus/page.tsx`):
| Section | Image to use |
|---------|-------------|
| Page banner | BENIDORM_IMAGES.banners.cyprus_page |

### Property detail page:
| Section | Image to use |
|---------|-------------|
| Fallback when no image | BENIDORM_IMAGES.property_fallback |

---

## Step 5 — Alt Text

For every image add descriptive, SEO-friendly alt text:

```
benidorm_skyline → "Benidorm skyline with iconic high-rise apartments, Costa Blanca, Spain"
benidorm_beach → "Golden sandy beach in Benidorm with crystal blue Mediterranean sea"
benidorm_aerial → "Aerial view of Benidorm city and coastline, Alicante province, Spain"
about_benidorm → "Benidorm seafront promenade with modern apartment buildings"
levante_beach → "Playa de Levante, Benidorm's famous eastern beach, 1.9km of golden sand"
poniente_beach → "Playa de Poniente, Benidorm's western beach at sunset"
la_cala_apartments → "Modern La Cala residential complex with swimming pool, Benidorm"
la_cala_pool → "Swimming pool at La Cala apartment complex, Benidorm Spain"
spain_destination → "Benidorm and La Cala, Costa Blanca, Spain"
cyprus_destination → "Mediterranean coastline of Cyprus"
altea_hills → "Altea Hills luxury residential area, Costa Blanca Spain"
finestrat → "Finestrat village with mountain backdrop near Benidorm, Spain"
property_fallback → "Modern apartment in Benidorm, Costa Blanca, Spain"
```

---

## Step 6 — Next.js Image Component Optimization

For every image replaced, use Next.js Image component correctly:

```tsx
// Hero images (above fold) — use priority
<Image
  src={BENIDORM_IMAGES.hero.benidorm_skyline}
  alt="Benidorm skyline with iconic high-rise apartments, Costa Blanca, Spain"
  fill
  priority={true}
  quality={85}
  className="object-cover"
  sizes="100vw"
/>

// Section images (below fold) — use lazy loading
<Image
  src={BENIDORM_IMAGES.sections.levante_beach}
  alt="Playa de Levante, Benidorm's famous eastern beach"
  fill
  loading="lazy"
  quality={80}
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Card images
<Image
  src={BENIDORM_IMAGES.cards.spain_destination}
  alt="Benidorm and La Cala, Costa Blanca, Spain"
  fill
  loading="lazy"
  quality={75}
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

---

## Step 7 — Update next.config.js

Make sure all image domains are allowed in Next.js config:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
}
module.exports = nextConfig
```

---

## Step 8 — Quality Check

Before finishing, verify:
- [ ] Every image URL in the codebase returns 200 OK
- [ ] No broken image links anywhere
- [ ] No generic placeholder images remaining
- [ ] Hero images use priority={true}
- [ ] All images have descriptive alt text
- [ ] next.config.js has all domains whitelisted
- [ ] No images stretched or distorted (all use object-cover)

---

## Final Step

After all images are replaced and verified:

1. Run: npm run build
2. Fix any image-related TypeScript or config errors
3. Run: git add .
4. Run: git commit -m "Real Benidorm images added - verified free commercial use"
5. Run: git push
6. Run: vercel --prod
7. Open the live site and visually verify every page has
   correct Benidorm images showing

---

## Checklist:
- [ ] All image URLs verified working (200 OK)
- [ ] lib/images.ts created with all image constants
- [ ] Benidorm page — all sections have Benidorm images
- [ ] Homepage destination cards updated
- [ ] Spain page banner updated
- [ ] Cyprus page banner updated
- [ ] Property detail fallback image updated
- [ ] All images have SEO alt text
- [ ] Next.js Image component used correctly
- [ ] next.config.js updated with all domains
- [ ] priority={true} on all above-fold images
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
- [ ] Live site visually verified
