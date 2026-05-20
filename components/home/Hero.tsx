'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

interface Props {
  locale: Locale
  page?: 'home' | 'spain' | 'cyprus'
}

export default function Hero({ locale, page = 'home' }: Props) {
  const t = getT(locale)
  const hero = t.hero[page]

  const isHome = page === 'home'

  return (
    <section className={`relative flex items-center overflow-hidden ${isHome ? 'min-h-screen' : 'min-h-[55vh]'}`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 hero-bg" />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] animate-[hero-pulse_18s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)', top: '-10%', right: '-5%' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05] animate-[float_12s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)', bottom: '10%', left: '-8%' }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-[0.04] animate-[float_8s_ease-in-out_infinite_3s]"
          style={{ background: 'radial-gradient(circle, #9faebd 0%, transparent 70%)', top: '30%', left: '30%' }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Gold vertical accent */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />

      {/* Content */}
      <div className={`container-site relative z-10 flex flex-col items-center text-center ${isHome ? 'pt-40 pb-32' : 'pt-32 pb-20'}`}>

        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in">
          <div className="w-10 h-px bg-gold/70" />
          <span className="eyebrow text-gold/80">
            Casa del Mar · International Real Estate
          </span>
          <div className="w-10 h-px bg-gold/70" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] mb-6 opacity-0 animate-fade-up whitespace-pre-line max-w-4xl">
          {hero.title}
        </h1>

        {/* Gold divider */}
        <div className="w-16 h-px bg-gold my-6 opacity-0 animate-fade-up-d1" />

        {/* Subtitle */}
        <p className="font-sans text-lg md:text-xl text-white/65 max-w-2xl leading-relaxed mb-10 opacity-0 animate-fade-up-d1">
          {hero.subtitle}
        </p>

        {/* CTAs — home only */}
        {isHome && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8 opacity-0 animate-fade-up-d2">
            <Link href={`/${locale}/spain`} className="btn-primary">
              {(hero as typeof t.hero.home).cta}
            </Link>
            <Link href={`/${locale}/cyprus`} className="btn-outline-white">
              {(hero as typeof t.hero.home).ctaContact}
            </Link>
          </div>
        )}

        {/* Scroll indicator — home only */}
        {isHome && (
          <div className="absolute bottom-[88px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-up-d3">
            <span className="font-accent text-[9px] tracking-[0.35em] uppercase text-white/35">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        )}
      </div>

      {/* Stats bar — home only */}
      {isHome && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/8"
          style={{ background: 'rgba(13,31,45,0.85)', backdropFilter: 'blur(12px)' }}
        >
          <div className="container-site">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
              {[
                { value: '200+', label: t.home.stats.properties },
                { value: '2',    label: t.home.stats.countries },
                { value: '500+', label: t.home.stats.clients },
                { value: '15+',  label: t.home.stats.years },
              ].map(stat => (
                <div key={stat.label} className="py-5 text-center">
                  <p className="font-serif text-2xl md:text-3xl text-gold font-light tracking-wide">
                    {stat.value}
                  </p>
                  <p className="font-accent text-[10px] tracking-[0.2em] text-white/45 uppercase mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
