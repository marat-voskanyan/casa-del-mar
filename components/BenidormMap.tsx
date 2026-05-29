'use client'

import { useEffect, useRef } from 'react'

export default function BenidormMap() {
  const mapRef   = useRef<HTMLDivElement>(null)
  const mapInst  = useRef<unknown>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return

    import('leaflet').then(L => {
      if (!mapRef.current || mapInst.current) return

      // ── Leaflet CSS ────────────────────────────────────────────────────────
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id   = 'leaflet-css'
        link.rel  = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // ── Luxury dark popup + attribution override ────────────────────────
      if (!document.getElementById('benidorm-map-css')) {
        const style = document.createElement('style')
        style.id = 'benidorm-map-css'
        style.textContent = `
          #benidorm-map .leaflet-control-attribution { display: none !important; }
          #benidorm-map .leaflet-container { background: #0D1F2D !important; }
        `
        document.head.appendChild(style)
      }

      // ── Map — starts at wide 22km view (zoom 10) ────────────────────────
      const map = L.map('benidorm-map', {
        center:           [38.5401, -0.1228],
        zoom:             10,
        scrollWheelZoom:  false,
        zoomControl:      true,
        attributionControl: false,
        preferCanvas:     true,
      })
      mapInst.current = map

      // ── Dark CartoDB tiles ───────────────────────────────────────────────
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom:    19,
      }).addTo(map)

      // ── Fly-in: zoom 10 → 14, triggered by IntersectionObserver ────────
      const container = document.getElementById('benidorm-map')
      if (container) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !animated.current) {
              animated.current = true
              setTimeout(() => {
                map.flyTo([38.5401, -0.1228], 14, { animate: true, duration: 3 })
              }, 300)
            }
          })
        }, { threshold: 0.3 })
        observer.observe(container)
      }
    })

    return () => {
      if (mapInst.current) {
        ;(mapInst.current as { remove: () => void }).remove()
        mapInst.current = null
      }
    }
  }, [])

  return (
    <div
      id="benidorm-map"
      ref={mapRef}
      style={{
        width:  '100%',
        height: 'clamp(320px, 40vw, 520px)',
        border: '1px solid rgba(201,168,76,0.3)',
      }}
    />
  )
}
