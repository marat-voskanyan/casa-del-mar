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

const CTRL_ZOOM_MSG: Record<string, string> = {
  en: 'Use Ctrl + scroll to zoom',
  ru: 'Ctrl + прокрутка для зума',
  hy: 'Ctrl + scroll՝ մեծացնելու համար',
}

export default function PropertyMapInner({ lat, lng, name, price, location, propertyRef, locale }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<unknown>(null)
  const inViewRef     = useRef(false)
  const [inView,      setInView]      = useState(false)
  const [showHint,    setShowHint]    = useState(false)
  const hintTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const t = getT(locale)

  function flashHint() {
    setShowHint(true)
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    hintTimerRef.current = setTimeout(() => setShowHint(false), 1500)
  }

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

      // ── Map init — scroll wheel zoom off by default ───────────────────────
      const map = L.map(containerRef.current!, {
        zoomControl:        false,
        scrollWheelZoom:    false,
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

      // ── Ctrl + scroll zoom ────────────────────────────────────────────────
      let ctrlPressed = false

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Control' || e.key === 'Meta') {
          ctrlPressed = true
          map.scrollWheelZoom.enable()
        }
      }
      const onKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Control' || e.key === 'Meta') {
          ctrlPressed = false
          map.scrollWheelZoom.disable()
        }
      }
      // Also disable if window loses focus
      const onBlur = () => { ctrlPressed = false; map.scrollWheelZoom.disable() }

      document.addEventListener('keydown', onKeyDown)
      document.addEventListener('keyup',   onKeyUp)
      window.addEventListener('blur',      onBlur)

      // Show hint when user scrolls over map without Ctrl
      const mapEl = containerRef.current as HTMLElement
      const onWheel = (e: WheelEvent) => {
        if (!ctrlPressed) {
          e.preventDefault()
          flashHint()
        }
      }
      mapEl.addEventListener('wheel', onWheel, { passive: false })

      // ── Custom luxury property marker — ONLY marker on map ────────────────
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

      // ── Custom zoom control (navy bg, gold +/−) ────────────────────────────
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
            L.DomEvent.on(b, 'click', (e) => { L.DomEvent.stopPropagation(e); fn() })
            return b
          }
          c.appendChild(btn('+', () => map.zoomIn()))
          c.appendChild(btn('−', () => map.zoomOut()))
          return c
        },
      })
      new (ZoomCtrl as any)({ position: 'topright' }).addTo(map)

      // Cleanup listeners when map is destroyed
      const origRemove = map.remove.bind(map)
      ;(map as any).remove = () => {
        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('keyup',   onKeyUp)
        window.removeEventListener('blur',      onBlur)
        mapEl.removeEventListener('wheel', onWheel)
        origRemove()
      }
    })()

    return () => {
      if (mapRef.current) {
        ;(mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
      }
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    }
  }, [inView, lat, lng, name, price, location, propertyRef, locale])

  const hintMsg = CTRL_ZOOM_MSG[locale] ?? CTRL_ZOOM_MSG.en

  return (
    <div className="relative">
      {/* Map container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        style={{
          height:    'clamp(280px, 40vw, 420px)',
          border:    '1px solid rgba(201,168,76,0.25)',
          boxShadow: '0 8px 32px rgba(13,31,45,0.10)',
        }}
      />

      {/* Ctrl+scroll hint overlay */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: showHint ? 1 : 0 }}
      >
        <div style={{
          background:     'rgba(13,31,45,0.82)',
          backdropFilter: 'blur(6px)',
          border:         '1px solid rgba(201,168,76,0.35)',
          borderRadius:   '4px',
          padding:        '10px 18px',
          color:          '#C9A84C',
          fontFamily:     'Montserrat,sans-serif',
          fontSize:       '12px',
          letterSpacing:  '0.06em',
          textTransform:  'uppercase',
          fontWeight:     600,
        }}>
          {hintMsg}
        </div>
      </div>

      {/* Info panel overlay — bottom left */}
      {inView && (
        <div
          className="pointer-events-none"
          style={{
            position:             'absolute',
            bottom:               '16px',
            left:                 '16px',
            zIndex:               1000,
            background:           'rgba(13,31,45,0.92)',
            backdropFilter:       'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border:               '1px solid rgba(201,168,76,0.35)',
            borderRadius:         '4px',
            padding:              '10px 14px',
            maxWidth:             '200px',
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
