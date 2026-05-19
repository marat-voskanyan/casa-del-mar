import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-gold' : 'text-white/15'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials({ locale }: { locale: Locale }) {
  const t = getT(locale)
  const { title, subtitle, items } = t.home.testimonials

  return (
    <section className="section-pad bg-sand relative overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(13,31,45,0.08) 0%, transparent 100%)',
        }}
      />

      <div className="container-site relative z-10">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <p className="eyebrow text-gold/80 mb-4">{title}</p>
          <h2 className="section-title text-navy mb-4">{title}</h2>
          <div className="gold-divider mx-auto" />
          <p className="font-sans text-navy/55 max-w-md mx-auto mt-5 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className={`relative bg-white p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-400 reveal reveal-d${i + 1}`}
            >
              {/* Opening quote mark */}
              <div className="absolute top-6 right-7 font-serif text-7xl text-gold/10 leading-none select-none">
                &ldquo;
              </div>

              {/* Stars */}
              <StarRating rating={item.rating} />

              {/* Text */}
              <p className="font-sans text-sm text-navy/70 leading-relaxed mt-5 mb-7 relative z-10">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-sand-200 pt-5">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-navy/8 flex items-center justify-center shrink-0">
                  <span className="font-serif text-lg text-navy/40 font-light">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-accent text-xs font-semibold text-navy tracking-wider">{item.name}</p>
                  <p className="font-sans text-[11px] text-navy/45 mt-0.5">{item.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
