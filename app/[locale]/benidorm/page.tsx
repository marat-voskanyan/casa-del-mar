import type { Metadata } from 'next'
import Link from 'next/link'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

interface Props { params: { locale: Locale } }

export const metadata: Metadata = {
  title: 'Benidorm Real Estate Guide | Casa del Mar',
  description: 'Everything you need to know about buying property in Benidorm. Climate, beaches, rental yields, investment potential — Costa Blanca\'s premier resort city.',
}

export default function BenidormPage({ params: { locale } }: Props) {
  const t = getT(locale)
  const b = t.home.benidorm
  const c = t.contact

  const whyCards = [
    { icon: '🏙️', title: 'Rental Demand',     desc: b.whyItems[0] },
    { icon: '💶', title: 'Rental Yield',      desc: b.whyItems[1] },
    { icon: '🌞', title: 'Year-Round Tourism', desc: b.whyItems[2] },
    { icon: '🌊', title: 'Sea-View Apartments', desc: b.whyItems[3] },
    { icon: '🌍', title: 'Expat Community',   desc: b.whyItems[4] },
    { icon: '✈️', title: 'Direct Flights',    desc: b.whyItems[5] },
  ]

  const facts = [
    { label: 'Location',    value: 'Costa Blanca, Alicante, southeast Spain' },
    { label: 'Population',  value: b.population },
    { label: 'Climate',     value: b.climate },
    { label: 'Beaches',     value: b.beaches },
    { label: 'Rental Yield', value: b.rental },
    { label: 'Airport',     value: b.airport },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-center min-h-[60vh] overflow-hidden">
        <div className="absolute inset-0 hero-bg" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&q=80)' }}
        />
        <div className="relative container-site z-10 py-32 text-center">
          <div className="flex items-center justify-center gap-4 mb-8 opacity-0 animate-fade-in">
            <div className="w-10 h-px bg-gold/70" />
            <span className="eyebrow text-gold/80">🇪🇸 Costa Blanca · Spain</span>
            <div className="w-10 h-px bg-gold/70" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-white mb-6 opacity-0 animate-fade-up">
            {b.title}
          </h1>
          <div className="w-16 h-px bg-gold my-6 mx-auto opacity-0 animate-fade-up-d1" />
          <p className="font-sans text-xl text-white/65 max-w-2xl mx-auto opacity-0 animate-fade-up-d1">
            {b.subtitle}
          </p>
        </div>
      </section>

      {/* Key Facts */}
      <section className="section-pad bg-sand">
        <div className="container-site">
          <div className="text-center mb-12 reveal">
            <p className="eyebrow text-gold mb-3">{b.infoLabel}</p>
            <h2 className="section-title text-navy mb-4">Benidorm at a Glance</h2>
            <div className="gold-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {facts.map(fact => (
              <div key={fact.label} className="bg-white p-6 reveal border-l-4 border-gold shadow-sm">
                <p className="font-accent text-[10px] tracking-[0.25em] uppercase text-gold/80 mb-2">{fact.label}</p>
                <p className="font-sans text-sm text-navy/80 leading-relaxed">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Benidorm */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="reveal">
              <p className="eyebrow text-gold mb-3">La Cala · Levante · Poniente</p>
              <h2 className="section-title text-navy mb-6">The Heart of the Costa Blanca</h2>
              <div className="gold-divider mb-8" />
              <div className="space-y-4 font-sans text-navy/70 leading-relaxed text-[15px]">
                <p>
                  Benidorm is one of Spain&apos;s most iconic coastal cities, located on the Costa Blanca in the Alicante province of southeast Spain. With over 320 sunny days per year and an average temperature of 20°C, it offers one of Europe&apos;s most enviable climates.
                </p>
                <p>
                  The city is divided by a historic headland into two magnificent sandy beaches: <strong className="text-navy">Playa de Levante</strong> and <strong className="text-navy">Playa de Poniente</strong>. Between them lies <strong className="text-navy">La Cala</strong> — the vibrant heart of Benidorm and the most popular area for apartment purchases.
                </p>
                <p>
                  Benidorm&apos;s excellent infrastructure includes modern hospitals, international schools, supermarkets, and reliable public transport. Alicante Airport is just 60km away with direct flights from Yerevan available through multiple airlines.
                </p>
                <p>
                  With a permanent population of around 70,000 residents and millions of tourists annually, Benidorm offers year-round activity and a thriving rental market. This is not just a summer destination — it&apos;s a genuine international city with a large expat community.
                </p>
              </div>
            </div>

            <div className="reveal">
              <div
                className="aspect-[4/5] bg-cover bg-center rounded-none shadow-2xl"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=600&q=80)' }}
              />
              <div className="mt-4 bg-sand p-5">
                <p className="font-accent text-[10px] tracking-[0.25em] uppercase text-gold mb-2">Our Areas</p>
                <p className="font-sans text-sm text-navy/70 leading-relaxed">{b.areas}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Invest */}
      <section className="section-pad bg-navy-900">
        <div className="container-site">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">Investment Case</p>
            <h2 className="section-title text-white mb-4">{b.why}</h2>
            <div className="gold-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((card, i) => (
              <div key={i} className="bg-white/5 border border-white/8 p-6 reveal hover:bg-white/8 hover:border-gold/30 transition-all duration-300">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-serif text-lg text-white font-light mb-2">{card.title}</h3>
                <p className="font-sans text-sm text-white/55 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Location */}
      <section className="section-pad bg-sand">
        <div className="container-site">
          <div className="text-center mb-10 reveal">
            <p className="eyebrow text-gold mb-3">Location</p>
            <h2 className="section-title text-navy mb-4">Benidorm on the Map</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="reveal overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50255.86537!2d-0.1338!3d38.5432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd61f0059e51b6a5%3A0x400b7e2a6e7a3d0!2sBenidorm%2C%20Alicante%2C%20Spain!5e0!3m2!1sen!2s!4v1"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Benidorm location"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 px-8 bg-navy-900">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-[#0D1F2D] to-navy-900" />
        <div className="relative container-site text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-4">
            {b.cta}
          </h2>
          <p className="font-sans text-white/55 text-lg mb-10 max-w-xl mx-auto">
            Browse our selection of apartments and villas in Benidorm and the Costa Blanca
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/spain`} className="btn-primary text-sm px-8 py-4">
              {b.cta}
            </Link>
            <Link href={`/${locale}/contact`} className="btn-outline-white text-sm px-8 py-4">
              {t.property.inquire}
            </Link>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/40">
            <a href={`tel:${c.tel1}`} className="font-sans text-sm hover:text-gold transition-colors">{c.tel1}</a>
            <a href={`mailto:${c.emailAddr}`} className="font-sans text-sm hover:text-gold transition-colors">{c.emailAddr}</a>
          </div>
        </div>
      </section>
    </>
  )
}
