'use client'

import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
  onPick: (lat: number, lng: number) => void
}

export default function MapPicker({ lat, lng, onPick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let map: any
    let marker: any

    ;(async () => {
      const L = (await import('leaflet')).default

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;background:#C9A84C;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      })

      map = L.map(containerRef.current!, { zoomControl: true, scrollWheelZoom: true })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      map.setView([lat, lng], 12)

      marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        onPick(pos.lat, pos.lng)
      })

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng)
        onPick(e.latlng.lat, e.latlng.lng)
      })
    })()

    return () => { if (map) map.remove() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
