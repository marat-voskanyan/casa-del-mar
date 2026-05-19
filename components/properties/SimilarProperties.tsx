import Link from 'next/link'
import Image from 'next/image'
import type { Property, Locale } from '@/types'
import { getT, formatPrice } from '@/lib/i18n'

interface Props {
  properties: Property[]
  locale: Locale
}

export default function SimilarProperties({ properties, locale }: Props) {
  const t = getT(locale)

  if (!properties.length) return null

  return (
    <section className="section-pad bg-sand">
      <div className="container-site">
        <div className="mb-10">
          <p className="eyebrow text-gold mb-3">{t.property.similar}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-navy">{t.property.similar}</h2>
          <div className="gold-divider mt-4" />
        </div>

        {/* Horizontal scroll on mobile, grid on md+ */}
        <div className="scroll-x md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible">
          {properties.map(p => {
            const img = p.images?.[0]
            return (
              <Link
                key={p.id}
                href={`/${locale}/properties/${p.id}`}
                className="group block w-72 md:w-auto shrink-0 md:shrink bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {img ? (
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 288px, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-navy-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="font-serif text-lg text-white font-light">{formatPrice(p.price)}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-serif text-base text-navy leading-tight mb-1 group-hover:text-gold transition-colors">
                    {p.name}
                  </h3>
                  <p className="font-sans text-xs text-navy/45">{p.location}</p>

                  {/* Mini features */}
                  <div className="flex gap-3 mt-3 text-[11px] text-navy/50 font-sans">
                    {p.bedrooms != null && <span>{p.bedrooms} {t.property.bedrooms}</span>}
                    {p.size_sqm != null && <span>{p.size_sqm} {t.property.sqm}</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
