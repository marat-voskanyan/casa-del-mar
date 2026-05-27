import Link from 'next/link'
import type { Property, Locale } from '@/types'
import { getT } from '@/lib/i18n'
import PropertyCard from '@/components/properties/PropertyCard'

interface Props {
  locale: Locale
  properties: Property[]
}

export default function FeaturedProperties({ locale, properties }: Props) {
  const t = getT(locale)

  return (
    <section className="section-pad bg-cream">
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="eyebrow text-gold mb-4">Portfolio</p>
          <h2 className="section-title text-navy mb-4">{t.home.featured}</h2>
          <div className="gold-divider" />
          <p className="font-sans text-sand-700 max-w-xl mx-auto mt-4 leading-relaxed">
            {t.home.featuredSub}
          </p>
        </div>

        {properties.length === 0 ? (
          <p className="text-center font-sans text-sand-600 py-12">{t.property.noProperties}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} locale={locale} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <div className="flex justify-center gap-4">
            <Link href={`/${locale}/spain`} className="btn-outline">
              {t.nav.spain}
            </Link>
            <Link href={`/${locale}/cyprus`} className="btn-outline">
              {t.nav.cyprus}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
