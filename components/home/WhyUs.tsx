import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

const ICONS = [
  // Expert guidance — sparkle
  <svg key="guidance" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>,
  // Prime locations — map pin
  <svg key="location" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>,
  // Legal support — shield check
  <svg key="legal" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>,
  // After-sales — heart
  <svg key="aftersales" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>,
]

export default function WhyUs({ locale }: { locale: Locale }) {
  const t = getT(locale)

  return (
    <section className="section-pad bg-navy relative overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,168,76,1) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Right-side gold orb */}
      <div
        className="absolute -right-40 top-0 bottom-0 w-96 opacity-5"
        style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)' }}
      />

      <div className="container-site relative z-10">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="eyebrow text-gold mb-4">Casa del Mar</p>
          <h2 className="section-title text-white mb-4">{t.home.why}</h2>
          <div className="gold-divider mx-auto" />
          <p className="font-sans text-white/55 max-w-lg mx-auto mt-5 leading-relaxed">
            {t.home.whySub}
          </p>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.home.whyItems.map((item, i) => (
            <div
              key={i}
              className={`group relative p-8 border border-white/8 overflow-hidden
                hover:border-gold/25
                transition-all duration-700 ease-out
                reveal reveal-d${i + 1}`}
              style={{ background: 'rgba(255,255,255,0.025)' }}
            >
              {/* Index number */}
              <span className="absolute top-4 right-5 font-serif text-[4rem] font-light
                text-white/[0.04] leading-none select-none
                group-hover:text-[#C9A84C]/10 transition-colors duration-700">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Gold top accent — grows in on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9A84C]
                scale-x-0 group-hover:scale-x-100 origin-left
                transition-transform duration-700 ease-out" />

              {/* Icon */}
              <div className="w-12 h-12 border border-gold/20 flex items-center justify-center
                text-gold mb-7
                group-hover:border-gold/50 group-hover:bg-gold/8
                transition-all duration-700">
                {ICONS[i]}
              </div>

              <h3 className="font-serif text-[1.25rem] text-white mb-3 leading-snug font-light
                group-hover:text-[#C9A84C] transition-colors duration-500">{item.title}</h3>
              <div className="w-8 h-px bg-gold/40 mb-4 group-hover:w-14 transition-all duration-700 ease-out" />
              <p className="font-sans text-sm text-white/50 leading-relaxed group-hover:text-white/65 transition-colors duration-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
