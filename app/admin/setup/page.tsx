'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSetupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: 'admin', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch('/api/setup')
      .then(r => r.json())
      .then(d => {
        if (!d.needsSetup) router.replace('/admin/login')
        else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/admin/login')
      } else {
        setError(data.error || 'Setup failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="text-white/50 font-sans text-sm">Checking…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-serif text-3xl font-light text-white tracking-wide">Casa del Mar</p>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold mt-1">Initial Setup</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white p-8 shadow-2xl">
          <h1 className="font-serif text-2xl text-navy mb-2 font-light">Create Admin Account</h1>
          <p className="font-sans text-xs text-gray-500 mb-6">
            This runs once. Set your admin credentials below.
          </p>

          <div className="space-y-4">
            <div>
              <label className="admin-label">Username</label>
              <input
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                required
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                minLength={8}
                className="admin-input"
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label className="admin-label">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                required
                className="admin-input"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
          )}

          <button type="submit" disabled={loading} className="admin-btn w-full mt-6 py-3">
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
