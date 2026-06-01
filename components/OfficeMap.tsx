'use client'
import { useEffect, useRef } from 'react'

const LAT = 40.186472
const LNG = 44.512972

export default function OfficeMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const L = require('leaflet')

    // Fix default icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    const map = L.map(mapRef.current, {
      center: [LAT, LNG],
      zoom: 12,
      scrollWheelZoom: false,
      zoomControl: false,
    })

    mapInstanceRef.current = map

    // CartoDB Positron tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    // Custom gold marker
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
      iconSize: [120, 52],
      iconAnchor: [60, 52],
    })

    L.marker([LAT, LNG], { icon: officeIcon })
      .addTo(map)
      .bindPopup(`
        <b style="color:#C9A84C">Casa del Mar</b><br>
        37 Mashtots Ave<br>
        Yerevan, Armenia
      `)

    // Remove default zoom, add custom controls via DOM
    map.zoomControl.remove()

    // Zoom in animation on scroll into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          setTimeout(() => {
            map.flyTo([LAT, LNG], 16, { animate: true, duration: 2.5 })
          }, 400)
        }
      })
    }, { threshold: 0.4 })

    if (mapRef.current) observer.observe(mapRef.current)

    return () => {
      observer.disconnect()
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  const zoomIn  = () => mapInstanceRef.current?.zoomIn()
  const zoomOut = () => mapInstanceRef.current?.zoomOut()

  return (
    <div className="relative">
      {/* Popup CSS */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #0D1F2D !important;
          color: rgba(255,255,255,0.85) !important;
          border: 1px solid rgba(201,168,76,0.5) !important;
          border-radius: 4px !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.4) !important;
          font-family: Montserrat, sans-serif !important;
          font-size: 12px !important;
        }
        .leaflet-popup-tip { background: #C9A84C !important; }
        .leaflet-control-attribution { display: none !important; }
      `}</style>

      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full md:h-[400px] h-[280px]"
        style={{
          borderTop: '2px solid #C9A84C',
          border: '1px solid rgba(201,168,76,0.3)',
          borderTopWidth: '2px',
          borderTopColor: '#C9A84C',
        }}
      />

      {/* Custom zoom controls */}
      <div
        className="absolute right-3 top-3 z-[1000] flex flex-col gap-0.5"
        style={{ zIndex: 1000 }}
      >
        <button
          onClick={zoomIn}
          className="w-8 h-8 flex items-center justify-center text-sm font-bold"
          style={{
            background: '#0D1F2D',
            border: '1px solid #C9A84C',
            color: '#C9A84C',
            cursor: 'pointer',
          }}
          aria-label="Zoom in"
        >+</button>
        <button
          onClick={zoomOut}
          className="w-8 h-8 flex items-center justify-center text-sm font-bold"
          style={{
            background: '#0D1F2D',
            border: '1px solid #C9A84C',
            color: '#C9A84C',
            cursor: 'pointer',
          }}
          aria-label="Zoom out"
        >−</button>
      </div>
    </div>
  )
}
