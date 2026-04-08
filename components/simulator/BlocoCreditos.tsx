'use client'

import { Creditos } from '@/lib/types'
import { formatBRL } from '@/lib/calculos'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { FieldGroup } from '@/components/ui/FieldGroup'

interface Props {
  creditos: Creditos
  totalCreditos: number
  irpfTabelaAuto: number
  onChange: (key: keyof Creditos, value: number) => void
}

export function BlocoCreditos({ creditos, totalCreditos, irpfTabelaAuto, onChange }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-50 text-amber-600 text-[10px] font-mono rounded border border-amber-200">2</span>
        <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">IR já pago a compensar</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <FieldGroup
          label="IRPF tabela progressiva (DAA)"
          sub={creditos.cDAA === 0 ? `Auto: ${formatBRL(irpfTabelaAuto)}` : undefined}
          tooltip="Imposto calculado pela tabela progressiva sobre rendimentos tributáveis, após deduções, apurado na Declaração de Ajuste Anual. Deixe em branco para estimativa automática."
        >
          <CurrencyInput
            value={creditos.cDAA}
            onChange={v => onChange('cDAA', v)}
            placeholder={`R$ ${irpfTabelaAuto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (auto)`}
          />
        </FieldGroup>
        <FieldGroup
          label="IRRF dividendos 10%"
          sub="Retido na fonte · art. 6º-A"
          tooltip="IRRF de 10% retido na fonte sobre dividendos que ultrapassaram R$ 50.000/mês por fonte pagadora em 2026. Funciona como antecipação do IRPFM, a ser compensado na DIRPF 2027."
        >
          <CurrencyInput value={creditos.cDiv} onChange={v => onChange('cDiv', v)} />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <FieldGroup
          label="IRRF aplicações / exclusiva"
          sub="CDB, fundos, ETF retido na fonte"
          tooltip="IR retido na fonte sobre CDB, fundos de investimento, ETF, ações e demais rendimentos com tributação exclusiva ou definitiva incluídos na base do IRPFM."
        >
          <CurrencyInput value={creditos.cAplic} onChange={v => onChange('cAplic', v)} />
        </FieldGroup>
        <FieldGroup
          label="IRRF offshore · Lei 14.754/2023"
          sub="IRPF pago sobre rendimentos no exterior"
          tooltip="IRPF apurado e pago sobre rendimentos de aplicações financeiras no exterior e lucros de controladas, conforme Lei 14.754/2023."
        >
          <CurrencyInput value={creditos.cOff} onChange={v => onChange('cOff', v)} />
        </FieldGroup>
      </div>

      <div className="mb-4">
        <FieldGroup
          label="Outros créditos compensáveis"
          sub="IRPF pago sobre rendimentos na base, não listado acima"
          tooltip="Qualquer IRPF retido ou pago definitivamente sobre rendimentos incluídos na base do IRPFM que não se enquadre nas categorias anteriores."
        >
          <CurrencyInput value={creditos.cOut} onChange={v => onChange('cOut', v)} />
        </FieldGroup>
      </div>

      <div className="flex justify-between items-center px-3 py-2.5 bg-gray-100 rounded-lg">
        <span className="text-xs text-gray-500">Total a compensar</span>
        <span className="font-mono text-sm text-emerald-600 font-medium">{formatBRL(totalCreditos)}</span>
      </div>
    </div>
  )
}
