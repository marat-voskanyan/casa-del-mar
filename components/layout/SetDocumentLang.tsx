'use client'

import { useEffect } from 'react'

/**
 * Sets document.documentElement.lang to the current locale so that
 * :lang(hy) CSS rules activate on the <html> element itself.
 * The root layout hardcodes lang="en", so this fixes it client-side.
 */
export default function SetDocumentLang({ locale }: { locale: string }) {
  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale
    }
  }, [locale])

  return null
}
