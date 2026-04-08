'use client'

import { Rendimentos } from '@/lib/types'
import { formatBRL } from '@/lib/calculos'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { FieldGroup } from '@/components/ui/FieldGroup'

interface Props {
  rendimentos: Rendimentos
  baseIRPFM: number
  onChange: (key: keyof Rendimentos, value: number) => void
}

export function BlocoRendimentos({ rendimentos, baseIRPFM, onChange }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-500/15 text-amber-400 text-[10px] font-mono rounded">1</span>
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Rendimentos sujeitos ao IRPFM</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <FieldGroup
          label="Tributáveis — PJ"
          sub="Salário, pró-labore, honorários"
          tooltip="Rendimentos brutos totais recebidos de pessoa jurídica: salários, pró-labore, honorários. Informe o valor anual."
        >
          <CurrencyInput value={rendimentos.rPJ} onChange={v => onChange('rPJ', v)} />
        </FieldGroup>
        <FieldGroup
          label="Tributáveis — PF / Exterior"
          sub="Aluguéis, autônomo, trabalho exterior"
          tooltip="Rendimentos brutos de aluguéis, trabalho não assalariado, serviços prestados ao exterior (não offshore)."
        >
          <CurrencyInput value={rendimentos.rPF} onChange={v => onChange('rPF', v)} />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <FieldGroup
          label="Lucros e dividendos"
          sub="Total recebido em 2026"
          tooltip="Total de lucros e dividendos de empresas brasileiras recebidos em 2026 (resultados apurados a partir de 2026). Entram integralmente na base do IRPFM."
        >
          <CurrencyInput value={rendimentos.rDiv} onChange={v => onChange('rDiv', v)} />
        </FieldGroup>
        <FieldGroup
          label="Offshore — Lei 14.754/2023"
          sub="Aplicações e controladas no exterior"
          tooltip="Rendimentos de aplicações financeiras no exterior e lucros de controladas no exterior, tributados nos termos da Lei 14.754/2023. Entram na base do IRPFM."
        >
          <CurrencyInput value={rendimentos.rOff} onChange={v => onChange('rOff', v)} />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <FieldGroup
          label="Tributação exclusiva / definitiva"
          sub="CDB, fundos, JCP, ETF, ações"
          tooltip="Rendimentos sujeitos à tributação exclusiva ou definitiva na fonte: CDB, fundos de investimento, ETF, ações, juros sobre capital próprio. Tributados a 15–22,5% na fonte. Entram na base do IRPFM."
        >
          <CurrencyInput value={rendimentos.rExcl} onChange={v => onChange('rExcl', v)} />
        </FieldGroup>
        <FieldGroup
          label="Ganhos de capital — bolsa / balcão"
          sub="Ganhos líquidos em operações de bolsa"
          tooltip="Ganhos líquidos em operações realizadas em bolsa de valores ou mercado de balcão organizado, sujeitos ao IR sobre ganho líquido. Entram na base do IRPFM."
        >
          <CurrencyInput value={rendimentos.rGC} onChange={v => onChange('rGC', v)} />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <FieldGroup
          label="Outros rendimentos"
          sub="Não listados acima; excluir isentos"
          tooltip="Rendimentos não enquadrados nas categorias anteriores que integrem a base do IRPFM. Não inclua rendimentos expressamente excluídos pela lei (ver lista de exclusões)."
        >
          <CurrencyInput value={rendimentos.rOut} onChange={v => onChange('rOut', v)} />
        </FieldGroup>
        <FieldGroup
          label="Isentos incentivados ✗ fora da base"
          sub="LCI, LCA, CRI, CRA, FII, poupança"
          tooltip="LCI, LCA, CRI, CRA, LIG, LCD, debêntures incentivadas, FII/Fiagro negociados em bolsa, poupança. NÃO entram na base do IRPFM. Informe apenas para referência do total de renda."
        >
          <CurrencyInput value={rendimentos.rIsen} onChange={v => onChange('rIsen', v)} />
        </FieldGroup>
      </div>

      <div className="flex justify-between items-center px-3 py-2.5 bg-zinc-800/60 rounded-lg">
        <span className="text-xs text-zinc-400">Base do IRPFM</span>
        <span className="font-mono text-sm text-zinc-100">{formatBRL(baseIRPFM)}</span>
      </div>
    </div>
  )
}
