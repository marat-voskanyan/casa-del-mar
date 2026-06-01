/**
 * Casa del Mar — Real Benidorm Photo Library
 *
 * All Spain/Benidorm images are real client photos stored in /public/images/
 * Cyprus images use Unsplash until real Cyprus photos are provided.
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
    /** Benidorm iconic skyscrapers — About Benidorm section */
    about_benidorm:     L('tallest-building.jpg'),
    /** Playa de Levante — east-facing 1.9 km golden beach */
    levante_beach:      L('benidorm-levante-2.jpg'),
    /** Playa de Poniente — west-facing 3 km beach, sunsets */
    poniente_beach:     L('poniente-beach.jpg'),
    /** Poniente beach with palm trees */
    poniente_palms:     L('poniente-beach-palmas.jpg'),
    /** La Cala district — aerial drone view */
    la_cala_section:    L('la-cala-drone.jpg'),
    /** La Cala beach */
    la_cala_beach:      L('la-cala-beach.jpg'),
    /** La Cala pool / apartments */
    la_cala_pool:       L('la-cala.jpg'),
    /** View from apartment — sea view */
    view_from_apartment: L('view-from-apartment.jpg'),
    /** Benidorm tallest residential tower */
    tallest_building:   L('tallest-building.jpg'),
    /** Getting there / transport */
    getting_there:      L('poniente-beach-palmas.jpg'),
    /** La Cala apartments (legacy alias) */
    la_cala_apartments: L('benidorm-lacala-1.jpg'),
  },

  // ── Page banners ─────────────────────────────────────────────────────────────
  banners: {
    /** Spain listing page hero — Benidorm skyline panorama */
    spain_page:    L('benidorm-skyline-1.jpg'),
    /** Benidorm guide page — aerial coastal view */
    benidorm_page: L('benidorm-aerial-1.jpg'),
    /** Cyprus listing page — Unsplash until Cyprus photos are uploaded */
    cyprus_page:   'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=85&fit=crop&auto=format',
  },

  // ── Destination / feature cards ───────────────────────────────────────────────
  cards: {
    /** Spain destination card — Benidorm city panorama */
    spain_destination:  L('benidorm-main.jpg'),
    /** Cyprus destination card — Unsplash until Cyprus photos are uploaded */
    cyprus_destination: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=85&fit=crop&auto=format',
    /** Altea Hills card — Benidorm tallest residential tower */
    altea_hills:        L('tallest-building.jpg'),
    /** Finestrat card — Poniente beach view */
    finestrat:          L('benidorm-poniente-2.jpg'),
    /** Villa / apartment with sea view */
    villa_pool:         L('view-from-apartment.jpg'),
  },

  // ── Fallback when a property has no uploaded image ────────────────────────────
  /** La Cala — shown when property has no photos */
  property_fallback: L('la-cala.jpg'),
} as const

// ── Alt text map — SEO friendly descriptions ──────────────────────────────
export const IMAGE_ALT = {
  benidorm_skyline:     'Benidorm skyline with iconic high-rise apartments, Costa Blanca, Spain',
  benidorm_beach:       'Playa de Levante, Benidorm — golden sandy beach with Mediterranean sea',
  benidorm_aerial:      'Aerial view of Benidorm city and coastline, Alicante province, Spain',
  about_benidorm:       'Benidorm iconic skyscrapers, Costa Blanca Spain',
  levante_beach:        "Playa de Levante, Benidorm's famous eastern beach, 1.9km of golden sand",
  poniente_beach:       "Playa de Poniente, Benidorm's western beach, Costa Blanca, Spain",
  poniente_palms:       'Poniente beach with palm trees, Benidorm, Costa Blanca',
  la_cala_section:      'La Cala district aerial drone view, Benidorm, Spain',
  la_cala_beach:        'La Cala beach, Benidorm, Costa Blanca, Spain',
  la_cala_pool:         'La Cala apartments and pool, Benidorm, Costa Blanca, Spain',
  view_from_apartment:  'Sea view from apartment in Benidorm, Costa Blanca, Spain',
  tallest_building:     'Benidorm tallest residential tower, Costa Blanca, Spain',
  la_cala_apartments:   'La Cala area, heart of Benidorm — popular for apartment purchases',
  getting_there:        'Poniente beach with palm trees, Benidorm, Costa Blanca',
  spain_destination:    'Benidorm city panorama, Costa Blanca, Spain',
  cyprus_destination:   'Mediterranean coastline of Cyprus',
  altea_hills:          'Benidorm tallest residential tower, Costa Blanca, Spain',
  finestrat:            'Poniente beach view near Benidorm, Costa Blanca, Spain',
  property_fallback:    'La Cala, Benidorm, Costa Blanca, Spain',
} as const
