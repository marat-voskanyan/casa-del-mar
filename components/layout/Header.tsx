'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

interface Props {
  locale: Locale
}

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'hy', label: 'HY' },
]

export default function Header({ locale }: Props) {
  const t = getT(locale)
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`

  const navLinks = [
    { href: `/${locale}`,         label: t.nav.home },
    { href: `/${locale}/spain`,   label: t.nav.spain },
    { href: `/${locale}/cyprus`,  label: t.nav.cyprus },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ]

  function localeHref(newLocale: Locale) {
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/')
  }

  function saveLocalePreference(newLocale: Locale) {
    try {
      document.cookie = `preferred_locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`
      localStorage.setItem('preferred_locale', newLocale)
    } catch {}
  }

  // Transparent on home hero, glass when scrolled or on inner pages
  const isGlass = scrolled || !isHome
  const headerCls = [
    'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
    isGlass
      ? 'glass shadow-nav'
      : 'bg-transparent border-b border-transparent',
  ].join(' ')

  return (
    <header className={headerCls}>
      <div className="container-site">
        <div className="flex items-center justify-between h-20 md:h-24">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex flex-col leading-none shrink-0">
            <span className="font-serif text-2xl font-normal text-white tracking-wide group-hover:text-gold transition-colors">
              Casa del Mar
            </span>
            <span className="font-accent text-[9px] tracking-[0.35em] uppercase text-gold/80 mt-0.5">
              International Real Estate
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Primary">
            {navLinks.map(link => {
              const active = pathname === link.href || pathname === link.href + '/'
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'relative font-accent text-[11px] tracking-[0.22em] uppercase pb-1',
                    'transition-colors duration-200',
                    active
                      ? 'text-gold after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gold'
                      : 'text-white/75 hover:text-white',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: locale + CTA + hamburger */}
          <div className="flex items-center gap-5">
            {/* Locale switcher */}
            <div className="hidden md:flex items-center gap-1 border border-white/15 rounded-full px-3 py-1.5">
              {LOCALES.map((loc, i) => (
                <span key={loc.code} className="flex items-center">
                  {i > 0 && <span className="text-white/20 text-[10px] mx-1.5">|</span>}
                  <Link
                    href={localeHref(loc.code)}
                    onClick={() => saveLocalePreference(loc.code)}
                    className={[
                      'font-accent text-[10px] tracking-[0.15em] transition-colors duration-200',
                      locale === loc.code
                        ? 'text-gold font-semibold'
                        : 'text-white/50 hover:text-white',
                    ].join(' ')}
                  >
                    {loc.label}
                  </Link>
                </span>
              ))}
            </div>

            {/* CTA button (hidden on very small screens) */}
            <Link
              href={`/${locale}/contact`}
              className="hidden lg:inline-flex btn-primary py-2.5 px-5 text-[10px]"
            >
              {t.nav.contact}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white p-1.5 -mr-1.5 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — slide down */}
      <div
        className={[
          'md:hidden overflow-hidden transition-all duration-300',
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
        style={{ background: 'rgba(13,31,45,0.97)', backdropFilter: 'blur(20px)' }}
      >
        <div className="container-site pb-6 pt-2">
          <nav className="flex flex-col">
            {navLinks.map(link => {
              const active = pathname === link.href || pathname === link.href + '/'
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'py-3.5 border-b border-white/8 font-accent text-sm tracking-[0.18em] uppercase',
                    'transition-colors duration-150',
                    active ? 'text-gold' : 'text-white/75',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile locale switcher */}
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/10">
            <span className="font-accent text-[10px] tracking-[0.2em] uppercase text-white/40">Language</span>
            <div className="flex gap-3">
              {LOCALES.map(loc => (
                <Link
                  key={loc.code}
                  href={localeHref(loc.code)}
                  onClick={() => {
                    document.cookie = `preferred_locale=${loc.code};path=/;max-age=31536000;SameSite=Lax`
                    try { localStorage.setItem('preferred_locale', loc.code) } catch {}
                  }}
                  className={[
                    'font-accent text-sm tracking-wider transition-colors',
                    locale === loc.code ? 'text-gold font-semibold' : 'text-white/50',
                  ].join(' ')}
                >
                  {loc.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
