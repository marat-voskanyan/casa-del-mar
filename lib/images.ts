/**
 * Casa del Mar — Real Benidorm Photo Library
 *
 * All images are real photos of Benidorm uploaded by the client.
 * Stored in /public/images/
 */

// Local helper — returns a root-relative path served by Next.js static file handler
const L = (filename: string) => `/images/${filename}`

export const BENIDORM_IMAGES = {
  // ── Hero images (above fold — use priority={true}) ──────────────────────────
  hero: {
    /** Benidorm iconic high-rise skyline viewed from the sea */
    benidorm_skyline: L('benidorm-skyline-1.jpg'),
    /** Golden sandy beach with clear Mediterranean water — Levante */
    benidorm_beach:   L('benidorm-levante-1.jpg'),
    /** Aerial coastal view — Benidorm / Costa Blanca */
    benidorm_aerial:  L('benidorm-aerial-1.jpg'),
  },

  // ── Section images (below fold) ─────────────────────────────────────────────
  sections: {
    /** Benidorm city overview */
    about_benidorm:     L('benidorm-skyline-1.jpg'),       // clean name ✓
    /** Playa de Levante — east-facing 1.9 km golden beach */
    levante_beach:      L('benidorm-levante-2.jpg'),       // clean name ✓
    /** Playa de Poniente — west-facing 3 km beach, sunsets */
    poniente_beach:     L('benidorm-poniente-1.jpg'),      // clean name ✓
    /** La Cala area — heart of Benidorm */
    la_cala_apartments: L('benidorm-lacala-1.jpg'),        // clean name ✓
    /** View from apartment — sea view */
    la_cala_pool:       L('view-from-apartment.jpg'),      // needs rename script
    /** Poniente beach with palm trees */
    getting_there:      L('poniente-beach-palmas.jpg'),    // needs rename script
  },

  // ── Page banners ─────────────────────────────────────────────────────────────
  banners: {
    /** Spain listing page hero — Benidorm skyline panorama */
    spain_page:    L('benidorm-skyline-1.jpg'),            // clean name ✓
    /** Benidorm guide page — aerial coastal view */
    benidorm_page: L('benidorm-aerial-1.jpg'),             // clean name ✓
    /** Cyprus listing page — keep Unsplash until Cyprus photos are uploaded */
    cyprus_page:   'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=85&fit=crop&auto=format',
  },

  // ── Destination / feature cards ───────────────────────────────────────────────
  cards: {
    /** Spain destination card */
    spain_destination:   L('benidorm-skyline-1.jpg'),      // clean name ✓
    /** Cyprus destination card — keep Unsplash until Cyprus photos are uploaded */
    cyprus_destination:  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=85&fit=crop&auto=format',
    /** Altea Hills card — Benidorm tallest residential tower */
    altea_hills:         L('tallest-building.jpg'),        // needs rename script
    /** Finestrat card — Poniente beach view */
    finestrat:           L('benidorm-poniente-2.jpg'),     // clean name ✓
    /** Villa / apartment with sea view */
    villa_pool:          L('view-from-apartment.jpg'),     // needs rename script
  },

  // ── Fallback when a property has no uploaded image ────────────────────────────
  /** La Cala — shown when property has no photos */
  property_fallback: L('benidorm-lacala-1.jpg'),           // clean name ✓
} as const

// ── Alt text map — SEO friendly descriptions ──────────────────────────────
export const IMAGE_ALT = {
  benidorm_skyline:    'Benidorm skyline with iconic high-rise apartments, Costa Blanca, Spain',
  benidorm_beach:      'Playa de Levante, Benidorm — golden sandy beach with Mediterranean sea',
  benidorm_aerial:     'Aerial view of Benidorm city and coastline, Alicante province, Spain',
  about_benidorm:      'Benidorm city overview, Costa Blanca, Spain',
  levante_beach:       "Playa de Levante, Benidorm's famous eastern beach, 1.9km of golden sand",
  poniente_beach:      "Playa de Poniente, Benidorm's western beach, Costa Blanca, Spain",
  la_cala_apartments:  'La Cala area, heart of Benidorm — popular for apartment purchases',
  la_cala_pool:        'Sea view from apartment in Benidorm, Costa Blanca, Spain',
  getting_there:       'Poniente beach with palm trees, Benidorm, Costa Blanca',
  spain_destination:   'Benidorm skyline and coastline, Costa Blanca, Spain',
  cyprus_destination:  'Mediterranean coastline of Cyprus',
  altea_hills:         'Benidorm tallest residential tower, Costa Blanca Spain',
  finestrat:           'Poniente beach view near Benidorm, Costa Blanca, Spain',
  property_fallback:   'La Cala beach, Benidorm, Costa Blanca, Spain',
} as const
