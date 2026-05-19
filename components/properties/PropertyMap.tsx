import dynamic from 'next/dynamic'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

const PropertyMapInner = dynamic(() => import('./PropertyMapInner'), { ssr: false })

interface Props {
  lat: number | null
  lng: number | null
  name: string
  price: number
  locale: Locale
}

export default function PropertyMap({ lat, lng, name, price, locale }: Props) {
  const t = getT(locale)

  if (!lat || !lng) {
    return (
      <div>
        <h2 className="font-serif text-2xl text-navy mb-4">{t.map.title}</h2>
        <div className="gold-divider mb-6" />
        <div className="h-40 rounded-xl border border-sand-200 bg-sand-50 flex items-center justify-center">
          <p className="font-sans text-sm text-navy/40">{t.map.noCoords}</p>
        </div>
      </div>
    )
  }

  return <PropertyMapInner lat={lat} lng={lng} name={name} price={price} locale={locale} />
}
