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

/** Converte string digitada pelo usuário em número.
 *  Aceita: "1000000" → 1000000 | "1.000.000" → 1000000 | "1000000,50" → 1000000.5
 */
function parseInput(raw: string): number {
  // Remove tudo exceto dígitos e vírgula (separador decimal pt-BR)
  const clean = raw.replace(/[^\d,]/g, '')
  if (!clean) return 0
  // Substitui vírgula por ponto para parseFloat
  return parseFloat(clean.replace(',', '.')) || 0
}

/** Formata string durante digitação: só dígitos + vírgula, sem R$ */
function formatLive(raw: string): string {
  // Mantém apenas dígitos e uma vírgula
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
    // Preenche com o valor atual como número limpo (sem R$ e sem formatação)
    setRaw(value > 0 ? String(value) : '')
  }

  const handleBlur = () => {
    setFocused(false)
    onChange(parseInput(raw))
    setRaw('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Permite apenas dígitos, pontos (ignorados) e uma vírgula
    const digits = input.replace(/[^\d,]/g, '')
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
      className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors ${className}`}
    />
  )
}
