import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

export default function AboutServices({ locale }: { locale: Locale }) {
  const t = getT(locale)
  const { about, services } = t.home

  return (
    <section className="section-pad bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-[0.025]"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 100% 50%, #0D1F2D 0%, transparent 100%)',
        }}
      />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: About */}
          <div className="reveal">
            <p className="eyebrow text-gold mb-4">{about.subtitle}</p>
            <h2 className="section-title text-navy mb-4 leading-tight">{about.title}</h2>
            <div className="gold-divider" />
            <p className="font-sans text-navy/65 leading-relaxed mt-6 text-base">
              {about.text}
            </p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-sand-200">
              {[
                { value: '2',    label: t.home.stats.countries },
                { value: '6+',   label: t.home.stats.years },
                { value: '200+', label: t.home.stats.clients },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-3xl text-navy font-light">{stat.value}</p>
                  <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-navy/45 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Services */}
          <div className="reveal reveal-d2">
            <p className="eyebrow text-gold mb-4">{services.subtitle}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-navy mb-4">{services.title}</h2>
            <div className="gold-divider" />

            <ul className="mt-8 grid grid-cols-1 gap-3">
              {services.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 py-3 border-b border-sand-100 last:border-0"
                >
                  <CheckIcon />
                  <span className="font-sans text-sm text-navy/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
