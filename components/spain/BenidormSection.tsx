'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

interface Props { locale: Locale }

export default function BenidormSection({ locale }: Props) {
  const t = getT(locale)
  const b = t.home.benidorm
  const [open, setOpen] = useState(false)

  const facts = [
    { icon: '☀️', text: b.climate },
    { icon: '🏖️', text: b.beaches },
    { icon: '💶', text: b.rental },
    { icon: '✈️', text: b.flights },
    { icon: '🌍', text: b.community },
    { icon: '📈', text: b.growth },
  ]

  return (
    <section className="bg-white border-b border-sand-300">
      <div className="container-site py-6">
        {/* Toggle button */}
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between gap-4 text-left group"
          aria-expanded={open}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇪🇸</span>
            <div>
              <span className="font-accent text-sm tracking-[0.18em] uppercase text-navy font-semibold">
                {b.expand}
              </span>
              {!open && (
                <p className="font-sans text-xs text-navy/50 mt-0.5 hidden sm:block">
                  {b.subtitle}
                </p>
              )}
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gold transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Collapsible content */}
        <div
          className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-[1200px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
        >
          <div className="border-t border-sand-300 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: About text */}
              <div>
                <h3 className="font-serif text-2xl text-navy font-light mb-2">{b.title}</h3>
                <p className="eyebrow text-gold text-[11px] mb-4">{b.subtitle}</p>

                <div className="space-y-2 mb-6">
                  <p className="font-sans text-sm text-navy/60">
                    <span className="font-semibold text-navy">📍 Costa Blanca,</span> Alicante province, southeast Spain
                  </p>
                  <p className="font-sans text-sm text-navy/60">
                    <span className="font-semibold text-navy">👥</span> {b.population}
                  </p>
                  <p className="font-sans text-sm text-navy/60">
                    <span className="font-semibold text-navy">✈️</span> {b.airport}
                  </p>
                  <p className="font-sans text-sm text-navy/60">
                    <span className="font-semibold text-navy">🏘️</span> {b.areas}
                  </p>
                </div>

                {/* Facts grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {facts.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-sand rounded-lg p-3">
                      <span className="text-lg shrink-0">{f.icon}</span>
                      <p className="font-sans text-xs text-navy/70 leading-relaxed">{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Why buy */}
              <div>
                <h4 className="font-serif text-xl text-navy font-light mb-4">{b.why}</h4>
                <ul className="space-y-3">
                  {b.whyItems.map((item, i) => {
                    const label = typeof item === 'string' ? item : (item as { title: string }).title
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-gold font-bold text-lg leading-none mt-0.5 shrink-0">{i + 1}</span>
                        <p className="font-sans text-sm text-navy/70 leading-relaxed">{label}</p>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-6 pt-6 border-t border-sand-300 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/${locale}/benidorm`}
                    className="btn-ghost text-sm px-5 py-2.5 text-center"
                  >
                    Full Benidorm Guide →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
