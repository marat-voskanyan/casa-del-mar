import dynamic from 'next/dynamic'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

// Lazy load — only when visible in viewport
const PropertyMapInner = dynamic(() => import('./PropertyMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] md:h-[420px] flex items-center justify-center"
      style={{ background: '#F2EBD9', border: '1px solid rgba(201,168,76,0.25)' }}>
      <span style={{
        color: '#C9A84C',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '11px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        Loading map…
      </span>
    </div>
  ),
})

interface Props {
  lat: number | null
  lng: number | null
  name: string
  price: number
  location?: string
  propertyRef?: string | null
  locale: Locale
}

export default function PropertyMap({ lat, lng, name, price, location, propertyRef, locale }: Props) {
  const t = getT(locale)

  return (
    <div>
      {/* ── Luxury section header ── */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-8 h-px bg-[#C9A84C]" />
        <span className="font-accent text-[11px] tracking-[0.25em] uppercase text-[#C9A84C]">
          {t.map.title}
        </span>
        <div className="flex-1 h-px bg-[#C9A84C]/20" />
      </div>

      {!lat || !lng ? (
        <div className="h-40 border border-sand-200 bg-sand-50 flex items-center justify-center">
          <p className="font-sans text-sm text-navy/40">{t.map.noCoords}</p>
        </div>
      ) : (
        <PropertyMapInner
          lat={lat}
          lng={lng}
          name={name}
          price={price}
          location={location ?? ''}
          propertyRef={propertyRef ?? null}
          locale={locale}
        />
      )}
    </div>
  )
}
