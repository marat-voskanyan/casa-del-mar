import type { Metadata } from 'next'
import Link from 'next/link'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

interface Props { params: { locale: Locale } }

export function generateMetadata({ params }: Props): Metadata {
  const locale = params.locale
  const isRu = locale === 'ru'
  const isHy = locale === 'hy'
  return {
    title: isRu
      ? 'Недвижимость в Бенидорме — Гид по Ла Кала | Casa del Mar'
      : isHy
        ? 'Բ. Գ. La Cala | Casa del Mar'
        : 'Benidorm Property Guide — La Cala Apartments | Casa del Mar',
    description: isRu
      ? 'Полный гид по покупке недвижимости в Бенидорме, Испания. Район Ла Кала — современные апартаменты 2008–2015 г.п. с бассейнами и теннисными кортами. Консультация из Еревана.'
      : isHy
        ? 'Բ. գ. La Cala ա. 2008–2015 բ. հ. թ. կ. Casa del Mar.'
        : 'Complete guide to buying property in Benidorm, Spain. La Cala modern apartments (2008–2015) with pools & tennis courts. Free consultation from Yerevan.',
  }
}

const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS_RU = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']
const MONTHS_HY = ['Հուն','Փետ','Մար','Ապր','Մայ','Հուն','Հուլ','Օգ','Սեպ','Հոկ','Նոյ','Դեկ']
const TEMPS    = [17, 18, 20, 22, 25, 29, 32, 32, 29, 25, 20, 17]
const MAX_TEMP = 32

const LA_CALA_TIMELINE_EN = [
  { year: '2005', text: 'La Cala development begins' },
  { year: '2008', text: 'First residential buildings completed' },
  { year: '2010', text: 'Main commercial area opens' },
  { year: '2012', text: 'La Cala fully established as premier district' },
  { year: '2015', text: 'Final buildings completed — district fully developed' },
  { year: 'Today', text: 'Most sought-after area for international buyers' },
]
const LA_CALA_TIMELINE_RU = [
  { year: '2005', text: 'Начало застройки Ла Кала' },
  { year: '2008', text: 'Первые жилые здания сданы' },
  { year: '2010', text: 'Открытие коммерческой зоны' },
  { year: '2012', text: 'Ла Кала признан престижным районом' },
  { year: '2015', text: 'Последние здания завершены — район полностью застроен' },
  { year: 'Сегодня', text: 'Самый востребованный район для международных покупателей' },
]
const LA_CALA_TIMELINE_HY = [
  { year: '2005', text: 'La Cala-ի կ.' },
  { year: '2008', text: 'Ա. բ. ա.' },
  { year: '2010', text: 'Կ. ա. բ.' },
  { year: '2012', text: 'La Cala — ա. թ.' },
  { year: '2015', text: 'Ա. բ. ա.' },
  { year: 'Այ.', text: 'Մ. ն. ա. գ.' },
]

export default function BenidormPage({ params: { locale } }: Props) {
  const t   = getT(locale)
  const b   = t.home.benidorm
  const c   = t.contact
  const isRu = locale === 'ru'
  const isHy = locale === 'hy'

  const months   = isRu ? MONTHS_RU : isHy ? MONTHS_HY : MONTHS_EN
  const timeline = isRu ? LA_CALA_TIMELINE_RU : isHy ? LA_CALA_TIMELINE_HY : LA_CALA_TIMELINE_EN

  const laCalaFeatures = [
    { icon: '🏊', text: (b.laCalaFeatures as string[])[0] },
    { icon: '🎾', text: (b.laCalaFeatures as string[])[1] },
    { icon: '🚗', text: (b.laCalaFeatures as string[])[2] },
    { icon: '🏗️', text: (b.laCalaFeatures as string[])[3] },
    { icon: '🏖️', text: (b.laCalaFeatures as string[])[4] },
    { icon: '🛒', text: (b.laCalaFeatures as string[])[5] },
  ]

  const quickFacts = [
    { icon: '🌞', value: '320+', label: isRu ? 'Солнечных дней' : isHy ? 'Արևային օր' : 'Sunny Days' },
    { icon: '🏖️', value: '2',   label: isRu ? 'Пляжа' : isHy ? 'Լողափ' : 'Famous Beaches' },
    { icon: '✈️', value: '60km', label: isRu ? 'До аэропорта' : isHy ? 'Ա. օ/կ' : 'To Airport' },
    { icon: '🌡️', value: '20°C', label: isRu ? 'Средняя темп.' : isHy ? 'Ջ. °C' : 'Avg Temperature' },
    { icon: '🏙️', value: '1960s', label: isRu ? 'Курорт с' : isHy ? 'Կ. հ.' : 'Resort Since' },
  ]

  const districts = isRu ? [
    { name: 'La Cala',        tag: 'Современное сердце',  bullets: ['Построено 2008–2015', 'Бассейн и теннис в каждом комплексе', 'Рядом с пляжем Поньенте', 'Большинство объектов Casa del Mar'] },
    { name: 'Levante',        tag: 'Живой восток',         bullets: ['Пляж 1,9 км', 'Высокая туристическая плотность', 'Лучшая краткосрочная аренда', 'Самая активная набережная'] },
    { name: 'Poniente',       tag: 'Тихий запад',          bullets: ['Пляж 3 км', 'Захватывающие закаты', 'Предпочитают семьи', 'Жилая атмосфера'] },
    { name: 'Vila Park',      tag: 'Надёжный и стабильный', bullets: ['Известный жилой комплекс', 'Хорошая инфраструктура', 'Устоявшееся сообщество', 'Отличное соотношение цены'] },
    { name: 'Sierra Cortina', tag: 'Холмистый престиж',    bullets: ['Возвышенное положение', 'Тишина и безопасность', 'Виды на горы и море', 'Элитная недвижимость'] },
    { name: 'Altea Hills',    tag: 'Элитное жильё',        bullets: ['15 км от Бенидорма', 'Закрытый посёлок', 'Роскошные виллы', 'Самый престижный адрес'] },
    { name: 'Finestrat',      tag: 'Новый и растущий',     bullets: ['5 км от Бенидорма', 'Новостройки', 'Горный пейзаж', 'Лучшее соотношение цены'] },
  ] : [
    { name: 'La Cala',        tag: isHy ? 'Ժ. ս.' : "Benidorm's Modern Heart",   bullets: isHy ? ['2008–2015 կ.','Բ. +թ. կ.','Poniente ծ.','Casa del Mar'] : ['Built 2008–2015, all modern','Pool & tennis in every complex','Next to Poniente beach','Most Casa del Mar properties here'] },
    { name: 'Levante',        tag: isHy ? 'Կ. ա.' : 'The Lively East',            bullets: isHy ? ['1.9 կ.','Բ. ն/տ.','Վ/կ. ե.','Ա. ժ.'] : ['Longest beach (1.9km)','Highest tourist density','Best short-term rental yields','Most vibrant nightlife & dining'] },
    { name: 'Poniente',       tag: isHy ? 'Հ. ա.' : 'The Peaceful West',          bullets: isHy ? ['3 կ.','Ա. ա.','Ու. ե.','Բ/կ. մ.'] : ['3km of golden sand','Stunning sunset views','Preferred by families','More residential atmosphere'] },
    { name: 'Vila Park',      tag: isHy ? 'Կ. ե.' : 'Established & Reliable',    bullets: isHy ? ['Ա. բ. ա.','Ե. ե.','Կ. հ.','Ե. գ.'] : ['Popular residential complex','Good facilities','Well-established community','Excellent value'] },
    { name: 'Sierra Cortina', tag: isHy ? 'Բ. հ.' : 'Hillside Prestige',         bullets: isHy ? ['Բ. դ.','Հ., ա.','Ե. ե. ս.','Ա. գ.'] : ['Elevated position with views','Quiet and prestigious','Mountain & sea panoramas','Premium properties'] },
    { name: 'Altea Hills',    tag: isHy ? 'Ե. կ.' : 'Elite Living',              bullets: isHy ? ['15 կ.','Ե. փ. հ.','Շ. վ.','Ա. հ.'] : ['15km north of Benidorm','Exclusive gated community','Luxury villas & penthouses','Most prestigious address'] },
    { name: 'Finestrat',      tag: isHy ? 'Ն. ե.' : 'New & Growing',             bullets: isHy ? ['5 կ.','Ն. կ.','Լ. ն.','Ե. գ.'] : ['5km from Benidorm','Brand new developments','Mountain backdrop','Best value for new-builds'] },
  ]

  const whyItems = Array.isArray(b.whyItems)
    ? b.whyItems as { icon: string; title: string; desc: string }[]
    : []

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'City',
          name: 'Benidorm',
          description: 'Coastal resort city on the Costa Blanca, Spain. Popular for property investment.',
          containedInPlace: { '@type': 'Country', name: 'Spain' },
        }) }}
      />

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-[100svh] overflow-hidden text-center">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/80" />

        {/* Content */}
        <div className="relative z-10 container-site pt-24 pb-32 flex flex-col items-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in">
            <div className="w-8 h-px bg-gold/60" />
            <span className="eyebrow text-gold/90 text-[10px]">🇪🇸 Costa Blanca · Spain</span>
            <div className="w-8 h-px bg-gold/60" />
          </div>

          {/* Title */}
          <h1 className="font-serif text-[clamp(3.5rem,12vw,8rem)] font-light text-white leading-none mb-3 opacity-0 animate-fade-up">
            {b.heroTitle}
          </h1>
          <div className="w-20 h-px bg-gold mx-auto my-4 opacity-0 animate-fade-up-d1" />
          <p className="font-serif text-[clamp(1.1rem,3vw,1.75rem)] text-white/70 italic font-light mb-8 opacity-0 animate-fade-up-d1">
            {(b as any).heroSub ?? 'The Manhattan of the Mediterranean'}
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 opacity-0 animate-fade-up-d2">
            {(['320+ Sunny Days', '2 World-Famous Beaches', '60km from Airport'] as const).map(pill => (
              <span key={pill} className="px-4 py-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm font-accent text-[10px] tracking-[0.15em] text-white/85 uppercase">
                {pill}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up-d2 w-full sm:w-auto px-4 sm:px-0">
            <Link href={`/${locale}/spain`} className="btn-primary w-full sm:w-auto justify-center py-4 sm:py-3.5">
              {b.cta}
            </Link>
            <Link href={`/${locale}/contact`} className="btn-outline-white w-full sm:w-auto justify-center py-4 sm:py-3.5">
              {b.ctaFree}
            </Link>
          </div>
        </div>

        {/* Scroll bounce */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce opacity-60">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── QUICK FACTS STRIP ── */}
      <div className="bg-navy border-t border-white/8">
        <div className="container-site">
          <div className="overflow-x-auto scrollbar-none -webkit-overflow-scrolling-touch">
            <div className="flex divide-x divide-white/8 min-w-max md:grid md:grid-cols-5 md:min-w-0">
              {quickFacts.map(f => (
                <div key={f.value} className="py-5 px-6 text-center shrink-0 md:shrink">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <p className="font-serif text-2xl text-gold font-light">{f.value}</p>
                  <p className="font-accent text-[9px] tracking-[0.18em] text-white/45 uppercase mt-0.5">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ABOUT BENIDORM ── */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Text — 3/5 */}
            <div className="lg:col-span-3 reveal">
              <p className="eyebrow text-gold mb-3">Costa Blanca · Spain</p>
              <h2 className="section-title text-navy mb-4">{b.title}</h2>
              <div className="gold-divider mb-8" />
              <div className="space-y-4 font-sans text-navy/70 leading-relaxed text-[15px]">
                {isRu ? <>
                  <p>Бенидорм — один из самых iconic прибрежных городов Испании, расположенный на Коста Бланке в провинции Аликанте. С более чем 320 солнечными днями в год и средней температурой 20°C он предлагает один из лучших климатов в Европе.</p>
                  <p>Город разделён историческим мысом на два пляжа: <strong className="text-navy">Playa de Levante</strong> (восток, самый длинный) и <strong className="text-navy">Playa de Poniente</strong> (запад, более спокойный). К западу от Поньенте расположен <strong className="text-navy">Ла Кала</strong> — самый современный жилой район Бенидорма.</p>
                  <p>Отличная инфраструктура включает больницы, международные школы, супермаркеты и общественный транспорт. Аэропорт Аликанте — всего 60 км.</p>
                  <p>Бенидорм — настоящий круглогодичный город с постоянным населением ~70 000 человек и миллионами туристов ежегодно.</p>
                </> : isHy ? <>
                  <p>Բ. Ի. ա. ծ. ք. Կ. Բ., Ա. ն. 320+ ա. ե. 20°C ջ. Ե. լ. կ.</p>
                  <p>Ք. բ. ե. Հ. ծ. Levante (ա., ե. լ.) ե. Poniente (ա., հ.). La Cala-ն Poniente-ի ա. — Բ. ա. ժ. բ. թ.</p>
                  <p>Ե/կ.: ժ. հ., մ. դ., ե. ս. Ա. (ALC) — 60 կ.</p>
                  <p>Բ. ն. ~70,000 բ. ե. մ. ն. ն/տ.</p>
                </> : <>
                  <p>Benidorm is one of Spain's most iconic coastal cities, located on the Costa Blanca in the Alicante province of southeast Spain. With over 320 sunny days per year and an average temperature of 20°C, it offers one of Europe's most enviable climates.</p>
                  <p>The city is divided by a historic headland into two beaches: <strong className="text-navy">Playa de Levante</strong> (east-facing, the longest and most lively) and <strong className="text-navy">Playa de Poniente</strong> (west-facing, calmer and more residential). To the west, beyond Poniente, lies <strong className="text-navy">La Cala</strong> — Benidorm's newest and most modern residential district.</p>
                  <p>Benidorm's excellent infrastructure includes modern hospitals, international schools, supermarkets, and public transport. Alicante Airport is just 60km away with direct flights from Yerevan.</p>
                  <p>Despite its reputation as a tourist hotspot, Benidorm is a thriving year-round city with a permanent population of ~70,000 and millions of tourists annually.</p>
                </>}
              </div>

              {/* Pull quote */}
              <blockquote className="mt-8 border-l-4 border-gold pl-5">
                <p className="font-serif text-lg text-navy/80 italic leading-relaxed">
                  &ldquo;{(b as any).pullQuote ?? "Once a small fishing village, now one of Spain's most visited cities — with the skyline to prove it."}&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Image — 2/5 */}
            <div className="lg:col-span-2 reveal">
              <div
                className="aspect-[3/4] bg-cover bg-center shadow-2xl"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=700&q=80)' }}
              />
              <div className="mt-4 bg-sand p-5">
                <p className="font-accent text-[10px] tracking-[0.25em] uppercase text-gold mb-1">
                  {isRu ? 'Наши районы' : isHy ? 'Մ. թ.' : 'Our Areas'}
                </p>
                <p className="font-sans text-sm text-navy/70 leading-relaxed">{b.areas}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE BEACHES ── */}
      <section className="section-pad bg-sand">
        <div className="container-site">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">🏖️ Benidorm</p>
            <h2 className="section-title text-navy mb-4">{b.beachesTitle}</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Levante */}
            <div className="reveal bg-white shadow-card overflow-hidden group">
              <div
                className="aspect-[16/9] bg-cover bg-center group-hover:scale-105 transition-transform duration-700 overflow-hidden"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80)' }}
              />
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-serif text-lg shrink-0">L</div>
                  <div>
                    <h3 className="font-serif text-xl text-navy">Playa de Levante</h3>
                    <p className="font-sans text-xs text-gold mt-0.5">
                      {isRu ? 'Восточный пляж · 1.9 км' : isHy ? 'Ա. Լ. · 1.9 կ.' : 'East Beach · 1.9km'}
                    </p>
                  </div>
                </div>
                <div className="gold-divider mb-5" />
                <ul className="space-y-2 font-sans text-sm text-navy/70">
                  {(isRu
                    ? ['1,9 км золотого песка', 'На восток, утреннее солнце', 'Активная атмосфера, водные виды спорта', 'Самая высокая туристическая плотность', 'Лучшие показатели краткосрочной аренды']
                    : isHy
                    ? ['1.9 կ. ա. ա.', 'Ա., ա. ա.', 'Կ. մ., ջ. ս.', 'Ամ. ա. ն/տ.', 'Վ/կ. ե.']
                    : ['1.9km of golden sand', 'East-facing, morning sun', 'Lively atmosphere, water sports', 'Highest tourist density in Benidorm', 'Best short-term rental yields']
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5 shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs font-accent tracking-wide text-gold uppercase">
                  {isRu ? 'Идеально для инвестиций в аренду' : isHy ? 'Ա. ն/ն.' : 'Most popular with tourists & investors'}
                </p>
              </div>
            </div>

            {/* Poniente */}
            <div className="reveal bg-white shadow-card overflow-hidden group">
              <div
                className="aspect-[16/9] bg-cover bg-center group-hover:scale-105 transition-transform duration-700 overflow-hidden"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1533760881669-80db4d7b4c15?w=800&q=80)' }}
              />
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-serif text-lg shrink-0">P</div>
                  <div>
                    <h3 className="font-serif text-xl text-navy">Playa de Poniente</h3>
                    <p className="font-sans text-xs text-gold mt-0.5">
                      {isRu ? 'Западный пляж · 3 км' : isHy ? 'Ա. Պ. · 3 կ.' : 'West Beach · 3km'}
                    </p>
                  </div>
                </div>
                <div className="gold-divider mb-5" />
                <ul className="space-y-2 font-sans text-sm text-navy/70">
                  {(isRu
                    ? ['3 км золотого песка', 'На запад, захватывающие закаты', 'Спокойная, жилая атмосфера', 'Предпочитают семьи и долгосрочные жители', 'Рядом — современный район Ла Кала']
                    : isHy
                    ? ['3 կ. ա. ա.', 'Ա., ա. ա.', 'Հ., բ/կ. մ.', 'Ու. ե. բ/կ.', 'La Cala — Ն.']
                    : ['3km of golden sand', 'West-facing, spectacular sunsets', 'Calmer, more residential atmosphere', 'Preferred by families & long-stay residents', 'La Cala district directly adjacent']
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5 shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs font-accent tracking-wide text-gold uppercase">
                  {isRu ? 'Предпочитают семьи и долгосрочные жители' : isHy ? 'Ու. ե. բ/կ.' : 'Preferred by families & long-term residents'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LA CALA — NEW PROMINENT SECTION ── */}
      <section className="section-pad" style={{ background: '#0D1F2D', borderTop: '3px solid #C9A84C' }}>
        <div className="container-site">
          {/* Header */}
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">
              {(b as any).laCalaEyebrow ?? 'Where Most Our Properties Are Located'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-light mb-4">
              {(b as any).laCalaTitle ?? 'La Cala District'}
            </h2>
            <div className="gold-divider mx-auto mb-4" />
            <p className="font-sans text-white/55 text-lg max-w-xl mx-auto">
              {(b as any).laCalaSubtitle ?? "Benidorm's Newest & Most Modern Residential Area"}
            </p>
          </div>

          {/* Two column */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* Left — info 3/5 */}
            <div className="lg:col-span-3 space-y-8 reveal">
              <p className="font-sans text-white/70 leading-relaxed text-[15px]">
                {(b as any).laCalaText ?? 'La Cala is Benidorm\'s most modern residential district, located on the western side of the city next to Poniente beach. Unlike older parts of Benidorm, La Cala was developed entirely from scratch — construction began in 2005 and all buildings were completed between 2008 and 2015.'}
              </p>

              {/* Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {laCalaFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/8 rounded-lg px-4 py-3 hover:bg-white/8 transition-colors">
                    <span className="text-xl shrink-0">{f.icon}</span>
                    <p className="font-sans text-sm text-white/75 leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link href={`/${locale}/spain`} className="inline-flex btn-primary">
                {(b as any).ctaLaCala ?? 'View La Cala Properties'}
              </Link>
            </div>

            {/* Right — timeline 2/5 */}
            <div className="lg:col-span-2 reveal">
              <div
                className="aspect-[4/3] bg-cover bg-center rounded-sm shadow-2xl mb-6"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=600&q=80)' }}
              />

              {/* Timeline */}
              <div className="space-y-0">
                <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
                  {isRu ? 'История застройки' : isHy ? 'Կ. պ.' : 'Development Timeline'}
                </p>
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                      {i < timeline.length - 1 && <div className="w-px flex-1 bg-white/15 my-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="font-accent text-[10px] tracking-widest text-gold uppercase">{item.year}</p>
                      <p className="font-sans text-sm text-white/60 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIMATE ── */}
      <section className="section-pad bg-navy">
        <div className="container-site">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">🌡️ Benidorm</p>
            <h2 className="section-title text-white mb-4">{b.climateTitle}</h2>
            <div className="gold-divider mx-auto mb-4" />
            <p className="font-sans text-white/45 max-w-xl mx-auto text-sm">
              {(b as any).climateSub ?? '320+ sunny days per year — more than anywhere else in mainland Europe'}
            </p>
          </div>

          {/* Month cards — horizontal scroll on mobile */}
          <div className="overflow-x-auto scrollbar-none -webkit-overflow-scrolling-touch reveal">
            <div className="flex gap-2 min-w-max md:grid md:grid-cols-12 md:min-w-0 md:gap-1.5">
              {TEMPS.map((temp, i) => {
                const isHot  = temp >= 28
                const isWarm = temp >= 22
                return (
                  <div
                    key={i}
                    className={[
                      'flex flex-col items-center gap-2 px-3 py-4 rounded-lg shrink-0 md:shrink w-16 md:w-auto',
                      isHot  ? 'bg-gold/20 border border-gold/30' :
                      isWarm ? 'bg-white/8 border border-white/10' :
                               'bg-white/4 border border-white/6',
                    ].join(' ')}
                  >
                    <span className="text-lg">{isHot ? '☀️' : isWarm ? '🌤️' : '⛅'}</span>
                    <p className={`font-serif text-lg font-light ${isHot ? 'text-gold' : 'text-white/80'}`}>{temp}°</p>
                    <p className="font-accent text-[9px] tracking-wide text-white/40 uppercase">{months[i]}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-center font-sans text-sm text-white/35 mt-8 max-w-lg mx-auto">
            {(b as any).climateNote ?? 'Even in January, Benidorm enjoys mild 17°C temperatures — perfect for year-round visits and rental income.'}
          </p>
        </div>
      </section>

      {/* ── DISTRICTS ── */}
      <section className="section-pad bg-sand">
        <div className="container-site">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">📍 Benidorm</p>
            <h2 className="section-title text-navy mb-4">{b.districtsTitle}</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {districts.map((d, i) => (
              <div
                key={i}
                className={`reveal bg-white p-6 border-l-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${
                  i === 0 ? 'border-gold sm:col-span-2 lg:col-span-1' : 'border-sand-300'
                }`}
              >
                <h3 className="font-serif text-xl text-navy mb-1">{d.name}</h3>
                <p className="font-sans text-xs italic text-gold mb-3">{d.tag}</p>
                <div className="w-6 h-px bg-gold/40 mb-3" />
                <ul className="space-y-1.5">
                  {d.bullets.map((b2, j) => (
                    <li key={j} className="flex items-start gap-2 font-sans text-xs text-navy/65">
                      <span className="text-gold mt-0.5 shrink-0">•</span>
                      {b2}
                    </li>
                  ))}
                </ul>
                {i === 0 && (
                  <Link
                    href={`/${locale}/spain`}
                    className="mt-4 inline-flex font-accent text-[10px] tracking-widest uppercase text-gold hover:text-gold/70 transition-colors"
                  >
                    {isRu ? 'Смотреть объекты →' : isHy ? 'Դ. գ. →' : 'View Properties →'}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY INVEST ── */}
      <section className="section-pad" style={{ background: '#0D2030' }}>
        <div className="container-site">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">
              {isRu ? 'Инвестиционный потенциал' : isHy ? 'Ն. Ն.' : 'Investment Case'}
            </p>
            <h2 className="section-title text-white mb-4">{b.why}</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyItems.map((card, i) => (
              <div
                key={i}
                className="reveal bg-white/5 border border-white/8 p-6 hover:bg-white/8 hover:border-gold/30 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-serif text-lg text-white font-light mb-3">{card.title}</h3>
                <div className="w-8 h-px bg-gold/40 mb-3" />
                <p className="font-sans text-sm text-white/55 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GETTING THERE ── */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">🗺️ Benidorm</p>
            <h2 className="section-title text-navy mb-4">{b.gettingTitle}</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '✈️',
                title: isRu ? 'На самолёте' : isHy ? 'Ա/կ-ով' : 'By Air',
                desc:  isRu ? 'Аэропорт Аликанте (ALC) — 60 км, 45 мин. Ryanair, EasyJet, Vueling.'
                             : isHy ? 'Ա. (ALC) — 60 կ., 45 ր. Ryanair, EasyJet.'
                             : 'Alicante Airport (ALC) — 60km, 45 min by car. Ryanair, EasyJet, Vueling and others.',
              },
              {
                icon: '🚗',
                title: isRu ? 'На машине' : isHy ? 'Մ/կ-ով' : 'By Car',
                desc:  isRu ? 'Из Аликанте — 50 км по AP-7. Из Валенсии — 120 км. Из Мадрида — 440 км.'
                             : isHy ? 'Ա. կ-ից — 50 կ. AP-7-ով. Վ-ից — 120 կ.'
                             : 'From Alicante — 50km on the AP-7 motorway. From Valencia — 120km. From Madrid — 440km.',
              },
              {
                icon: '🚌',
                title: isRu ? 'На автобусе' : isHy ? 'Ա/բ-ով' : 'By Bus',
                desc:  isRu ? 'Регулярные ALSA из Аликанте, Валенсии и Мадрида прямо до Бенидорма.'
                             : isHy ? 'ALSA Ա., Վ. ե. Մ-ից Բ. կ.'
                             : 'Regular ALSA bus services from Alicante, Valencia, and Madrid directly to Benidorm.',
              },
            ].map((item, i) => (
              <div key={i} className="reveal bg-sand p-8 border-l-4 border-gold hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl text-navy mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-navy/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="bg-sand pb-0">
        <div className="container-site pb-20">
          <div className="overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50255.86537!2d-0.1338!3d38.5432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd61f0059e51b6a5%3A0x400b7e2a6e7a3d0!2sBenidorm%2C%20Alicante%2C%20Spain!5e0!3m2!1sen!2s!4v1"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Benidorm location"
            />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden py-24 px-4" style={{ background: '#0D1F2D' }}>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(45deg, #C9A84C 1px, transparent 1px), linear-gradient(-45deg, #C9A84C 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative container-site text-center">
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <p className="eyebrow text-gold mb-4">Casa del Mar</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-white mb-4 leading-tight">
            {b.ctaTitle}
          </h2>
          <p className="font-sans text-white/50 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {b.ctaSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 px-4 sm:px-0">
            <Link href={`/${locale}/spain`} className="btn-primary w-full sm:w-auto justify-center py-4 sm:py-3.5">
              {b.cta}
            </Link>
            <Link href={`/${locale}/contact`} className="btn-outline-white w-full sm:w-auto justify-center py-4 sm:py-3.5">
              {b.ctaFree}
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-white/35">
            <a href={`tel:${c.tel1}`} className="font-sans text-sm hover:text-gold transition-colors">{c.tel1}</a>
            <span className="hidden sm:block w-px h-4 bg-white/20" />
            <a href={`mailto:${c.emailAddr}`} className="font-sans text-sm hover:text-gold transition-colors">{c.emailAddr}</a>
          </div>
        </div>
      </section>
    </>
  )
}
