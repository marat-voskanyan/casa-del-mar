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
          <div className="gold-divider mt-4 mb-3" />
          <p className="font-accent text-[10px] tracking-[0.15em] uppercase text-navy/40">
            {(t.property as any).similarSub}
          </p>
        </div>

        {/* Snap-scroll carousel on mobile, grid on md+ */}
        <div className="flex gap-4 overflow-x-auto scroll-touch scrollbar-none
          snap-x snap-mandatory -mx-5 px-5
          md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6
          md:overflow-visible md:snap-none">
          {properties.map(p => {
            const img = p.images?.[0]
            const slug = p.ref || String(p.id)
            return (
              <Link
                key={p.id}
                href={`/${locale}/properties/${slug}`}
                className="group block snap-start shrink-0 w-[260px]
                  md:w-auto md:shrink
                  bg-white overflow-hidden
                  shadow-[0_4px_20px_rgba(13,31,45,0.08)]
                  hover:shadow-[0_12px_32px_rgba(13,31,45,0.14)]
                  transition-shadow duration-500"
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
                  <h3 className="font-serif text-[15px] text-navy leading-snug mb-1.5
                    group-hover:text-[#C9A84C] transition-colors duration-400">
                    {p.name}
                  </h3>
                  <p className="font-accent text-[10px] tracking-[0.12em] uppercase text-[#C9A84C]/70 mb-3">{p.location}</p>

                  {/* Mini features */}
                  <div className="flex gap-3 text-[11px] font-accent uppercase tracking-wide text-navy/45">
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
