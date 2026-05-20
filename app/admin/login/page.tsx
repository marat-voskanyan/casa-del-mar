'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
        <div className="text-center mb-10">
          <p className="font-serif text-3xl font-light text-white tracking-wide">Casa del Mar</p>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold mt-1">Admin Panel</p>
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
