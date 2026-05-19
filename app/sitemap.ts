import type { MetadataRoute } from 'next'
import { getAllProperties } from '@/lib/db'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://casadelmar.eu'
const LOCALES = ['en', 'ru', 'hy'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap(locale => [
    { url: `${BASE}/${locale}`,         lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/${locale}/spain`,   lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/${locale}/cyprus`,  lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/${locale}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ])

  // Property pages
  let properties: { id: number; updated_at: string }[] = []
  try { properties = getAllProperties() as unknown as { id: number; updated_at: string }[] } catch { /* */ }

  const propertyRoutes: MetadataRoute.Sitemap = properties.flatMap(p =>
    LOCALES.map(locale => ({
      url: `${BASE}/${locale}/properties/${p.id}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  return [...staticRoutes, ...propertyRoutes]
}
