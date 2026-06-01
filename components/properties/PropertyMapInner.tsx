'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/types'
import { getT, formatPrice } from '@/lib/i18n'

interface Props {
  lat: number
  lng: number
  name: string
  price: number
  location: string
  propertyRef: string | null
  locale: Locale
}

// ── Detect Benidorm / La Cala area ────────────────────────────────────────────
function isBenidormArea(lat: number, lng: number) {
  return lat > 38.48 && lat < 38.62 && lng > -0.26 && lng < -0.08
}

// ── Points of interest near Benidorm ─────────────────────────────────────────
const BENIDORM_POIS = [
  { lat: 38.5428, lng: -0.1121, label: 'Playa de Levante', icon: '🏖️' },
  { lat: 38.5367, lng: -0.1420, label: 'Playa de Poniente', icon: '🏖️' },
  { lat: 38.5355, lng: -0.1467, label: 'La Cala District',  icon: '🏘️' },
  { lat: 38.5320, lng: -0.1230, label: 'Mercadona',         icon: '🛒' },
  { lat: 38.5130, lng: -0.2260, label: 'Hospital Marina Baixa', icon: '🏥' },
]

// ── Haversine distance (km) ───────────────────────────────────────────────────
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function PropertyMapInner({ lat, lng, name, price, location, propertyRef, locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<unknown>(null)
  const inViewRef    = useRef(false)
  const t = getT(locale)
  const [inView, setInView] = useState(false)

  // ── Load map only when in viewport ────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inViewRef.current) {
          inViewRef.current = true
          setInView(true)
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ── Init Leaflet once in view ──────────────────────────────────────────────
  useEffect(() => {
    if (!inView || !containerRef.current || mapRef.current) return

    ;(async () => {
      const L = (await import('leaflet')).default

      // ── Leaflet CSS ──────────────────────────────────────────────────────
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'; link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // ── Custom popup / attribution CSS ───────────────────────────────────
      if (!document.getElementById('prop-map-css')) {
        const s = document.createElement('style')
        s.id = 'prop-map-css'
        s.textContent = `
          .prop-map .leaflet-control-attribution { display:none!important; }
          .prop-map .leaflet-popup-content-wrapper {
            background:#0D1F2D!important; color:#fff!important;
            border:1px solid rgba(201,168,76,0.4)!important;
            border-radius:4px!important;
            box-shadow:0 4px 20px rgba(0,0,0,0.35)!important;
            font-family:Montserrat,sans-serif!important;
            font-size:11px!important; letter-spacing:0.05em!important;
          }
          .prop-map .leaflet-popup-tip { background:#C9A84C!important; }
          .prop-map .leaflet-popup-close-button { color:#C9A84C!important; top:6px!important; right:8px!important; }
          .prop-map .leaflet-container { background:#F2EBD9!important; }
        `
        document.head.appendChild(s)
      }

      // ── Map init ─────────────────────────────────────────────────────────
      const map = L.map(containerRef.current!, {
        zoomControl:      false,
        scrollWheelZoom:  false,
        attributionControl: false,
      })
      mapRef.current = map
      ;(containerRef.current as HTMLElement).classList.add('prop-map')

      // ── CartoDB Positron tiles ────────────────────────────────────────────
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom:    20,
      }).addTo(map)

      map.setView([lat, lng], 15)

      // ── Custom luxury property marker ─────────────────────────────────────
      const shortName = name.length > 28 ? name.slice(0, 26) + '…' : name
      const propertyIcon = L.divIcon({
        className: '',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="
              background:#0D1F2D;border:2px solid #C9A84C;border-radius:6px;
              padding:5px 11px;color:#C9A84C;font-family:Montserrat,sans-serif;
              font-size:11px;font-weight:600;letter-spacing:0.08em;
              white-space:nowrap;box-shadow:0 4px 15px rgba(0,0,0,0.3);
            ">${shortName}</div>
            <div style="width:2px;height:10px;background:#C9A84C;"></div>
            <div style="
              width:8px;height:8px;background:#C9A84C;border-radius:50%;
              border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);
            "></div>
          </div>`,
        iconSize:    [140, 52],
        iconAnchor:  [70, 52],
        popupAnchor: [0, -56],
      })

      L.marker([lat, lng], { icon: propertyIcon })
        .addTo(map)
        .bindPopup(
          `<div style="padding:4px 0">
            <div style="color:#C9A84C;font-weight:600;margin-bottom:3px">${name}</div>
            <div style="opacity:0.7;margin-bottom:2px">${location}</div>
            <div style="color:#C9A84C;font-size:13px;font-weight:600">${formatPrice(price)}</div>
            ${propertyRef ? `<div style="opacity:0.45;font-size:10px;margin-top:3px">REF: ${propertyRef}</div>` : ''}
          </div>`,
          { maxWidth: 220 }
        )

      // ── 500m radius circle (Benidorm area only) ───────────────────────────
      if (isBenidormArea(lat, lng)) {
        L.circle([lat, lng], {
          radius:      500,
          color:       '#C9A84C',
          weight:      1,
          opacity:     0.45,
          fillColor:   '#C9A84C',
          fillOpacity: 0.04,
          dashArray:   '5, 8',
        }).addTo(map)
      }

      // ── POI markers (Benidorm area only) ─────────────────────────────────
      if (isBenidormArea(lat, lng)) {
        const poiIcon = L.divIcon({
          className: '',
          html: `<div style="
            background:white;border:1.5px solid #C9A84C;border-radius:50%;
            width:10px;height:10px;box-shadow:0 2px 6px rgba(0,0,0,0.2);
          "></div>`,
          iconSize:   [10, 10],
          iconAnchor: [5, 5],
        })

        BENIDORM_POIS.forEach(poi => {
          const dist = distanceKm(lat, lng, poi.lat, poi.lng)
          // Only show POIs within 3km
          if (dist > 3) return
          const distLabel = dist < 1
            ? `${Math.round(dist * 1000)}m`
            : `${dist.toFixed(1)}km`
          L.marker([poi.lat, poi.lng], { icon: poiIcon })
            .addTo(map)
            .bindPopup(
              `<div style="padding:3px 0">
                <span style="font-size:14px">${poi.icon}</span>
                <span style="color:#C9A84C;font-weight:600;margin-left:5px">${poi.label}</span>
                <div style="opacity:0.55;font-size:10px;margin-top:2px">${distLabel} away</div>
              </div>`,
              { maxWidth: 180 }
            )
        })
      }

      // ── Custom zoom control (navy bg, gold +/−) ────────────────────────────
      const ZoomCtrl = L.Control.extend({
        onAdd() {
          const c = L.DomUtil.create('div')
          c.style.cssText = 'display:flex;flex-direction:column;gap:2px;'
          const btn = (label: string, fn: () => void) => {
            const b = L.DomUtil.create('button') as HTMLButtonElement
            b.innerHTML = label
            b.style.cssText = `
              width:32px;height:32px;background:#0D1F2D;border:1px solid rgba(201,168,76,0.4);
              color:#C9A84C;font-size:18px;cursor:pointer;display:flex;
              align-items:center;justify-content:center;line-height:1;
              transition:border-color 0.2s;
            `
            b.onmouseenter = () => { b.style.borderColor = '#C9A84C' }
            b.onmouseleave = () => { b.style.borderColor = 'rgba(201,168,76,0.4)' }
            L.DomEvent.on(b, 'click', (e) => { L.DomEvent.stopPropagation(e); fn() })
            return b
          }
          c.appendChild(btn('+', () => map.zoomIn()))
          c.appendChild(btn('−', () => map.zoomOut()))
          return c
        },
      })
      new (ZoomCtrl as any)({ position: 'topright' }).addTo(map)
    })()

    return () => {
      if (mapRef.current) {
        ;(mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
      }
    }
  }, [inView, lat, lng, name, price, location, propertyRef, locale])

  return (
    <div className="relative">
      {/* Map container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        style={{
          height: 'clamp(280px, 40vw, 420px)',
          border: '1px solid rgba(201,168,76,0.25)',
          boxShadow: '0 8px 32px rgba(13,31,45,0.10)',
        }}
      />

      {/* Info panel overlay — bottom left, only when map loaded */}
      {inView && (
        <div
          className="pointer-events-none"
          style={{
            position:       'absolute',
            bottom:         '16px',
            left:           '16px',
            zIndex:         1000,
            background:     'rgba(13,31,45,0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border:         '1px solid rgba(201,168,76,0.35)',
            borderRadius:   '4px',
            padding:        '10px 14px',
            maxWidth:       '200px',
          }}
        >
          <div style={{ color: '#C9A84C', fontFamily: 'Montserrat,sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '3px' }}>
            {name.length > 24 ? name.slice(0, 22) + '…' : name}
          </div>
          {location && (
            <div style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Montserrat,sans-serif', fontSize: '10px', letterSpacing: '0.04em' }}>
              {location}
            </div>
          )}
          {propertyRef && (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat,sans-serif', fontSize: '9px', letterSpacing: '0.06em', marginTop: '4px', textTransform: 'uppercase' }}>
              REF: {propertyRef}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
