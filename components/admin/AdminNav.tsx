'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const links = [
    { href: '/admin', label: 'Dashboard', icon: '⊞' },
    { href: '/admin/properties/new', label: 'Add Property', icon: '+' },
  ]

  function NavLinks() {
    return (
      <>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded text-sm font-sans transition-colors ${
                pathname === link.href
                  ? 'bg-gold/20 text-gold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base w-5 text-center">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <a
            href="/en"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 px-3 py-3 text-sm font-sans text-white/50 hover:text-white/80 transition-colors"
          >
            <span className="text-base w-5 text-center">↗</span>
            View Site
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-3 text-sm font-sans text-white/50 hover:text-red-400 transition-colors"
          >
            <span className="text-base w-5 text-center">⇥</span>
            Sign Out
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-navy min-h-screen flex-col shrink-0">
        <div className="px-6 py-7 border-b border-white/10">
          <p className="font-serif text-xl font-light text-white tracking-wide">Casa del Mar</p>
          <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold mt-0.5">Admin</p>
        </div>
        <NavLinks />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden bg-navy text-white flex items-center justify-between px-4 py-3 fixed top-0 left-0 right-0 z-40 shadow-lg">
        <p className="font-serif text-lg font-light tracking-wide">Casa del Mar</p>
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile backdrop */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile slide-in drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-navy z-50 flex flex-col transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 py-7 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="font-serif text-xl font-light text-white tracking-wide">Casa del Mar</p>
            <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold mt-0.5">Admin</p>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <NavLinks />
      </aside>
    </>
  )
}
