import Link from 'next/link'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

interface Props { locale: Locale }

export default function ContactStrip({ locale }: Props) {
  const t = getT(locale)
  const c = t.contact
  const cs = t.home.contactStrip

  return (
    <section className="relative overflow-hidden py-24 md:py-32 px-8 bg-[#0D1F2D]">
      {/* Gold top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
      {/* Subtle diagonal lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(60deg, #C9A84C 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      {/* Radial gold glow center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        w-[600px] h-[300px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(ellipse, #C9A84C 0%, transparent 70%)' }} />

      <div className="relative container-site">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Text */}
          <div className="text-center lg:text-left max-w-2xl">
            <h2 className="font-serif text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] font-light text-white mb-4 leading-[1.08] tracking-[-0.01em]">
              {cs.title}
            </h2>
            <p className="font-sans text-white/55 text-lg leading-relaxed">
              {cs.subtitle}
            </p>

            {/* Contact details */}
            <div className="flex flex-col sm:flex-row gap-6 mt-8 justify-center lg:justify-start">
              <a href={`tel:${c.tel1}`} className="flex items-center gap-2 text-gold/80 hover:text-gold transition-colors">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="font-sans text-sm">{c.tel1}</span>
              </a>
              <a href={`mailto:${c.emailAddr}`} className="flex items-center gap-2 text-gold/80 hover:text-gold transition-colors">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="font-sans text-sm">{c.emailAddr}</span>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <Link
              href={`/${locale}/contact`}
              className="btn-primary text-sm px-8 py-4 min-w-[220px] text-center"
            >
              {cs.cta}
            </Link>
            <a
              href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm px-8 py-4 min-w-[220px] text-center flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
