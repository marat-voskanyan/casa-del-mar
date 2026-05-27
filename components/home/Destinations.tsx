import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'
import { BENIDORM_IMAGES, IMAGE_ALT } from '@/lib/images'

interface Props { locale: Locale }

export default function Destinations({ locale }: Props) {
  const t = getT(locale)
  const d = t.home.destinations

  const cards = [
    {
      key:    'spain',
      href:   `/${locale}/spain`,
      title:  d.spain.title,
      desc:   d.spain.desc,
      flag:   '🇪🇸',
      src:    BENIDORM_IMAGES.cards.spain_destination,
      alt:    IMAGE_ALT.spain_destination,
    },
    {
      key:    'cyprus',
      href:   `/${locale}/cyprus`,
      title:  d.cyprus.title,
      desc:   d.cyprus.desc,
      flag:   '🇨🇾',
      src:    BENIDORM_IMAGES.cards.cyprus_destination,
      alt:    IMAGE_ALT.cyprus_destination,
    },
  ]

  return (
    <section className="section-pad bg-navy-900">
      <div className="container-site">
        <div className="text-center mb-14 reveal">
          <p className="eyebrow text-gold mb-3">{d.title}</p>
          <h2 className="section-title text-white mb-4">{d.subtitle}</h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map(card => (
            <Link
              key={card.key}
              href={card.href}
              className="group relative overflow-hidden aspect-[16/10] block reveal"
            >
              {/* Background image */}
              <Image
                src={card.src}
                alt={card.alt}
                fill
                loading="lazy"
                quality={75}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-navy-900/10 group-hover:from-navy-900/80 transition-all duration-500" />

              {/* Gold border on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/50 transition-all duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-white mb-2 group-hover:text-gold transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="font-sans text-sm text-white/60 max-w-xs leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gold/70 group-hover:text-gold transition-colors duration-300 shrink-0 ml-4">
                    <span className="font-accent text-[10px] tracking-[0.25em] uppercase hidden sm:block">
                      {d.cta}
                    </span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
