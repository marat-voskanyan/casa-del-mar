'use client'

import { useState } from 'react'
import type { Locale } from '@/types'
import { getT } from '@/lib/i18n'

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = getT(locale)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">✓</div>
        <p className="font-serif text-2xl text-navy mb-2">{t.contact.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label-field">{t.contact.name}</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="input-field"
            placeholder={t.contact.name}
          />
        </div>
        <div>
          <label className="label-field">{t.contact.email}</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            className="input-field"
            placeholder={t.contact.email}
          />
        </div>
      </div>

      <div>
        <label className="label-field">{t.contact.phone}</label>
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          className="input-field"
          placeholder={t.contact.phone}
        />
      </div>

      <div>
        <label className="label-field">{t.contact.message}</label>
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          required
          rows={5}
          className="input-field resize-none"
          placeholder={t.contact.messagePlaceholder}
        />
      </div>

      {status === 'error' && (
        <p className="font-sans text-sm text-red-600">{t.contact.error}</p>
      )}

      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full text-center">
        {status === 'sending' ? '…' : t.contact.send}
      </button>
    </form>
  )
}
