import type { Metadata } from 'next'
import { Playfair_Display, Inter, Montserrat } from 'next/font/google'
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://casadelmar.eu'),
  title: {
    default: 'Casa del Mar | Luxury Coastal Real Estate in Spain & Cyprus',
    template: '%s | Casa del Mar',
  },
  description:
    'Casa del Mar is a premier international real estate agency specialising in luxury properties in Spain and Cyprus. Based in Yerevan, Armenia — serving clients worldwide.',
  keywords: ['luxury real estate', 'Spain property', 'Cyprus property', 'coastal homes', 'Mediterranean', 'Armenia', 'international real estate'],
  openGraph: {
    type: 'website',
    siteName: 'Casa del Mar',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${montserrat.variable}`}>
      <head>
        <meta name="site-id" content={process.env.NEXT_PUBLIC_SITE_ID || '69021918-94ab-48db-9e03-ca90f1a79617'} />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
