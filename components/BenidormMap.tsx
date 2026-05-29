'use client'

import { useEffect, useRef } from 'react'

const MARKERS = [
  { pos: [38.5428, -0.1121] as [number, number], label: 'Playa de Levante — 1.9km' },
  { pos: [38.5367, -0.1420] as [number, number], label: 'Playa de Poniente — 3km' },
  { pos: [38.5355, -0.1467] as [number, number], label: 'La Cala — Modern Apartments' },
  { pos: [38.5408, -0.1189] as [number, number], label: 'Casco Antiguo — Old Town' },
  { pos: [38.5578, -0.0889] as [number, number], label: 'Sierra Cortina — Prestigious Area' },
  { pos: [38.6089, -0.0467] as [number, number], label: 'Altea Hills — Elite Community' },
  { pos: [38.5681, -0.1889] as [number, number], label: 'Finestrat — New Developments' },
]

const LEVANTE_LINE: [number, number][] = [
  [38.5398, -0.1193], [38.5428, -0.1121], [38.5458, -0.1060],
]
const PONIENTE_LINE: [number, number][] = [
  [38.5398, -0.1193], [38.5367, -0.1420], [38.5330, -0.1520],
]

export default function BenidormMap() {
  const mapRef    = useRef<HTMLDivElement>(null)
  const mapInst   = useRef<unknown>(null)
  const animated  = useRef(false)

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return

    // Dynamically import Leaflet (client-only)
    import('leaflet').then(L => {
      if (!mapRef.current || mapInst.current) return

      // ── Tile layer CSS (inject once) ──────────────────────────────────────────
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id   = 'leaflet-css'
        link.rel  = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // ── Custom luxury popup CSS ───────────────────────────────────────────────
      if (!document.getElementById('benidorm-map-css')) {
        const style = document.createElement('style')
        style.id = 'benidorm-map-css'
        style.textContent = `
          #benidorm-map .leaflet-popup-content-wrapper {
            background: #0D1F2D !important;
            color: #C9A84C !important;
            border: 1px solid rgba(201,168,76,0.5) !important;
            border-radius: 2px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
            font-family: 'Montserrat', sans-serif !important;
            font-size: 11px !important;
            letter-spacing: 0.08em !important;
            text-transform: uppercase !important;
          }
          #benidorm-map .leaflet-popup-tip { background: #C9A84C !important; }
          #benidorm-map .leaflet-popup-close-button { color: #C9A84C !important; }
          #benidorm-map .leaflet-container { background: #0D1F2D !important; }
          #benidorm-map .leaflet-attribution-flag { display: none !important; }
          #benidorm-map .leaflet-control-attribution {
            background: rgba(13,31,45,0.8) !important;
            color: rgba(201,168,76,0.5) !important;
            font-size: 9px !important;
          }
          #benidorm-map .leaflet-control-attribution a { color: rgba(201,168,76,0.6) !important; }
        `
        document.head.appendChild(style)
      }

      // ── Map init ──────────────────────────────────────────────────────────────
      const map = L.map('benidorm-map', {
        center:           [38.5401, -0.1228],
        zoom:             12,
        scrollWheelZoom:  false,
        zoomControl:      false,
        attributionControl: true,
        preferCanvas:     true,
      })
      mapInst.current = map

      // Dark tiles (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains:  'abcd',
        maxZoom:     19,
      }).addTo(map)

      // ── Custom gold marker ────────────────────────────────────────────────────
      const goldMarker = () => L.divIcon({
        className: '',
        html: `<div style="
          width:14px;height:14px;
          background:#C9A84C;
          border:2px solid rgba(255,255,255,0.8);
          border-radius:50%;
          box-shadow:0 0 12px rgba(201,168,76,0.7),0 0 4px rgba(201,168,76,1);
          cursor:pointer;
        "></div>`,
        iconSize:    [14, 14],
        iconAnchor:  [7, 7],
        popupAnchor: [0, -10],
      })

      // ── Place markers ─────────────────────────────────────────────────────────
      MARKERS.forEach(({ pos, label }) => {
        L.marker(pos, { icon: goldMarker() })
          .bindPopup(label)
          .addTo(map)
      })

      // ── Beach polylines ───────────────────────────────────────────────────────
      L.polyline(LEVANTE_LINE,  { color: '#C9A84C', weight: 4, opacity: 0.75 }).addTo(map)
      L.polyline(PONIENTE_LINE, { color: '#C9A84C', weight: 4, opacity: 0.75 }).addTo(map)

      // ── Custom gold zoom controls ─────────────────────────────────────────────
      const ZoomCtrl = L.Control.extend({
        onAdd() {
          const container = L.DomUtil.create('div')
          container.style.cssText = 'display:flex;flex-direction:column;gap:2px'

          const btn = (text: string, fn: () => void) => {
            const b = L.DomUtil.create('button') as HTMLButtonElement
            b.innerHTML = text
            b.style.cssText = `
              width:32px;height:32px;
              background:#0D1F2D;border:1px solid #C9A84C;
              color:#C9A84C;font-size:18px;cursor:pointer;line-height:1;
            `
            L.DomEvent.on(b, 'click', (e) => { L.DomEvent.stopPropagation(e); fn() })
            return b
          }

          container.appendChild(btn('+', () => map.zoomIn()))
          container.appendChild(btn('−', () => map.zoomOut()))
          return container
        },
      })
      new ZoomCtrl({ position: 'topright' }).addTo(map)

      // ── Legend ────────────────────────────────────────────────────────────────
      const Legend = L.Control.extend({
        onAdd() {
          const div = L.DomUtil.create('div')
          div.style.cssText = `
            background:rgba(13,31,45,0.9);
            border:1px solid rgba(201,168,76,0.3);
            padding:10px 14px;
            font-family:Montserrat,sans-serif;
            font-size:10px;color:rgba(201,168,76,0.8);
            letter-spacing:0.1em;text-transform:uppercase;
            line-height:1.8;
          `
          div.innerHTML = `
            <div style="color:#C9A84C;font-weight:600;margin-bottom:4px">BENIDORM</div>
            <div>● Beaches</div>
            <div>● Districts</div>
            <div style="margin-top:6px;border-top:1px solid rgba(201,168,76,0.2);padding-top:6px">— Beach Lines</div>
          `
          return div
        },
      })
      new Legend({ position: 'bottomleft' }).addTo(map)

      // ── Fly-in animation on scroll into view ──────────────────────────────────
      const container = document.getElementById('benidorm-map')
      if (container) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !animated.current) {
              animated.current = true
              setTimeout(() => {
                map.flyTo([38.5401, -0.1228], 13, { animate: true, duration: 2.5 })
              }, 500)
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
      style={{ width: '100%', height: 'clamp(320px, 40vw, 520px)' }}
    />
  )
}
