import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const LOCALES = ['en', 'ru', 'hy'] as const
const DEFAULT_LOCALE = 'en'

function detectLocale(request: NextRequest): string {
  // 1. Saved preference from cookie (set by language switcher)
  const saved = request.cookies.get('preferred_locale')?.value
  if (saved && (LOCALES as readonly string[]).includes(saved)) return saved

  // 2. Accept-Language header
  const accept = request.headers.get('accept-language') || ''
  if (accept.includes('ru')) return 'ru'
  if (accept.includes('hy') || accept.includes('arm')) return 'hy'
  return DEFAULT_LOCALE
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pass through static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|woff2?|ttf|otf)$/)
  ) {
    return NextResponse.next()
  }

  // --- Admin routes ---
  if (pathname.startsWith('/admin')) {
    const publicAdminPaths = ['/admin/login', '/admin/setup']
    if (publicAdminPaths.some(p => pathname.startsWith(p))) {
      return NextResponse.next()
    }

    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'casa-del-mar-secret-2024-change-me'
      )
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', request.url))
      res.cookies.delete('admin_token')
      return res
    }
  }

  // --- Locale routing ---
  const hasLocale = LOCALES.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (!hasLocale) {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
