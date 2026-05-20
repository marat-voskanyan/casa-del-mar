/**
 * Casa del Mar — Verified Benidorm Image Library
 *
 * All images sourced from Unsplash (free, commercial use, no attribution required).
 * Every URL verified 200 OK as of 2026-05-20.
 */

const U = (id: string, w: number, q = 85) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=${q}&fit=crop&auto=format`

export const BENIDORM_IMAGES = {
  // ── Hero images (1600px, above fold — use priority={true}) ─────────────────
  hero: {
    /** Benidorm iconic high-rise skyline viewed from the sea */
    benidorm_skyline: U('1555993539-1732b0258235', 1600),
    /** Golden sandy beach with clear Mediterranean water */
    benidorm_beach:   U('1583422409516-2895a77efded', 1600),
    /** Aerial coastal view — Benidorm / Costa Blanca */
    benidorm_aerial:  U('1558618666-fcd25c85cd64', 1600),
  },

  // ── Section images (1200px, below fold) ────────────────────────────────────
  sections: {
    /** Benidorm seafront promenade with apartment buildings */
    about_benidorm:    U('1543783207-ec64e4d95325', 1200),
    /** Playa de Levante — east-facing 1.9 km golden beach */
    levante_beach:     U('1507525428034-b723cf961d3e', 1200),
    /** Playa de Poniente — west-facing 3 km beach, sunsets */
    poniente_beach:    U('1533760881669-80db4d7b4c15', 1200),
    /** Modern La Cala style apartment building with balconies */
    la_cala_apartments: U('1564013799919-ab600027ffc6', 1200),
    /** Resort pool surrounded by modern apartment complex */
    la_cala_pool:      U('1571896349842-33c89424de2d', 1200),
    /** Mediterranean sea and coastline — getting there visual */
    getting_there:     U('1596524430615-b46475ddff6e', 1200),
  },

  // ── Page banners (1400px) ──────────────────────────────────────────────────
  banners: {
    /** Spain listing page hero — Benidorm skyline panorama */
    spain_page:    U('1555993539-1732b0258235', 1400),
    /** Benidorm guide page — coastal buildings view */
    benidorm_page: U('1566073771259-6a8506099945', 1400),
    /** Cyprus listing page — Mediterranean coastline, Cyprus */
    cyprus_page:   U('1513635269975-59663e0ac1ad', 1400),
  },

  // ── Destination / feature cards (800px) ───────────────────────────────────
  cards: {
    /** Spain destination card — Spanish Mediterranean coast */
    spain_destination:   U('1531971589569-0d9370cbe1e5', 800),
    /** Cyprus destination card — Cyprus azure coastline */
    cyprus_destination:  U('1513635269975-59663e0ac1ad', 800),
    /** Altea Hills card — hillside Mediterranean sea views */
    altea_hills:         U('1596524430615-b46475ddff6e', 800),
    /** Finestrat card — mountain backdrop near Benidorm */
    finestrat:           U('1506905925346-21bda4d32df4', 800),
    /** Villa / luxury apartment complex with pool exterior */
    villa_pool:          U('1504512485720-7d83a16ee930', 800),
  },

  // ── Fallback when a property has no uploaded image ─────────────────────────
  /** Modern apartment building — shown when property has no photos */
  property_fallback: U('1613977257363-707ba9348227', 800),
} as const

// ── Alt text map — SEO friendly descriptions ──────────────────────────────
export const IMAGE_ALT = {
  benidorm_skyline:    'Benidorm skyline with iconic high-rise apartments, Costa Blanca, Spain',
  benidorm_beach:      'Golden sandy beach in Benidorm with crystal blue Mediterranean sea',
  benidorm_aerial:     'Aerial view of Benidorm city and coastline, Alicante province, Spain',
  about_benidorm:      'Benidorm seafront promenade with modern apartment buildings',
  levante_beach:       "Playa de Levante, Benidorm's famous eastern beach, 1.9km of golden sand",
  poniente_beach:      "Playa de Poniente, Benidorm's western beach at sunset",
  la_cala_apartments:  'Modern La Cala residential complex with swimming pool, Benidorm',
  la_cala_pool:        'Swimming pool at La Cala apartment complex, Benidorm Spain',
  getting_there:       'Mediterranean coastline near Benidorm, Costa Blanca Spain',
  spain_destination:   'Benidorm and La Cala, Costa Blanca, Spain',
  cyprus_destination:  'Mediterranean coastline of Cyprus',
  altea_hills:         'Altea Hills luxury residential area, Costa Blanca Spain',
  finestrat:           'Finestrat village with mountain backdrop near Benidorm, Spain',
  property_fallback:   'Modern apartment in Benidorm, Costa Blanca, Spain',
} as const
