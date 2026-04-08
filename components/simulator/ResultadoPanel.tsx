'use client'

import { useState } from 'react'
import { Creditos, ResultadoCalculo } from '@/lib/types'
import { formatBRL, formatPct } from '@/lib/calculos'

interface Props {
  resultado: ResultadoCalculo
  creditos: Creditos
}

const EXCLUSOES = [
  'Ganhos de capital (exceto bolsa/balcão organizado)',
  'Rendimentos acumulados trib. excl. na fonte (art. 12-A Lei 7.713)',
  'Doações em adiantamento da legítima ou herança',
  'Rendimentos em contas de poupança',
  'LCI, LCA, CRI, CRA, LIG, LCD',
  'Debêntures incentivadas de infraestrutura',
  'FII e Fiagro negociados em bolsa (≥ 100 cotistas)',
  'FIP-IE, FIP-PD&I, CPR com liquidação financeira',
  'Parcela isenta da atividade rural',
  'Indenizações por acidente de trabalho / danos',
  'Aposentadoria e pensão por moléstia grave',
]

function ResultLine({ label, value, variant = 'default' }: {
  label: string; value: string
  variant?: 'default' | 'deduct' | 'total' | 'highlight'
}) {
  const valClass = {
    default: 'text-gray-600',
    deduct: 'text-emerald-600',
    total: 'text-gray-900 font-medium',
    highlight: 'text-amber-600 font-medium text-sm',
  }[variant]
  const lblClass = variant === 'total' ? 'text-gray-800 font-medium' : 'text-gray-500'
  return (
    <div className="flex justify-between items-baseline py-1.5 border-b border-gray-100 last:border-0 gap-2">
      <span className={`text-xs flex-1 ${lblClass}`}>{label}</span>
      <span className={`font-mono text-xs text-right whitespace-nowrap ${valClass}`}>{value}</span>
    </div>
  )
}

function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors">
        <span className={`text-[8px] transition-transform duration-150 text-gray-400 ${open ? 'rotate-90' : ''}`}>▶</span>
        <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">{label}</span>
      </button>
      {open && <div className="border-t border-gray-100 bg-gray-50">{children}</div>}
    </div>
  )
}

export function ResultadoPanel({ resultado, creditos }: Props) {
  const { base, rendaTotal, aliq, irpfmBruto, irpfTabela,
    totalCreditos, totalReductor, irpfmFinal, cargaEfetiva, aliqZona } = resultado

  const badge = aliqZona === 'isento'
    ? <div className="inline-block font-mono text-[10px] px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded mb-4">Fora do IRPFM — base ≤ R$ 600.000</div>
    : aliqZona === 'progressiva'
      ? <div className="inline-block font-mono text-[10px] px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded mb-4">IRPFM progressivo — alíquota {formatPct(aliq)}</div>
      : <div className="inline-block font-mono text-[10px] px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded mb-4">IRPFM máximo — alíquota 10%</div>

  const barColor = aliqZona === 'isento' ? '#16a34a' : aliqZona === 'maxima' ? '#dc2626' : '#d97706'

  const formula = aliqZona === 'isento'
    ? `Base = ${formatBRL(base)} ≤ R$ 600.000\nAlíquota = 0% → IRPFM = R$ 0,00`
    : [
        `Base = ${formatBRL(base)}`,
        aliqZona === 'progressiva'
          ? `Alíquota = (${formatBRL(base)} ÷ 60.000) − 10 = ${formatPct(aliq)}`
          : `Alíquota = 10% (base ≥ R$ 1.200.000)`,
        `IRPFM bruto = ${formatBRL(base)} × ${formatPct(aliq)} = ${formatBRL(irpfmBruto)}`,
        `(−) Total créditos = ${formatBRL(totalCreditos)}`,
        ...(totalReductor > 0 ? [`(−) Redutor 16-B = ${formatBRL(totalReductor)}`] : []),
        `IRPFM final = ${formatBRL(irpfmFinal)}`,
      ].join('\n')

  return (
    <div className="sticky top-6 space-y-3">
      {/* Hero */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        {badge}
        <div className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-2">IRPFM adicional estimado</div>
        <div className={`font-mono text-3xl font-medium leading-none ${irpfmFinal > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {formatBRL(irpfmFinal)}
        </div>
        <div className="text-[11px] text-gray-400 mt-2">
          {base > 600_000
            ? `Créditos: ${formatBRL(totalCreditos + totalReductor)} · Renda total: ${formatBRL(rendaTotal)}`
            : 'Base abaixo de R$ 600.000 — IRPFM não se aplica'}
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
            <span>0%</span>
            <span style={{ color: barColor }}>{formatPct(aliq)}</span>
            <span>10%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, aliq * 1000)}%`, background: barColor }} />
          </div>
        </div>
      </div>

      {/* Memória */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-3">Memória de cálculo</div>
        <ResultLine label="Base do IRPFM" value={formatBRL(base)} variant="total" />
        <ResultLine label="Alíquota mínima" value={formatPct(aliq)} />
        <ResultLine label="IRPFM bruto" value={formatBRL(irpfmBruto)} />
        <div className="my-1.5 border-t border-gray-100" />
        <ResultLine label="(−) IRPF tabela progressiva" value={formatBRL(irpfTabela)} variant="deduct" />
        {creditos.cDiv > 0 && <ResultLine label="(−) IRRF dividendos 10%" value={formatBRL(creditos.cDiv)} variant="deduct" />}
        {creditos.cAplic > 0 && <ResultLine label="(−) IRRF aplicações/exclusiva" value={formatBRL(creditos.cAplic)} variant="deduct" />}
        {creditos.cOff > 0 && <ResultLine label="(−) IRRF offshore" value={formatBRL(creditos.cOff)} variant="deduct" />}
        {creditos.cOut > 0 && <ResultLine label="(−) Outros créditos" value={formatBRL(creditos.cOut)} variant="deduct" />}
        {totalReductor > 0 && <ResultLine label="(−) Redutor art. 16-B" value={formatBRL(totalReductor)} variant="deduct" />}
        <div className="my-1.5 border-t border-gray-100" />
        <ResultLine label="IRPFM a pagar" value={formatBRL(irpfmFinal)} variant="highlight" />
      </div>

      {/* Carga efetiva */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-3">Carga tributária efetiva</div>
        <ResultLine label="Renda total (incl. isentos incentivados)" value={formatBRL(rendaTotal)} />
        <ResultLine label="IR pago (antes IRPFM)" value={formatBRL(totalCreditos)} />
        <ResultLine label="IRPFM adicional" value={formatBRL(irpfmFinal)} />
        <ResultLine label="Carga efetiva s/ renda total" value={formatPct(cargaEfetiva)} variant="total" />
      </div>

      <Accordion label="Fórmula detalhada">
        <pre className="px-4 py-3 font-mono text-[11px] text-gray-600 leading-loose whitespace-pre-wrap">{formula}</pre>
      </Accordion>

      <Accordion label="Exclusões da base do IRPFM">
        <div className="px-4 py-3 space-y-0.5">
          {EXCLUSOES.map((e, i) => (
            <div key={i} className="text-[11px] text-gray-500 py-0.5">✗ {e}</div>
          ))}
        </div>
      </Accordion>
    </div>
  )
}
