import type { Metadata } from 'next'
import { Playfair_Display, Inter, Montserrat, Noto_Serif_Armenian, Noto_Sans_Armenian } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

const notoSerifArmenian = Noto_Serif_Armenian({
  subsets: ['armenian'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-noto-serif-armenian',
  display: 'swap',
})

const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ['armenian'],
  weight: ['300', '400', '500'],
  variable: '--font-noto-sans-armenian',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://casa-del-mar.vercel.app'),
  title: {
    default: 'Casa del Mar | Luxury Coastal Real Estate in Spain & Cyprus',
    template: '%s | Casa del Mar',
  },
  description:
    'Casa del Mar is a premier international real estate agency specialising in luxury properties in Spain and Cyprus. Based in Yerevan, Armenia — serving clients worldwide.',
  keywords: ['luxury real estate', 'Spain property', 'Cyprus property', 'coastal homes', 'Mediterranean', 'Armenia', 'international real estate'],
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png' },
    ],
    shortcut: '/favicon.png',
  },
  openGraph: {
    title: 'Casa del Mar | International Real Estate',
    description: 'Premium properties in Spain and Cyprus. Based in Yerevan, Armenia.',
    url: 'https://casa-del-mar.vercel.app',
    siteName: 'Casa del Mar',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Casa del Mar International Real Estate',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Casa del Mar | International Real Estate',
    description: 'Premium properties in Spain and Cyprus.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${montserrat.variable} ${notoSerifArmenian.variable} ${notoSansArmenian.variable}`}>
      <head>
        <meta name="site-id" content={process.env.NEXT_PUBLIC_SITE_ID || '69021918-94ab-48db-9e03-ca90f1a79617'} />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
