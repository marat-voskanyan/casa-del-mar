import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'
import ContactForm from '@/components/contact/ContactForm'
import OfficeSection from '@/components/contact/OfficeSection'

interface Props { params: { locale: Locale } }

export const metadata: Metadata = { title: 'Contact Us' }

export default function ContactPage({ params: { locale } }: Props) {
  const t = getT(locale)
  const c = t.contact

  return (
    <>
      {/* Preload office interior image */}
      <link rel="preload" as="image" href="/images/inside-new.png" />

      {/* Hero */}
      <section className="hero-bg pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="container-site text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-10 h-px bg-gold/60" />
            <p className="eyebrow text-gold/80">Casa del Mar</p>
            <div className="w-10 h-px bg-gold/60" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white mb-4 leading-tight">{c.title}</h1>
          <div className="gold-divider mx-auto" />
          <p className="font-sans text-white/60 max-w-lg mx-auto mt-5 leading-relaxed">{c.subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad bg-sand">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm locale={locale} />
            </div>

            {/* Info panel */}
            <div className="lg:col-span-2">
              <div className="bg-navy p-8 h-full">
                <h3 className="font-serif text-2xl text-white font-light mb-2">{c.infoTitle}</h3>
                <div className="w-10 h-px bg-gold mb-8 mt-4" />

                <ul className="space-y-5">
                  {/* Address */}
                  <li className="flex gap-3 items-start">
                    <svg className="w-4 h-4 text-gold/70 mt-1 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="font-sans text-sm text-white/65 leading-relaxed">{c.address}</span>
                  </li>
                  {/* Tel 1 */}
                  <li className="flex gap-3 items-center">
                    <svg className="w-4 h-4 text-gold/70 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <div className="flex flex-col gap-0.5">
                      <a href={`tel:${c.tel1}`} className="font-sans text-sm text-white/65 hover:text-gold transition-colors">{c.tel1}</a>
                      <a href={`tel:${c.tel2}`} className="font-sans text-sm text-white/65 hover:text-gold transition-colors">{c.tel2}</a>
                    </div>
                  </li>
                  {/* Email */}
                  <li className="flex gap-3 items-center">
                    <svg className="w-4 h-4 text-gold/70 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <a href={`mailto:${c.emailAddr}`} className="font-sans text-sm text-white/65 hover:text-gold transition-colors">
                      {c.emailAddr}
                    </a>
                  </li>
                  {/* Hours */}
                  <li className="flex gap-3 items-center">
                    <svg className="w-4 h-4 text-gold/70 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-sans text-sm text-white/65">{c.hours}</span>
                  </li>
                </ul>

                {/* Social links */}
                <div className="mt-10 pt-8 border-t border-white/10">
                  <p className="font-accent text-[10px] tracking-[0.25em] uppercase text-gold/70 mb-5">{c.followUs}</p>
                  <div className="flex flex-col gap-3">
                    <a
                      href={c.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/55 hover:text-gold transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                      <span className="font-sans text-sm">{c.viewFacebook}</span>
                    </a>
                    <a
                      href="https://www.instagram.com/casadelmar_armenia/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/55 hover:text-gold transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="font-sans text-sm">Instagram</span>
                    </a>
                    <a
                      href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/55 hover:text-gold transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span className="font-sans text-sm">{c.chatWhatsapp}</span>
                    </a>
                  </div>
                </div>

                {/* Languages */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="font-accent text-[10px] tracking-[0.25em] uppercase text-gold/70 mb-3">Languages</p>
                  <div className="flex gap-4">
                    {['🇬🇧 English', '🇷🇺 Русский', '🇦🇲 Հայերեն'].map(lang => (
                      <span key={lang} className="font-sans text-xs text-white/50">{lang}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office section — between contact form and footer */}
      <OfficeSection locale={locale} />
    </>
  )
}
