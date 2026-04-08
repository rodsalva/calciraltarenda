'use client'

import { useState } from 'react'
import { calcIRRFMensal, formatBRL } from '@/lib/calculos'
import { CurrencyInput } from '@/components/ui/CurrencyInput'

export function BlocoMensal() {
  const [divMensal, setDivMensal] = useState(0)
  const { irrf, irrfAnual } = calcIRRFMensal(divMensal)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-2">
        Simulador IRRF mensal — dividendos
      </div>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        Dividendos &gt; R$ 50.000/mês por fonte pagadora → retenção de 10% na fonte (antecipação do IRPFM — art. 6º-A).
      </p>
      <div className="mb-3">
        <label className="text-xs text-gray-600 mb-1.5 block">Dividendos mensais (por fonte pagadora)</label>
        <CurrencyInput value={divMensal} onChange={setDivMensal} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="px-3 py-2.5 bg-gray-100 rounded-lg">
          <div className="text-[10px] text-gray-400 mb-0.5">IRRF por mês</div>
          <div className="font-mono text-sm text-amber-600 font-medium">{formatBRL(irrf)}</div>
        </div>
        <div className="px-3 py-2.5 bg-gray-100 rounded-lg">
          <div className="text-[10px] text-gray-400 mb-0.5">IRRF anual estimado</div>
          <div className="font-mono text-sm text-gray-700 font-medium">{formatBRL(irrfAnual)}</div>
        </div>
      </div>
    </div>
  )
}
