'use client'
import { useEffect, useRef } from 'react'

const LAT = 40.186472
const LNG = 44.512972

export default function OfficeMap() {
  const mapRef     = useRef<HTMLDivElement>(null)
  const mapInst    = useRef<unknown>(null)
  const animated   = useRef(false)

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return

    import('leaflet').then(L => {
      if (!mapRef.current || mapInst.current) return

      // ── Leaflet CSS ──────────────────────────────────────────────────────────
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id   = 'leaflet-css'
        link.rel  = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // ── Office map custom styles ─────────────────────────────────────────────
      if (!document.getElementById('office-map-css')) {
        const style = document.createElement('style')
        style.id = 'office-map-css'
        style.textContent = `
          #office-map .leaflet-popup-content-wrapper {
            background: #0D1F2D !important;
            color: rgba(255,255,255,0.85) !important;
            border: 1px solid rgba(201,168,76,0.5) !important;
            border-radius: 4px !important;
            box-shadow: 0 8px 30px rgba(0,0,0,0.4) !important;
            font-family: Montserrat, sans-serif !important;
            font-size: 12px !important;
          }
          #office-map .leaflet-popup-tip { background: #C9A84C !important; }
          #office-map .leaflet-control-attribution { display: none !important; }
          #office-map .leaflet-container { background: #F2EBD9 !important; }
        `
        document.head.appendChild(style)
      }

      // ── Map init ─────────────────────────────────────────────────────────────
      const map = L.map('office-map', {
        center:           [LAT, LNG],
        zoom:             12,
        scrollWheelZoom:  false,
        zoomControl:      false,
        attributionControl: false,
      })
      mapInst.current = map

      // ── CartoDB Positron tiles ───────────────────────────────────────────────
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains:  'abcd',
        maxZoom:     20,
      }).addTo(map)

      // ── Custom gold marker ───────────────────────────────────────────────────
      const officeIcon = L.divIcon({
        className: '',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="
              background:#0D1F2D;
              border:2px solid #C9A84C;
              border-radius:6px;
              padding:6px 12px;
              color:#C9A84C;
              font-family:Montserrat,sans-serif;
              font-size:11px;
              font-weight:600;
              letter-spacing:0.08em;
              white-space:nowrap;
              box-shadow:0 4px 15px rgba(0,0,0,0.3);
            ">Casa del Mar</div>
            <div style="width:2px;height:10px;background:#C9A84C"></div>
            <div style="
              width:10px;height:10px;
              background:#C9A84C;
              border-radius:50%;
              border:2px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,0.4);
            "></div>
          </div>
        `,
        iconSize:   [120, 52],
        iconAnchor: [60, 52],
      })

      L.marker([LAT, LNG], { icon: officeIcon })
        .addTo(map)
        .bindPopup(`
          <b style="color:#C9A84C">Casa del Mar</b><br>
          37 Mashtots Ave<br>
          Yerevan, Armenia
        `)

      // ── Custom gold zoom controls ────────────────────────────────────────────
      const ZoomCtrl = L.Control.extend({
        onAdd() {
          const c = L.DomUtil.create('div')
          c.style.cssText = 'display:flex;flex-direction:column;gap:2px;'
          const btn = (label: string, fn: () => void) => {
            const b = L.DomUtil.create('button') as HTMLButtonElement
            b.innerHTML = label
            b.style.cssText = `
              width:32px;height:32px;background:#0D1F2D;
              border:1px solid rgba(201,168,76,0.4);
              color:#C9A84C;font-size:18px;cursor:pointer;
              display:flex;align-items:center;justify-content:center;
              line-height:1;transition:border-color 0.2s;
            `
            b.onmouseenter = () => { b.style.borderColor = '#C9A84C' }
            b.onmouseleave = () => { b.style.borderColor = 'rgba(201,168,76,0.4)' }
            L.DomEvent.on(b, 'click', (e: Event) => { L.DomEvent.stopPropagation(e); fn() })
            return b
          }
          c.appendChild(btn('+', () => map.zoomIn()))
          c.appendChild(btn('−', () => map.zoomOut()))
          return c
        },
      })
      new (ZoomCtrl as any)({ position: 'topright' }).addTo(map)

      // ── Fly-in animation on scroll into view ─────────────────────────────────
      const container = document.getElementById('office-map')
      if (container) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !animated.current) {
              animated.current = true
              setTimeout(() => {
                map.flyTo([LAT, LNG], 16, { animate: true, duration: 2.5 })
              }, 400)
            }
          })
        }, { threshold: 0.4 })
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
      id="office-map"
      ref={mapRef}
      style={{
        width:          '100%',
        height:         'clamp(280px, 40vw, 400px)',
        borderTop:      '2px solid #C9A84C',
        border:         '1px solid rgba(201,168,76,0.3)',
        borderTopWidth: '2px',
        borderTopColor: '#C9A84C',
      }}
    />
  )
}
