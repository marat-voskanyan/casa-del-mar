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

      // ── Light map CSS overrides ────────────────────────────────────────────
      if (!document.getElementById('benidorm-map-css')) {
        const style = document.createElement('style')
        style.id = 'benidorm-map-css'
        style.textContent = `
          #benidorm-map .leaflet-control-attribution { display: none !important; }
          #benidorm-map .leaflet-container { background: #F2EBD9 !important; }
          #benidorm-map .leaflet-popup-content-wrapper {
            background: #0D1F2D !important;
            color: #C9A84C !important;
            border: 1px solid rgba(201,168,76,0.4) !important;
            border-radius: 2px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
            font-family: 'Montserrat', sans-serif !important;
            font-size: 12px !important;
          }
          #benidorm-map .leaflet-popup-tip { background: #C9A84C !important; }
          #benidorm-map .leaflet-popup-close-button { color: #C9A84C !important; }
        `
        document.head.appendChild(style)
      }

      // ── Map — starts at wide view (zoom 10) ────────────────────────────────
      const map = L.map('benidorm-map', {
        center:           [38.5401, -0.1228],
        zoom:             10,
        scrollWheelZoom:  false,
        zoomControl:      true,
        attributionControl: false,
        preferCanvas:     true,
      })
      mapInst.current = map

      // ── CartoDB Positron — clean light premium tiles ───────────────────────
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom:    20,
      }).addTo(map)

      // ── Single gold Benidorm marker ────────────────────────────────────────
      const benidormMarker = L.divIcon({
        className: '',
        html: `<div style="
          width:16px; height:16px;
          background:#C9A84C;
          border:3px solid white;
          border-radius:50%;
          box-shadow:0 2px 8px rgba(0,0,0,0.3), 0 0 0 4px rgba(201,168,76,0.2);
        "></div>`,
        iconSize:    [16, 16],
        iconAnchor:  [8, 8],
        popupAnchor: [0, -12],
      })

      L.marker([38.5401, -0.1228], { icon: benidormMarker })
        .addTo(map)
        .bindPopup('<b style="color:#C9A84C;letter-spacing:0.05em">BENIDORM</b><br><span style="color:rgba(255,255,255,0.7);font-size:10px">Costa Blanca, Spain</span>')

      // ── Fly-in: zoom 10 → 13, triggered by IntersectionObserver ───────────
      const container = document.getElementById('benidorm-map')
      if (container) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !animated.current) {
              animated.current = true
              setTimeout(() => {
                map.flyTo([38.5401, -0.1228], 13, { animate: true, duration: 2.5 })
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
        width:     '100%',
        height:    'clamp(320px, 40vw, 520px)',
        border:    '1px solid rgba(201,168,76,0.4)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}
    />
  )
}
