'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import type { Property } from '@/types'

const COUNTRY_FLAG: Record<string, string> = { spain: '🇪🇸', cyprus: '🇨🇾' }
const STATUS_STYLE: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  sold:      'bg-red-100 text-red-800',
  reserved:  'bg-amber-100 text-amber-800',
}

function fmt(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

function NotesIcon({ notes }: { notes: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        title="View internal notes"
        className="text-lg hover:scale-110 transition-transform"
      >
        📋
      </button>
      {open && (
        <div className="absolute z-50 right-0 mt-1 w-72 bg-[#FFFBEB] border border-yellow-300 rounded-lg shadow-xl p-4 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-bold text-red-700 uppercase tracking-wide">Internal Notes</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
          </div>
          <p className="font-sans text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{notes}</p>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'spain' | 'cyprus'>('all')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/properties')
      const data = await res.json()
      setProperties(data.properties || [])
    } catch { /* */ }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      setProperties(prev => prev.filter(p => p.id !== id))
    } catch { /* */ }
    finally { setDeleting(null) }
  }

  const visible = filter === 'all' ? properties : properties.filter(p => p.country === filter)
  const spainCount  = properties.filter(p => p.country === 'spain').length
  const cyprusCount = properties.filter(p => p.country === 'cyprus').length
  const availableCount = properties.filter(p => p.status === 'available').length

  return (
    <div className="flex">
      <AdminNav />

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl text-navy font-light">Properties</h1>
              <p className="font-sans text-sm text-gray-500 mt-1">
                {properties.length} total · {availableCount} available
              </p>
            </div>
            <Link href="/admin/properties/new" className="admin-btn">
              + Add Property
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', value: properties.length, color: 'border-navy' },
              { label: '🇪🇸 Spain', value: spainCount, color: 'border-blue-500' },
              { label: '🇨🇾 Cyprus', value: cyprusCount, color: 'border-cyan-500' },
              { label: 'Available', value: availableCount, color: 'border-emerald-500' },
            ].map(s => (
              <div key={s.label} className={`bg-white rounded shadow-sm p-4 border-l-4 ${s.color}`}>
                <p className="font-sans text-2xl font-semibold text-navy">{s.value}</p>
                <p className="font-sans text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4">
            {(['all', 'spain', 'cyprus'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium capitalize transition-colors ${
                  filter === f ? 'bg-navy text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'All' : f === 'spain' ? '🇪🇸 Spain' : '🇨🇾 Cyprus'}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-16 text-gray-400 font-sans text-sm">Loading…</div>
          ) : visible.length === 0 ? (
            <div className="text-center py-16 bg-white rounded shadow-sm">
              <p className="font-serif text-xl text-gray-400">No properties yet</p>
              <Link href="/admin/properties/new" className="admin-btn inline-block mt-4">
                Add your first property
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <table className="w-full text-sm font-sans">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Property</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold hidden md:table-cell">Country</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold hidden md:table-cell">Price</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Status</th>
                    <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold hidden md:table-cell">Notes</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visible.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">📍 {p.location}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-base">{COUNTRY_FLAG[p.country]}</span>
                        <span className="ml-1 capitalize text-gray-600">{p.country}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-700 font-medium">
                        {fmt(p.price)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLE[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        {p.internal_notes ? (
                          <NotesIcon notes={p.internal_notes} />
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/properties/${p.id}/edit`}
                            className="px-3 py-1.5 text-xs bg-navy text-white rounded hover:bg-navy-800 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deleting === p.id}
                            className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            {deleting === p.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
