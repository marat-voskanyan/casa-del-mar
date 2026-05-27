'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

export default function Footer({ locale }: { locale: Locale }) {
  const t = getT(locale)
  const c = t.contact

  const navLinks = [
    { href: `/${locale}`,         label: t.nav.home },
    { href: `/${locale}/spain`,   label: t.nav.spain },
    { href: `/${locale}/cyprus`,  label: t.nav.cyprus },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ]

  return (
    <footer className="bg-navy-900 text-white/60">
      {/* Top bar with gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="container-site pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image
                src="/logo.png"
                alt="Casa del Mar"
                height={40}
                width={160}
                className="h-[40px] w-auto object-contain"
              />
            </div>
            <div className="w-10 h-px bg-gold mb-5" />
            <p className="font-sans text-sm leading-relaxed text-white/55">{t.footer.desc}</p>

            {/* Social links */}
            <div className="mt-6">
              <p className="font-accent text-[10px] tracking-[0.25em] uppercase text-gold/70 mb-3">
                {t.footer.followUs}
              </p>
              <div className="flex gap-3">
                {/* Facebook */}
                <a
                  href={c.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/casadelmar_armenia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold/80 mb-6">
              {t.footer.links}
            </h4>
            <ul className="space-y-3">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/50 hover:text-gold transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-gold/0 group-hover:bg-gold/60 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold/80 mb-6">
              {t.footer.contact}
            </h4>
            <ul className="space-y-4 font-sans text-sm">
              <li className="flex gap-3 items-start">
                <span className="text-gold/70 mt-0.5 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <span className="text-white/55 leading-relaxed">{c.address}</span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-gold/70 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <div className="flex flex-col gap-0.5">
                  <a href={`tel:${c.tel1}`} className="text-white/55 hover:text-gold transition-colors">{c.tel1}</a>
                  <a href={`tel:${c.tel2}`} className="text-white/55 hover:text-gold transition-colors">{c.tel2}</a>
                </div>
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-gold/70 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <a href={`mailto:${c.emailAddr}`} className="text-white/55 hover:text-gold transition-colors">
                  {c.emailAddr}
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-gold/70 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-white/55">{c.hours}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold/80 mb-6">
              {t.footer.newsletter}
            </h4>
            <p className="font-sans text-sm text-white/50 mb-4 leading-relaxed">
              {locale === 'ru'
                ? 'Получайте свежие предложения прямо на почту'
                : locale === 'hy'
                ? 'Ստացեք նորագույն առաջարկները ձեր էլ. հասցեին'
                : 'Get the latest listings delivered to your inbox'}
            </p>
            <form
              onSubmit={e => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder={t.footer.newsletterPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-sans text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:bg-white/8 transition-all duration-200"
              />
              <button
                type="submit"
                className="btn-primary w-full py-3 text-[10px]"
              >
                {t.footer.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-white/30">
            © {new Date().getFullYear()} Casa del Mar. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <a href={c.facebookUrl} target="_blank" rel="noopener noreferrer"
               className="font-accent text-[10px] tracking-widest text-white/25 hover:text-gold/60 uppercase transition-colors">
              Facebook
            </a>
            <a href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
               className="font-accent text-[10px] tracking-widest text-white/25 hover:text-gold/60 uppercase transition-colors">
              WhatsApp
            </a>
            <span className="font-accent text-[10px] tracking-widest text-white/25">
              {c.tel1}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
