'use client'

import { useEffect, useRef } from 'react'
import type { Locale } from '@/types'
import { getT, formatPrice } from '@/lib/i18n'

interface Props {
  lat: number
  lng: number
  name: string
  price: number
  locale: Locale
}

export default function PropertyMapInner({ lat, lng, name, price, locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const t = getT(locale)

  useEffect(() => {
    if (!containerRef.current) return

    let map: any
    ;(async () => {
      const L = (await import('leaflet')).default

      // Custom gold marker
      const icon = L.divIcon({
        className: '',
        html: `<div class="custom-map-marker"><span>🏠</span></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -44],
      })

      map = L.map(containerRef.current!, { zoomControl: true, scrollWheelZoom: false })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      map.setView([lat, lng], 14)

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:var(--font-inter,sans-serif);padding:4px 0">
            <p style="font-weight:600;color:#0D1F2D;margin:0 0 4px">${name}</p>
            <p style="color:#C9A84C;font-size:13px;margin:0">${formatPrice(price)}</p>
          </div>`,
          { maxWidth: 200 }
        )
        .openPopup()
    })()

    return () => { if (map) map.remove() }
  }, [lat, lng, name, price, locale])

  return (
    <div>
      <h2 className="font-serif text-2xl text-navy mb-4">{t.map.title}</h2>
      <div className="gold-divider mb-6" />
      <div
        ref={containerRef}
        className="w-full h-80 rounded-xl overflow-hidden border border-sand-200 shadow-card"
      />
    </div>
  )
}
