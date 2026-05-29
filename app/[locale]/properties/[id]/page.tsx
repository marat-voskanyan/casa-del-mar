import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Locale, Property } from '@/types'
import { getPropertyById, getSimilarProperties } from '@/lib/db'
import { getT, formatPrice } from '@/lib/i18n'
import PropertyGallery from '@/components/properties/PropertyGallery'
import PropertyMap from '@/components/properties/PropertyMap'
import SimilarProperties from '@/components/properties/SimilarProperties'
import ShareButtonClient from './ShareButtonClient'
import WhatsAppButton from '@/components/WhatsAppButton'

export const dynamic   = 'force-dynamic'
export const revalidate = 0

interface Props { params: { locale: Locale; id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let property: Property | null = null
  try { property = await getPropertyById(Number(params.id)) as unknown as Property } catch { /* */ }
  if (!property) return { title: 'Property Not Found' }

  const descKey = `description_${params.locale}` as `description_${Locale}`
  const description = property[descKey] || property.description_en || undefined

  return {
    title: property.name,
    description: description?.slice(0, 160),
    openGraph: {
      title: property.name,
      description: description?.slice(0, 160),
      images: property.images[0] ? [{ url: property.images[0] }] : [],
    },
  }
}

export default async function PropertyDetailPage({ params: { locale, id } }: Props) {
  const t = getT(locale)
  let property: Property | null = null
  let similar: Property[] = []

  try {
    property = await getPropertyById(Number(id)) as unknown as Property
    if (property) {
      similar = await getSimilarProperties(property.id, property.country, 4) as unknown as Property[]
    }
  } catch { /* */ }

  if (!property) notFound()

  const descKey = `description_${locale}` as `description_${Locale}`
  const description  = property[descKey] || property.description_en
  const displayName  = locale === 'ru' ? (property.name_ru || property.name)
                     : locale === 'hy' ? (property.name_hy || property.name)
                     : property.name

  const features = [
    property.bedrooms  != null && { label: t.property.bedrooms,  value: String(property.bedrooms) },
    property.bathrooms != null && { label: t.property.bathrooms, value: String(property.bathrooms) },
    property.floor     != null && { label: t.property.floor,     value: String(property.floor) },
    property.size_sqm  != null && { label: t.property.size,      value: `${property.size_sqm} ${t.property.sqm}` },
    { label: t.property.parking, value: property.parking ? t.property.yes : t.property.no },
    property.ref       && { label: 'Reference', value: property.ref, isRef: true },
  ].filter(Boolean) as { label: string; value: string; isRef?: boolean }[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.name,
    description: description || undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://casadelmar.eu'}/${locale}/properties/${property.id}`,
    image: property.images,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'EUR',
      availability: property.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
      addressCountry: property.country === 'spain' ? 'ES' : 'CY',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-24 min-h-screen bg-white pb-20 lg:pb-0">
        {/* Breadcrumb */}
        <div className="bg-sand border-b border-sand-300">
          <div className="container-site py-3 flex items-center gap-2 text-xs font-sans text-navy/50">
            <Link href={`/${locale}`} className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${locale}/${property.country}`} className="hover:text-gold transition-colors capitalize">
              {property.country}
            </Link>
            <span>/</span>
            <span className="text-navy/70 truncate max-w-[200px]">{property.name}</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="container-site pt-10">
          <PropertyGallery images={property.images} name={property.name} locale={locale} />
        </div>

        {/* Main content */}
        <div className="container-site pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left — details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Title block */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`badge ${
                    property.status === 'available' ? 'badge-available' :
                    property.status === 'sold' ? 'badge-sold' : 'badge-reserved'
                  }`}>
                    <span className={
                      property.status === 'available' ? 'dot-available' :
                      property.status === 'sold' ? 'dot-sold' : 'dot-reserved'
                    } />
                    {t.property.status[property.status]}
                  </span>
                  <span className="font-accent text-[10px] tracking-widest text-navy/40 uppercase">
                    {property.country === 'spain' ? '🇪🇸 Spain' : '🇨🇾 Cyprus'}
                  </span>
                </div>

                <h1 className="font-serif text-4xl md:text-5xl text-navy font-light leading-tight mb-3">
                  {displayName}
                </h1>

                <p className="font-sans text-sm text-navy/50 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gold/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {property.location}
                </p>

                <div className="gold-divider mt-6" />
              </div>

              {/* Features grid */}
              {features.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl text-navy mb-4">{t.property.features}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {features.map(f => (
                      <div key={f.label} className="bg-sand p-4 border-l-2 border-gold">
                        <p className="font-accent text-[10px] tracking-[0.2em] text-navy/45 uppercase mb-1.5">{f.label}</p>
                        <p className={`font-serif text-xl ${f.isRef ? 'text-[#C9A84C] text-base tracking-widest' : 'text-navy'}`}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {description && (
                <div>
                  <h2 className="font-serif text-2xl text-navy mb-4">{t.property.description}</h2>
                  <div className="gold-divider mb-6" />
                  <p className="font-sans text-navy/70 leading-relaxed whitespace-pre-wrap text-base">
                    {description}
                  </p>
                </div>
              )}

              {/* Map */}
              <PropertyMap
                lat={property.latitude}
                lng={property.longitude}
                name={property.name}
                price={property.price}
                locale={locale}
              />
            </div>

            {/* Right — sticky sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-navy p-8 sticky top-28 shadow-nav">
                <p className="font-accent text-[10px] tracking-[0.25em] uppercase text-gold/70 mb-1">
                  {t.property.price}
                </p>
                <p className="font-serif text-4xl text-white font-light mb-6">
                  {formatPrice(property.price)}
                </p>

                <div className="w-10 h-px bg-gold/40 mb-6" />

                <p className="font-sans text-sm text-white/60 mb-6 leading-relaxed">
                  {t.property.contactAbout}
                </p>

                <Link href={`/${locale}/contact`} className="btn-primary block text-center mb-4">
                  {t.property.contactCta}
                </Link>

                <Link
                  href={`/${locale}/${property.country}`}
                  className="flex items-center justify-center gap-2 font-accent text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-gold/70 transition-colors mt-4"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  {t.property.back}
                </Link>

                <ShareButtonClient label={t.property.share} successLabel={t.property.shareSuccess} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar properties */}
      <SimilarProperties properties={similar} locale={locale} />
      <WhatsAppButton locale={locale} />

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy border-t border-white/10 shadow-lg px-4 py-3 flex items-center gap-3">
        <div className="shrink-0">
          <p className="font-accent text-[9px] tracking-[0.2em] uppercase text-gold/70">{t.property.price}</p>
          <p className="font-serif text-xl text-white font-light leading-tight">{formatPrice(property.price)}</p>
        </div>
        <Link href={`/${locale}/contact`} className="btn-primary flex-1 text-center text-xs py-3">
          {t.property.contactCta}
        </Link>
      </div>
    </>
  )
}
