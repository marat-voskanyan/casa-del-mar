'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect to setup if no admin exists
  useEffect(() => {
    fetch('/api/setup')
      .then(r => r.json())
      .then(d => { if (d.needsSetup) router.replace('/admin/setup') })
      .catch(() => {})
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/admin')
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 gap-3">
          <Image
            src="/logo.png"
            alt="Casa del Mar"
            height={60}
            width={240}
            className="h-[60px] w-auto object-contain brightness-0 invert"
            priority
          />
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold">Admin Panel</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white p-8 shadow-2xl">
          <h1 className="font-serif text-2xl text-navy mb-6 font-light">Sign In</h1>

          <div className="space-y-4">
            <div>
              <label className="admin-label">Username</label>
              <input
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                required
                autoComplete="username"
                className="admin-input"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="admin-label">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                autoComplete="current-password"
                className="admin-input"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
          )}

          <button type="submit" disabled={loading} className="admin-btn w-full mt-6">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
