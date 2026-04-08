'use client'

import { useState, useRef } from 'react'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  id?: string
  className?: string
}

function formatDisplay(value: number): string {
  if (value === 0) return ''
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

function parseInput(raw: string): number {
  const clean = raw.replace(/[^\d,]/g, '')
  if (!clean) return 0
  return parseFloat(clean.replace(',', '.')) || 0
}

function formatLive(raw: string): string {
  const withoutSymbol = raw.replace(/[^\d,]/g, '')
  const parts = withoutSymbol.split(',')
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  if (parts.length > 1) {
    return intPart + ',' + parts[1].slice(0, 2)
  }
  return intPart
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = 'R$ 0,00',
  id,
  className = '',
}: CurrencyInputProps) {
  const [focused, setFocused] = useState(false)
  const [raw, setRaw] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    setFocused(true)
    setRaw(value > 0 ? String(value) : '')
  }

  const handleBlur = () => {
    setFocused(false)
    onChange(parseInput(raw))
    setRaw('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^\d,]/g, '')
    setRaw(digits)
    onChange(parseInput(digits))
  }

  const displayValue = focused ? formatLive(raw) : formatDisplay(value)

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={displayValue}
      placeholder={placeholder}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      className={`w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 transition-colors ${className}`}
    />
  )
}
