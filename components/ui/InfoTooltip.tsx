'use client'

import { useState } from 'react'

interface InfoTooltipProps {
  content: string
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-zinc-600 text-zinc-500 text-[9px] hover:border-zinc-400 hover:text-zinc-400 transition-colors flex-shrink-0"
        aria-label="Mais informações"
      >
        ?
      </button>
      {open && (
        <span className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 z-50 w-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-300 leading-relaxed shadow-xl pointer-events-none">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-700" />
        </span>
      )}
    </span>
  )
}
