import type { Metadata } from 'next'
import type { Locale, Property } from '@/types'
import { getFeaturedProperties } from '@/lib/db'
import Hero from '@/components/home/Hero'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import Destinations from '@/components/home/Destinations'
import WhyUs from '@/components/home/WhyUs'
import AboutServices from '@/components/home/AboutServices'
import ContactStrip from '@/components/home/ContactStrip'

// Force server-render on every request so new properties appear immediately
export const dynamic = 'force-dynamic'

interface Props { params: { locale: Locale } }

export const metadata: Metadata = {
  title: 'Luxury Coastal Real Estate in Spain & Cyprus | Casa del Mar',
  description: 'Casa del Mar — premier international real estate agency based in Yerevan, Armenia. Exclusive coastal properties in Spain and Cyprus, curated for discerning buyers worldwide.',
}

export default async function HomePage({ params: { locale } }: Props) {
  let properties: Property[] = []
  try {
    properties = await getFeaturedProperties(6) as unknown as Property[]
  } catch {
    // DB not yet initialised during build
  }

  return (
    <>
      <Hero locale={locale} page="home" />
      <Destinations locale={locale} />
      <FeaturedProperties locale={locale} properties={properties} />
      <AboutServices locale={locale} />
      <WhyUs locale={locale} />
      <ContactStrip locale={locale} />
    </>
  )
}
