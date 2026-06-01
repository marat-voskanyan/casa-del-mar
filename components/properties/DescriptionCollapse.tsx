'use client'

import { useState } from 'react'

interface Props {
  text: string
  title: string
  previewChars?: number
}

export default function DescriptionCollapse({ text, title, previewChars = 180 }: Props) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > previewChars
  const displayed = !isLong || expanded ? text : text.slice(0, previewChars).trimEnd() + '…'

  return (
    <div>
      <h2 className="font-serif text-2xl text-navy mb-4">{title}</h2>
      <div className="w-8 h-px bg-gold mb-6" />
      <p className="font-sans text-navy/70 leading-relaxed whitespace-pre-wrap text-base">
        {displayed}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-3 font-accent text-[11px] tracking-[0.18em] uppercase
            text-[#C9A84C] hover:text-[#C9A84C]/70
            flex items-center gap-1.5 transition-colors"
        >
          {expanded ? 'Read less' : 'Read more'}
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  )
}
