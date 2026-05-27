'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

interface Props {
  locale: Locale
}

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'hy', label: 'AM' },
]

export default function Header({ locale }: Props) {
  const t = getT(locale)
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`

  const navLinks = [
    { href: `/${locale}`,           label: t.nav.home },
    { href: `/${locale}/spain`,     label: t.nav.spain },
    { href: `/${locale}/benidorm`,  label: t.nav.benidorm },
    { href: `/${locale}/cyprus`,    label: t.nav.cyprus },
    { href: `/${locale}/contact`,   label: t.nav.contact },
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

  const isGlass = scrolled || !isHome
  const headerCls = [
    'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
    isGlass ? 'glass shadow-nav' : 'bg-transparent border-b border-transparent',
  ].join(' ')

  return (
    <>
      <header className={headerCls}>
        <div className="container-site">
          <div className="flex items-center justify-between h-16 md:h-24">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center shrink-0">
              <Image
                src="/logo.png"
                alt="Casa del Mar International Real Estate"
                height={45}
                width={180}
                priority
                className="h-[38px] md:h-[45px] w-auto object-contain brightness-0 invert"
              />
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
            <div className="flex items-center gap-4">
              {/* Locale switcher — desktop only */}
              <div className="hidden md:flex items-center gap-1 border border-white/15 rounded-full px-3 py-1.5">
                {LOCALES.map((loc, i) => (
                  <span key={loc.code} className="flex items-center">
                    {i > 0 && <span className="text-white/20 text-[10px] mx-1.5">|</span>}
                    <Link
                      href={localeHref(loc.code)}
                      onClick={() => saveLocalePreference(loc.code)}
                      className={[
                        'font-accent text-[10px] tracking-[0.15em] transition-colors duration-200',
                        locale === loc.code ? 'text-gold font-semibold' : 'text-white/50 hover:text-white',
                      ].join(' ')}
                    >
                      {loc.label}
                    </Link>
                  </span>
                ))}
              </div>

              {/* CTA button — desktop only */}
              <Link
                href={`/${locale}/contact`}
                className="hidden lg:inline-flex btn-primary py-2.5 px-5 text-[10px]"
              >
                {t.nav.contact}
              </Link>

              {/* Mobile hamburger */}
              <button
                className="md:hidden flex items-center justify-center w-12 h-12 text-white rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(v => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Fullscreen mobile menu overlay ── */}
      <div
        className={[
          'fixed inset-0 z-[60] flex flex-col md:hidden',
          'transition-transform duration-300 ease-in-out',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        style={{ background: '#0D1F2D' }}
        aria-hidden={!menuOpen}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <Link href={`/${locale}`} onClick={() => setMenuOpen(false)} className="flex items-center">
            <Image
              src="/logo.png"
              alt="Casa del Mar International Real Estate"
              height={38}
              width={152}
              className="h-[38px] w-auto object-contain brightness-0 invert"
            />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex items-center justify-center w-12 h-12 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center px-6" aria-label="Mobile">
          {navLinks.map(link => {
            const active = pathname === link.href || pathname === link.href + '/'
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={[
                  'flex items-center justify-between py-4 border-b border-white/8',
                  'font-serif text-2xl font-light tracking-wide',
                  'transition-colors duration-150',
                  active ? 'text-gold' : 'text-white',
                ].join(' ')}
              >
                {link.label}
                {active && (
                  <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Language + social */}
        <div className="px-6 pb-10 space-y-6">
          {/* Language switcher */}
          <div className="flex items-center gap-4">
            <span className="font-accent text-[10px] tracking-[0.2em] uppercase text-white/35">
              Language
            </span>
            <div className="flex gap-1">
              {LOCALES.map(loc => (
                <Link
                  key={loc.code}
                  href={localeHref(loc.code)}
                  onClick={() => {
                    saveLocalePreference(loc.code)
                    setMenuOpen(false)
                  }}
                  className={[
                    'px-3 py-1.5 rounded font-accent text-sm tracking-wider transition-colors',
                    locale === loc.code
                      ? 'bg-gold text-navy font-semibold'
                      : 'text-white/50 hover:text-white border border-white/15',
                  ].join(' ')}
                >
                  {loc.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social links */}
          <div className="flex gap-4">
            <a
              href="https://wa.me/37444203008"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-green-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="https://www.facebook.com/Casadelmar.am"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
          </div>

          {/* Phone */}
          <a
            href="tel:+37444203008"
            className="block font-sans text-sm text-white/40 hover:text-gold transition-colors"
          >
            +374-44-20-30-08
          </a>
        </div>
      </div>
    </>
  )
}
