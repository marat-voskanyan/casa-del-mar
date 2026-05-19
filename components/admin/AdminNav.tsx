'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const links = [
    { href: '/admin', label: 'Dashboard', icon: '⊞' },
    { href: '/admin/properties/new', label: 'Add Property', icon: '+' },
  ]

  return (
    <aside className="w-60 bg-navy min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <p className="font-serif text-xl font-light text-white tracking-wide">Casa del Mar</p>
        <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold mt-0.5">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-sans transition-colors ${
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

      {/* Public site link */}
      <div className="px-3 py-4 border-t border-white/10">
        <a
          href="/en"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-sans text-white/50 hover:text-white/80 transition-colors"
        >
          <span className="text-base w-5 text-center">↗</span>
          View Site
        </a>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-sans text-white/50 hover:text-red-400 transition-colors"
        >
          <span className="text-base w-5 text-center">⇥</span>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
