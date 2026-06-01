import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SetDocumentLang from '@/components/layout/SetDocumentLang'
import type { Locale } from '@/types'
import RevealObserver from '@/components/layout/RevealObserver'

const LOCALES: Locale[] = ['en', 'ru', 'hy']

// Force dynamic rendering so new DB data (properties) is always fetched fresh.
// The [locale] layout still validates locale params at runtime.
export const dynamic = 'force-dynamic'

interface Props {
  children: React.ReactNode
  params: { locale: Locale }
}

export const metadata: Metadata = {}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  if (!LOCALES.includes(locale)) notFound()

  return (
    <div lang={locale} className="locale-wrapper">
      {/* Sets document.documentElement.lang so :lang(hy) CSS activates on <html> */}
      <SetDocumentLang locale={locale} />
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <RevealObserver />
    </div>
  )
}
