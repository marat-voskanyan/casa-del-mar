import type { Metadata } from 'next'
import Link from 'next/link'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

interface Props { params: { locale: Locale } }

export const metadata: Metadata = {
  title: 'Benidorm Properties & Guide | Casa del Mar Real Estate',
  description: 'Complete guide to buying property in Benidorm, Spain. Beaches, climate, districts, investment potential. Browse apartments from €180,000. Free consultation.',
}

const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS_RU = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']
const MONTHS_HY = ['Հուն','Փետ','Մար','Ապр','Մայ','Հուն','Հուլ','Օգ','Սեպ','Հոկ','Նոյ','Դեկ']
const TEMPS = [17, 18, 20, 22, 25, 29, 32, 32, 29, 25, 20, 17]
const MAX_TEMP = 32

export default function BenidormPage({ params: { locale } }: Props) {
  const t = getT(locale)
  const b = t.home.benidorm
  const c = t.contact

  const months = locale === 'ru' ? MONTHS_RU : locale === 'hy' ? MONTHS_HY : MONTHS_EN

  const quickFacts = [
    { icon: '🌞', value: '320+', label: locale === 'ru' ? 'Солнечных дней в год' : locale === 'hy' ? 'Արևային օր տարում' : 'Sunny Days per Year' },
    { icon: '🏖️', value: '2',   label: locale === 'ru' ? 'Знаменитых пляжа' : locale === 'hy' ? 'Հայտնի լողափ' : 'Famous Beaches' },
    { icon: '✈️', value: '60km', label: locale === 'ru' ? 'До аэропорта Аликанте' : locale === 'hy' ? 'Ալիkantеи oghanavakayanits' : 'From Alicante Airport' },
    { icon: '🌡️', value: '20°C', label: locale === 'ru' ? 'Средняя температура' : locale === 'hy' ? 'Миجин jеrmoostyan' : 'Average Temperature' },
    { icon: '🏙️', value: '70k', label: locale === 'ru' ? 'Постоянных жителей' : locale === 'hy' ? 'Меж bnakich' : 'Permanent Residents' },
  ]

  const whyCards = [
    { icon: '🏠', title: locale === 'ru' ? 'Доходность аренды' : locale === 'hy' ? 'Варdzakalutyun' : 'Proven Rental Income',
      desc: locale === 'ru' ? '6–10% годовых. Один из самых высоких туристических потоков в Испании гарантирует круглогодичную загрузку.' : locale === 'hy' ? '6–10% tarEkaN. Isрания ameNА shАT zaghаhRAN kаghаkNERits mEkN erАzhkhАvOrum E Аmbogjаmyа pахAndjArk.' : '6-10% annual rental yield. One of Spain\'s highest tourist densities guarantees year-round occupancy.' },
    { icon: '📈', title: locale === 'ru' ? 'Рост стоимости' : locale === 'hy' ? 'ArjEkhi AchN' : 'Rising Property Values',
      desc: locale === 'ru' ? 'Устойчивый рост цен за последнее десятилетие. Стабильный международный спрос продолжает двигать рынок.' : locale === 'hy' ? 'KAyun gyNAhAyin АchN vaJEkshan тAruM. Mijаzgаyin pаhаNjаRkI MjTNOrum.' : 'Consistent price growth over the past decade. Strong demand from international buyers continues to drive appreciation.' },
    { icon: '✈️', title: locale === 'ru' ? 'Удобное сообщение' : locale === 'hy' ? 'HetevоghakAN hаsANELiutYUN' : 'Easy to Reach',
      desc: locale === 'ru' ? 'Прямые рейсы из крупных европейских городов в аэропорт Аликанте (60 км). Несколько авиакомпаний работают круглый год.' : locale === 'hy' ? 'Ughjigh chvERTHNEr AviаkАyaneri OGHgHАkuTYAMb. 60 km аlivkANTEi oghАNАvAkAyan.' : 'Direct flights from major European cities to Alicante airport (60km). Multiple airlines serve the route year-round.' },
    { icon: '🌍', title: locale === 'ru' ? 'Международное сообщество' : locale === 'hy' ? 'МijAzgаyin hAmAYNk' : 'International Community',
      desc: locale === 'ru' ? 'Большие устоявшиеся общины экспатов из Великобритании, Германии, Скандинавии и Восточной Европы. Лёгкая интеграция.' : locale === 'hy' ? 'ООghj, GermANiA, SKАNdinAvIA eV ArdvenA EvrоpAyits EkspAtNEri Mezoghkуm hAmAYNknER.' : 'Large established expat communities from UK, Germany, Scandinavia, and Eastern Europe. Easy to settle and integrate.' },
    { icon: '🏥', title: locale === 'ru' ? 'Развитая инфраструктура' : locale === 'hy' ? 'kArtAvAr trAmsADrutyun' : 'Excellent Infrastructure',
      desc: locale === 'ru' ? 'Современные больницы, международные школы, все крупные европейские супермаркеты. Всё для комфортной жизни.' : locale === 'hy' ? 'ЖamAnаkAKits hIvAnDAnоchNER, МijAzgAYin dprоcNER, EUR GNIА. lriv kOMfоrtАyIN кyАnkI hаMAr.' : 'Modern hospitals, international schools, every major European supermarket brand. Everything you need for comfortable living.' },
    { icon: '📋', title: locale === 'ru' ? 'Простая покупка' : locale === 'hy' ? 'pArAzat gNUm' : 'Simple Purchase Process',
      desc: locale === 'ru' ? 'Casa del Mar берёт на себя всё — NIE, юридические документы, банковские счета, карты резидента. Мы говорим на вашем языке.' : locale === 'hy' ? 'Casa del Mar verjarchnum E Ameni hAmAr — NIE, iravAbAnАkАn fаstAtgHEr, bAnkАYIN hАshiVNEr.' : 'Casa del Mar handles everything — NIE, legal documents, bank accounts, residency cards. We speak your language.' },
  ]

  const districts = [
    { name: 'La Cala', desc: locale === 'ru' ? 'Сердце Бенидорма. Коммерческий центр между двумя пляжами. Самый популярный район для покупки апартаментов.' : locale === 'hy' ? 'Бenenидormi SIртhUNd. eRKU loGHаpHNEri miджEV gAmADzаYIN кENtрON.' : 'The heart of Benidorm. Commercial centre between the two beaches. Most popular area for apartments. Walking distance to both beaches.' },
    { name: 'Levante', desc: locale === 'ru' ? 'Оживлённый восточный район. Близко к самому длинному пляжу. Высокая туристическая плотность обеспечивает отличную доходность.' : locale === 'hy' ? 'KEnDАNI ArEvelYAN tаGHAMAsTАR. АmeNА GHIN loGHаphIN mechкА. BArtz vаrdzАkаlUtyuN.' : 'Lively eastern district. Close to the longest beach. High tourist density means excellent short-term rental yields.' },
    { name: 'Poniente', desc: locale === 'ru' ? 'Более тихий западный район. Предпочитают семьи и долгосрочные жители. Спокойная, жилая атмосфера.' : locale === 'hy' ? 'HАNgIst аrEvelYAN tаGHAMAsTАR. UNdANIkNERi eV ерKАR BNАKicHNERI nАkhASIRUTYUN.' : 'Quieter western district. Preferred by families and long-term residents. More residential atmosphere.' },
    { name: 'Vila Park', desc: locale === 'ru' ? 'Популярный жилой комплекс с хорошими удобствами. Немного от побережья, но отличное соотношение цены и качества.' : locale === 'hy' ? 'ShАt pаHАNjArkvАdz BNАkОGH hAmALiR Lаv HNАrAVOrUTYUNNERov. GIN-оRАkUTYUN.' : 'Popular residential complex with good facilities. Slightly inland but excellent value for money.' },
    { name: 'Sierra Cortina', desc: locale === 'ru' ? 'Престижный район на склонах холмов. Тихо, безопасно, красивые виды на горы и море. Элитная недвижимость.' : locale === 'hy' ? 'BERdАdzOR SBArEGH tаGHAMAsTАR. HАNgist, ANTS АpАhov, sIrUN TЕSARANNÉR.' : 'Prestigious hillside area. Quiet, safe, beautiful mountain and sea views. Premium properties.' },
    { name: 'Altea Hills', desc: locale === 'ru' ? 'Элитный закрытый посёлок в 15 км к северу от Бенидорма. Роскошные виллы с панорамным видом на море. Самый престижный адрес.' : locale === 'hy' ? 'ELIt PАRGНKАPEД HAmAYNk 15 km ЦEPHAKACHOum. ShАRhAfAR teсARAnNErov ShAREGH VILLANÉR.' : 'Elite gated community 15km north of Benidorm. Luxury villas with panoramic sea views. Highest prestige address on the Costa Blanca.' },
    { name: 'Finestrat', desc: locale === 'ru' ? 'Растущий район в 5 км от Бенидорма. Новостройки, горный пейзаж, отличное соотношение цены и качества.' : locale === 'hy' ? 'ZArGACOGH tаGHAMAsTАR 5 km BENidoRMits. NOR KаRUCOMNER, LERNАYIN pEyzАzH.' : 'Growing area 5km from Benidorm. New-build developments, mountain backdrop, excellent value for money.' },
  ]

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex items-center min-h-[65vh] overflow-hidden">
        <div className="absolute inset-0 hero-bg" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1400&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy/60" />
        <div className="relative container-site z-10 py-36 text-center">
          <div className="flex items-center justify-center gap-4 mb-8 opacity-0 animate-fade-in">
            <div className="w-10 h-px bg-gold/70" />
            <span className="eyebrow text-gold/80">🇪🇸 Costa Blanca · Spain</span>
            <div className="w-10 h-px bg-gold/70" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight opacity-0 animate-fade-up">
            {b.heroTitle}
          </h1>
          <div className="w-16 h-px bg-gold my-6 mx-auto opacity-0 animate-fade-up-d1" />
          <p className="font-sans text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up-d1">
            {b.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-up-d2">
            <Link href={`/${locale}/spain`} className="btn-primary px-8 py-4">
              {b.cta}
            </Link>
            <Link href={`/${locale}/contact`} className="btn-outline-white px-8 py-4">
              {b.ctaFree}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Facts Bar ── */}
      <div className="bg-navy border-t border-white/8">
        <div className="container-site">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x divide-white/8">
            {quickFacts.map(f => (
              <div key={f.label} className="py-5 px-4 text-center">
                <div className="text-2xl mb-1">{f.icon}</div>
                <p className="font-serif text-xl md:text-2xl text-gold font-light">{f.value}</p>
                <p className="font-accent text-[9px] tracking-[0.18em] text-white/45 uppercase mt-0.5 leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── About Benidorm ── */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="reveal">
              <p className="eyebrow text-gold mb-3">La Cala · Levante · Poniente</p>
              <h2 className="section-title text-navy mb-6">{b.title}</h2>
              <div className="gold-divider mb-8" />
              <div className="space-y-4 font-sans text-navy/70 leading-relaxed text-[15px]">
                {locale === 'ru' ? <>
                  <p>Бенидорм — один из самых iconic прибрежных городов Испании, расположенный на Коста Бланке в провинции Аликанте. С более чем 320 солнечными днями в год и средней температурой 20°C он предлагает один из лучших климатов в Европе.</p>
                  <p>Город разделён историческим мысом на два великолепных пляжа: <strong className="text-navy">Пляж Леванте</strong> и <strong className="text-navy">Пляж Поньенте</strong>. Между ними находится <strong className="text-navy">Ла Кала</strong> — оживлённое сердце Бенидорма и самый популярный район для покупки апартаментов.</p>
                  <p>Отличная инфраструктура Бенидорма включает современные больницы, международные школы, супермаркеты и надёжный общественный транспорт. Аэропорт Аликанте находится всего в 60 км с прямыми рейсами из Еревана.</p>
                  <p>Бенидорм — это не просто летний курорт. Это настоящий международный город с постоянным населением около 70 000 человек, огромным сообществом экспатов и круглогодичным туристическим рынком.</p>
                </> : locale === 'hy' ? <>
                  <p>Benidorm-ը Ispaniayi ameNАkAz iconic ծovаphNYА kАghАkNeRits mEkN е, KostА BlаNkАyum, Аlikantеyi nAhАNjUm. Тarvm 320+ аrevаYiN orov eV mIjIN 20°CՋermoostyan, EvrоpAyum lAvAgUYN kliMANERits mEkN.</p>
                  <p>KАghАkN bАzhAnvUM е istоrikАkAN bLURov eRkU HrАShАLi аvAzоT loGHAphNeRi: <strong className="text-navy">Playa de Levante</strong> eV <strong className="text-navy">Playa de Poniente</strong>. NErantsits mijev е <strong className="text-navy">La Cala</strong> — BENidoRMi kEnDANi sIRTUND.</p>
                  <p>Lаv trаMsAdRUtyunN ЕNcArKUm е ZhАmАnАkАkits hIVАndAnоcHNeR, mijAzGАyin dprоcNER eV HIMnARKAN EvropAkAN supErmARkEtnER. АlIkAntEyi ogHAnАvAkAYАN 60 km hEROUTYUN UNi.</p>
                  <p>BENidoRM ZARF Аmаrаyin hАNgistAvАYR chÉ. AYS isMаKАn miJаZGАYIN kАghАk Е LIkIn 70,000 mIshT bнАkichOV eV MiLiOnAvOR ZBoosАSHrjikNEROV.</p>
                </> : <>
                  <p>Benidorm is one of Spain&apos;s most iconic coastal cities, located on the Costa Blanca in the Alicante province of southeast Spain. With over 320 sunny days per year and an average temperature of 20°C, it offers one of Europe&apos;s most enviable climates.</p>
                  <p>The city is divided by a historic headland into two magnificent sandy beaches: <strong className="text-navy">Playa de Levante</strong> and <strong className="text-navy">Playa de Poniente</strong>. Between them lies <strong className="text-navy">La Cala</strong> — the vibrant heart of Benidorm and the most popular area for property investment.</p>
                  <p>Benidorm&apos;s excellent infrastructure includes modern hospitals, international schools, supermarkets of every European brand, and a well-connected public transport network. Alicante Airport is just 60km away with direct flights from Yerevan via multiple airlines.</p>
                  <p>Despite its reputation as a tourist hotspot, Benidorm has a thriving year-round community of residents, expats and retirees from across Europe. With a permanent population of around 70,000 and millions of tourists annually, the rental market never sleeps.</p>
                </>}
              </div>
            </div>
            <div className="reveal">
              <div
                className="aspect-[4/5] bg-cover bg-center shadow-2xl"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=600&q=80)' }}
              />
              <div className="mt-4 bg-sand p-5">
                <p className="font-accent text-[10px] tracking-[0.25em] uppercase text-gold mb-2">
                  {locale === 'ru' ? 'Наши районы' : locale === 'hy' ? 'Меr tAGhAMASTERа' : 'Our Areas'}
                </p>
                <p className="font-sans text-sm text-navy/70 leading-relaxed">{b.areas}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Beaches ── */}
      <section className="section-pad bg-sand">
        <div className="container-site">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">🏖️ Benidorm</p>
            <h2 className="section-title text-navy mb-4">{b.beachesTitle}</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Levante */}
            <div className="reveal bg-white shadow-card overflow-hidden">
              <div
                className="aspect-[16/9] bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80)' }}
              />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-serif text-lg">L</div>
                  <h3 className="font-serif text-2xl text-navy">Playa de Levante</h3>
                </div>
                <div className="gold-divider mb-5" />
                <ul className="space-y-2 font-sans text-sm text-navy/70">
                  {(locale === 'ru'
                    ? ['1,9 км золотого песка', 'На восток, утреннее солнце', 'Активная атмосфера, водные виды спорта', 'Ближайший пляж к La Cala', 'Отличное вложение — высокий туристический спрос']
                    : locale === 'hy'
                    ? ['1.9 km ОnDАrGIN аvАzОT', 'ArEvelk, аrevАyIN кAvAKUME', 'KENDANI mthNOL, chRhаINА spORT', 'La Cala-yIn METHK loGHАph', 'LаV KApItALAcUM — BАrtz pАhАNdArk']
                    : ['1.9km of golden sand', 'East-facing, morning sun', 'Lively atmosphere, water sports', 'Closest beach to La Cala district', 'Perfect for rental investment — highest tourist demand']
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5 shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Poniente */}
            <div className="reveal bg-white shadow-card overflow-hidden">
              <div
                className="aspect-[16/9] bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1533760881669-80db4d7b4c15?w=800&q=80)' }}
              />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-serif text-lg">P</div>
                  <h3 className="font-serif text-2xl text-navy">Playa de Poniente</h3>
                </div>
                <div className="gold-divider mb-5" />
                <ul className="space-y-2 font-sans text-sm text-navy/70">
                  {(locale === 'ru'
                    ? ['3 км золотого песка', 'На запад, захватывающие закаты', 'Спокойная, жилая атмосфера', 'Предпочитают семьи и долгосрочные жители', 'Идеально для постоянного проживания']
                    : locale === 'hy'
                    ? ['3 km ОnDАrGIN аvАzОT', 'ArEvmоutK, hrАShАLi kHAchkАL', 'HАNgist, bNАkОGH mthNОL', 'UNdАNIKNeR eV eRKАR bNАKicHNeR', 'KАtАREL mIshT bNАkutyAN hAMAr']
                    : ['3km of golden sand', 'West-facing, spectacular sunsets', 'Calmer, more residential feel', 'Preferred by families and long-stay visitors', 'Excellent for permanent residence']
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5 shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Climate ── */}
      <section className="section-pad bg-navy">
        <div className="container-site">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">🌡️ Benidorm</p>
            <h2 className="section-title text-white mb-4">{b.climateTitle}</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 reveal">
            {TEMPS.map((temp, i) => {
              const heightPct = Math.round((temp / MAX_TEMP) * 100)
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="font-sans text-xs text-white/60">{temp}°</span>
                  <div className="w-full flex items-end justify-center h-16">
                    <div
                      className="w-full rounded-t bg-gold/70 transition-all"
                      style={{ height: `${heightPct}%`, minHeight: '4px' }}
                    />
                  </div>
                  <span className="font-accent text-[9px] tracking-wide text-white/50 uppercase">{months[i]}</span>
                </div>
              )
            })}
          </div>
          <p className="text-center font-sans text-sm text-white/40 mt-6">
            {locale === 'ru' ? 'Средняя максимальная температура °C' : locale === 'hy' ? 'МИjIN АRЖЕК jERMasTYUN °C' : 'Average maximum temperature °C'}
          </p>
        </div>
      </section>

      {/* ── Districts ── */}
      <section className="section-pad bg-sand">
        <div className="container-site">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">📍 Benidorm</p>
            <h2 className="section-title text-navy mb-4">{b.districtsTitle}</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {districts.map((d, i) => (
              <div key={i} className="reveal bg-white p-6 border-l-4 border-gold shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-serif text-xl text-navy mb-2">{d.name}</h3>
                <div className="w-8 h-px bg-gold/50 mb-3" />
                <p className="font-sans text-sm text-navy/65 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Invest ── */}
      <section className="section-pad bg-navy-900">
        <div className="container-site">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow text-gold mb-3">
              {locale === 'ru' ? 'Инвестиционный потенциал' : locale === 'hy' ? 'KApItАLАcumАYIN hNАRAVoRutyuN' : 'Investment Case'}
            </p>
            <h2 className="section-title text-white mb-4">{b.why}</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((card, i) => (
              <div key={i} className="bg-white/5 border border-white/8 p-6 reveal hover:bg-white/8 hover:border-gold/30 transition-all duration-300">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-serif text-lg text-white font-light mb-3">{card.title}</h3>
                <div className="w-8 h-px bg-gold/40 mb-3" />
                <p className="font-sans text-sm text-white/55 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Getting There ── */}
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
                title: locale === 'ru' ? 'На самолёте' : locale === 'hy' ? 'оGHАkAYov' : 'By Air',
                desc: locale === 'ru'
                  ? 'Аэропорт Аликанте (ALC) — 60 км, 45 мин на машине. Прямые рейсы из Еревана через стыковочные хабы. Ryanair, EasyJet, Vueling и другие.'
                  : locale === 'hy'
                  ? 'АlikAntEyi oGHАNАvAkAYАN (ALC) — 60 km, 45 rоpE АvtoMEKhov. MIjAnkAYIn reYseR erEvАNits. Ryanair, EasyJet, Vueling.'
                  : 'Alicante Airport (ALC) — 60km, 45 min by car. Direct flights from Yerevan available via connecting hubs. Ryanair, Easyjet, Vueling and others serve the airport.',
              },
              {
                icon: '🚗',
                title: locale === 'ru' ? 'На машине' : locale === 'hy' ? 'АvtoMEKhov' : 'By Car',
                desc: locale === 'ru'
                  ? 'Из центра Аликанте — 50 км по шоссе AP-7. Из Валенсии — 120 км. Из Мадрида — 440 км.'
                  : locale === 'hy'
                  ? 'АlikAntEyi kENTROnits — 50 km AP-7 AvtOMAGIsTrАlov. VAlensiAyits — 120 km. MАdrIdits — 440 km.'
                  : 'From Alicante city centre — 50km on the AP-7 motorway. From Valencia — 120km. From Madrid — 440km.',
              },
              {
                icon: '🚌',
                title: locale === 'ru' ? 'На автобусе' : locale === 'hy' ? 'АвtobUSOV' : 'By Bus',
                desc: locale === 'ru'
                  ? 'Регулярные автобусы ALSA из Аликанте, Валенсии и Мадрида прямо до автовокзала Бенидорма.'
                  : locale === 'hy'
                  ? 'KАNonAvOr ALSA аvtobusNER АlikAntEyits, VАlensiAyits eV MАdrIdits NeRQINUm BENidoRMi аvtоKAYАN.'
                  : 'Regular ALSA bus services from Alicante, Valencia, and Madrid directly to Benidorm bus station.',
              },
            ].map((item, i) => (
              <div key={i} className="reveal bg-sand p-8 border-l-4 border-gold">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl text-navy mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-navy/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="bg-sand pb-20">
        <div className="container-site">
          <div className="overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50255.86537!2d-0.1338!3d38.5432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd61f0059e51b6a5%3A0x400b7e2a6e7a3d0!2sBenidorm%2C%20Alicante%2C%20Spain!5e0!3m2!1sen!2s!4v1"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Benidorm on the map"
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden py-24 px-4 bg-navy-900">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-[#0D1F2D] to-navy-900" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(45deg, #C9A84C 1px, transparent 1px), linear-gradient(-45deg, #C9A84C 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative container-site text-center">
          <p className="eyebrow text-gold mb-4">Casa del Mar</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-white mb-4 leading-tight">
            {b.ctaTitle}
          </h2>
          <p className="font-sans text-white/55 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {b.ctaSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href={`/${locale}/spain`} className="btn-primary px-8 py-4">
              {b.cta}
            </Link>
            <Link href={`/${locale}/contact`} className="btn-outline-white px-8 py-4">
              {b.ctaFree}
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/40">
            <a href={`tel:${c.tel1}`} className="font-sans text-sm hover:text-gold transition-colors">{c.tel1}</a>
            <span className="hidden sm:block w-px h-4 bg-white/20" />
            <a href={`mailto:${c.emailAddr}`} className="font-sans text-sm hover:text-gold transition-colors">{c.emailAddr}</a>
          </div>
        </div>
      </section>
    </>
  )
}
