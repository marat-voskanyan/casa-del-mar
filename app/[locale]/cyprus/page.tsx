import type { Metadata } from 'next'
import type { Locale, Property } from '@/types'
import { getAllProperties } from '@/lib/db'
import Hero from '@/components/home/Hero'
import PropertiesGrid from '@/components/properties/PropertiesGrid'
import WhatsAppButton from '@/components/WhatsAppButton'
import { getT } from '@/lib/i18n'
import { BENIDORM_IMAGES, IMAGE_ALT } from '@/lib/images'

export const dynamic = 'force-dynamic'

interface Props { params: { locale: Locale } }

export const metadata: Metadata = { title: 'Cyprus Properties' }

export default async function CyprusPage({ params: { locale } }: Props) {
  const t = getT(locale)
  let properties: Property[] = []
  try {
    properties = await getAllProperties('cyprus') as unknown as Property[]
  } catch {
    // DB not yet initialised
  }

  return (
    <>
      <Hero
        locale={locale}
        page="cyprus"
        bgImage={BENIDORM_IMAGES.banners.cyprus_page}
        bgAlt={IMAGE_ALT.cyprus_destination}
      />
      <PropertiesGrid
        properties={properties}
        locale={locale}
        country="cyprus"
        flag="🇨🇾 Κύπρος"
        subtitle={t.hero.cyprus.title}
      />
      <WhatsAppButton locale={locale} />
    </>
  )
}
