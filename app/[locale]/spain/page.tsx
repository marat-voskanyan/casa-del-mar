import type { Metadata } from 'next'
import type { Locale, Property } from '@/types'
import { getAllProperties } from '@/lib/db'
import Hero from '@/components/home/Hero'
import PropertiesGrid from '@/components/properties/PropertiesGrid'
import BenidormSection from '@/components/spain/BenidormSection'
import { getT } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

interface Props { params: { locale: Locale } }

export const metadata: Metadata = {
  title: 'Properties in Spain | Casa del Mar',
  description: 'Browse apartments and villas in Benidorm, Altea Hills, and the Costa Blanca. Expert guidance from Casa del Mar.',
}

export default async function SpainPage({ params: { locale } }: Props) {
  const t = getT(locale)
  let properties: Property[] = []
  try {
    properties = await getAllProperties('spain') as unknown as Property[]
  } catch {
    // DB not yet initialised
  }

  return (
    <>
      <Hero locale={locale} page="spain" />
      <BenidormSection locale={locale} />
      <PropertiesGrid
        properties={properties}
        locale={locale}
        country="spain"
        flag="🇪🇸 España"
        subtitle={t.hero.spain.title}
      />
    </>
  )
}
