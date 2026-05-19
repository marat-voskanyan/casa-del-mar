import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Locale } from '@/types'
import RevealObserver from '@/components/layout/RevealObserver'

const LOCALES: Locale[] = ['en', 'ru', 'hy']

export async function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

interface Props {
  children: React.ReactNode
  params: { locale: Locale }
}

export const metadata: Metadata = {}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  if (!LOCALES.includes(locale)) notFound()

  return (
    <>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <RevealObserver />
    </>
  )
}
