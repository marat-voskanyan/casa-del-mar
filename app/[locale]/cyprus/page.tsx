import type { Metadata } from 'next'
import type { Locale, Property } from '@/types'
import { getAllProperties } from '@/lib/db'
import Hero from '@/components/home/Hero'
import PropertiesGrid from '@/components/properties/PropertiesGrid'
import { getT } from '@/lib/i18n'

interface Props { params: { locale: Locale } }

export const metadata: Metadata = { title: 'Cyprus Properties' }

export default function CyprusPage({ params: { locale } }: Props) {
  const t = getT(locale)
  let properties: Property[] = []
  try {
    properties = getAllProperties('cyprus') as unknown as Property[]
  } catch {
    // DB not yet initialised
  }

  return (
    <>
      <Hero locale={locale} page="cyprus" />
      <PropertiesGrid
        properties={properties}
        locale={locale}
        country="cyprus"
        flag="🇨🇾 Κύπρος"
        subtitle={t.hero.cyprus.title}
      />
    </>
  )
}
