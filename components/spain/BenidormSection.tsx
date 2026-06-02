'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'
import { getYearsExperience } from '@/lib/years'
import { SunIcon, WavesIcon, PlaneIcon, ThermometerIcon } from '@/components/icons/LuxuryIcons'

interface Props { locale: Locale }

const FACTS = [
  { icon: <SunIcon size={22} className="text-[#C9A84C]" />,         value: '320+', label: 'Sunny Days' },
  { icon: <WavesIcon size={22} className="text-[#C9A84C]" />,       value: '2',    label: 'Famous Beaches' },
  { icon: <PlaneIcon size={22} className="text-[#C9A84C]" />,       value: '60km', label: 'To Airport' },
  { icon: <ThermometerIcon size={22} className="text-[#C9A84C]" />, value: '20°C', label: 'Average Temp' },
]

export default function BenidormSection({ locale }: Props) {
  const t = getT(locale)
  const b = t.home.benidorm
  const [open,    setOpen]    = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setAnimate(true), 50)
      return () => clearTimeout(timer)
    } else {
      setAnimate(false)
    }
  }, [open])

  const armenianFont = "'Noto Sans Armenian', 'Noto Serif Armenian', 'Arial Unicode MS', sans-serif"

  return (
    <section
      className="bg-[#0D1F2D]"
      lang={locale}
      style={locale === 'hy' ? { fontFamily: armenianFont } : undefined}
    >
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="about-benidorm-trigger w-full flex items-center justify-between
          px-6 md:px-10 py-5 border-b border-[#C9A84C]/20
          hover:border-[#C9A84C]/60 transition-all duration-300 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-px bg-[#C9A84C] shrink-0" />
          <span className="font-accent text-xs tracking-[0.28em] uppercase text-[#C9A84C]">
            {b.expand}
          </span>
          <span className="hidden sm:block font-sans text-xs text-white/35">—</span>
          <span className="hidden sm:block font-sans text-xs text-white/35 italic">{b.subtitle}</span>
        </div>
        <svg
          className={`w-4 h-4 text-[#C9A84C] transition-transform duration-500 shrink-0
            ${open ? 'rotate-180' : 'rotate-0'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Collapsible content ── */}
      <div
        className="overflow-hidden"
        style={{
          maxHeight:  open ? '700px' : '0px',
          opacity:    open ? 1 : 0,
          transform:  open ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'max-height 0.7s ease-in-out, opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Gold top accent line */}
        <div className="h-[2px] bg-[#C9A84C] w-full" />

        <div className="container-site py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* ── Left: About text ── */}
            <div>
              <p
                className="font-accent text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-3"
                style={{
                  opacity:    animate ? 1 : 0,
                  transform:  animate ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease 0.05s, transform 0.5s ease 0.05s',
                }}
              >
                Costa Blanca · Spain
              </p>
              <h3
                className="font-serif text-4xl md:text-5xl text-white font-light mb-4 leading-tight"
                style={{
                  opacity:    animate ? 1 : 0,
                  transform:  animate ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
                }}
              >
                Benidorm
              </h3>
              <div className="w-12 h-px bg-[#C9A84C] mb-5" />
              <p
                className="font-sans text-sm text-white/60 leading-relaxed mb-6 max-w-sm"
                style={{
                  opacity:    animate ? 1 : 0,
                  transform:  animate ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
                }}
              >
                {locale === 'ru'
                  ? 'Бенидорм — ведущий курортный город Коста Бланки с 320+ солнечными днями в году. Один из самых посещаемых городов Испании.'
                  : locale === 'hy'
                  ? 'Բenenidormը Կоستа Բlankayum aaarachatarar hankstavarq taghn e, 320+ araevnay orner tarakan. Испаниայи amenaaytselvadz taqhnerits voch mekn e.'
                  : 'Benidorm is Costa Blanca\'s premier resort city with 320+ sunny days per year. One of Spain\'s most visited cities, with world-class beaches and year-round tourism.'}
              </p>
              <div
                style={{
                  opacity:    animate ? 1 : 0,
                  transform:  animate ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease 0.25s, transform 0.5s ease 0.25s',
                }}
              >
                <Link
                  href={`/${locale}/benidorm`}
                  className="inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.2em]
                    uppercase text-[#C9A84C] hover:text-white border border-[#C9A84C]/40
                    hover:border-[#C9A84C] px-5 py-2.5 transition-all duration-300"
                >
                  {locale === 'ru' ? 'Полный гид по Бенидорму'
                   : locale === 'hy' ? 'Բenidormi ughecuyts'
                   : 'Full Benidorm Guide'}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* ── Right: 4 fact cards 2×2 ── */}
            <div className="grid grid-cols-2 gap-4">
              {FACTS.map((f, i) => (
                <div
                  key={f.label}
                  className="bg-white/5 border border-white/8 p-5 hover:border-[#C9A84C]/40
                    hover:bg-white/8 transition-all duration-300"
                  style={{
                    opacity:    animate ? 1 : 0,
                    transform:  animate ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.5s ease ${0.3 + i * 0.05}s, transform 0.5s ease ${0.3 + i * 0.05}s`,
                  }}
                >
                  <div className="mb-2">{f.icon}</div>
                  <p className="font-serif text-2xl text-[#C9A84C] font-light">{f.value}</p>
                  <p className="font-accent text-[10px] tracking-[0.18em] uppercase text-white/45 mt-1">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
