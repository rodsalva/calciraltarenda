'use client'

import { useState } from 'react'
import { calcIRRFMensal, formatBRL } from '@/lib/calculos'
import { CurrencyInput } from '@/components/ui/CurrencyInput'

export function BlocoMensal() {
  const [divMensal, setDivMensal] = useState(0)
  const { irrf, irrfAnual } = calcIRRFMensal(divMensal)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">
        Simulador IRRF mensal — dividendos
      </div>
      <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
        Dividendos &gt; R$ 50.000/mês por fonte pagadora → retenção de 10% na fonte (antecipação do IRPFM — art. 6º-A).
      </p>
      <div className="mb-3">
        <label className="text-xs text-zinc-400 mb-1.5 block">Dividendos mensais (por fonte pagadora)</label>
        <CurrencyInput value={divMensal} onChange={setDivMensal} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="px-3 py-2.5 bg-zinc-800/60 rounded-lg">
          <div className="text-[10px] text-zinc-500 mb-0.5">IRRF por mês</div>
          <div className="font-mono text-sm text-amber-400">{formatBRL(irrf)}</div>
        </div>
        <div className="px-3 py-2.5 bg-zinc-800/60 rounded-lg">
          <div className="text-[10px] text-zinc-500 mb-0.5">IRRF anual estimado</div>
          <div className="font-mono text-sm text-zinc-300">{formatBRL(irrfAnual)}</div>
        </div>
      </div>
    </div>
  )
}
